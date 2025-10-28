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
        // Set a timeout to detect if loading is stuck
        const loadingTimeout = setTimeout(() => {
            console.error('Loading timeout detected - game may be stuck');
            this.loadingText.textContent = 'Loading is taking longer than expected...';
            this.loadingText.style.color = '#ffaa00';
        }, 10000); // 10 second warning
        
        const criticalTimeout = setTimeout(() => {
            console.error('Critical loading timeout - stopping load attempt');
            this.handleLoadError(new Error('Loading timeout - game did not load within 30 seconds'));
        }, 30000); // 30 second failure
        
        try {
            // Update loading screen
            this.updateLoading(10, 'Initializing game engine...');
            
            // Initialize game engine with timeout protection
            this.engine = new GameEngine(this.canvas);
            await Promise.race([
                this.engine.init(),
                this.createTimeout(10000, 'Game engine initialization')
            ]);
            
            this.updateLoading(30, 'Loading assets...');
            
            // Load game assets with timeout protection
            await Promise.race([
                this.assetLoader.loadAll((progress) => {
                    this.updateLoading(30 + progress * 50, `Loading assets: ${Math.floor(progress * 100)}%`);
                }),
                this.createTimeout(10000, 'Asset loading')
            ]);
            
            this.updateLoading(80, 'Initializing controls...');
            
            // Initialize input manager
            this.inputManager = new InputManager(this.canvas, this.engine);
            
            this.updateLoading(90, 'Creating world...');
            
            // Create initial game world with timeout protection
            await Promise.race([
                this.engine.createWorld(),
                this.createTimeout(10000, 'World creation')
            ]);
            
            this.updateLoading(100, 'Ready!');
            
            // Clear timeouts since loading succeeded
            clearTimeout(loadingTimeout);
            clearTimeout(criticalTimeout);
            
            // Hide loading screen
            setTimeout(() => {
                this.loadingScreen.classList.add('hidden');
                this.start();
            }, 500);
            
        } catch (error) {
            clearTimeout(loadingTimeout);
            clearTimeout(criticalTimeout);
            this.handleLoadError(error);
        }
    }
    
    createTimeout(ms, operation) {
        return new Promise((_, reject) => {
            setTimeout(() => reject(new Error(`${operation} timed out after ${ms}ms`)), ms);
        });
    }
    
    handleLoadError(error) {
        console.error('Failed to initialize game:', error);
        console.error('Stack trace:', error.stack);
        
        // Show detailed error to user
        this.loadingText.innerHTML = `
            ⚠️ Error loading game<br>
            <span style="font-size: 0.8em; color: #ff6b9d;">${error.message}</span><br>
            <span style="font-size: 0.7em; margin-top: 10px; display: block;">
                Please refresh the page to try again.<br>
                If the problem persists, try clearing your browser cache.
            </span>
        `;
        this.loadingText.style.color = '#ff6b9d';
        this.loadingProgress.style.background = 'linear-gradient(90deg, #ff0844, #ff6b9d)';
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
