/**
import { logger } from '../core/Logger.js';
 * Complete Player Control & Settings System
 * Comprehensive user controls, settings, customization, and quality of life features
 */

import * as THREE from 'three';

export class PlayerControlSettingsSystem {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        
        // Control schemes
        this.controlSchemes = {
            WASD: { up: 'w', down: 's', left: 'a', right: 'd' },
            ARROWS: { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight' },
            ESDF: { up: 'e', down: 'd', left: 's', right: 'f' },
            CUSTOM: {}
        };
        
        this.currentScheme = 'WASD';
        
        // All game settings
        this.settings = {
            // Graphics settings
            graphics: {
                quality: 'HIGH', // POTATO, LOW, MEDIUM, HIGH, ULTRA
                resolution: 1.0, // 0.5 to 2.0
                shadows: true,
                particles: true,
                antialiasing: true,
                bloom: true,
                motionBlur: false,
                fov: 75,
                drawDistance: 1000,
                vsync: true,
                targetFPS: 60
            },
            
            // Audio settings
            audio: {
                masterVolume: 1.0,
                musicVolume: 0.7,
                sfxVolume: 0.8,
                ambientVolume: 0.6,
                voiceVolume: 1.0,
                mute: false,
                muteOnMinimize: true
            },
            
            // Gameplay settings
            gameplay: {
                difficulty: 'NORMAL', // EASY, NORMAL, HARD, HARDCORE
                autoLoot: true,
                autoLootQuality: 'RARE', // ALL, UNCOMMON, RARE, EPIC, LEGENDARY
                showDamageNumbers: true,
                showHitMarkers: true,
                showCriticals: true,
                combatText: true,
                screenShake: true,
                bloodEffects: true,
                autoSave: true,
                autoSaveInterval: 60, // seconds
                pauseOnMenu: true
            },
            
            // UI settings
            ui: {
                hudScale: 1.0,
                miniMapSize: 'MEDIUM',
                miniMapZoom: 1.0,
                miniMapRotate: true,
                showPlayerNames: true,
                showEnemyNames: true,
                showHealthBars: true,
                showQuestTracker: true,
                showBuffs: true,
                showDebuffs: true,
                showCooldowns: true,
                tooltips: true,
                tooltipDelay: 0.5,
                chatFontSize: 14,
                chatOpacity: 0.8
            },
            
            // Camera settings
            camera: {
                distance: 15,
                height: 10,
                angle: 45,
                smoothness: 0.1,
                collisionDetection: true,
                autoRotate: false,
                rotationSpeed: 2.0,
                zoomSpeed: 1.0,
                invertY: false,
                invertX: false,
                mouseSensitivity: 1.0
            },
            
            // Controls
            controls: {
                scheme: 'WASD',
                mouseButtons: {
                    leftClick: 'attack',
                    rightClick: 'special',
                    middleClick: 'ability3'
                },
                keyBindings: this.getDefaultKeyBindings(),
                holdToMove: false,
                smartCast: false,
                quickCast: false,
                doubleClickToRun: false
            },
            
            // Accessibility
            accessibility: {
                colorBlindMode: 'NONE', // NONE, PROTANOPIA, DEUTERANOPIA, TRITANOPIA
                highContrast: false,
                largeText: false,
                reduceMotion: false,
                screenReader: false,
                subtitles: true,
                subtitleSize: 'MEDIUM'
            },
            
            // Social
            social: {
                showOnlineStatus: true,
                allowWhispers: true,
                allowGroupInvites: true,
                allowGuildInvites: true,
                showLevel: true,
                showGear: true,
                blockStrangers: false,
                filterProfanity: true
            },
            
            // Performance
            performance: {
                autoOptimize: true,
                adaptiveQuality: true,
                objectCulling: true,
                lodEnabled: true,
                maxParticles: 5000,
                maxEnemies: 50,
                memoryLimit: 500 // MB
            }
        };
        
        // Player preferences
        this.preferences = {
            favoriteClass: null,
            favoriteWeapon: null,
            autoEquipBest: true,
            sellJunk: true,
            skipCutscenes: false,
            autoAcceptQuests: false,
            autoTurnInQuests: false,
            mountAutoDismount: true,
            petAutoSummon: true,
            companionPreference: 'BALANCED'
        };
        
        // Statistics tracking
        this.statistics = {
            playtime: 0,
            deaths: 0,
            kills: 0,
            bossKills: 0,
            questsCompleted: 0,
            itemsLooted: 0,
            goldEarned: 0,
            damageDealt: 0,
            damageTaken: 0,
            healingDone: 0,
            distanceTraveled: 0,
            jumpsPerformed: 0,
            skillsUsed: 0,
            favoriteSkill: null,
            favoriteEnemy: null
        };
        
        // Achievements unlocked
        this.achievements = new Set();
        
        // Unlocked content
        this.unlocks = {
            mounts: new Set(),
            pets: new Set(),
            costumes: new Set(),
            titles: new Set(),
            emotes: new Set(),
            dyes: new Set(),
            zones: new Set(['starting_zone']),
            dungeons: new Set(),
            features: new Set(['basic_combat', 'inventory'])
        };
        
        // Quick slots
        this.quickSlots = {
            abilities: Array(10).fill(null),
            items: Array(5).fill(null),
            emotes: Array(8).fill(null)
        };
        
        // Macros
        this.macros = [];
        
        this.initialize();
    }
    
    initialize() {
        logger.info('🎮 Complete Player Control & Settings System initialized');
        
        // Load saved settings
        this.loadSettings();
        
        // Apply settings
        this.applyAllSettings();
        
        // Setup event listeners
        this.setupEventListeners();
    }
    
    /**
     * Get default key bindings
     */
    getDefaultKeyBindings() {
        return {
            // Movement
            moveForward: 'w',
            moveBackward: 's',
            moveLeft: 'a',
            moveRight: 'd',
            jump: ' ', // space
            dodge: 'shift',
            sprint: 'shift',
            walk: 'alt',
            
            // Combat
            attack: 'mouse0',
            special: 'mouse1',
            ability1: '1',
            ability2: '2',
            ability3: '3',
            ability4: '4',
            ability5: '5',
            ultimate: 'r',
            
            // Interface
            inventory: 'i',
            character: 'c',
            skills: 'k',
            quests: 'j',
            map: 'm',
            social: 'o',
            menu: 'escape',
            
            // Quick actions
            quickSlot1: 'q',
            quickSlot2: 'e',
            quickSlot3: 'f',
            mountUp: 'x',
            interact: 'e',
            autoRun: 'numlock',
            
            // Camera
            resetCamera: 'home',
            zoomIn: '=',
            zoomOut: '-',
            
            // Communication
            chat: 'enter',
            say: 's',
            yell: 'y',
            whisper: 'w',
            guild: 'g',
            party: 'p',
            
            // Targeting
            targetEnemy: 'tab',
            targetAlly: 'f1',
            targetSelf: 'f2',
            targetPet: 'f3',
            
            // Misc
            screenshot: 'printscreen',
            toggleUI: 'alt+z',
            toggleFPS: 'ctrl+r'
        };
    }
    
    /**
     * Apply all settings to game
     */
    applyAllSettings() {
        this.applyGraphicsSettings();
        this.applyAudioSettings();
        this.applyGameplaySettings();
        this.applyUISettings();
        this.applyCameraSettings();
        this.applyControlSettings();
        this.applyAccessibilitySettings();
        this.applyPerformanceSettings();
    }
    
    /**
     * Apply graphics settings
     */
    applyGraphicsSettings() {
        const g = this.settings.graphics;
        
        // Set quality preset
        if (this.gameEngine.autoManagementSystem) {
            this.gameEngine.autoManagementSystem.setQuality(g.quality);
        }
        
        // Apply individual settings
        if (this.gameEngine.renderer) {
            this.gameEngine.renderer.setPixelRatio(window.devicePixelRatio * g.resolution);
            this.gameEngine.renderer.shadowMap.enabled = g.shadows;
        }
        
        if (this.gameEngine.camera) {
            this.gameEngine.camera.fov = g.fov;
            this.gameEngine.camera.updateProjectionMatrix();
        }
        
        // Particles
        if (this.gameEngine.particleSystem) {
            this.gameEngine.particleSystem.enabled = g.particles;
        }
        
        logger.info(`✅ Applied graphics settings: ${g.quality}`);
    }
    
    /**
     * Apply audio settings
     */
    applyAudioSettings() {
        const a = this.settings.audio;
        
        if (this.gameEngine.audioSystem) {
            this.gameEngine.audioSystem.setMasterVolume(a.masterVolume);
            this.gameEngine.audioSystem.setMusicVolume(a.musicVolume);
            this.gameEngine.audioSystem.setSFXVolume(a.sfxVolume);
            this.gameEngine.audioSystem.setAmbientVolume(a.ambientVolume);
            this.gameEngine.audioSystem.setMuted(a.mute);
        }
        
        logger.info('✅ Applied audio settings');
    }
    
    /**
     * Apply gameplay settings
     */
    applyGameplaySettings() {
        const g = this.settings.gameplay;
        
        // Set difficulty
        if (this.gameEngine.difficultySystem) {
            this.gameEngine.difficultySystem.setDifficulty(g.difficulty);
        }
        
        // Auto-loot
        if (this.gameEngine.inventorySystem) {
            this.gameEngine.inventorySystem.setAutoLoot(g.autoLoot, g.autoLootQuality);
        }
        
        // Combat feedback
        if (this.gameEngine.combatSystem) {
            this.gameEngine.combatSystem.showDamageNumbers = g.showDamageNumbers;
            this.gameEngine.combatSystem.showHitMarkers = g.showHitMarkers;
            this.gameEngine.combatSystem.showCriticals = g.showCriticals;
        }
        
        logger.info('✅ Applied gameplay settings');
    }
    
    /**
     * Apply UI settings
     */
    applyUISettings() {
        const ui = this.settings.ui;
        
        // Scale HUD
        const hudElements = document.querySelectorAll('.hud');
        hudElements.forEach(el => {
            el.style.transform = `scale(${ui.hudScale})`;
        });
        
        // Mini-map settings
        if (this.gameEngine.miniMapSystem) {
            this.gameEngine.miniMapSystem.setSize(ui.miniMapSize);
            this.gameEngine.miniMapSystem.setZoom(ui.miniMapZoom);
            this.gameEngine.miniMapSystem.setRotate(ui.miniMapRotate);
        }
        
        logger.info('✅ Applied UI settings');
    }
    
    /**
     * Apply camera settings
     */
    applyCameraSettings() {
        const c = this.settings.camera;
        
        if (this.gameEngine.cameraController) {
            this.gameEngine.cameraController.setDistance(c.distance);
            this.gameEngine.cameraController.setHeight(c.height);
            this.gameEngine.cameraController.setAngle(c.angle);
            this.gameEngine.cameraController.setSmoothness(c.smoothness);
            this.gameEngine.cameraController.setInvertY(c.invertY);
            this.gameEngine.cameraController.setInvertX(c.invertX);
            this.gameEngine.cameraController.setSensitivity(c.mouseSensitivity);
        }
        
        logger.info('✅ Applied camera settings');
    }
    
    /**
     * Apply control settings
     */
    applyControlSettings() {
        const c = this.settings.controls;
        
        // Update control scheme
        this.currentScheme = c.scheme;
        
        // Apply key bindings
        if (this.gameEngine.inputManager) {
            this.gameEngine.inputManager.setKeyBindings(c.keyBindings);
        }
        
        logger.info('✅ Applied control settings');
    }
    
    /**
     * Apply accessibility settings
     */
    applyAccessibilitySettings() {
        const a = this.settings.accessibility;
        
        // Color blind mode
        if (a.colorBlindMode !== 'NONE' && this.gameEngine.renderer) {
            this.applyColorBlindFilter(a.colorBlindMode);
        }
        
        // High contrast
        if (a.highContrast) {
            document.body.classList.add('high-contrast');
        } else {
            document.body.classList.remove('high-contrast');
        }
        
        // Large text
        if (a.largeText) {
            document.documentElement.style.fontSize = '120%';
        } else {
            document.documentElement.style.fontSize = '100%';
        }
        
        // Reduce motion
        if (a.reduceMotion) {
            if (this.gameEngine.cameraController) {
                this.gameEngine.cameraController.reduceMotion = true;
            }
        }
        
        logger.info('✅ Applied accessibility settings');
    }
    
    /**
     * Apply performance settings
     */
    applyPerformanceSettings() {
        const p = this.settings.performance;
        
        if (this.gameEngine.autoManagementSystem) {
            if (p.autoOptimize) {
                this.gameEngine.autoManagementSystem.enableAutoQuality();
            } else {
                this.gameEngine.autoManagementSystem.disableAutoQuality();
            }
            
            this.gameEngine.autoManagementSystem.adaptive.qualityAdjustment = p.adaptiveQuality;
        }
        
        // Set resource limits
        if (this.gameEngine.enemyManager) {
            this.gameEngine.enemyManager.setMaxEnemies(p.maxEnemies);
        }
        
        logger.info('✅ Applied performance settings');
    }
    
    /**
     * Setup event listeners for controls
     */
    setupEventListeners() {
        // Key press handler
        document.addEventListener('keydown', (e) => {
            this.handleKeyPress(e);
        });
        
        // Mouse handler
        document.addEventListener('mousedown', (e) => {
            this.handleMouseClick(e);
        });
        
        // Window events
        window.addEventListener('blur', () => {
            if (this.settings.audio.muteOnMinimize) {
                this.gameEngine.audioSystem?.setMuted(true);
            }
        });
        
        window.addEventListener('focus', () => {
            if (this.settings.audio.muteOnMinimize && !this.settings.audio.mute) {
                this.gameEngine.audioSystem?.setMuted(false);
            }
        });
    }
    
    /**
     * Handle key press
     */
    handleKeyPress(event) {
        const key = event.key.toLowerCase();
        const bindings = this.settings.controls.keyBindings;
        
        // Find action for key
        for (const [action, boundKey] of Object.entries(bindings)) {
            if (boundKey === key) {
                this.executeAction(action);
                break;
            }
        }
    }
    
    /**
     * Handle mouse click
     */
    handleMouseClick(event) {
        const button = `mouse${event.button}`;
        const mouseBindings = this.settings.controls.mouseButtons;
        
        for (const [mouseButton, action] of Object.entries(mouseBindings)) {
            if (mouseButton === `${event.button}`) {
                this.executeAction(action);
                break;
            }
        }
    }
    
    /**
     * Execute action
     */
    executeAction(action) {
        logger.info(`Executing action: ${action}`);
        
        // Route action to appropriate system
        switch (action) {
            case 'attack':
                this.gameEngine.player?.attack();
                break;
            case 'special':
                this.gameEngine.player?.useSpecial();
                break;
            case 'inventory':
                this.toggleInventory();
                break;
            case 'character':
                this.toggleCharacterSheet();
                break;
            // Add more actions...
        }
    }
    
    /**
     * UI Toggle methods
     */
    toggleInventory() {
        const panel = document.getElementById('inventory-panel');
        if (panel) {
            panel.classList.toggle('visible');
        }
    }
    
    toggleCharacterSheet() {
        // Implementation
    }
    
    /**
     * Save/Load settings
     */
    saveSettings() {
        try {
            localStorage.setItem('gameSettings', JSON.stringify(this.settings));
            localStorage.setItem('gamePreferences', JSON.stringify(this.preferences));
            localStorage.setItem('gameStatistics', JSON.stringify(this.statistics));
            localStorage.setItem('gameUnlocks', JSON.stringify({
                achievements: Array.from(this.achievements),
                mounts: Array.from(this.unlocks.mounts),
                pets: Array.from(this.unlocks.pets),
                costumes: Array.from(this.unlocks.costumes),
                titles: Array.from(this.unlocks.titles),
                emotes: Array.from(this.unlocks.emotes),
                dyes: Array.from(this.unlocks.dyes),
                zones: Array.from(this.unlocks.zones),
                dungeons: Array.from(this.unlocks.dungeons),
                features: Array.from(this.unlocks.features)
            }));
            logger.info('💾 Settings saved');
        } catch (error) {
            logger.error('Failed to save settings:', error);
        }
    }
    
    loadSettings() {
        try {
            const saved = localStorage.getItem('gameSettings');
            if (saved) {
                const loaded = JSON.parse(saved);
                this.settings = { ...this.settings, ...loaded };
            }
            
            const prefs = localStorage.getItem('gamePreferences');
            if (prefs) {
                this.preferences = { ...this.preferences, ...JSON.parse(prefs) };
            }
            
            const stats = localStorage.getItem('gameStatistics');
            if (stats) {
                this.statistics = { ...this.statistics, ...JSON.parse(stats) };
            }
            
            const unlocks = localStorage.getItem('gameUnlocks');
            if (unlocks) {
                const u = JSON.parse(unlocks);
                this.achievements = new Set(u.achievements || []);
                this.unlocks.mounts = new Set(u.mounts || []);
                this.unlocks.pets = new Set(u.pets || []);
                this.unlocks.costumes = new Set(u.costumes || []);
                this.unlocks.titles = new Set(u.titles || []);
                this.unlocks.emotes = new Set(u.emotes || []);
                this.unlocks.dyes = new Set(u.dyes || []);
                this.unlocks.zones = new Set(u.zones || ['starting_zone']);
                this.unlocks.dungeons = new Set(u.dungeons || []);
                this.unlocks.features = new Set(u.features || ['basic_combat', 'inventory']);
            }
            
            logger.info('📂 Settings loaded');
        } catch (error) {
            logger.error('Failed to load settings:', error);
        }
    }
    
    /**
     * Update statistics
     */
    updateStatistic(stat, value) {
        if (this.statistics.hasOwnProperty(stat)) {
            if (typeof this.statistics[stat] === 'number') {
                this.statistics[stat] += value;
            } else {
                this.statistics[stat] = value;
            }
        }
    }
    
    /**
     * Unlock content
     */
    unlock(category, item) {
        if (this.unlocks[category]) {
            this.unlocks[category].add(item);
            logger.info(`🎉 Unlocked ${category}: ${item}`);
            this.saveSettings();
        }
    }
    
    /**
     * Check if unlocked
     */
    isUnlocked(category, item) {
        return this.unlocks[category]?.has(item) || false;
    }
    
    /**
     * Award achievement
     */
    awardAchievement(achievementId) {
        if (!this.achievements.has(achievementId)) {
            this.achievements.add(achievementId);
            logger.info(`🏆 Achievement Unlocked: ${achievementId}`);
            
            // Show notification
            this.showAchievementNotification(achievementId);
            this.saveSettings();
        }
    }
    
    showAchievementNotification(achievementId) {
        // Create achievement popup
        logger.info(`Achievement: ${achievementId}`);
    }
    
    /**
     * Create macro
     */
    createMacro(name, commands) {
        this.macros.push({
            name: name,
            commands: commands,
            icon: 'default'
        });
        this.saveSettings();
    }
    
    /**
     * Execute macro
     */
    executeMacro(macroName) {
        const macro = this.macros.find(m => m.name === macroName);
        if (macro) {
            macro.commands.forEach(cmd => {
                this.executeAction(cmd);
            });
        }
    }
    
    /**
     * Apply color blind filter
     */
    applyColorBlindFilter(mode) {
        // Would apply shader-based color correction
        logger.info(`Applying color blind mode: ${mode}`);
    }
    
    /**
     * Reset to defaults
     */
    resetToDefaults() {
        this.settings = this.getDefaultSettings();
        this.applyAllSettings();
        this.saveSettings();
        logger.info('🔄 Settings reset to defaults');
    }
    
    getDefaultSettings() {
        // Return fresh copy of default settings
        return JSON.parse(JSON.stringify(this.settings));
    }
    
    /**
     * Get current settings
     */
    getSettings() {
        return this.settings;
    }
    
    /**
     * Update setting
     */
    updateSetting(category, setting, value) {
        if (this.settings[category] && this.settings[category].hasOwnProperty(setting)) {
            this.settings[category][setting] = value;
            
            // Apply the specific setting
            switch (category) {
                case 'graphics':
                    this.applyGraphicsSettings();
                    break;
                case 'audio':
                    this.applyAudioSettings();
                    break;
                case 'gameplay':
                    this.applyGameplaySettings();
                    break;
                case 'ui':
                    this.applyUISettings();
                    break;
                case 'camera':
                    this.applyCameraSettings();
                    break;
                case 'controls':
                    this.applyControlSettings();
                    break;
                case 'accessibility':
                    this.applyAccessibilitySettings();
                    break;
                case 'performance':
                    this.applyPerformanceSettings();
                    break;
            }
            
            this.saveSettings();
        }
    }
    
    /**
     * Get statistics
     */
    getStatistics() {
        return {
            ...this.statistics,
            playtimeFormatted: this.formatPlaytime(this.statistics.playtime),
            killDeathRatio: this.statistics.deaths > 0 
                ? (this.statistics.kills / this.statistics.deaths).toFixed(2)
                : this.statistics.kills
        };
    }
    
    formatPlaytime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${hours}h ${minutes}m`;
    }
    
    /**
     * Export settings
     */
    exportSettings() {
        return {
            settings: this.settings,
            preferences: this.preferences,
            quickSlots: this.quickSlots,
            macros: this.macros
        };
    }
    
    /**
     * Import settings
     */
    importSettings(data) {
        try {
            if (data.settings) this.settings = data.settings;
            if (data.preferences) this.preferences = data.preferences;
            if (data.quickSlots) this.quickSlots = data.quickSlots;
            if (data.macros) this.macros = data.macros;
            
            this.applyAllSettings();
            this.saveSettings();
            
            logger.info('✅ Settings imported successfully');
        } catch (error) {
            logger.error('Failed to import settings:', error);
        }
    }
}
