/**
 * TutorialSystem - Guides new players through game mechanics
 * Provides step-by-step onboarding experience
 */

export class TutorialSystem {
    constructor(engine) {
        this.engine = engine;
        
        // Tutorial steps
        this.steps = [
            {
                id: 'welcome',
                title: 'Welcome to Dynasty of Emberveil!',
                message: 'You are a Wielder, exploring the twilight realms known as Vibespheres. Let\'s learn the basics!',
                highlight: null,
                action: null
            },
            {
                id: 'movement',
                title: 'Movement',
                message: 'Use WASD or Arrow Keys to move your character around the dungeon.',
                highlight: null,
                action: 'move'
            },
            {
                id: 'abilities',
                title: 'Combat Abilities',
                message: 'Press Q, W, E, or R to use your special abilities. Each ability costs mana (MP).',
                highlight: '#abilities-bar',
                action: 'ability'
            },
            {
                id: 'enemies',
                title: 'Defeat Enemies',
                message: 'Use your abilities to defeat enemies. Defeating enemies grants experience and loot!',
                highlight: null,
                action: 'kill_enemy'
            },
            {
                id: 'inventory',
                title: 'Inventory System',
                message: 'Press I to open your inventory. Equip items to become stronger!',
                highlight: '#inventory-toggle',
                action: 'open_inventory'
            },
            {
                id: 'skills',
                title: 'Skill Trees',
                message: 'Press K to open skill trees. Spend skill points (earned by leveling up) to unlock powerful abilities!',
                highlight: '#skilltree-toggle',
                action: 'open_skills'
            },
            {
                id: 'achievements',
                title: 'Achievements',
                message: 'Press A to view achievements. Complete them for bonus rewards!',
                highlight: '#achievement-toggle',
                action: 'open_achievements'
            },
            {
                id: 'customization',
                title: 'Character Customization',
                message: 'Press C to customize your appearance. Unlock more options by leveling up!',
                highlight: '#customization-toggle',
                action: 'open_customization'
            },
            {
                id: 'complete',
                title: 'Tutorial Complete!',
                message: 'You\'re ready to explore the Vibespheres! Remember: progress is auto-saved every 30 seconds. Good luck, Wielder!',
                highlight: null,
                action: null
            }
        ];
        
        // State
        this.currentStep = 0;
        this.completed = false;
        this.active = false;
        this.actionCompleted = false;
        
        // UI
        this.tutorialPanel = null;
        this.highlightOverlay = null;
        
        logger.info('📚 Tutorial System initialized');
    }
    
    start() {
        if (this.completed) return;
        
        this.active = true;
        this.currentStep = 0;
        this.createTutorialUI();
        this.showStep(0);
        
        logger.info('📚 Tutorial started');
    }
    
    createTutorialUI() {
        // Create tutorial panel
        this.tutorialPanel = document.createElement('div');
        this.tutorialPanel.id = 'tutorial-panel';
        this.tutorialPanel.style.cssText = `
            position: absolute;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            width: 90%;
            max-width: 600px;
            background: rgba(0, 0, 0, 0.95);
            border: 3px solid #52b788;
            border-radius: 15px;
            padding: 25px;
            color: #fff;
            pointer-events: auto;
            z-index: 2000;
            box-shadow: 0 0 30px rgba(82, 183, 136, 0.8);
        `;
        document.getElementById('ui-overlay').appendChild(this.tutorialPanel);
        
        // Create highlight overlay
        this.highlightOverlay = document.createElement('div');
        this.highlightOverlay.id = 'tutorial-highlight';
        this.highlightOverlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: none;
            pointer-events: none;
            z-index: 1999;
        `;
        document.getElementById('ui-overlay').appendChild(this.highlightOverlay);
    }
    
    showStep(stepIndex) {
        if (stepIndex >= this.steps.length) {
            this.complete();
            return;
        }
        
        this.currentStep = stepIndex;
        this.actionCompleted = false;
        const step = this.steps[stepIndex];
        
        // Update panel content
        let html = '<div style="text-align: center;">';
        html += `<h3 style="color: #52b788; margin-bottom: 10px; font-size: 1.3em;">${step.title}</h3>`;
        html += `<p style="color: #e0aaff; margin-bottom: 20px; font-size: 1.1em; line-height: 1.6;">${step.message}</p>`;
        
        // Progress indicator
        html += '<div style="display: flex; justify-content: center; gap: 8px; margin-bottom: 15px;">';
        for (let i = 0; i < this.steps.length; i++) {
            const color = i < stepIndex ? '#52b788' : (i === stepIndex ? '#ffd60a' : '#444');
            html += `<div style="width: 12px; height: 12px; border-radius: 50%; background: ${color};"></div>`;
        }
        html += '</div>';
        
        // Action hint
        if (step.action) {
            html += `<div style="color: #ffd60a; font-size: 0.95em; margin-bottom: 15px;">Complete this action to continue!</div>`;
        }
        
        // Buttons
        html += '<div style="display: flex; justify-content: center; gap: 15px;">';
        if (stepIndex > 0) {
            html += '<button id="tutorial-prev" style="background: #444; border: none; border-radius: 8px; padding: 10px 20px; color: #fff; cursor: pointer;">← Back</button>';
        }
        if (!step.action) {
            html += '<button id="tutorial-next" style="background: linear-gradient(135deg, #52b788, #2d6a4f); border: none; border-radius: 8px; padding: 10px 30px; color: #fff; font-weight: bold; cursor: pointer;">Next →</button>';
        }
        html += '<button id="tutorial-skip" style="background: #888; border: none; border-radius: 8px; padding: 10px 20px; color: #fff; cursor: pointer;">Skip Tutorial</button>';
        html += '</div>';
        
        html += '</div>';
        
        this.tutorialPanel.innerHTML = html;
        
        // Add button handlers
        const nextBtn = document.getElementById('tutorial-next');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextStep());
        }
        
        const prevBtn = document.getElementById('tutorial-prev');
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousStep());
        }
        
        const skipBtn = document.getElementById('tutorial-skip');
        if (skipBtn) {
            skipBtn.addEventListener('click', () => this.skip());
        }
        
        // Handle highlight
        if (step.highlight) {
            this.highlightElement(step.highlight);
        } else {
            this.clearHighlight();
        }
        
        // Listen for action completion
        if (step.action) {
            this.setupActionListener(step.action);
        }
    }
    
    highlightElement(selector) {
        this.highlightOverlay.style.display = 'block';
        
        const element = document.querySelector(selector);
        if (element) {
            const rect = element.getBoundingClientRect();
            
            // Create cutout effect
            this.highlightOverlay.style.clipPath = `polygon(
                0 0,
                0 100%,
                ${rect.left - 10}px 100%,
                ${rect.left - 10}px ${rect.top - 10}px,
                ${rect.right + 10}px ${rect.top - 10}px,
                ${rect.right + 10}px ${rect.bottom + 10}px,
                ${rect.left - 10}px ${rect.bottom + 10}px,
                ${rect.left - 10}px 100%,
                100% 100%,
                100% 0
            )`;
            
            // Add pulsing border
            element.style.boxShadow = '0 0 20px #52b788';
            element.style.animation = 'tutorialPulse 2s infinite';
        }
    }
    
    clearHighlight() {
        this.highlightOverlay.style.display = 'none';
        
        // Remove pulsing from all elements
        document.querySelectorAll('*').forEach(el => {
            if (el.style.animation === 'tutorialPulse 2s infinite') {
                el.style.animation = '';
                el.style.boxShadow = '';
            }
        });
    }
    
    setupActionListener(action) {
        this.actionCompleted = false;
        
        const checkAction = () => {
            if (this.actionCompleted) return;
            
            switch (action) {
                case 'move':
                    // Check if player has moved
                    if (this.engine.player && (
                        this.engine.player.moveForward ||
                        this.engine.player.moveBackward ||
                        this.engine.player.moveLeft ||
                        this.engine.player.moveRight
                    )) {
                        this.actionCompleted = true;
                        setTimeout(() => this.nextStep(), 1000);
                    }
                    break;
                    
                case 'ability':
                    // Will be triggered by ability use
                    break;
                    
                case 'kill_enemy':
                    // Will be triggered by enemy death
                    break;
                    
                case 'open_inventory':
                case 'open_skills':
                case 'open_achievements':
                case 'open_customization':
                    // Will be triggered by UI interactions
                    break;
            }
        };
        
        // Check periodically
        this.actionCheckInterval = setInterval(checkAction, 100);
    }
    
    onActionCompleted(actionType) {
        const step = this.steps[this.currentStep];
        
        if (step && step.action === actionType && !this.actionCompleted) {
            this.actionCompleted = true;
            
            if (this.actionCheckInterval) {
                clearInterval(this.actionCheckInterval);
            }
            
            // Auto-advance after brief delay
            setTimeout(() => this.nextStep(), 1500);
        }
    }
    
    nextStep() {
        if (this.actionCheckInterval) {
            clearInterval(this.actionCheckInterval);
        }
        
        this.showStep(this.currentStep + 1);
    }
    
    previousStep() {
        if (this.actionCheckInterval) {
            clearInterval(this.actionCheckInterval);
        }
        
        this.showStep(this.currentStep - 1);
    }
    
    skip() {
        if (confirm('Are you sure you want to skip the tutorial? You can always replay it from the settings.')) {
            this.complete();
        }
    }
    
    complete() {
        this.active = false;
        this.completed = true;
        
        if (this.actionCheckInterval) {
            clearInterval(this.actionCheckInterval);
        }
        
        // Clean up UI
        if (this.tutorialPanel && this.tutorialPanel.parentNode) {
            this.tutorialPanel.parentNode.removeChild(this.tutorialPanel);
        }
        
        this.clearHighlight();
        
        if (this.highlightOverlay && this.highlightOverlay.parentNode) {
            this.highlightOverlay.parentNode.removeChild(this.highlightOverlay);
        }
        
        // Show completion message
        this.showCompletionMessage();
        
        // Save
        if (this.engine.saveSystem) {
            this.engine.saveSystem.saveGame('Tutorial completed');
        }
        
        logger.info('📚 Tutorial completed');
    }
    
    showCompletionMessage() {
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.5);
            background: linear-gradient(135deg, #2d0a4e, #4a0e7a);
            border: 3px solid #52b788;
            border-radius: 15px;
            padding: 40px;
            color: #fff;
            font-size: 1.3em;
            z-index: 10000;
            text-align: center;
            box-shadow: 0 0 50px rgba(82, 183, 136, 1);
            opacity: 0;
            animation: tutorialCompletePop 4s ease-out forwards;
            pointer-events: none;
        `;
        
        message.innerHTML = `
            <div style="font-size: 4em; margin-bottom: 15px;">🎓</div>
            <div style="font-size: 1.8em; color: #52b788; font-weight: bold; margin-bottom: 15px;">Tutorial Complete!</div>
            <div style="color: #e0aaff;">You're now ready to conquer the Vibespheres!</div>
            <div style="color: #aaa; font-size: 0.9em; margin-top: 20px;">May the smoke guide your path, Wielder.</div>
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            if (document.body.contains(message)) {
                document.body.removeChild(message);
            }
        }, 4000);
    }
    
    // Save/Load
    getSaveData() {
        return {
            completed: this.completed,
            currentStep: this.currentStep
        };
    }
    
    loadSaveData(data) {
        if (data.completed !== undefined) {
            this.completed = data.completed;
        }
        if (data.currentStep !== undefined) {
            this.currentStep = data.currentStep;
        }
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes tutorialPulse {
        0%, 100% { box-shadow: 0 0 10px #52b788; }
        50% { box-shadow: 0 0 30px #52b788; }
    }
    
    @keyframes tutorialCompletePop {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
        10% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
        15% { transform: translate(-50%, -50%) scale(1); }
        85% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
    }
`;
document.head.appendChild(style);
