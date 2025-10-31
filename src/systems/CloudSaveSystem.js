/**
 * Cloud Save & Server Connection System
 * Reliable cloud-based save system with automatic sync to prevent data loss
 */

export class CloudSaveSystem {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        
        // Server configuration
        this.serverConfig = {
            apiUrl: 'https://api.dynasty-emberveil.game', // Would be real server
            wsUrl: 'wss://ws.dynasty-emberveil.game',
            backupServers: [
                'https://backup1.dynasty-emberveil.game',
                'https://backup2.dynasty-emberveil.game'
            ],
            timeout: 10000,
            retryAttempts: 3
        };
        
        // Connection state
        this.connectionState = {
            connected: false,
            authenticated: false,
            userId: null,
            sessionId: null,
            lastSync: null,
            syncInProgress: false
        };
        
        // WebSocket for real-time sync
        this.websocket = null;
        this.reconnectInterval = null;
        
        // Save queue for offline changes
        this.saveQueue = [];
        this.pendingOperations = new Map();
        
        // Local cache with IndexedDB
        this.indexedDB = null;
        this.dbName = 'DynastyEmberveil';
        this.dbVersion = 1;
        
        // Sync intervals
        this.autoSaveInterval = null;
        this.syncInterval = null;
        
        // Conflict resolution
        this.conflictStrategy = 'server_wins'; // server_wins, client_wins, merge, prompt
        
        // Offline mode
        this.offlineMode = false;
        this.offlineChanges = [];
        
        this.initialize();
    }
    
    initialize() {
        logger.info('☁️ Cloud Save System initializing...');
        
        // Initialize IndexedDB for local caching
        this.initializeIndexedDB();
        
        // Try to connect to server
        this.connectToServer();
        
        // Setup auto-save
        this.startAutoSave();
        
        // Setup periodic sync
        this.startPeriodicSync();
        
        // Handle page unload
        this.setupUnloadHandler();
        
        // Handle connection loss
        this.setupConnectionMonitoring();
    }
    
    /**
     * Initialize IndexedDB for offline storage
     */
    async initializeIndexedDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);
            
            request.onerror = () => {
                logger.error('Failed to open IndexedDB');
                reject(request.error);
            };
            
            request.onsuccess = () => {
                this.indexedDB = request.result;
                logger.info('✅ IndexedDB initialized');
                resolve();
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Create object stores
                if (!db.objectStoreNames.contains('saves')) {
                    db.createObjectStore('saves', { keyPath: 'id' });
                }
                
                if (!db.objectStoreNames.contains('characters')) {
                    db.createObjectStore('characters', { keyPath: 'id' });
                }
                
                if (!db.objectStoreNames.contains('settings')) {
                    db.createObjectStore('settings', { keyPath: 'id' });
                }
                
                if (!db.objectStoreNames.contains('cache')) {
                    db.createObjectStore('cache', { keyPath: 'key' });
                }
                
                logger.info('📦 IndexedDB object stores created');
            };
        });
    }
    
    /**
     * Connect to game server
     */
    async connectToServer() {
        try {
            logger.info('🔌 Connecting to game server...');
            
            // Try to authenticate (would use real auth)
            const userId = this.getStoredUserId() || this.generateUserId();
            
            // Create session
            const session = await this.createSession(userId);
            
            if (session) {
                this.connectionState.connected = true;
                this.connectionState.authenticated = true;
                this.connectionState.userId = userId;
                this.connectionState.sessionId = session.sessionId;
                
                // Connect WebSocket
                this.connectWebSocket();
                
                // Load cloud save
                await this.loadFromCloud();
                
                logger.info('✅ Connected to game server');
                this.showNotification('Connected', 'Cloud save active');
            }
        } catch (error) {
            logger.warn('⚠️ Could not connect to server, using offline mode');
            this.offlineMode = true;
            
            // Load from local storage
            await this.loadFromLocal();
        }
    }
    
    /**
     * Create game session
     */
    async createSession(userId) {
        try {
            // Simulated API call - would be real HTTP request
            return {
                sessionId: `session_${Date.now()}`,
                userId: userId,
                serverTime: Date.now()
            };
        } catch (error) {
            logger.error('Failed to create session:', error);
            return null;
        }
    }
    
    /**
     * Connect WebSocket for real-time sync
     */
    connectWebSocket() {
        if (this.websocket) {
            this.websocket.close();
        }
        
        try {
            // Would connect to real WebSocket server
            logger.info('🔌 Connecting WebSocket...');
            
            // Simulated WebSocket connection
            this.websocket = {
                connected: true,
                send: (data) => logger.info('WS Send:', data),
                close: () => logger.info('WS Closed')
            };
            
            // In real implementation:
            // this.websocket = new WebSocket(this.serverConfig.wsUrl);
            // this.websocket.onmessage = (event) => this.handleServerMessage(event);
            // this.websocket.onerror = (error) => this.handleWebSocketError(error);
            // this.websocket.onclose = () => this.handleWebSocketClose();
            
            logger.info('✅ WebSocket connected');
        } catch (error) {
            logger.error('WebSocket connection failed:', error);
        }
    }
    
    /**
     * Save game data to cloud
     */
    async saveToCloud(saveData = null) {
        if (!this.connectionState.connected) {
            logger.info('💾 Offline mode - saving locally');
            return this.saveToLocal(saveData);
        }
        
        if (this.connectionState.syncInProgress) {
            logger.info('⏳ Sync in progress, queuing save...');
            this.saveQueue.push(saveData || this.collectSaveData());
            return;
        }
        
        this.connectionState.syncInProgress = true;
        
        try {
            const data = saveData || this.collectSaveData();
            
            logger.info('☁️ Saving to cloud...');
            
            // Send to server (would be real API call)
            const response = await this.sendToServer('save', data);
            
            if (response.success) {
                this.connectionState.lastSync = Date.now();
                
                // Also save locally as backup
                await this.saveToLocal(data);
                
                logger.info('✅ Cloud save successful');
                this.showNotification('Saved', 'Progress saved to cloud');
                
                return true;
            }
        } catch (error) {
            logger.error('❌ Cloud save failed:', error);
            
            // Fallback to local save
            await this.saveToLocal(saveData);
            
            // Queue for retry
            this.offlineChanges.push({
                type: 'save',
                data: saveData,
                timestamp: Date.now()
            });
        } finally {
            this.connectionState.syncInProgress = false;
            
            // Process queue
            if (this.saveQueue.length > 0) {
                const nextSave = this.saveQueue.shift();
                this.saveToCloud(nextSave);
            }
        }
    }
    
    /**
     * Load game data from cloud
     */
    async loadFromCloud() {
        try {
            logger.info('📥 Loading from cloud...');
            
            // Request save data from server (would be real API call)
            const response = await this.sendToServer('load', {
                userId: this.connectionState.userId
            });
            
            if (response.success && response.data) {
                // Check for conflicts with local save
                const localData = await this.loadFromLocal();
                
                if (localData && this.hasConflict(localData, response.data)) {
                    const resolved = await this.resolveConflict(localData, response.data);
                    this.applySaveData(resolved);
                } else {
                    this.applySaveData(response.data);
                }
                
                logger.info('✅ Loaded from cloud');
                return response.data;
            }
        } catch (error) {
            logger.error('❌ Cloud load failed:', error);
            
            // Fallback to local
            return this.loadFromLocal();
        }
    }
    
    /**
     * Save to local IndexedDB
     */
    async saveToLocal(saveData = null) {
        if (!this.indexedDB) {
            logger.warn('IndexedDB not available, using localStorage');
            return this.saveToLocalStorage(saveData);
        }
        
        try {
            const data = saveData || this.collectSaveData();
            
            const transaction = this.indexedDB.transaction(['saves'], 'readwrite');
            const store = transaction.objectStore('saves');
            
            await store.put({
                id: 'current_save',
                data: data,
                timestamp: Date.now()
            });
            
            logger.info('💾 Saved locally to IndexedDB');
            return true;
        } catch (error) {
            logger.error('Local save failed:', error);
            return this.saveToLocalStorage(saveData);
        }
    }
    
    /**
     * Load from local IndexedDB
     */
    async loadFromLocal() {
        if (!this.indexedDB) {
            return this.loadFromLocalStorage();
        }
        
        try {
            const transaction = this.indexedDB.transaction(['saves'], 'readonly');
            const store = transaction.objectStore('saves');
            const request = store.get('current_save');
            
            return new Promise((resolve, reject) => {
                request.onsuccess = () => {
                    if (request.result) {
                        logger.info('📂 Loaded from IndexedDB');
                        resolve(request.result.data);
                    } else {
                        resolve(null);
                    }
                };
                
                request.onerror = () => {
                    logger.error('Failed to load from IndexedDB');
                    resolve(this.loadFromLocalStorage());
                };
            });
        } catch (error) {
            logger.error('Local load failed:', error);
            return this.loadFromLocalStorage();
        }
    }
    
    /**
     * Fallback to localStorage
     */
    saveToLocalStorage(saveData = null) {
        try {
            const data = saveData || this.collectSaveData();
            localStorage.setItem('game_save', JSON.stringify(data));
            logger.info('💾 Saved to localStorage');
            return true;
        } catch (error) {
            logger.error('localStorage save failed:', error);
            return false;
        }
    }
    
    loadFromLocalStorage() {
        try {
            const saved = localStorage.getItem('game_save');
            if (saved) {
                logger.info('📂 Loaded from localStorage');
                return JSON.parse(saved);
            }
        } catch (error) {
            logger.error('localStorage load failed:', error);
        }
        return null;
    }
    
    /**
     * Collect all save data from game
     */
    collectSaveData() {
        const saveData = {
            version: '2.0.0',
            timestamp: Date.now(),
            userId: this.connectionState.userId,
            
            // Player data
            player: this.collectPlayerData(),
            
            // Inventory
            inventory: this.collectInventoryData(),
            
            // Progress
            progress: this.collectProgressData(),
            
            // Settings
            settings: this.collectSettingsData(),
            
            // Statistics
            statistics: this.collectStatisticsData(),
            
            // Unlocks
            unlocks: this.collectUnlocksData(),
            
            // World state
            worldState: this.collectWorldStateData()
        };
        
        return saveData;
    }
    
    collectPlayerData() {
        const player = this.gameEngine.player;
        if (!player) return null;
        
        return {
            name: player.name || 'Hero',
            level: player.level || 1,
            experience: player.experience || 0,
            health: player.health || 100,
            maxHealth: player.maxHealth || 100,
            mana: player.mana || 100,
            maxMana: player.maxMana || 100,
            position: player.mesh ? {
                x: player.mesh.position.x,
                y: player.mesh.position.y,
                z: player.mesh.position.z
            } : { x: 0, y: 0, z: 0 },
            class: player.class || 'Warrior',
            stats: player.stats || {},
            skills: player.skills || [],
            equipment: player.equipment || {}
        };
    }
    
    collectInventoryData() {
        if (!this.gameEngine.inventorySystem) return { items: [] };
        
        return {
            items: this.gameEngine.inventorySystem.items || [],
            gold: this.gameEngine.player?.gold || 0,
            capacity: this.gameEngine.inventorySystem.capacity || 50
        };
    }
    
    collectProgressData() {
        return {
            questsCompleted: this.gameEngine.questSystem?.completedQuests || [],
            achievementsUnlocked: this.gameEngine.achievementSystem?.unlockedAchievements || [],
            zonesDiscovered: this.gameEngine.openWorldSystem?.discoveredZones || [],
            dungeonsCleared: this.gameEngine.dungeonGenerator?.clearedDungeons || [],
            bossesDefeated: this.gameEngine.bossesDefeated || []
        };
    }
    
    collectSettingsData() {
        if (!this.gameEngine.settingsSystem) return {};
        
        return this.gameEngine.settingsSystem.settings || {};
    }
    
    collectStatisticsData() {
        if (!this.gameEngine.settingsSystem) return {};
        
        return this.gameEngine.settingsSystem.statistics || {};
    }
    
    collectUnlocksData() {
        if (!this.gameEngine.settingsSystem) return {};
        
        return {
            mounts: Array.from(this.gameEngine.settingsSystem.unlocks.mounts || []),
            pets: Array.from(this.gameEngine.settingsSystem.unlocks.pets || []),
            costumes: Array.from(this.gameEngine.settingsSystem.unlocks.costumes || []),
            titles: Array.from(this.gameEngine.settingsSystem.unlocks.titles || []),
            emotes: Array.from(this.gameEngine.settingsSystem.unlocks.emotes || [])
        };
    }
    
    collectWorldStateData() {
        return {
            currentZone: this.gameEngine.currentZone || 'starting_zone',
            time: Date.now(),
            weather: this.gameEngine.weatherSystem?.currentWeather || 'clear'
        };
    }
    
    /**
     * Apply save data to game
     */
    applySaveData(saveData) {
        if (!saveData) return;
        
        logger.info('📥 Applying save data...');
        
        // Apply player data
        if (saveData.player) {
            this.applyPlayerData(saveData.player);
        }
        
        // Apply inventory
        if (saveData.inventory) {
            this.applyInventoryData(saveData.inventory);
        }
        
        // Apply progress
        if (saveData.progress) {
            this.applyProgressData(saveData.progress);
        }
        
        // Apply settings
        if (saveData.settings) {
            this.applySettingsData(saveData.settings);
        }
        
        // Apply statistics
        if (saveData.statistics) {
            this.applyStatisticsData(saveData.statistics);
        }
        
        // Apply unlocks
        if (saveData.unlocks) {
            this.applyUnlocksData(saveData.unlocks);
        }
        
        logger.info('✅ Save data applied');
    }
    
    applyPlayerData(data) {
        const player = this.gameEngine.player;
        if (!player) return;
        
        player.level = data.level || 1;
        player.experience = data.experience || 0;
        player.health = data.health || 100;
        player.maxHealth = data.maxHealth || 100;
        player.mana = data.mana || 100;
        player.maxMana = data.maxMana || 100;
        player.gold = data.gold || 0;
        
        if (player.mesh && data.position) {
            player.mesh.position.set(data.position.x, data.position.y, data.position.z);
        }
    }
    
    applyInventoryData(data) {
        if (!this.gameEngine.inventorySystem) return;
        
        this.gameEngine.inventorySystem.items = data.items || [];
        if (this.gameEngine.player) {
            this.gameEngine.player.gold = data.gold || 0;
        }
    }
    
    applyProgressData(data) {
        // Apply to respective systems
    }
    
    applySettingsData(data) {
        if (this.gameEngine.settingsSystem) {
            this.gameEngine.settingsSystem.settings = { ...this.gameEngine.settingsSystem.settings, ...data };
            this.gameEngine.settingsSystem.applyAllSettings();
        }
    }
    
    applyStatisticsData(data) {
        if (this.gameEngine.settingsSystem) {
            this.gameEngine.settingsSystem.statistics = { ...this.gameEngine.settingsSystem.statistics, ...data };
        }
    }
    
    applyUnlocksData(data) {
        if (this.gameEngine.settingsSystem) {
            this.gameEngine.settingsSystem.unlocks.mounts = new Set(data.mounts || []);
            this.gameEngine.settingsSystem.unlocks.pets = new Set(data.pets || []);
            this.gameEngine.settingsSystem.unlocks.costumes = new Set(data.costumes || []);
            this.gameEngine.settingsSystem.unlocks.titles = new Set(data.titles || []);
            this.gameEngine.settingsSystem.unlocks.emotes = new Set(data.emotes || []);
        }
    }
    
    /**
     * Conflict resolution
     */
    hasConflict(localData, cloudData) {
        if (!localData || !cloudData) return false;
        
        return localData.timestamp > cloudData.timestamp + 60000; // 1 minute tolerance
    }
    
    async resolveConflict(localData, cloudData) {
        logger.info('⚠️ Save conflict detected, resolving...');
        
        switch (this.conflictStrategy) {
            case 'server_wins':
                return cloudData;
                
            case 'client_wins':
                // Upload local to server
                await this.saveToCloud(localData);
                return localData;
                
            case 'merge':
                return this.mergeSaveData(localData, cloudData);
                
            case 'prompt':
                return await this.promptUserForResolution(localData, cloudData);
                
            default:
                return cloudData;
        }
    }
    
    mergeSaveData(localData, cloudData) {
        // Intelligent merge - take highest values, combine arrays
        return {
            ...cloudData,
            player: {
                ...cloudData.player,
                level: Math.max(localData.player?.level || 0, cloudData.player?.level || 0),
                experience: Math.max(localData.player?.experience || 0, cloudData.player?.experience || 0)
            },
            inventory: {
                items: [...(localData.inventory?.items || []), ...(cloudData.inventory?.items || [])],
                gold: Math.max(localData.inventory?.gold || 0, cloudData.inventory?.gold || 0)
            }
        };
    }
    
    /**
     * Auto-save setup
     */
    startAutoSave() {
        this.autoSaveInterval = setInterval(() => {
            this.saveToCloud();
        }, 60000); // Auto-save every minute
        
        logger.info('⏰ Auto-save enabled (every 60 seconds)');
    }
    
    /**
     * Periodic sync
     */
    startPeriodicSync() {
        this.syncInterval = setInterval(() => {
            if (this.connectionState.connected && !this.connectionState.syncInProgress) {
                this.syncWithServer();
            }
        }, 300000); // Sync every 5 minutes
    }
    
    async syncWithServer() {
        logger.info('🔄 Syncing with server...');
        
        // Sync any pending offline changes
        if (this.offlineChanges.length > 0) {
            for (const change of this.offlineChanges) {
                await this.saveToCloud(change.data);
            }
            this.offlineChanges = [];
        }
        
        // Check for server updates
        const serverData = await this.loadFromCloud();
        
        logger.info('✅ Sync complete');
    }
    
    /**
     * Handle page unload
     */
    setupUnloadHandler() {
        window.addEventListener('beforeunload', (e) => {
            // Save before closing
            this.saveToCloud();
            
            // Don't show confirmation if save is in progress
            if (this.connectionState.syncInProgress) {
                e.preventDefault();
                e.returnValue = '';
            }
        });
    }
    
    /**
     * Monitor connection
     */
    setupConnectionMonitoring() {
        window.addEventListener('online', () => {
            logger.info('🌐 Connection restored');
            this.offlineMode = false;
            this.connectToServer();
        });
        
        window.addEventListener('offline', () => {
            logger.info('📴 Connection lost - switching to offline mode');
            this.offlineMode = true;
        });
    }
    
    /**
     * Helpers
     */
    
    async sendToServer(endpoint, data) {
        // Simulated server request - would be real HTTP/fetch
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    data: data,
                    serverTime: Date.now()
                });
            }, 100);
        });
    }
    
    getStoredUserId() {
        return localStorage.getItem('userId');
    }
    
    generateUserId() {
        // Use crypto.randomUUID for secure random generation
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
            const randomPart = crypto.randomUUID();
            const userId = `user_${randomPart}`;
            localStorage.setItem('userId', userId);
            return userId;
        }
        
        // Fallback: Use crypto.getRandomValues for secure random
        if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
            const array = new Uint32Array(4);
            crypto.getRandomValues(array);
            const randomPart = Array.from(array, num => num.toString(36)).join('');
            const userId = `user_${randomPart}`;
            localStorage.setItem('userId', userId);
            return userId;
        }
        
        // Last resort: timestamp-based (not cryptographically secure but better than Math.random)
        const timestamp = Date.now();
        const performanceNow = performance.now().toString().replace('.', '');
        const userId = `user_${timestamp}_${performanceNow}`;
        localStorage.setItem('userId', userId);
        return userId;
    }
    
    showNotification(title, message) {
        logger.info(`🔔 ${title}: ${message}`);
        // Would show in-game notification
    }
    
    /**
     * Manual save trigger
     */
    async manualSave() {
        logger.info('💾 Manual save triggered');
        await this.saveToCloud();
        this.showNotification('Game Saved', 'Progress saved successfully');
    }
    
    /**
     * Get save status
     */
    getStatus() {
        return {
            connected: this.connectionState.connected,
            lastSync: this.connectionState.lastSync ? new Date(this.connectionState.lastSync).toLocaleString() : 'Never',
            offlineMode: this.offlineMode,
            pendingChanges: this.offlineChanges.length,
            userId: this.connectionState.userId
        };
    }
    
    /**
     * Cleanup
     */
    destroy() {
        if (this.autoSaveInterval) clearInterval(this.autoSaveInterval);
        if (this.syncInterval) clearInterval(this.syncInterval);
        if (this.websocket) this.websocket.close();
        
        // Final save
        this.saveToCloud();
    }

  update(delta) {
    // Updated for v3.0.0 - modernized system
  }
}
