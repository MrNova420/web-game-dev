/**
 * ComboSystem - Tracks and rewards consecutive hits and skill usage
 * Provides damage multipliers and visual feedback for combos
 */

export class ComboSystem {
    constructor(engine) {
        this.engine = engine;
        
        // Combo state
        this.currentCombo = 0;
        this.comboMultiplier = 1.0;
        this.lastHitTime = 0;
        this.comboTimeout = 3.0; // seconds - time before combo resets
        this.comboTimer = 0;
        
        // Combo thresholds
        this.comboThresholds = {
            3: { multiplier: 1.2, name: 'Nice!', color: '#ffd60a' },
            5: { multiplier: 1.5, name: 'Great!', color: '#ff6b9d' },
            10: { multiplier: 2.0, name: 'Awesome!', color: '#ff0844' },
            15: { multiplier: 2.5, name: 'Incredible!', color: '#9d4edd' },
            20: { multiplier: 3.0, name: 'LEGENDARY!', color: '#ff00ff' }
        };
        
        // UI element
        this.comboDisplay = null;
        
        this.init();
        console.log('💥 Combo System initialized');
    }
    
    init() {
        this.createComboUI();
    }
    
    createComboUI() {
        // Create combo counter display
        this.comboDisplay = document.createElement('div');
        this.comboDisplay.id = 'combo-display';
        this.comboDisplay.style.cssText = `
            position: absolute;
            top: 150px;
            left: 50%;
            transform: translateX(-50%) scale(0);
            background: rgba(0, 0, 0, 0.8);
            border: 3px solid #ffd60a;
            border-radius: 15px;
            padding: 20px 30px;
            color: #fff;
            font-size: 2em;
            font-weight: bold;
            pointer-events: none;
            z-index: 1000;
            text-align: center;
            box-shadow: 0 0 30px rgba(255, 215, 0, 0.8);
            transition: all 0.3s ease-out;
            opacity: 0;
        `;
        document.getElementById('ui-overlay').appendChild(this.comboDisplay);
    }
    
    onHit(damage) {
        const now = Date.now() / 1000;
        
        // Check if combo should reset
        if (now - this.lastHitTime > this.comboTimeout) {
            this.resetCombo();
        }
        
        // Increment combo
        this.currentCombo++;
        this.lastHitTime = now;
        this.comboTimer = this.comboTimeout;
        
        // Update multiplier
        this.updateMultiplier();
        
        // Show combo UI
        this.updateComboDisplay();
        
        // Play sound effect
        if (this.engine.audioSystem) {
            const pitch = Math.min(2.0, 1.0 + (this.currentCombo * 0.05));
            this.engine.audioSystem.playSoundEffect('hit');
        }
        
        // Create particle effect
        if (this.engine.particleSystem && this.engine.player) {
            this.engine.particleSystem.createComboEffect(
                this.engine.player.mesh.position,
                this.currentCombo
            );
        }
        
        // Check for combo milestones
        this.checkComboMilestone();
        
        return damage * this.comboMultiplier;
    }
    
    updateMultiplier() {
        // Find highest threshold reached
        let highestMultiplier = 1.0;
        
        Object.keys(this.comboThresholds).forEach(threshold => {
            const thresholdNum = parseInt(threshold);
            if (this.currentCombo >= thresholdNum) {
                highestMultiplier = this.comboThresholds[threshold].multiplier;
            }
        });
        
        this.comboMultiplier = highestMultiplier;
    }
    
    checkComboMilestone() {
        const threshold = this.comboThresholds[this.currentCombo];
        if (threshold) {
            // Show milestone notification
            this.showComboMilestone(threshold);
            
            // Play special sound
            if (this.engine.audioSystem) {
                this.engine.audioSystem.playSoundEffect('achievement');
            }
        }
    }
    
    showComboMilestone(threshold) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 30%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.5);
            background: linear-gradient(135deg, #2d0a4e, #4a0e7a);
            border: 4px solid ${threshold.color};
            border-radius: 20px;
            padding: 30px 50px;
            color: ${threshold.color};
            font-size: 3em;
            font-weight: bold;
            z-index: 10001;
            text-align: center;
            box-shadow: 0 0 50px ${threshold.color};
            opacity: 0;
            animation: comboMilestonePop 2s ease-out forwards;
            pointer-events: none;
        `;
        
        notification.innerHTML = `
            <div style="font-size: 0.7em; margin-bottom: 10px;">COMBO x${this.currentCombo}</div>
            <div>${threshold.name}</div>
            <div style="font-size: 0.5em; margin-top: 10px;">Damage x${threshold.multiplier.toFixed(1)}</div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 2000);
    }
    
    updateComboDisplay() {
        if (!this.comboDisplay) return;
        
        if (this.currentCombo >= 3) {
            // Find current threshold
            let currentThreshold = this.comboThresholds[3];
            Object.keys(this.comboThresholds).forEach(threshold => {
                const thresholdNum = parseInt(threshold);
                if (this.currentCombo >= thresholdNum) {
                    currentThreshold = this.comboThresholds[threshold];
                }
            });
            
            this.comboDisplay.style.borderColor = currentThreshold.color;
            this.comboDisplay.style.boxShadow = `0 0 30px ${currentThreshold.color}`;
            this.comboDisplay.style.transform = 'translateX(-50%) scale(1)';
            this.comboDisplay.style.opacity = '1';
            
            this.comboDisplay.innerHTML = `
                <div style="color: ${currentThreshold.color};">COMBO</div>
                <div style="font-size: 1.5em; color: #fff;">${this.currentCombo}</div>
                <div style="font-size: 0.6em; color: #e0aaff;">x${this.comboMultiplier.toFixed(1)} Damage</div>
            `;
        }
    }
    
    hideComboDisplay() {
        if (this.comboDisplay) {
            this.comboDisplay.style.transform = 'translateX(-50%) scale(0)';
            this.comboDisplay.style.opacity = '0';
        }
    }
    
    resetCombo() {
        if (this.currentCombo >= 3) {
            // Show combo end notification
            this.showComboEnd();
        }
        
        this.currentCombo = 0;
        this.comboMultiplier = 1.0;
        this.comboTimer = 0;
        this.hideComboDisplay();
    }
    
    showComboEnd() {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 150px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            border: 2px solid #888;
            border-radius: 10px;
            padding: 15px 25px;
            color: #888;
            font-size: 1.2em;
            z-index: 1001;
            text-align: center;
            opacity: 0;
            animation: fadeInOut 2s ease-in-out forwards;
            pointer-events: none;
        `;
        
        notification.textContent = 'Combo Ended';
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 2000);
    }
    
    update(delta) {
        if (this.currentCombo > 0) {
            this.comboTimer -= delta;
            
            if (this.comboTimer <= 0) {
                this.resetCombo();
            }
            
            // Update display color as timer runs out
            if (this.comboDisplay && this.currentCombo >= 3) {
                const timeRatio = this.comboTimer / this.comboTimeout;
                if (timeRatio < 0.3) {
                    // Flash red when combo is about to end
                    this.comboDisplay.style.borderColor = '#ff0844';
                    this.comboDisplay.style.animation = 'pulse 0.3s ease-in-out infinite';
                }
            }
        }
    }
    
    getMultiplier() {
        return this.comboMultiplier;
    }
    
    getCurrentCombo() {
        return this.currentCombo;
    }
    
    // Save/Load
    getSaveData() {
        return {
            currentCombo: 0, // Don't save combo across sessions
            comboMultiplier: 1.0
        };
    }
    
    loadSaveData(data) {
        // Combos always start fresh
        this.resetCombo();
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes comboMilestonePop {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5) rotate(-5deg); }
        10% { opacity: 1; transform: translate(-50%, -50%) scale(1.2) rotate(5deg); }
        20% { transform: translate(-50%, -50%) scale(1) rotate(0deg); }
        80% { opacity: 1; transform: translate(-50%, -50%) scale(1) rotate(0deg); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8) rotate(0deg); }
    }
    
    @keyframes pulse {
        0%, 100% { transform: translateX(-50%) scale(1); }
        50% { transform: translateX(-50%) scale(1.1); }
    }
`;
document.head.appendChild(style);
