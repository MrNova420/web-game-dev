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
        
        // Monitor connection status
        this.connectionStatus = 'online';
        this.setupConnectionMonitoring();
        
        this.init();
    }
    
    setupConnectionMonitoring() {
        // Monitor online/offline status
        window.addEventListener('online', () => {
            this.connectionStatus = 'online';
            console.log('🌐 Connection restored');
            if (this.loadingText.textContent.includes('offline')) {
                this.loadingText.textContent = 'Connection restored, resuming...';
            }
        });
        
        window.addEventListener('offline', () => {
            this.connectionStatus = 'offline';
            console.warn('📡 Connection lost');
            this.loadingText.textContent = 'You appear to be offline. Waiting for connection...';
            this.loadingText.style.color = '#ffaa00';
        });
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
                this.assetLoader.loadAll((progress, assetName) => {
                    const percent = Math.floor(progress * 100);
                    const loadingPercent = 30 + progress * 50;
                    this.updateLoading(
                        loadingPercent, 
                        `Loading assets: ${percent}% ${assetName ? `(${assetName})` : ''}`
                    );
                }),
                this.createTimeout(15000, 'Asset loading')
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
                
                // Set up periodic health checks
                this.setupHealthChecks();
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
        
        // Show main menu initially
        if (this.engine.mainMenuSystem) {
            this.engine.mainMenuSystem.show();
        }
        
        // Start game loop
        this.gameLoop();
    }
    
    setupHealthChecks() {
        // Check game health every 30 seconds
        this.healthCheckInterval = setInterval(() => {
            if (this.engine && this.engine.isRunning) {
                // Check for common issues
                if (!this.engine.player) {
                    console.warn('⚠️ Player reference lost, attempting recovery...');
                    // The game will auto-recover on next update
                }
                
                // Log performance metrics
                if (this.engine.performanceOptimizer) {
                    const fps = this.engine.performanceOptimizer.currentFPS || 0;
                    if (fps < 10 && fps > 0) {
                        console.warn(`⚠️ Low FPS detected: ${fps.toFixed(1)}`);
                    }
                }
            }
        }, 30000);
    }
    
    gameLoop() {
        requestAnimationFrame(() => this.gameLoop());
        
        if (this.engine) {
            try {
                this.engine.update();
                this.engine.render();
            } catch (error) {
                console.error('Error in game loop:', error);
                // Don't crash the game, just log the error
                // The performance optimizer will handle degraded performance
            }
        }
    }
    
    // Handle visibility change to pause/resume game
    handleVisibilityChange() {
        if (document.hidden) {
            console.log('⏸️ Game paused (tab hidden)');
            if (this.engine) {
                this.engine.isRunning = false;
            }
        } else {
            console.log('▶️ Game resumed (tab visible)');
            if (this.engine) {
                this.engine.isRunning = true;
            }
        }
    }
}

// Start the game when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
    
    // Add visibility change handler to pause/resume
    document.addEventListener('visibilitychange', () => {
        game.handleVisibilityChange();
    });
    
    // Add error handler for uncaught errors
    window.addEventListener('error', (event) => {
        console.error('Uncaught error:', event.error);
        // Don't let uncaught errors crash the game
        event.preventDefault();
    });
    
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled promise rejection:', event.reason);
        event.preventDefault();
    });
});
