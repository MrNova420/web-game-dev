/**
 * SaveSystem - Handles game state persistence
 * Auto-saves player progress to localStorage
 */

export class SaveSystem {
    constructor(engine) {
        this.engine = engine;
        this.saveKey = 'dynasty_of_emberveil_save';
        this.autoSaveInterval = 30000; // 30 seconds
        this.autoSaveTimer = null;
        this.lastSaveTime = 0;
        
        // Initialize auto-save
        this.startAutoSave();
        
        logger.info('💾 Save System initialized');
    }
    
    startAutoSave() {
        // Auto-save every 30 seconds
        this.autoSaveTimer = setInterval(() => {
            this.autoSave();
        }, this.autoSaveInterval);
        
        // Save on page unload
        window.addEventListener('beforeunload', () => {
            this.saveGame('Auto-save on exit');
        });
    }
    
    stopAutoSave() {
        if (this.autoSaveTimer) {
            clearInterval(this.autoSaveTimer);
            this.autoSaveTimer = null;
        }
    }
    
    autoSave() {
        if (!this.engine.isRunning) return;
        
        this.saveGame('Auto-save');
        logger.info('💾 Auto-saved game');
    }
    
    saveGame(saveType = 'Manual') {
        try {
            const saveData = this.createSaveData();
            localStorage.setItem(this.saveKey, JSON.stringify(saveData));
            this.lastSaveTime = Date.now();
            
            // Show save indicator
            this.showSaveIndicator(saveType);
            
            return true;
        } catch (error) {
            logger.error('Failed to save game:', error);
            return false;
        }
    }
    
    createSaveData() {
        const player = this.engine.player;
        const endlessMode = this.engine.endlessMode;
        const companionManager = this.engine.companionManager;
        const inventorySystem = this.engine.inventorySystem;
        const questSystem = this.engine.questSystem;
        const achievementSystem = this.engine.achievementSystem;
        const audioSystem = this.engine.audioSystem;
        const skillTreeSystem = this.engine.skillTreeSystem;
        const characterCustomization = this.engine.characterCustomization;
        const dailyRewards = this.engine.dailyRewards;
        const tutorialSystem = this.engine.tutorialSystem;
        
        return {
            version: '1.0.4',
            timestamp: Date.now(),
            saveType: 'auto',
            
            // Player data
            player: {
                stats: {
                    hp: player.stats.hp,
                    maxHp: player.stats.maxHp,
                    mp: player.stats.mp,
                    maxMp: player.stats.maxMp,
                    attack: player.stats.attack,
                    defense: player.stats.defense,
                    speed: player.stats.speed,
                    level: player.stats.level,
                    exp: player.stats.exp,
                    expToNext: player.stats.expToNext
                },
                baseStats: {
                    maxHp: player.baseStats.maxHp,
                    maxMp: player.baseStats.maxMp,
                    attack: player.baseStats.attack,
                    defense: player.baseStats.defense,
                    speed: player.baseStats.speed
                },
                position: {
                    x: player.mesh.position.x,
                    y: player.mesh.position.y,
                    z: player.mesh.position.z
                }
            },
            
            // Endless mode data
            endlessMode: {
                currentFloor: endlessMode.currentFloor,
                highestFloor: endlessMode.highestFloor,
                enemiesDefeated: endlessMode.enemiesDefeated,
                timeElapsed: endlessMode.timeElapsed,
                totalRuns: endlessMode.totalRuns
            },
            
            // Companion data
            companions: {
                activeCompanion: companionManager.activeCompanion,
                unlockedCompanions: Object.keys(companionManager.companions)
                    .filter(id => companionManager.companions[id].unlocked)
            },
            
            // Inventory data
            inventory: inventorySystem ? inventorySystem.getSaveData() : { items: [], equipment: {} },
            
            // Quest data
            quests: questSystem ? questSystem.getSaveData() : { activeQuests: [], completedQuests: [], availableQuests: [] },
            
            // Achievement data
            achievements: achievementSystem ? achievementSystem.getSaveData() : { unlockedAchievements: [], progress: {} },
            
            // Audio settings
            audio: audioSystem ? audioSystem.getSaveData() : { settings: {} },
            
            // Skill tree data
            skills: skillTreeSystem ? skillTreeSystem.getSaveData() : { unlockedSkills: [], skillPoints: 0 },
            
            // Character customization data
            customization: characterCustomization ? characterCustomization.getSaveData() : { current: {}, unlockedOptions: {} },
            
            // Daily rewards data
            dailyRewards: dailyRewards ? dailyRewards.getSaveData() : {},
            
            // Tutorial data
            tutorial: tutorialSystem ? tutorialSystem.getSaveData() : { completed: false },
            
            // Dungeon state
            dungeon: {
                biome: this.engine.currentDungeon?.biome || 'crystal_cavern'
            }
        };
    }
    
    loadGame() {
        try {
            const saveDataString = localStorage.getItem(this.saveKey);
            if (!saveDataString) {
                logger.info('No save data found');
                return false;
            }
            
            const saveData = JSON.parse(saveDataString);
            
            // Validate save data
            if (!this.validateSaveData(saveData)) {
                logger.error('Invalid save data');
                return false;
            }
            
            // Apply save data
            this.applySaveData(saveData);
            
            logger.info('💾 Game loaded successfully');
            this.showLoadIndicator();
            
            return true;
        } catch (error) {
            logger.error('Failed to load game:', error);
            return false;
        }
    }
    
    validateSaveData(saveData) {
        return saveData &&
               saveData.version &&
               saveData.player &&
               saveData.endlessMode &&
               saveData.companions;
    }
    
    applySaveData(saveData) {
        const player = this.engine.player;
        const endlessMode = this.engine.endlessMode;
        const companionManager = this.engine.companionManager;
        const inventorySystem = this.engine.inventorySystem;
        const questSystem = this.engine.questSystem;
        const achievementSystem = this.engine.achievementSystem;
        const audioSystem = this.engine.audioSystem;
        const skillTreeSystem = this.engine.skillTreeSystem;
        const characterCustomization = this.engine.characterCustomization;
        const dailyRewards = this.engine.dailyRewards;
        const tutorialSystem = this.engine.tutorialSystem;
        
        // DO NOT restore base stats from save - always use current code values
        // This ensures balance changes are always applied
        // player.baseStats are already set correctly by Player constructor
        
        // Force update stats from current baseStats (not from save file)
        player.stats.maxHp = player.baseStats.maxHp;
        player.stats.maxMp = player.baseStats.maxMp;
        player.stats.attack = player.baseStats.attack;
        player.stats.defense = player.baseStats.defense;
        player.stats.speed = player.baseStats.speed;
        
        // Restore player stats (preserve level, exp, heal player to full with new maxHp)
        if (saveData.player.stats) {
            player.stats.level = saveData.player.stats.level || 1;
            player.stats.exp = saveData.player.stats.exp || 0;
            player.stats.expToNext = saveData.player.stats.expToNext || 100;
            
            // Heal player to full HP with new max (don't restore old HP values)
            player.stats.hp = player.stats.maxHp;
            player.stats.mp = player.stats.maxMp;
        }
        
        // Restore player position
        if (saveData.player.position) {
            player.mesh.position.set(
                saveData.player.position.x,
                saveData.player.position.y,
                saveData.player.position.z
            );
        }
        
        // Restore endless mode progress
        endlessMode.currentFloor = saveData.endlessMode.currentFloor;
        endlessMode.highestFloor = saveData.endlessMode.highestFloor;
        endlessMode.enemiesDefeated = saveData.endlessMode.enemiesDefeated;
        endlessMode.timeElapsed = saveData.endlessMode.timeElapsed;
        endlessMode.totalRuns = saveData.endlessMode.totalRuns;
        
        // Restore companions
        if (saveData.companions.unlockedCompanions) {
            saveData.companions.unlockedCompanions.forEach(companionId => {
                if (companionManager.companions[companionId]) {
                    companionManager.companions[companionId].unlocked = true;
                }
            });
        }
        
        if (saveData.companions.activeCompanion) {
            companionManager.setActiveCompanion(saveData.companions.activeCompanion);
        }
        
        // Restore inventory
        if (saveData.inventory && inventorySystem) {
            inventorySystem.loadSaveData(saveData.inventory);
        }
        
        // Restore quests
        if (saveData.quests && questSystem) {
            questSystem.loadSaveData(saveData.quests);
        }
        
        // Restore achievements
        if (saveData.achievements && achievementSystem) {
            achievementSystem.loadSaveData(saveData.achievements);
        }
        
        // Restore audio settings
        if (saveData.audio && audioSystem) {
            audioSystem.loadSaveData(saveData.audio);
        }
        
        // Restore skills (must be done before other systems)
        if (saveData.skills && skillTreeSystem) {
            skillTreeSystem.loadSaveData(saveData.skills);
        }
        
        // Restore character customization
        if (saveData.customization && characterCustomization) {
            characterCustomization.loadSaveData(saveData.customization);
        }
        
        // Restore daily rewards
        if (saveData.dailyRewards && dailyRewards) {
            dailyRewards.loadSaveData(saveData.dailyRewards);
        }
        
        // Restore tutorial
        if (saveData.tutorial && tutorialSystem) {
            tutorialSystem.loadSaveData(saveData.tutorial);
            
            // Start tutorial if not completed
            if (!tutorialSystem.completed) {
                setTimeout(() => tutorialSystem.start(), 2000);
            }
        }
        
        // Update UI
        endlessMode.updateUI();
        this.engine.updatePlayerUI();
        // Restore quests
        if (saveData.quests && questSystem) {
            questSystem.loadSaveData(saveData.quests);
        }
        
        // Restore achievements
        if (saveData.achievements && achievementSystem) {
            achievementSystem.loadSaveData(saveData.achievements);
        }
        
        // Restore audio settings
        if (saveData.audio && audioSystem) {
            audioSystem.loadSaveData(saveData.audio);
        }
        
        // Restore skills (must be done before other systems)
        if (saveData.skills && skillTreeSystem) {
            skillTreeSystem.loadSaveData(saveData.skills);
        }
        
        // Update UI
        endlessMode.updateUI();
        this.engine.updatePlayerUI();
        this.engine.updateCompanionUI();
        
        // Regenerate dungeon for current floor
        endlessMode.updateDifficulty();
        endlessMode.generateFloor();
    }
    
    deleteSave() {
        try {
            localStorage.removeItem(this.saveKey);
            logger.info('💾 Save data deleted');
            return true;
        } catch (error) {
            logger.error('Failed to delete save:', error);
            return false;
        }
    }
    
    hasSaveData() {
        return localStorage.getItem(this.saveKey) !== null;
    }
    
    getSaveMetadata() {
        try {
            const saveDataString = localStorage.getItem(this.saveKey);
            if (!saveDataString) return null;
            
            const saveData = JSON.parse(saveDataString);
            return {
                timestamp: saveData.timestamp,
                floor: saveData.endlessMode.currentFloor,
                level: saveData.player.stats.level,
                playtime: saveData.endlessMode.timeElapsed
            };
        } catch (error) {
            return null;
        }
    }
    
    exportSave() {
        try {
            const saveDataString = localStorage.getItem(this.saveKey);
            if (!saveDataString) return null;
            
            // Create download
            const blob = new Blob([saveDataString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `dynasty_save_${Date.now()}.json`;
            a.click();
            URL.revokeObjectURL(url);
            
            logger.info('💾 Save exported');
            return true;
        } catch (error) {
            logger.error('Failed to export save:', error);
            return false;
        }
    }
    
    importSave(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const saveData = JSON.parse(e.target.result);
                    if (this.validateSaveData(saveData)) {
                        localStorage.setItem(this.saveKey, e.target.result);
                        logger.info('💾 Save imported');
                        resolve(true);
                    } else {
                        reject(new Error('Invalid save file'));
                    }
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = () => reject(reader.error);
            reader.readAsText(file);
        });
    }
    
    showSaveIndicator(saveType) {
        // Create save indicator
        const indicator = document.createElement('div');
        indicator.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            border: 2px solid #52b788;
            border-radius: 10px;
            padding: 15px 25px;
            color: #52b788;
            font-size: 1em;
            z-index: 9999;
            animation: fadeInOut 2s ease-in-out;
        `;
        indicator.textContent = `💾 ${saveType}`;
        
        document.body.appendChild(indicator);
        
        setTimeout(() => {
            document.body.removeChild(indicator);
        }, 2000);
    }
    
    showLoadIndicator() {
        const indicator = document.createElement('div');
        indicator.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            border: 2px solid #c77dff;
            border-radius: 10px;
            padding: 15px 25px;
            color: #c77dff;
            font-size: 1em;
            z-index: 9999;
            animation: fadeInOut 2s ease-in-out;
        `;
        indicator.textContent = '💾 Game Loaded';
        
        document.body.appendChild(indicator);
        
        setTimeout(() => {
            document.body.removeChild(indicator);
        }, 2000);
    }
}

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translateX(20px); }
        20% { opacity: 1; transform: translateX(0); }
        80% { opacity: 1; transform: translateX(0); }
        100% { opacity: 0; transform: translateX(20px); }
    }
`;
document.head.appendChild(style);
