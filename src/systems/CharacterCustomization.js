import { logger } from '../core/Logger.js';
/**
 * CharacterCustomization - Player appearance and cosmetic customization
 * Allows players to personalize their character with unlockable options
 */

export class CharacterCustomization {
    constructor(engine) {
        this.engine = engine;
        
        // Customization options
        this.options = {
            hairStyles: [
                { id: 'long_flowing', name: 'Flowing Locks', unlocked: true, color: 0x9d4edd },
                { id: 'short_spiky', name: 'Spiky Style', unlocked: false, color: 0xff6b9d },
                { id: 'twin_tails', name: 'Twin Tails', unlocked: false, color: 0x66ccff },
                { id: 'elegant_bun', name: 'Elegant Bun', unlocked: false, color: 0xffd60a },
                { id: 'wild_messy', name: 'Wild & Free', unlocked: false, color: 0x52b788 }
            ],
            outfits: [
                { id: 'wielder_robes', name: 'Wielder Robes', unlocked: true, color: 0x4a0e7a },
                { id: 'battle_dress', name: 'Battle Dress', unlocked: false, color: 0xff0844 },
                { id: 'mystical_kimono', name: 'Mystical Kimono', unlocked: false, color: 0x9d4edd },
                { id: 'cyber_suit', name: 'Cyber Suit', unlocked: false, color: 0x66ccff },
                { id: 'elegant_gown', name: 'Elegant Gown', unlocked: false, color: 0xe0aaff }
            ],
            accessories: [
                { id: 'none', name: 'None', unlocked: true },
                { id: 'glowing_earrings', name: 'Glowing Earrings', unlocked: false },
                { id: 'mystical_crown', name: 'Mystical Crown', unlocked: false },
                { id: 'floating_orbs', name: 'Floating Orbs', unlocked: false },
                { id: 'energy_wings', name: 'Energy Wings', unlocked: false }
            ],
            auras: [
                { id: 'purple_glow', name: 'Purple Glow', unlocked: true, color: 0x9d4edd },
                { id: 'pink_radiance', name: 'Pink Radiance', unlocked: false, color: 0xff6b9d },
                { id: 'cyan_shimmer', name: 'Cyan Shimmer', unlocked: false, color: 0x66ccff },
                { id: 'golden_aura', name: 'Golden Aura', unlocked: false, color: 0xffd60a },
                { id: 'rainbow_pulse', name: 'Rainbow Pulse', unlocked: false, color: 0xffffff }
            ]
        };
        
        // Current selections
        this.current = {
            hairStyle: 'long_flowing',
            outfit: 'wielder_robes',
            accessory: 'none',
            aura: 'purple_glow'
        };
        
        // UI panel
        this.customizationPanel = null;
        
        this.init();
        logger.info('💄 Character Customization initialized');
    }
    
    init() {
        this.createCustomizationUI();
    }
    
    createCustomizationUI() {
        // Create toggle button
        const toggleButton = document.createElement('div');
        toggleButton.id = 'customization-toggle';
        toggleButton.innerHTML = '💄 Customize (C)';
        toggleButton.style.cssText = `
            position: absolute;
            bottom: 150px;
            left: 20px;
            background: linear-gradient(135deg, #ff6b9d, #ff0844);
            border: 2px solid #ff6b9d;
            border-radius: 10px;
            padding: 10px 20px;
            color: #fff;
            cursor: pointer;
            font-weight: bold;
            pointer-events: auto;
            z-index: 100;
        `;
        toggleButton.addEventListener('click', () => this.togglePanel());
        toggleButton.addEventListener('mouseenter', () => {
            toggleButton.style.background = 'linear-gradient(135deg, #ff0844, #ff6b9d)';
        });
        toggleButton.addEventListener('mouseleave', () => {
            toggleButton.style.background = 'linear-gradient(135deg, #ff6b9d, #ff0844)';
        });
        document.getElementById('ui-overlay').appendChild(toggleButton);
        
        // Create customization panel
        this.customizationPanel = document.createElement('div');
        this.customizationPanel.id = 'customization-panel';
        this.customizationPanel.style.cssText = `
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 80%;
            max-width: 800px;
            max-height: 80vh;
            overflow-y: auto;
            background: rgba(0, 0, 0, 0.95);
            border: 3px solid #ff6b9d;
            border-radius: 15px;
            padding: 20px;
            color: #fff;
            display: none;
            pointer-events: auto;
            z-index: 1000;
            box-shadow: 0 0 50px rgba(255, 107, 157, 0.5);
        `;
        document.getElementById('ui-overlay').appendChild(this.customizationPanel);
        
        this.updateCustomizationUI();
        
        // Add keyboard shortcut
        document.addEventListener('keydown', (e) => {
            if (e.key === 'c' || e.key === 'C') {
                this.togglePanel();
            }
        });
    }
    
    togglePanel() {
        const isVisible = this.customizationPanel.style.display === 'block';
        this.customizationPanel.style.display = isVisible ? 'none' : 'block';
        if (!isVisible) {
            this.updateCustomizationUI();
        }
    }
    
    updateCustomizationUI() {
        if (!this.customizationPanel) return;
        
        let html = '<div style="text-align: center; margin-bottom: 20px;">';
        html += '<h2 style="color: #ff6b9d; margin-bottom: 10px;">💄 Character Customization</h2>';
        html += '<p style="color: #aaa; font-size: 0.9em;">Customize your appearance with unlockable cosmetics</p>';
        html += '</div>';
        
        // Hair Styles
        html += this.renderCategory('Hair Style', 'hairStyles', 'hairStyle', '💇');
        
        // Outfits
        html += this.renderCategory('Outfit', 'outfits', 'outfit', '👗');
        
        // Accessories
        html += this.renderCategory('Accessory', 'accessories', 'accessory', '✨');
        
        // Auras
        html += this.renderCategory('Aura', 'auras', 'aura', '🌟');
        
        html += '<div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.9em;">';
        html += 'Unlock more options by leveling up and completing achievements!';
        html += '</div>';
        
        this.customizationPanel.innerHTML = html;
        
        // Add click handlers
        this.attachClickHandlers();
    }
    
    renderCategory(title, optionsKey, currentKey, icon) {
        let html = `<div style="margin-bottom: 25px; border: 2px solid #ff6b9d; border-radius: 10px; padding: 15px;">`;
        html += `<h3 style="color: #ff6b9d; margin-bottom: 15px;">${icon} ${title}</h3>`;
        html += '<div style="display: flex; flex-wrap: wrap; gap: 10px;">';
        
        this.options[optionsKey].forEach(option => {
            const isSelected = this.current[currentKey] === option.id;
            const isUnlocked = option.unlocked;
            
            let bgColor = 'rgba(45, 10, 78, 0.5)';
            let borderColor = '#444';
            let opacity = isUnlocked ? 1 : 0.5;
            let cursor = isUnlocked ? 'pointer' : 'not-allowed';
            
            if (isSelected) {
                bgColor = 'rgba(255, 107, 157, 0.3)';
                borderColor = '#ff6b9d';
            }
            
            html += `
                <div 
                    class="customization-option"
                    data-category="${currentKey}"
                    data-option-id="${option.id}"
                    style="
                        background: ${bgColor};
                        border: 2px solid ${borderColor};
                        border-radius: 10px;
                        padding: 12px;
                        width: 150px;
                        cursor: ${cursor};
                        opacity: ${opacity};
                        transition: all 0.3s;
                        text-align: center;
                    "
                >
                    <div style="font-weight: bold; color: #fff; margin-bottom: 5px;">${option.name}</div>
                    ${option.color ? `<div style="width: 30px; height: 30px; background: #${option.color.toString(16).padStart(6, '0')}; border-radius: 50%; margin: 10px auto; border: 2px solid #fff;"></div>` : ''}
                    ${!isUnlocked ? '<div style="color: #888; font-size: 0.8em; margin-top: 5px;">🔒 Locked</div>' : ''}
                    ${isSelected ? '<div style="color: #52b788; margin-top: 5px;">✓ Equipped</div>' : ''}
                </div>
            `;
        });
        
        html += '</div></div>';
        return html;
    }
    
    attachClickHandlers() {
        const options = this.customizationPanel.querySelectorAll('.customization-option');
        options.forEach(option => {
            option.addEventListener('click', () => {
                const category = option.getAttribute('data-category');
                const optionId = option.getAttribute('data-option-id');
                this.selectOption(category, optionId);
            });
            
            // Hover effect
            option.addEventListener('mouseenter', () => {
                if (option.style.cursor === 'pointer') {
                    option.style.transform = 'scale(1.05)';
                    option.style.boxShadow = '0 0 20px rgba(255, 107, 157, 0.5)';
                }
            });
            option.addEventListener('mouseleave', () => {
                option.style.transform = 'scale(1)';
                option.style.boxShadow = 'none';
            });
        });
    }
    
    selectOption(category, optionId) {
        // Find the option in the corresponding category
        const categoryKey = category + 's'; // e.g., 'hairStyle' -> 'hairStyles'
        const option = this.options[categoryKey]?.find(opt => opt.id === optionId);
        
        if (!option) {
            // Fallback: search all categories
            for (const key of Object.keys(this.options)) {
                const found = this.options[key].find(opt => opt.id === optionId);
                if (found) {
                    if (!found.unlocked) {
                        logger.info('Option locked:', found.name);
                        return;
                    }
                    
                    this.current[category] = optionId;
                    this.applyCustomization();
                    this.updateCustomizationUI();
                    
                    // Play sound
                    if (this.engine.audioSystem) {
                        this.engine.audioSystem.playSoundEffect('pickup');
                    }
                    
                    // Save
                    if (this.engine.saveSystem) {
                        this.engine.saveSystem.saveGame('Customization changed');
                    }
                    
                    logger.info(`✨ Equipped ${found.name}`);
                    return;
                }
            }
            return;
        }
        
        if (!option.unlocked) {
            logger.info('Option locked:', option.name);
            return;
        }
        
        this.current[category] = optionId;
        this.applyCustomization();
        this.updateCustomizationUI();
        
        // Play sound
        if (this.engine.audioSystem) {
            this.engine.audioSystem.playSoundEffect('pickup');
        }
        
        // Save
        if (this.engine.saveSystem) {
            this.engine.saveSystem.saveGame('Customization changed');
        }
        
        logger.info(`✨ Equipped ${option.name}`);
    }
    
    applyCustomization() {
        // Apply visual changes to player character
        if (!this.engine.player || !this.engine.player.mesh) return;
        
        const player = this.engine.player;
        
        // Apply aura color
        const aura = this.options.auras.find(a => a.id === this.current.aura);
        if (aura && aura.color) {
            player.mesh.material.color.setHex(aura.color);
            player.mesh.material.emissive.setHex(aura.color);
            player.mesh.material.emissiveIntensity = 0.5;
        }
        
        // Apply outfit color
        const outfit = this.options.outfits.find(o => o.id === this.current.outfit);
        if (outfit && outfit.color) {
            // Adjust material based on outfit
            player.mesh.material.color.setHex(outfit.color);
        }
    }
    
    unlockOption(category, optionId) {
        const categoryKey = category + 's';
        const option = this.options[categoryKey]?.find(opt => opt.id === optionId);
        
        if (option && !option.unlocked) {
            option.unlocked = true;
            logger.info(`🎉 Unlocked: ${option.name}`);
            
            // Show notification
            this.showUnlockNotification(option);
            
            // Update UI if open
            if (this.customizationPanel.style.display === 'block') {
                this.updateCustomizationUI();
            }
            
            return true;
        }
        
        return false;
    }
    
    showUnlockNotification(option) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.5);
            background: linear-gradient(135deg, #2d0a4e, #4a0e7a);
            border: 3px solid #ff6b9d;
            border-radius: 15px;
            padding: 30px;
            color: #fff;
            font-size: 1.2em;
            z-index: 10000;
            text-align: center;
            box-shadow: 0 0 40px rgba(255, 107, 157, 0.8);
            opacity: 0;
            animation: customUnlockPop 3s ease-out forwards;
            pointer-events: none;
        `;
        
        notification.innerHTML = `
            <div style="font-size: 2em; margin-bottom: 10px;">✨</div>
            <div style="font-size: 1.3em; color: #ff6b9d; font-weight: bold; margin-bottom: 10px;">New Cosmetic Unlocked!</div>
            <div style="color: #e0aaff;">${option.name}</div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 3000);
    }
    
    // Unlock cosmetics based on achievements
    checkUnlocks() {
        const level = this.engine.player?.stats.level || 1;
        const floor = this.engine.endlessMode?.currentFloor || 1;
        
        // Unlock based on level
        if (level >= 5) this.unlockOption('hairStyle', 'short_spiky');
        if (level >= 10) this.unlockOption('outfit', 'battle_dress');
        if (level >= 15) this.unlockOption('accessory', 'glowing_earrings');
        if (level >= 20) this.unlockOption('aura', 'pink_radiance');
        if (level >= 25) this.unlockOption('hairStyle', 'twin_tails');
        if (level >= 30) this.unlockOption('outfit', 'mystical_kimono');
        if (level >= 35) this.unlockOption('accessory', 'mystical_crown');
        if (level >= 40) this.unlockOption('aura', 'cyan_shimmer');
        if (level >= 50) this.unlockOption('hairStyle', 'elegant_bun');
        if (level >= 60) this.unlockOption('outfit', 'cyber_suit');
        if (level >= 70) this.unlockOption('accessory', 'floating_orbs');
        if (level >= 80) this.unlockOption('aura', 'golden_aura');
        if (level >= 90) this.unlockOption('hairStyle', 'wild_messy');
        if (level >= 100) {
            this.unlockOption('outfit', 'elegant_gown');
            this.unlockOption('accessory', 'energy_wings');
            this.unlockOption('aura', 'rainbow_pulse');
        }
        
        // Unlock based on floor
        if (floor >= 10) this.unlockOption('hairStyle', 'short_spiky');
        if (floor >= 25) this.unlockOption('aura', 'pink_radiance');
        if (floor >= 50) this.unlockOption('aura', 'cyan_shimmer');
    }
    
    // Save/Load
    getSaveData() {
        return {
            current: this.current,
            unlockedOptions: {
                hairStyles: this.options.hairStyles.filter(o => o.unlocked).map(o => o.id),
                outfits: this.options.outfits.filter(o => o.unlocked).map(o => o.id),
                accessories: this.options.accessories.filter(o => o.unlocked).map(o => o.id),
                auras: this.options.auras.filter(o => o.unlocked).map(o => o.id)
            }
        };
    }
    
    loadSaveData(data) {
        if (data.current) {
            this.current = data.current;
        }
        
        if (data.unlockedOptions) {
            // Unlock all saved options
            Object.keys(data.unlockedOptions).forEach(category => {
                data.unlockedOptions[category].forEach(optionId => {
                    const option = this.options[category]?.find(o => o.id === optionId);
                    if (option) {
                        option.unlocked = true;
                    }
                });
            });
        }
        
        // Apply customization
        this.applyCustomization();
        this.updateCustomizationUI();
    }
}

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes customUnlockPop {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
        10% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
        20% { transform: translate(-50%, -50%) scale(1); }
        80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
    }
`;
document.head.appendChild(style);
