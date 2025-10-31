/**
 * MainMenuSystem - Handles main menu, start screen, and game hub
 * Provides a polished starting experience with multiple options
 */

export class MainMenuSystem {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.currentScreen = 'main'; // main, newGame, loadGame, settings, credits
        this.menuVisible = false;
        
        this.init();
    }
    
    init() {
        this.createMenuUI();
        this.setupKeyboardShortcuts();
        logger.info('🎮 Main Menu System initialized');
    }
    
    setupKeyboardShortcuts() {
        // Add ESC key listener to close menu
        this.escapeHandler = (e) => {
            if (e.key === 'Escape' && this.menuVisible) {
                logger.info('ESC pressed, starting game...');
                this.startNewGame();
            }
        };
        
        document.addEventListener('keydown', this.escapeHandler);
    }
    
    createMenuUI() {
        // Main menu container
        const menuContainer = document.createElement('div');
        menuContainer.id = 'main-menu';
        menuContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #0a001a 0%, #1a0033 50%, #2d0a4e 100%);
            display: none;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 2000;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        `;
        
        // Title
        const title = document.createElement('div');
        title.style.cssText = `
            font-size: 4em;
            font-weight: bold;
            background: linear-gradient(45deg, #9d4edd, #c77dff, #e0aaff, #9d4edd);
            background-size: 300% 300%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 10px;
            text-align: center;
            animation: gradientShift 3s ease infinite;
        `;
        title.textContent = 'Dynasty of Emberveil';
        
        // Subtitle
        const subtitle = document.createElement('div');
        subtitle.style.cssText = `
            font-size: 1.5em;
            color: #c77dff;
            margin-bottom: 60px;
            text-align: center;
        `;
        subtitle.textContent = 'A Psychedelic Fantasy RPG';
        
        // Menu buttons container
        const buttonsContainer = document.createElement('div');
        buttonsContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 20px;
            min-width: 300px;
        `;
        
        // Create menu buttons
        const buttons = [
            { text: '▶️ Start Game', action: () => this.startNewGame(), primary: true },
            { text: '⚔️ New Game', action: () => this.startNewGame() },
            { text: '📂 Load Game', action: () => this.loadGame() },
            { text: '🏰 Safe Zone Hub', action: () => this.enterSafeZone() },
            { text: '⚙️ Settings', action: () => this.openSettings() },
            { text: '📜 Credits', action: () => this.showCredits() }
        ];
        
        buttons.forEach(btn => {
            const button = document.createElement('button');
            button.textContent = btn.text;
            
            // Primary button gets special styling
            const isPrimary = btn.primary;
            button.style.cssText = `
                padding: ${isPrimary ? '20px 40px' : '15px 30px'};
                font-size: ${isPrimary ? '1.4em' : '1.2em'};
                background: ${isPrimary ? 'linear-gradient(135deg, #9d4edd, #c77dff)' : 'linear-gradient(135deg, #2d0a4e, #4a0e7a)'};
                border: ${isPrimary ? '3px' : '2px'} solid #9d4edd;
                border-radius: 10px;
                color: #fff;
                cursor: pointer;
                transition: all 0.3s;
                box-shadow: 0 0 ${isPrimary ? '30px' : '20px'} rgba(157, 78, 221, ${isPrimary ? '0.6' : '0.3'});
                font-weight: ${isPrimary ? 'bold' : 'normal'};
            `;
            
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'scale(1.05)';
                button.style.boxShadow = `0 0 ${isPrimary ? '40px' : '30px'} rgba(157, 78, 221, 0.8)`;
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'scale(1)';
                button.style.boxShadow = `0 0 ${isPrimary ? '30px' : '20px'} rgba(157, 78, 221, ${isPrimary ? '0.6' : '0.3'})`;
            });
            
            button.addEventListener('click', btn.action);
            buttonsContainer.appendChild(button);
        });
        
        // Version info
        const version = document.createElement('div');
        version.style.cssText = `
            position: absolute;
            bottom: 20px;
            right: 20px;
            color: #7b2cbf;
            font-size: 0.9em;
        `;
        version.textContent = 'v2.0.0 - Enhanced Edition';
        
        // Instructions
        const instructions = document.createElement('div');
        instructions.style.cssText = `
            position: absolute;
            bottom: 20px;
            left: 20px;
            color: #9d4edd;
            font-size: 0.9em;
            text-align: left;
        `;
        instructions.innerHTML = `
            <div>Press <strong>ESC</strong> to close menu</div>
            <div style="margin-top: 5px;">Auto-starts in 5 seconds</div>
        `;
        
        // Add gradient animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes gradientShift {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
        `;
        document.head.appendChild(style);
        
        menuContainer.appendChild(title);
        menuContainer.appendChild(subtitle);
        menuContainer.appendChild(buttonsContainer);
        menuContainer.appendChild(version);
        menuContainer.appendChild(instructions);
        
        document.getElementById('game-container').appendChild(menuContainer);
        this.menuContainer = menuContainer;
    }
    
    show() {
        if (this.menuContainer) {
            this.menuContainer.style.display = 'flex';
            this.menuVisible = true;
            
            // Auto-hide after 5 seconds if user doesn't interact
            this.autoHideTimeout = setTimeout(() => {
                if (this.menuVisible) {
                    logger.info('Auto-starting game after menu timeout...');
                    this.startNewGame();
                }
            }, 5000);
        }
    }
    
    hide() {
        if (this.menuContainer) {
            this.menuContainer.style.display = 'none';
            this.menuVisible = false;
            
            // Clear auto-hide timeout
            if (this.autoHideTimeout) {
                clearTimeout(this.autoHideTimeout);
                this.autoHideTimeout = null;
            }
        }
    }
    
    startNewGame() {
        logger.info('🎮 Starting new game...');
        this.hide();
        // Reset game state for new game
        if (this.gameEngine.saveSystem) {
            localStorage.removeItem('dynasty_save');
        }
        // Game will start from the safe zone
        this.gameEngine.startFromSafeZone = true;
    }
    
    loadGame() {
        logger.info('📂 Loading saved game...');
        if (this.gameEngine.saveSystem && this.gameEngine.saveSystem.hasSaveData()) {
            this.hide();
            this.gameEngine.saveSystem.loadGame();
        } else {
            alert('No saved game found. Please start a new game.');
        }
    }
    
    enterSafeZone() {
        logger.info('🏰 Entering Safe Zone Hub...');
        this.hide();
        this.gameEngine.startFromSafeZone = true;
        // Will be handled by SafeZoneSystem
    }
    
    openSettings() {
        logger.info('⚙️ Opening settings...');
        this.createSettingsPanel();
    }
    
    createSettingsPanel() {
        // Remove existing settings panel if any
        const existing = document.getElementById('settings-panel');
        if (existing) {
            existing.remove();
        }
        
        const panel = document.createElement('div');
        panel.id = 'settings-panel';
        panel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, rgba(26, 40, 71, 0.98), rgba(45, 74, 124, 0.98));
            border: 2px solid #9d4edd;
            border-radius: 15px;
            padding: 30px;
            z-index: 3000;
            min-width: 400px;
            max-width: 600px;
            box-shadow: 0 10px 40px rgba(157, 78, 221, 0.4);
            color: white;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        `;
        
        // Title
        const title = document.createElement('h2');
        title.textContent = '⚙️ Settings';
        title.style.cssText = `
            margin: 0 0 20px 0;
            color: #c77dff;
            text-align: center;
            font-size: 2em;
        `;
        panel.appendChild(title);
        
        // Audio Settings
        const audioSection = this.createSettingSection('Audio', [
            { label: 'Master Volume', type: 'range', id: 'master-volume', value: 0.7 },
            { label: 'Music Volume', type: 'range', id: 'music-volume', value: 0.6 },
            { label: 'SFX Volume', type: 'range', id: 'sfx-volume', value: 0.8 },
        ]);
        panel.appendChild(audioSection);
        
        // Graphics Settings
        const graphicsSection = this.createSettingSection('Graphics', [
            { label: 'Graphics Quality', type: 'select', id: 'graphics-quality', options: ['Low', 'Medium', 'High', 'Ultra'], value: 'High' },
            { label: 'Shadows', type: 'checkbox', id: 'shadows', checked: true },
            { label: 'Particles', type: 'checkbox', id: 'particles', checked: true },
            { label: 'Anti-Aliasing', type: 'checkbox', id: 'anti-aliasing', checked: true },
        ]);
        panel.appendChild(graphicsSection);
        
        // Controls Settings
        const controlsSection = this.createSettingSection('Controls', [
            { label: 'Mouse Sensitivity', type: 'range', id: 'mouse-sensitivity', value: 0.5, min: 0.1, max: 2.0 },
            { label: 'Invert Y-Axis', type: 'checkbox', id: 'invert-y', checked: false },
        ]);
        panel.appendChild(controlsSection);
        
        // Buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            display: flex;
            justify-content: space-between;
            margin-top: 30px;
            gap: 10px;
        `;
        
        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save Settings';
        saveButton.style.cssText = this.getButtonStyle('#9d4edd');
        saveButton.onclick = () => {
            this.saveSettings();
            panel.remove();
        };
        
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.style.cssText = this.getButtonStyle('#dc143c');
        closeButton.onclick = () => panel.remove();
        
        buttonContainer.appendChild(saveButton);
        buttonContainer.appendChild(closeButton);
        panel.appendChild(buttonContainer);
        
        document.body.appendChild(panel);
    }
    
    createSettingSection(title, settings) {
        const section = document.createElement('div');
        section.style.cssText = 'margin-bottom: 25px;';
        
        const sectionTitle = document.createElement('h3');
        sectionTitle.textContent = title;
        sectionTitle.style.cssText = 'color: #e0aaff; margin-bottom: 15px; font-size: 1.3em;';
        section.appendChild(sectionTitle);
        
        settings.forEach(setting => {
            const row = document.createElement('div');
            row.style.cssText = 'margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;';
            
            const label = document.createElement('label');
            label.textContent = setting.label;
            label.style.cssText = 'flex: 1; color: #ffffff;';
            row.appendChild(label);
            
            let input;
            if (setting.type === 'range') {
                input = document.createElement('input');
                input.type = 'range';
                input.id = setting.id;
                input.min = setting.min || 0;
                input.max = setting.max || 1;
                input.step = 0.1;
                input.value = localStorage.getItem(setting.id) || setting.value;
                input.style.cssText = 'flex: 1; max-width: 150px;';
                
                const valueDisplay = document.createElement('span');
                valueDisplay.textContent = Math.round(input.value * 100) + '%';
                valueDisplay.style.cssText = 'margin-left: 10px; min-width: 45px; color: #c77dff;';
                input.oninput = () => valueDisplay.textContent = Math.round(input.value * 100) + '%';
                
                row.appendChild(input);
                row.appendChild(valueDisplay);
            } else if (setting.type === 'select') {
                input = document.createElement('select');
                input.id = setting.id;
                setting.options.forEach(opt => {
                    const option = document.createElement('option');
                    option.value = opt;
                    option.textContent = opt;
                    input.appendChild(option);
                });
                input.value = localStorage.getItem(setting.id) || setting.value;
                input.style.cssText = 'padding: 5px 10px; background: rgba(0,0,0,0.3); color: white; border: 1px solid #9d4edd; border-radius: 5px;';
                row.appendChild(input);
            } else if (setting.type === 'checkbox') {
                input = document.createElement('input');
                input.type = 'checkbox';
                input.id = setting.id;
                input.checked = localStorage.getItem(setting.id) !== null ? localStorage.getItem(setting.id) === 'true' : setting.checked;
                input.style.cssText = 'width: 20px; height: 20px; cursor: pointer;';
                row.appendChild(input);
            }
            
            section.appendChild(row);
        });
        
        return section;
    }
    
    getButtonStyle(color) {
        return `
            padding: 12px 30px;
            background: ${color};
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1em;
            font-weight: bold;
            flex: 1;
            transition: all 0.3s;
        `;
    }
    
    saveSettings() {
        // Save all settings to localStorage
        const settings = [
            'master-volume', 'music-volume', 'sfx-volume',
            'graphics-quality', 'shadows', 'particles', 'anti-aliasing',
            'mouse-sensitivity', 'invert-y'
        ];
        
        settings.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                if (element.type === 'checkbox') {
                    localStorage.setItem(id, element.checked);
                } else {
                    localStorage.setItem(id, element.value);
                }
            }
        });
        
        logger.info('✅ Settings saved');
        alert('Settings saved successfully!');
    }
    
    showCredits() {
        logger.info('📜 Showing credits...');
        const creditsText = `
Dynasty of Emberveil
A Psychedelic Fantasy RPG

Created with passion and powered by Three.js

Special thanks to all contributors and players!

Version 1.1.0 - Enhanced Edition
        `;
        alert(creditsText);
    }
}
