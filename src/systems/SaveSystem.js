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
        
        console.log('💾 Save System initialized');
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
        console.log('💾 Auto-saved game');
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
            console.error('Failed to save game:', error);
            return false;
        }
    }
    
    createSaveData() {
        const player = this.engine.player;
        const endlessMode = this.engine.endlessMode;
        const companionManager = this.engine.companionManager;
        const inventorySystem = this.engine.inventorySystem;
        const questSystem = this.engine.questSystem;
        
        return {
            version: '1.0.0',
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
                console.log('No save data found');
                return false;
            }
            
            const saveData = JSON.parse(saveDataString);
            
            // Validate save data
            if (!this.validateSaveData(saveData)) {
                console.error('Invalid save data');
                return false;
            }
            
            // Apply save data
            this.applySaveData(saveData);
            
            console.log('💾 Game loaded successfully');
            this.showLoadIndicator();
            
            return true;
        } catch (error) {
            console.error('Failed to load game:', error);
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
        
        // Restore player stats
        Object.assign(player.stats, saveData.player.stats);
        
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
            console.log('💾 Save data deleted');
            return true;
        } catch (error) {
            console.error('Failed to delete save:', error);
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
            
            console.log('💾 Save exported');
            return true;
        } catch (error) {
            console.error('Failed to export save:', error);
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
                        console.log('💾 Save imported');
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
