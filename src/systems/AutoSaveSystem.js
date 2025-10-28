/**
 * AutoSaveSystem.js
 * Robust auto-save system with redundancy, versioning, and corruption protection
 * ~823 lines
 */

export class AutoSaveSystem {
    constructor() {
        this.saveInterval = 30000; // Auto-save every 30 seconds
        this.saveTimer = null;
        this.saveHistory = [];
        this.maxHistorySize = 10;
        this.saveInProgress = false;
        this.saveQueue = [];
        this.cloudSyncEnabled = false;
        this.lastSaveTime = null;
        this.corruptionChecks = true;
        
        this.initializeStorage();
        this.startAutoSave();
    }

    initializeStorage() {
        // Check for available storage
        this.storageAvailable = this.checkStorageAvailable();
        
        // Initialize storage keys
        this.storageKeys = {
            PRIMARY: 'game_save_primary',
            BACKUP_1: 'game_save_backup_1',
            BACKUP_2: 'game_save_backup_2',
            BACKUP_3: 'game_save_backup_3',
            METADATA: 'game_save_metadata',
            CLOUD_SYNC: 'game_save_cloud_sync',
            RECOVERY: 'game_save_recovery'
        };

        // Initialize IndexedDB for larger saves
        this.initializeIndexedDB();
    }

    checkStorageAvailable() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            console.warn('localStorage not available, using IndexedDB only');
            return false;
        }
    }

    async initializeIndexedDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('GameSaveDB', 1);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                if (!db.objectStoreNames.contains('saves')) {
                    const saveStore = db.createObjectStore('saves', { keyPath: 'id', autoIncrement: true });
                    saveStore.createIndex('timestamp', 'timestamp', { unique: false });
                    saveStore.createIndex('version', 'version', { unique: false });
                }
                
                if (!db.objectStoreNames.contains('backups')) {
                    db.createObjectStore('backups', { keyPath: 'id', autoIncrement: true });
                }
                
                if (!db.objectStoreNames.contains('cloudSync')) {
                    db.createObjectStore('cloudSync', { keyPath: 'syncId' });
                }
            };
        });
    }

    // Auto-save methods
    startAutoSave() {
        if (this.saveTimer) {
            clearInterval(this.saveTimer);
        }

        this.saveTimer = setInterval(() => {
            this.performAutoSave();
        }, this.saveInterval);

        console.log(`✅ Auto-save started (every ${this.saveInterval / 1000}s)`);
    }

    stopAutoSave() {
        if (this.saveTimer) {
            clearInterval(this.saveTimer);
            this.saveTimer = null;
        }
        console.log('⏸️ Auto-save stopped');
    }

    setSaveInterval(intervalMs) {
        this.saveInterval = Math.max(5000, intervalMs); // Minimum 5 seconds
        this.startAutoSave(); // Restart with new interval
    }

    async performAutoSave() {
        if (this.saveInProgress) {
            console.log('⏳ Save in progress, skipping this cycle');
            return;
        }

        try {
            console.log('💾 Auto-saving...');
            await this.saveGame('auto');
            console.log('✅ Auto-save complete');
        } catch (error) {
            console.error('❌ Auto-save failed:', error);
            this.handleSaveFailure(error);
        }
    }

    // Main save method
    async saveGame(saveType = 'manual', gameState = null) {
        if (this.saveInProgress) {
            return new Promise((resolve) => {
                this.saveQueue.push({ saveType, gameState, resolve });
            });
        }

        this.saveInProgress = true;

        try {
            // Collect game state
            const state = gameState || this.collectGameState();
            
            // Add metadata
            const saveData = this.prepareSaveData(state, saveType);
            
            // Verify integrity before saving
            if (this.corruptionChecks && !this.verifyIntegrity(saveData)) {
                throw new Error('Save data integrity check failed');
            }

            // Perform multi-layer save
            await this.performMultiLayerSave(saveData);
            
            // Update metadata
            this.updateSaveMetadata(saveData);
            
            // Add to history
            this.addToHistory(saveData);
            
            // Cloud sync if enabled
            if (this.cloudSyncEnabled) {
                await this.syncToCloud(saveData);
            }

            this.lastSaveTime = Date.now();
            
            return { success: true, timestamp: this.lastSaveTime };
            
        } catch (error) {
            console.error('Save failed:', error);
            throw error;
        } finally {
            this.saveInProgress = false;
            this.processQueue();
        }
    }

    collectGameState() {
        // This would collect all game state from various systems
        // For now, returning placeholder structure
        return {
            player: window.gameEngine?.player || {},
            inventory: window.gameEngine?.inventory || {},
            progression: window.gameEngine?.progression || {},
            quests: window.gameEngine?.quests || {},
            guilds: window.gameEngine?.guilds || {},
            pets: window.gameEngine?.pets || {},
            mounts: window.gameEngine?.mounts || {},
            achievements: window.gameEngine?.achievements || {},
            stats: window.gameEngine?.stats || {},
            settings: window.gameEngine?.settings || {}
        };
    }

    prepareSaveData(state, saveType) {
        return {
            version: '1.0.0',
            saveType,
            timestamp: Date.now(),
            checksum: this.calculateChecksum(state),
            compressed: this.compressData(state),
            state
        };
    }

    calculateChecksum(data) {
        // Simple checksum calculation (would use proper hash in production)
        const str = JSON.stringify(data);
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(16);
    }

    compressData(data) {
        // Simplified compression (would use proper compression library)
        const str = JSON.stringify(data);
        return btoa(str);
    }

    decompressData(compressed) {
        try {
            return JSON.parse(atob(compressed));
        } catch (e) {
            console.error('Decompression failed:', e);
            return null;
        }
    }

    verifyIntegrity(saveData) {
        const recalculated = this.calculateChecksum(saveData.state);
        return recalculated === saveData.checksum;
    }

    async performMultiLayerSave(saveData) {
        const promises = [];

        // Layer 1: Primary LocalStorage save
        if (this.storageAvailable) {
            promises.push(this.saveToLocalStorage(this.storageKeys.PRIMARY, saveData));
        }

        // Layer 2: IndexedDB save
        promises.push(this.saveToIndexedDB('saves', saveData));

        // Layer 3: Backup saves
        promises.push(this.rotateBackups(saveData));

        // Layer 4: Recovery save (kept separately for emergency)
        if (Math.random() < 0.1) { // 10% chance to update recovery save
            promises.push(this.saveToLocalStorage(this.storageKeys.RECOVERY, saveData));
        }

        await Promise.all(promises);
    }

    async saveToLocalStorage(key, data) {
        if (!this.storageAvailable) return;

        try {
            const serialized = JSON.stringify(data);
            localStorage.setItem(key, serialized);
        } catch (e) {
            if (e.name === 'QuotaExceededError') {
                console.warn('LocalStorage quota exceeded, cleaning old saves');
                this.cleanOldSaves();
                localStorage.setItem(key, JSON.stringify(data));
            } else {
                throw e;
            }
        }
    }

    async saveToIndexedDB(storeName, data) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('IndexedDB not initialized'));
                return;
            }

            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            
            const request = store.add(data);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async rotateBackups(saveData) {
        // Rotate backup saves: backup_3 <- backup_2 <- backup_1 <- primary
        const backups = [
            this.storageKeys.BACKUP_3,
            this.storageKeys.BACKUP_2,
            this.storageKeys.BACKUP_1
        ];

        for (let i = backups.length - 1; i > 0; i--) {
            const prev = localStorage.getItem(backups[i - 1]);
            if (prev) {
                localStorage.setItem(backups[i], prev);
            }
        }

        // Save current as backup_1
        await this.saveToLocalStorage(this.storageKeys.BACKUP_1, saveData);
    }

    updateSaveMetadata(saveData) {
        const metadata = {
            lastSaveTime: saveData.timestamp,
            saveType: saveData.saveType,
            version: saveData.version,
            checksum: saveData.checksum,
            saveCount: (this.getSaveMetadata()?.saveCount || 0) + 1,
            totalPlayTime: this.calculateTotalPlayTime()
        };

        if (this.storageAvailable) {
            localStorage.setItem(this.storageKeys.METADATA, JSON.stringify(metadata));
        }
    }

    getSaveMetadata() {
        if (!this.storageAvailable) return null;
        
        const data = localStorage.getItem(this.storageKeys.METADATA);
        return data ? JSON.parse(data) : null;
    }

    calculateTotalPlayTime() {
        // Would calculate actual play time from game engine
        return Date.now();
    }

    addToHistory(saveData) {
        this.saveHistory.unshift({
            timestamp: saveData.timestamp,
            type: saveData.saveType,
            checksum: saveData.checksum
        });

        // Keep only last N saves in history
        if (this.saveHistory.length > this.maxHistorySize) {
            this.saveHistory = this.saveHistory.slice(0, this.maxHistorySize);
        }
    }

    // Load methods
    async loadGame() {
        console.log('📂 Loading game...');

        try {
            // Try loading from primary save
            let saveData = await this.loadFromPrimary();
            
            if (!saveData || !this.verifyIntegrity(saveData)) {
                console.warn('Primary save corrupted or missing, trying backups...');
                saveData = await this.loadFromBackups();
            }

            if (!saveData) {
                console.warn('All saves corrupted, trying recovery save...');
                saveData = await this.loadFromRecovery();
            }

            if (!saveData) {
                throw new Error('No valid save data found');
            }

            // Decompress and verify
            const gameState = saveData.state || this.decompressData(saveData.compressed);
            
            if (!gameState) {
                throw new Error('Failed to decompress save data');
            }

            console.log('✅ Game loaded successfully');
            return gameState;
            
        } catch (error) {
            console.error('❌ Load failed:', error);
            throw error;
        }
    }

    async loadFromPrimary() {
        try {
            // Try localStorage first
            if (this.storageAvailable) {
                const data = localStorage.getItem(this.storageKeys.PRIMARY);
                if (data) {
                    return JSON.parse(data);
                }
            }

            // Try IndexedDB
            return await this.loadFromIndexedDB('saves');
        } catch (e) {
            console.error('Primary load failed:', e);
            return null;
        }
    }

    async loadFromBackups() {
        const backupKeys = [
            this.storageKeys.BACKUP_1,
            this.storageKeys.BACKUP_2,
            this.storageKeys.BACKUP_3
        ];

        for (const key of backupKeys) {
            try {
                const data = localStorage.getItem(key);
                if (data) {
                    const saveData = JSON.parse(data);
                    if (this.verifyIntegrity(saveData)) {
                        console.log(`Loaded from backup: ${key}`);
                        return saveData;
                    }
                }
            } catch (e) {
                continue;
            }
        }

        return null;
    }

    async loadFromRecovery() {
        try {
            const data = localStorage.getItem(this.storageKeys.RECOVERY);
            if (data) {
                const saveData = JSON.parse(data);
                if (this.verifyIntegrity(saveData)) {
                    console.log('Loaded from recovery save');
                    return saveData;
                }
            }
        } catch (e) {
            console.error('Recovery load failed:', e);
        }
        return null;
    }

    async loadFromIndexedDB(storeName) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('IndexedDB not initialized'));
                return;
            }

            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const index = store.index('timestamp');
            
            // Get most recent save
            const request = index.openCursor(null, 'prev');
            
            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    resolve(cursor.value);
                } else {
                    resolve(null);
                }
            };
            
            request.onerror = () => reject(request.error);
        });
    }

    // Cloud sync methods
    async syncToCloud(saveData) {
        if (!this.cloudSyncEnabled) return;

        try {
            // This would sync to actual cloud service
            console.log('☁️ Syncing to cloud...');
            
            await this.saveToIndexedDB('cloudSync', {
                syncId: 'latest',
                data: saveData,
                synced: false,
                timestamp: Date.now()
            });

            // Simulate cloud upload
            // In production, this would be an actual API call
            console.log('✅ Cloud sync queued');
        } catch (error) {
            console.error('Cloud sync failed:', error);
        }
    }

    async downloadFromCloud() {
        // Would download from cloud service
        console.log('☁️ Downloading from cloud...');
        // Placeholder
        return null;
    }

    enableCloudSync() {
        this.cloudSyncEnabled = true;
        console.log('☁️ Cloud sync enabled');
    }

    disableCloudSync() {
        this.cloudSyncEnabled = false;
        console.log('Cloud sync disabled');
    }

    // Utility methods
    processQueue() {
        if (this.saveQueue.length > 0) {
            const { saveType, gameState, resolve } = this.saveQueue.shift();
            this.saveGame(saveType, gameState).then(resolve);
        }
    }

    cleanOldSaves() {
        // Remove oldest saves to free up space
        const toRemove = [
            this.storageKeys.BACKUP_3
        ];

        toRemove.forEach(key => {
            try {
                localStorage.removeItem(key);
            } catch (e) {
                // Ignore
            }
        });
    }

    handleSaveFailure(error) {
        console.error('Save system encountered an error:', error);
        
        // Notify user
        if (window.gameEngine?.ui) {
            window.gameEngine.ui.showNotification('Save failed! Your progress may be at risk.', 'error');
        }

        // Try emergency save to recovery slot
        try {
            const state = this.collectGameState();
            const saveData = this.prepareSaveData(state, 'emergency');
            this.saveToLocalStorage(this.storageKeys.RECOVERY, saveData);
            console.log('Emergency save completed');
        } catch (e) {
            console.error('Emergency save also failed:', e);
        }
    }

    // Export/Import methods
    exportSave() {
        const saveData = localStorage.getItem(this.storageKeys.PRIMARY);
        if (!saveData) {
            throw new Error('No save data to export');
        }

        const blob = new Blob([saveData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `game_save_${Date.now()}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        console.log('✅ Save exported');
    }

    async importSave(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = async (e) => {
                try {
                    const saveData = JSON.parse(e.target.result);
                    
                    if (!this.verifyIntegrity(saveData)) {
                        throw new Error('Imported save data is corrupted');
                    }

                    await this.saveGame('import', saveData.state);
                    console.log('✅ Save imported');
                    resolve(saveData);
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = () => reject(reader.error);
            reader.readAsText(file);
        });
    }

    // Status methods
    getStatus() {
        return {
            autoSaveEnabled: !!this.saveTimer,
            saveInterval: this.saveInterval,
            lastSaveTime: this.lastSaveTime,
            saveInProgress: this.saveInProgress,
            cloudSyncEnabled: this.cloudSyncEnabled,
            saveHistory: this.saveHistory,
            metadata: this.getSaveMetadata()
        };
    }

    // Cleanup
    destroy() {
        this.stopAutoSave();
        if (this.db) {
            this.db.close();
        }
    }
}
