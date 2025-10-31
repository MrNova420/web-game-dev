import { logger } from './core/Logger.js';
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
            logger.info('🌐 Connection restored');
            if (this.loadingText.textContent.includes('offline')) {
                this.loadingText.textContent = 'Connection restored, resuming...';
            }
        });
        
        window.addEventListener('offline', () => {
            this.connectionStatus = 'offline';
            logger.warn('📡 Connection lost');
            this.loadingText.textContent = 'You appear to be offline. Waiting for connection...';
            this.loadingText.style.color = '#ffaa00';
        });
    }
    
    async init() {
        try {
            logger.info('🎮 Starting optimized game loading...');
            
            // Simple, fast loading - no complex timeouts
            this.updateLoading(10, 'Initializing...');
            
            // Create game engine
            this.engine = new GameEngine(this.canvas);
            await this.engine.init();
            
            this.updateLoading(40, 'Loading assets...');
            
            // Load assets quickly
            await this.assetLoader.loadAll((progress, assetName) => {
                const percent = Math.floor(progress * 100);
                const loadingPercent = 40 + progress * 30;
                this.updateLoading(loadingPercent, `Loading: ${percent}%`);
            });
            
            this.updateLoading(70, 'Creating world...');
            
            // Create world
            await this.engine.createWorld();
            
            this.updateLoading(85, 'Setting up controls...');
            
            // Initialize controls
            this.inputManager = new InputManager(this.canvas, this.engine);
            
            this.updateLoading(100, 'Ready!');
            
            // Hide loading screen and show game
            setTimeout(() => {
                this.loadingScreen.classList.add('hidden');
                
                const uiOverlay = document.getElementById('ui-overlay');
                if (uiOverlay) {
                    uiOverlay.classList.add('loaded');
                }
                
                this.start();
            }, 500);
            
        } catch (error) {
            logger.error('Failed to initialize game:', error);
            this.handleLoadError(error);
        }
    }
    
    handleLoadError(error) {
        logger.error('Failed to initialize game:', error);
        logger.error('Stack trace:', error.stack);
        
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
        logger.info('🎮 Dynasty of Emberveil - NEW COMPLETE GAME STARTING!');
        logger.info('   🌟 This is the UPDATED version with all new systems!');
        logger.info('   ✅ Complete UI/UX System');
        logger.info('   ✅ Universal Input (Mobile + Desktop)');
        logger.info('   ✅ 3 Playable Biomes');
        logger.info('   ✅ Combat & Magic System');
        logger.info('   ✅ Dungeon System');
        
        this.engine.start();
        
        // Make engine and input manager globally accessible
        window.gameEngine = this.engine;
        window.gameEngine.inputManager = this.inputManager;
        
        // NEW: Check if Complete Game Integration is available
        if (this.engine.completeGameIntegration) {
            logger.info('   ✅ Complete Game Integration Active!');
            
            // Show the NEW UI system (not old beta UI)
            if (this.engine.enhancedUISystem) {
                logger.info('   ✅ NEW Enhanced UI System loaded');
                // UI is already initialized and showing main menu
            }
            
            // Make the complete integration globally available
            window.completeGame = this.engine.completeGameIntegration;
            
        } else {
            logger.warn('   ⚠️ Complete Game Integration not found - using fallback');
            
            // Fallback to old main menu if new system isn't loaded
            if (this.engine.mainMenuSystem) {
                this.engine.mainMenuSystem.show();
            }
        }
        
        logger.info('');
        logger.info('🎉 GAME READY! The NEW complete game is now running!');
        logger.info('   Click "Start Adventure" in the menu to begin!');
        
        // Start game loop
        this.gameLoop();
    }
    
    setupHealthChecks() {
        // Check game health every 30 seconds
        this.healthCheckInterval = setInterval(() => {
            if (this.engine && this.engine.isRunning) {
                // Check for common issues
                if (!this.engine.player) {
                    logger.warn('⚠️ Player reference lost, attempting recovery...');
                    // The game will auto-recover on next update
                }
                
                // Log performance metrics
                if (this.engine.performanceOptimizer) {
                    const fps = this.engine.performanceOptimizer.currentFPS || 0;
                    if (fps < 10 && fps > 0) {
                        logger.warn(`⚠️ Low FPS detected: ${fps.toFixed(1)}`);
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
                logger.error('Error in game loop:', error);
                // Don't crash the game, just log the error
                // The performance optimizer will handle degraded performance
            }
        }
    }
    
    // Handle visibility change to pause/resume game
    handleVisibilityChange() {
        if (document.hidden) {
            logger.info('⏸️ Game paused (tab hidden)');
            if (this.engine) {
                this.engine.isRunning = false;
            }
        } else {
            logger.info('▶️ Game resumed (tab visible)');
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
        logger.error('Uncaught error:', event.error);
        // Don't let uncaught errors crash the game
        event.preventDefault();
    });
    
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
        logger.error('Unhandled promise rejection:', event.reason);
        event.preventDefault();
    });
});
