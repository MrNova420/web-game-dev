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
        console.log('🎮 Main Menu System initialized');
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
            { text: '⚔️ New Game', action: () => this.startNewGame() },
            { text: '📂 Load Game', action: () => this.loadGame() },
            { text: '🏰 Safe Zone Hub', action: () => this.enterSafeZone() },
            { text: '⚙️ Settings', action: () => this.openSettings() },
            { text: '📜 Credits', action: () => this.showCredits() }
        ];
        
        buttons.forEach(btn => {
            const button = document.createElement('button');
            button.textContent = btn.text;
            button.style.cssText = `
                padding: 15px 30px;
                font-size: 1.2em;
                background: linear-gradient(135deg, #2d0a4e, #4a0e7a);
                border: 2px solid #9d4edd;
                border-radius: 10px;
                color: #fff;
                cursor: pointer;
                transition: all 0.3s;
                box-shadow: 0 0 20px rgba(157, 78, 221, 0.3);
            `;
            
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'scale(1.05)';
                button.style.boxShadow = '0 0 30px rgba(157, 78, 221, 0.8)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'scale(1)';
                button.style.boxShadow = '0 0 20px rgba(157, 78, 221, 0.3)';
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
        version.textContent = 'v1.1.0 - Enhanced Edition';
        
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
        
        document.getElementById('game-container').appendChild(menuContainer);
        this.menuContainer = menuContainer;
    }
    
    show() {
        if (this.menuContainer) {
            this.menuContainer.style.display = 'flex';
            this.menuVisible = true;
        }
    }
    
    hide() {
        if (this.menuContainer) {
            this.menuContainer.style.display = 'none';
            this.menuVisible = false;
        }
    }
    
    startNewGame() {
        console.log('🎮 Starting new game...');
        this.hide();
        // Reset game state for new game
        if (this.gameEngine.saveSystem) {
            localStorage.removeItem('dynasty_save');
        }
        // Game will start from the safe zone
        this.gameEngine.startFromSafeZone = true;
    }
    
    loadGame() {
        console.log('📂 Loading saved game...');
        if (this.gameEngine.saveSystem && this.gameEngine.saveSystem.hasSaveData()) {
            this.hide();
            this.gameEngine.saveSystem.loadGame();
        } else {
            alert('No saved game found. Please start a new game.');
        }
    }
    
    enterSafeZone() {
        console.log('🏰 Entering Safe Zone Hub...');
        this.hide();
        this.gameEngine.startFromSafeZone = true;
        // Will be handled by SafeZoneSystem
    }
    
    openSettings() {
        console.log('⚙️ Opening settings...');
        // TODO: Implement settings panel
        alert('Settings panel coming soon!');
    }
    
    showCredits() {
        console.log('📜 Showing credits...');
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
