/**
 * Dynasty of Emberveil - Main Entry Point
 * A browser-based psychedelic fantasy RPG
 */

import { GameEngine } from './core/GameEngine.js';
import { AssetLoader } from './core/AssetLoader.js';
import { InputManager } from './core/InputManager.js';

class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.loadingScreen = document.getElementById('loading-screen');
        this.loadingProgress = document.getElementById('loading-progress');
        this.loadingText = document.getElementById('loading-text');
        
        this.engine = null;
        this.assetLoader = new AssetLoader();
        this.inputManager = null;
        
        this.init();
    }
    
    async init() {
        try {
            // Update loading screen
            this.updateLoading(10, 'Initializing game engine...');
            
            // Initialize game engine
            this.engine = new GameEngine(this.canvas);
            await this.engine.init();
            
            this.updateLoading(30, 'Loading assets...');
            
            // Load game assets
            await this.assetLoader.loadAll((progress) => {
                this.updateLoading(30 + progress * 50, `Loading assets: ${Math.floor(progress * 100)}%`);
            });
            
            this.updateLoading(80, 'Initializing controls...');
            
            // Initialize input manager
            this.inputManager = new InputManager(this.canvas, this.engine);
            
            this.updateLoading(90, 'Creating world...');
            
            // Create initial game world
            await this.engine.createWorld();
            
            this.updateLoading(100, 'Ready!');
            
            // Hide loading screen
            setTimeout(() => {
                this.loadingScreen.classList.add('hidden');
                this.start();
            }, 500);
            
        } catch (error) {
            console.error('Failed to initialize game:', error);
            this.loadingText.textContent = 'Error loading game. Please refresh.';
        }
    }
    
    updateLoading(progress, text) {
        this.loadingProgress.style.width = `${progress}%`;
        this.loadingText.textContent = text;
    }
    
    start() {
        console.log('🎮 Dynasty of Emberveil - Game Started!');
        this.engine.start();
        
        // Make engine and input manager globally accessible
        window.gameEngine = this.engine;
        window.gameEngine.inputManager = this.inputManager;
        
        // Start game loop
        this.gameLoop();
    }
    
    gameLoop() {
        requestAnimationFrame(() => this.gameLoop());
        
        if (this.engine) {
            this.engine.update();
            this.engine.render();
        }
    }
}

// Start the game when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
    new Game();
});
