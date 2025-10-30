/**
 * Advanced Auto-Management System
 * Comprehensive system for automatic performance optimization, resource management,
 * reliability monitoring, and intelligent game management
 */

import * as THREE from 'three';

export class AdvancedAutoManagementSystem {
    constructor(scene, renderer, gameEngine) {
        this.scene = scene;
        this.renderer = renderer;
        this.gameEngine = gameEngine;
        
        // Performance monitoring
        this.performanceMetrics = {
            fps: 60,
            frameTime: 0,
            drawCalls: 0,
            triangles: 0,
            memory: 0,
            cpu: 0,
            gpu: 0,
            networkLatency: 0,
            history: []
        };
        
        // Quality settings tiers
        this.qualityTiers = {
            ULTRA: {
                name: 'Ultra',
                shadowMapSize: 2048,
                anisotropy: 16,
                antialias: true,
                particles: 1.0,
                drawDistance: 1000,
                lodDistance: [20, 40, 80],
                postProcessing: true,
                volumetricLighting: true,
                reflections: true,
                targetFPS: 60
            },
            HIGH: {
                name: 'High',
                shadowMapSize: 1024,
                anisotropy: 8,
                antialias: true,
                particles: 0.8,
                drawDistance: 750,
                lodDistance: [15, 30, 60],
                postProcessing: true,
                volumetricLighting: false,
                reflections: true,
                targetFPS: 60
            },
            MEDIUM: {
                name: 'Medium',
                shadowMapSize: 512,
                anisotropy: 4,
                antialias: true,
                particles: 0.6,
                drawDistance: 500,
                lodDistance: [10, 20, 40],
                postProcessing: false,
                volumetricLighting: false,
                reflections: false,
                targetFPS: 45
            },
            LOW: {
                name: 'Low',
                shadowMapSize: 256,
                anisotropy: 2,
                antialias: false,
                particles: 0.4,
                drawDistance: 350,
                lodDistance: [8, 15, 30],
                postProcessing: false,
                volumetricLighting: false,
                reflections: false,
                targetFPS: 30
            },
            POTATO: {
                name: 'Potato',
                shadowMapSize: 0,
                anisotropy: 1,
                antialias: false,
                particles: 0.2,
                drawDistance: 200,
                lodDistance: [5, 10, 20],
                postProcessing: false,
                volumetricLighting: false,
                reflections: false,
                targetFPS: 25
            }
        };
        
        this.currentQuality = 'HIGH';
        this.autoQualityEnabled = true;
        
        // Resource management
        this.resourcePool = {
            textures: new Map(),
            geometries: new Map(),
            materials: new Map(),
            meshes: new Set(),
            particles: new Set()
        };
        
        this.resourceLimits = {
            maxTextures: 200,
            maxGeometries: 500,
            maxMaterials: 300,
            maxMeshes: 5000,
            maxParticles: 10000,
            memoryThreshold: 500 // MB
        };
        
        // Object pooling
        this.objectPools = {
            enemies: [],
            projectiles: [],
            particles: [],
            effects: [],
            ui: []
        };
        
        // LOD (Level of Detail) system
        this.lodGroups = new Map();
        
        // Culling system
        this.cullingEnabled = true;
        this.frustumCulling = true;
        this.occlusionCulling = false;
        
        // Network optimization
        this.networkStats = {
            bandwidth: 0,
            packetsLost: 0,
            latency: 0,
            jitter: 0
        };
        
        // Error recovery
        this.errorRecovery = {
            enabled: true,
            autoRestart: true,
            maxRestarts: 3,
            restartCount: 0,
            lastError: null
        };
        
        // Health monitoring
        this.systemHealth = {
            overall: 100,
            performance: 100,
            stability: 100,
            responsiveness: 100,
            resources: 100
        };
        
        // Auto-save system
        this.autoSave = {
            enabled: true,
            interval: 60000, // 1 minute
            lastSave: Date.now(),
            savesThisSession: 0
        };
        
        // Cache management
        this.cache = {
            textures: new Map(),
            models: new Map(),
            audio: new Map(),
            data: new Map(),
            maxSize: 100 * 1024 * 1024, // 100MB
            currentSize: 0
        };
        
        // Adaptive systems
        this.adaptive = {
            qualityAdjustment: true,
            spawnRateAdjustment: true,
            effectsReduction: true,
            automaticCleanup: true,
            intelligentPrefetch: true
        };
        
        this.initialize();
    }
    
    initialize() {
        console.log('🔧 Advanced Auto-Management System initialized');
        
        // Start monitoring
        this.startPerformanceMonitoring();
        this.startResourceMonitoring();
        this.startHealthMonitoring();
        this.startAutoSave();
        this.setupErrorHandling();
        this.optimizeRenderer();
        
        // Apply initial quality settings
        this.applyQualitySettings(this.currentQuality);
    }
    
    /**
     * Start performance monitoring
     */
    startPerformanceMonitoring() {
        this.performanceInterval = setInterval(() => {
            this.updatePerformanceMetrics();
            this.analyzePerformance();
            
            if (this.autoQualityEnabled) {
                this.autoAdjustQuality();
            }
        }, 1000); // Check every second
    }
    
    /**
     * Update performance metrics
     */
    updatePerformanceMetrics() {
        const info = this.renderer.info;
        
        this.performanceMetrics.drawCalls = info.render.calls;
        this.performanceMetrics.triangles = info.render.triangles;
        this.performanceMetrics.fps = this.calculateFPS();
        
        // Estimate memory usage
        if (performance.memory) {
            this.performanceMetrics.memory = Math.floor(
                performance.memory.usedJSHeapSize / 1048576
            );
        }
        
        // Store history
        this.performanceMetrics.history.push({
            time: Date.now(),
            fps: this.performanceMetrics.fps,
            drawCalls: this.performanceMetrics.drawCalls,
            memory: this.performanceMetrics.memory
        });
        
        // Keep last 60 seconds
        if (this.performanceMetrics.history.length > 60) {
            this.performanceMetrics.history.shift();
        }
    }
    
    /**
     * Calculate current FPS
     */
    calculateFPS() {
        if (!this.lastFrameTime) {
            this.lastFrameTime = performance.now();
            return 60;
        }
        
        const now = performance.now();
        const delta = now - this.lastFrameTime;
        this.lastFrameTime = now;
        
        const fps = 1000 / delta;
        
        // Smooth FPS calculation
        if (!this.smoothFPS) {
            this.smoothFPS = fps;
        } else {
            this.smoothFPS = this.smoothFPS * 0.9 + fps * 0.1;
        }
        
        return Math.round(this.smoothFPS);
    }
    
    /**
     * Analyze performance and detect issues
     */
    analyzePerformance() {
        const metrics = this.performanceMetrics;
        const quality = this.qualityTiers[this.currentQuality];
        
        // Check FPS performance
        if (metrics.fps < quality.targetFPS * 0.7) {
            this.handleLowPerformance();
        } else if (metrics.fps > quality.targetFPS * 1.2) {
            this.handleHighPerformance();
        }
        
        // Check draw calls
        if (metrics.drawCalls > 2000) {
            this.optimizeDrawCalls();
        }
        
        // Check memory
        if (metrics.memory > this.resourceLimits.memoryThreshold) {
            this.handleHighMemory();
        }
    }
    
    /**
     * Auto-adjust quality based on performance
     */
    autoAdjustQuality() {
        const avgFPS = this.getAverageFPS();
        const targetFPS = this.qualityTiers[this.currentQuality].targetFPS;
        
        // Decrease quality if FPS too low
        if (avgFPS < targetFPS * 0.7) {
            this.decreaseQuality();
        }
        // Increase quality if FPS consistently high
        else if (avgFPS > targetFPS * 1.3 && this.currentQuality !== 'ULTRA') {
            this.increaseQuality();
        }
    }
    
    /**
     * Get average FPS from history
     */
    getAverageFPS() {
        if (this.performanceMetrics.history.length === 0) return 60;
        
        const sum = this.performanceMetrics.history.reduce((acc, m) => acc + m.fps, 0);
        return sum / this.performanceMetrics.history.length;
    }
    
    /**
     * Decrease quality tier
     */
    decreaseQuality() {
        const tiers = ['ULTRA', 'HIGH', 'MEDIUM', 'LOW', 'POTATO'];
        const currentIndex = tiers.indexOf(this.currentQuality);
        
        if (currentIndex < tiers.length - 1) {
            this.currentQuality = tiers[currentIndex + 1];
            this.applyQualitySettings(this.currentQuality);
            console.log(`🔽 Quality decreased to ${this.currentQuality}`);
        }
    }
    
    /**
     * Increase quality tier
     */
    increaseQuality() {
        const tiers = ['ULTRA', 'HIGH', 'MEDIUM', 'LOW', 'POTATO'];
        const currentIndex = tiers.indexOf(this.currentQuality);
        
        if (currentIndex > 0) {
            this.currentQuality = tiers[currentIndex - 1];
            this.applyQualitySettings(this.currentQuality);
            console.log(`🔼 Quality increased to ${this.currentQuality}`);
        }
    }
    
    /**
     * Apply quality settings
     */
    applyQualitySettings(tier) {
        const settings = this.qualityTiers[tier];
        
        // Shadow quality
        if (settings.shadowMapSize > 0) {
            this.renderer.shadowMap.enabled = true;
            this.scene.traverse((obj) => {
                if (obj.isLight && obj.shadow) {
                    obj.shadow.mapSize.width = settings.shadowMapSize;
                    obj.shadow.mapSize.height = settings.shadowMapSize;
                }
            });
        } else {
            this.renderer.shadowMap.enabled = false;
        }
        
        // Texture anisotropy
        this.scene.traverse((obj) => {
            if (obj.isMesh && obj.material) {
                const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
                materials.forEach(mat => {
                    if (mat.map) {
                        mat.map.anisotropy = settings.anisotropy;
                    }
                });
            }
        });
        
        // Antialiasing
        if (this.renderer.getContext().getContextAttributes().antialias !== settings.antialias) {
            console.log(`Antialiasing change requires renderer recreation`);
        }
        
        // Particle count adjustment
        if (this.gameEngine.particleSystem) {
            this.gameEngine.particleSystem.setQuality(settings.particles);
        }
        
        // Draw distance / fog
        if (this.scene.fog) {
            this.scene.fog.far = settings.drawDistance;
        }
        
        console.log(`✅ Applied ${settings.name} quality settings`);
    }
    
    /**
     * Handle low performance
     */
    handleLowPerformance() {
        console.warn('⚠️ Low performance detected, applying optimizations...');
        
        // Reduce particle count
        this.reduceParticles(0.7);
        
        // Increase LOD distances
        this.adjustLODDistances(0.8);
        
        // Disable expensive effects
        this.disableExpensiveEffects();
        
        // Aggressive culling
        this.enableAggressiveCulling();
    }
    
    /**
     * Handle high performance (can increase quality)
     */
    handleHighPerformance() {
        // Already at max quality
        if (this.currentQuality === 'ULTRA') return;
        
        // Gradually increase quality
        this.qualityIncreaseTimer = (this.qualityIncreaseTimer || 0) + 1;
        
        if (this.qualityIncreaseTimer > 10) { // 10 seconds of good performance
            this.increaseQuality();
            this.qualityIncreaseTimer = 0;
        }
    }
    
    /**
     * Optimize draw calls by batching
     */
    optimizeDrawCalls() {
        console.log('🔧 Optimizing draw calls...');
        
        // Merge similar geometries
        this.mergeStaticGeometries();
        
        // Use instanced rendering where possible
        this.setupInstancedRendering();
        
        // Combine materials
        this.combineMaterials();
    }
    
    /**
     * Handle high memory usage
     */
    handleHighMemory() {
        console.warn('⚠️ High memory usage detected, cleaning up...');
        
        // Clear unused resources
        this.clearUnusedResources();
        
        // Reduce texture sizes
        this.reduceTextureQuality();
        
        // Force garbage collection (if available)
        if (window.gc) {
            window.gc();
        }
        
        // Clear caches
        this.clearCache(0.5); // Clear 50% of cache
    }
    
    /**
     * Start resource monitoring
     */
    startResourceMonitoring() {
        this.resourceInterval = setInterval(() => {
            this.monitorResources();
            this.cleanupUnusedResources();
        }, 5000); // Check every 5 seconds
    }
    
    /**
     * Monitor resource usage
     */
    monitorResources() {
        // Count active resources
        const textures = this.scene.traverse((obj) => {
            if (obj.isMesh && obj.material) {
                const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
                return materials.filter(m => m.map).length;
            }
            return 0;
        });
        
        // Log if exceeding limits
        if (this.resourcePool.meshes.size > this.resourceLimits.maxMeshes) {
            console.warn(`⚠️ Mesh count (${this.resourcePool.meshes.size}) exceeds limit`);
            this.reduceMeshCount();
        }
    }
    
    /**
     * Cleanup unused resources
     */
    cleanupUnusedResources() {
        // Remove meshes that are far from player
        if (this.gameEngine.player) {
            const playerPos = this.gameEngine.player.mesh.position;
            const maxDistance = this.qualityTiers[this.currentQuality].drawDistance;
            
            this.resourcePool.meshes.forEach(mesh => {
                const distance = mesh.position.distanceTo(playerPos);
                if (distance > maxDistance * 1.5) {
                    this.despawnMesh(mesh);
                }
            });
        }
    }
    
    /**
     * Clear unused resources
     */
    clearUnusedResources() {
        let cleared = 0;
        
        // Clear unused textures
        this.resourcePool.textures.forEach((texture, key) => {
            if (!this.isTextureInUse(texture)) {
                texture.dispose();
                this.resourcePool.textures.delete(key);
                cleared++;
            }
        });
        
        // Clear unused geometries
        this.resourcePool.geometries.forEach((geometry, key) => {
            if (!this.isGeometryInUse(geometry)) {
                geometry.dispose();
                this.resourcePool.geometries.delete(key);
                cleared++;
            }
        });
        
        // Clear unused materials
        this.resourcePool.materials.forEach((material, key) => {
            if (!this.isMaterialInUse(material)) {
                material.dispose();
                this.resourcePool.materials.delete(key);
                cleared++;
            }
        });
        
        console.log(`🧹 Cleared ${cleared} unused resources`);
    }
    
    /**
     * Object pooling - get object from pool
     */
    getFromPool(type) {
        const pool = this.objectPools[type];
        if (!pool || pool.length === 0) {
            return null;
        }
        
        return pool.pop();
    }
    
    /**
     * Object pooling - return object to pool
     */
    returnToPool(type, object) {
        if (!this.objectPools[type]) {
            this.objectPools[type] = [];
        }
        
        // Reset object state
        this.resetObject(object);
        
        // Add to pool
        this.objectPools[type].push(object);
    }
    
    /**
     * LOD system - create LOD group
     */
    createLODGroup(highDetail, medDetail, lowDetail) {
        const lodGroup = new THREE.LOD();
        
        const settings = this.qualityTiers[this.currentQuality];
        
        lodGroup.addLevel(highDetail, settings.lodDistance[0]);
        lodGroup.addLevel(medDetail, settings.lodDistance[1]);
        lodGroup.addLevel(lowDetail, settings.lodDistance[2]);
        
        return lodGroup;
    }
    
    /**
     * Start health monitoring
     */
    startHealthMonitoring() {
        this.healthInterval = setInterval(() => {
            this.updateSystemHealth();
            this.checkSystemHealth();
        }, 2000); // Check every 2 seconds
    }
    
    /**
     * Update system health metrics
     */
    updateSystemHealth() {
        // Performance health
        const targetFPS = this.qualityTiers[this.currentQuality].targetFPS;
        this.systemHealth.performance = Math.min(100, 
            (this.performanceMetrics.fps / targetFPS) * 100
        );
        
        // Resource health
        const memoryUsage = this.performanceMetrics.memory / this.resourceLimits.memoryThreshold;
        this.systemHealth.resources = Math.max(0, 100 - memoryUsage * 100);
        
        // Stability health (based on errors)
        if (this.errorRecovery.lastError) {
            const timeSinceError = Date.now() - this.errorRecovery.lastError.time;
            this.systemHealth.stability = Math.min(100, (timeSinceError / 60000) * 100);
        }
        
        // Overall health
        this.systemHealth.overall = (
            this.systemHealth.performance * 0.4 +
            this.systemHealth.resources * 0.3 +
            this.systemHealth.stability * 0.3
        );
    }
    
    /**
     * Check system health and take action
     */
    checkSystemHealth() {
        if (this.systemHealth.overall < 50) {
            console.error('🚨 System health critical! Taking emergency actions...');
            this.emergencyOptimization();
        } else if (this.systemHealth.overall < 70) {
            console.warn('⚠️ System health low, optimizing...');
            this.handleLowPerformance();
        }
    }
    
    /**
     * Emergency optimization
     */
    emergencyOptimization() {
        console.log('🚨 Emergency optimization activated');
        
        // Force lowest quality
        this.currentQuality = 'POTATO';
        this.applyQualitySettings('POTATO');
        
        // Disable all non-essential features
        this.disableNonEssentialFeatures();
        
        // Aggressive cleanup
        this.clearUnusedResources();
        this.reduceParticles(0.3);
        
        // Clear all caches
        this.clearCache(1.0);
    }
    
    /**
     * Start auto-save system
     */
    startAutoSave() {
        this.autoSaveInterval = setInterval(() => {
            if (this.autoSave.enabled) {
                this.performAutoSave();
            }
        }, this.autoSave.interval);
    }
    
    /**
     * Perform auto-save
     */
    performAutoSave() {
        try {
            if (this.gameEngine.saveSystem) {
                this.gameEngine.saveSystem.quickSave();
                this.autoSave.lastSave = Date.now();
                this.autoSave.savesThisSession++;
                console.log(`💾 Auto-save #${this.autoSave.savesThisSession} completed`);
            }
        } catch (error) {
            console.error('Auto-save failed:', error);
        }
    }
    
    /**
     * Setup error handling
     */
    setupErrorHandling() {
        // Global error handler
        window.addEventListener('error', (event) => {
            this.handleError(event.error);
        });
        
        // Unhandled promise rejection handler
        window.addEventListener('unhandledrejection', (event) => {
            this.handleError(event.reason);
        });
        
        // WebGL context lost handler
        if (this.renderer.domElement) {
            this.renderer.domElement.addEventListener('webglcontextlost', (event) => {
                event.preventDefault();
                this.handleWebGLContextLost();
            });
            
            this.renderer.domElement.addEventListener('webglcontextrestored', () => {
                this.handleWebGLContextRestored();
            });
        }
    }
    
    /**
     * Handle errors with recovery
     */
    handleError(error) {
        console.error('❌ Error caught:', error);
        
        this.errorRecovery.lastError = {
            error: error,
            time: Date.now()
        };
        
        if (this.errorRecovery.enabled) {
            this.attemptRecovery(error);
        }
    }
    
    /**
     * Attempt error recovery
     */
    attemptRecovery(error) {
        this.errorRecovery.restartCount++;
        
        if (this.errorRecovery.restartCount > this.errorRecovery.maxRestarts) {
            console.error('❌ Max restart attempts reached, giving up');
            return;
        }
        
        console.log(`🔄 Attempting recovery (attempt ${this.errorRecovery.restartCount})...`);
        
        // Try to recover
        try {
            this.performRecovery();
            console.log('✅ Recovery successful');
            this.errorRecovery.restartCount = 0;
        } catch (recoveryError) {
            console.error('❌ Recovery failed:', recoveryError);
        }
    }
    
    /**
     * Perform recovery actions
     */
    performRecovery() {
        // Clear problematic resources
        this.clearUnusedResources();
        
        // Reset to safe defaults
        this.currentQuality = 'MEDIUM';
        this.applyQualitySettings('MEDIUM');
        
        // Clear caches
        this.clearCache(1.0);
        
        // Reload essential systems
        if (this.gameEngine.player) {
            // Respawn player at safe location
            this.gameEngine.player.mesh.position.set(0, 5, 0);
        }
    }
    
    /**
     * Handle WebGL context lost
     */
    handleWebGLContextLost() {
        console.error('🔴 WebGL context lost!');
        
        // Stop rendering
        this.isContextLost = true;
        
        // Clear all resources
        this.clearAllResources();
    }
    
    /**
     * Handle WebGL context restored
     */
    handleWebGLContextRestored() {
        console.log('🟢 WebGL context restored, reinitializing...');
        
        this.isContextLost = false;
        
        // Reinitialize renderer
        this.optimizeRenderer();
        
        // Reload resources
        if (this.gameEngine.assetLoader) {
            this.gameEngine.assetLoader.reloadAll();
        }
    }
    
    /**
     * Optimize renderer settings
     */
    optimizeRenderer() {
        // Enable performance optimizations
        this.renderer.powerPreference = 'high-performance';
        
        // Sort objects for optimal rendering
        this.renderer.sortObjects = true;
        
        // Enable frustum culling
        this.scene.traverse((obj) => {
            if (obj.isMesh) {
                obj.frustumCulled = this.frustumCulling;
            }
        });
    }
    
    /**
     * Cache management
     */
    addToCache(key, data, type = 'data') {
        const size = this.estimateSize(data);
        
        // Check if cache is full
        if (this.cache.currentSize + size > this.cache.maxSize) {
            this.clearCache(0.3); // Clear 30% to make room
        }
        
        this.cache[type].set(key, {
            data: data,
            size: size,
            lastAccessed: Date.now(),
            accessCount: 0
        });
        
        this.cache.currentSize += size;
    }
    
    getFromCache(key, type = 'data') {
        const cached = this.cache[type].get(key);
        
        if (cached) {
            cached.lastAccessed = Date.now();
            cached.accessCount++;
            return cached.data;
        }
        
        return null;
    }
    
    clearCache(percentage = 1.0) {
        const types = ['textures', 'models', 'audio', 'data'];
        let cleared = 0;
        
        types.forEach(type => {
            const cache = this.cache[type];
            const entries = Array.from(cache.entries());
            
            // Sort by access count (least used first)
            entries.sort((a, b) => a[1].accessCount - b[1].accessCount);
            
            // Remove percentage of entries
            const removeCount = Math.floor(entries.length * percentage);
            
            for (let i = 0; i < removeCount; i++) {
                const [key, entry] = entries[i];
                this.cache.currentSize -= entry.size;
                cache.delete(key);
                cleared++;
            }
        });
        
        console.log(`🧹 Cleared ${cleared} cache entries`);
    }
    
    /**
     * Intelligent prefetching
     */
    prefetchResources(playerPosition, direction) {
        if (!this.adaptive.intelligentPrefetch) return;
        
        // Predict where player is going
        const predictedPosition = playerPosition.clone().add(
            direction.clone().multiplyScalar(20)
        );
        
        // Prefetch resources in that area
        this.loadResourcesNear(predictedPosition);
    }
    
    /**
     * Helper methods
     */
    
    reduceParticles(factor) {
        if (this.gameEngine.particleSystem) {
            this.gameEngine.particleSystem.setQuality(factor);
        }
    }
    
    adjustLODDistances(factor) {
        this.lodGroups.forEach(lod => {
            lod.levels.forEach((level, index) => {
                level.distance *= factor;
            });
        });
    }
    
    disableExpensiveEffects() {
        // Disable post-processing
        if (this.gameEngine.postProcessingSystem) {
            this.gameEngine.postProcessingSystem.disable();
        }
        
        // Disable volumetric lighting
        if (this.gameEngine.volumetricLightingSystem) {
            this.gameEngine.volumetricLightingSystem.disable();
        }
    }
    
    enableAggressiveCulling() {
        this.scene.traverse((obj) => {
            if (obj.isMesh) {
                obj.frustumCulled = true;
            }
        });
    }
    
    mergeStaticGeometries() {
        // Implementation would merge geometries that don't move
        console.log('Merging static geometries...');
    }
    
    setupInstancedRendering() {
        // Implementation would use InstancedMesh for repeated objects
        console.log('Setting up instanced rendering...');
    }
    
    combineMaterials() {
        // Implementation would combine similar materials
        console.log('Combining materials...');
    }
    
    reduceTextureQuality() {
        this.scene.traverse((obj) => {
            if (obj.isMesh && obj.material) {
                const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
                materials.forEach(mat => {
                    if (mat.map && mat.map.image) {
                        // Reduce texture resolution
                        mat.map.minFilter = THREE.LinearFilter;
                        mat.map.magFilter = THREE.LinearFilter;
                    }
                });
            }
        });
    }
    
    reduceMeshCount() {
        // Remove least important meshes
        console.log('Reducing mesh count...');
    }
    
    despawnMesh(mesh) {
        this.scene.remove(mesh);
        this.resourcePool.meshes.delete(mesh);
    }
    
    isTextureInUse(texture) {
        let inUse = false;
        this.scene.traverse((obj) => {
            if (obj.isMesh && obj.material) {
                const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
                materials.forEach(mat => {
                    if (mat.map === texture) {
                        inUse = true;
                    }
                });
            }
        });
        return inUse;
    }
    
    isGeometryInUse(geometry) {
        let inUse = false;
        this.scene.traverse((obj) => {
            if (obj.isMesh && obj.geometry === geometry) {
                inUse = true;
            }
        });
        return inUse;
    }
    
    isMaterialInUse(material) {
        let inUse = false;
        this.scene.traverse((obj) => {
            if (obj.isMesh && obj.material === material) {
                inUse = true;
            }
        });
        return inUse;
    }
    
    resetObject(object) {
        if (object.position) object.position.set(0, 0, 0);
        if (object.rotation) object.rotation.set(0, 0, 0);
        if (object.scale) object.scale.set(1, 1, 1);
        if (object.visible !== undefined) object.visible = true;
    }
    
    disableNonEssentialFeatures() {
        console.log('Disabling non-essential features...');
        
        // Disable particles
        this.reduceParticles(0.1);
        
        // Disable weather
        if (this.gameEngine.weatherSystem) {
            this.gameEngine.weatherSystem.disable();
        }
        
        // Disable ambient creatures
        if (this.gameEngine.worldBeautificationSystem) {
            this.gameEngine.worldBeautificationSystem.reduceAnimals(0.1);
        }
    }
    
    clearAllResources() {
        this.resourcePool.textures.forEach(t => t.dispose());
        this.resourcePool.geometries.forEach(g => g.dispose());
        this.resourcePool.materials.forEach(m => m.dispose());
        
        this.resourcePool.textures.clear();
        this.resourcePool.geometries.clear();
        this.resourcePool.materials.clear();
    }
    
    estimateSize(data) {
        // Rough estimation of data size in bytes
        return JSON.stringify(data).length;
    }
    
    loadResourcesNear(position) {
        // Implementation would load resources near position
        console.log('Prefetching resources near', position);
    }
    
    /**
     * Get system status
     */
    getStatus() {
        return {
            quality: this.currentQuality,
            performance: this.performanceMetrics,
            health: this.systemHealth,
            resources: {
                textures: this.resourcePool.textures.size,
                geometries: this.resourcePool.geometries.size,
                materials: this.resourcePool.materials.size,
                meshes: this.resourcePool.meshes.size
            },
            cache: {
                size: this.cache.currentSize,
                maxSize: this.cache.maxSize,
                usage: (this.cache.currentSize / this.cache.maxSize * 100).toFixed(1) + '%'
            },
            autoSave: {
                lastSave: new Date(this.autoSave.lastSave).toLocaleTimeString(),
                savesThisSession: this.autoSave.savesThisSession
            }
        };
    }
    
    /**
     * Manual control methods
     */
    
    setQuality(tier) {
        if (this.qualityTiers[tier]) {
            this.currentQuality = tier;
            this.applyQualitySettings(tier);
            this.autoQualityEnabled = false; // Disable auto when manually set
        }
    }
    
    enableAutoQuality() {
        this.autoQualityEnabled = true;
    }
    
    disableAutoQuality() {
        this.autoQualityEnabled = false;
    }
    
    /**
     * Cleanup
     */
    destroy() {
        if (this.performanceInterval) clearInterval(this.performanceInterval);
        if (this.resourceInterval) clearInterval(this.resourceInterval);
        if (this.healthInterval) clearInterval(this.healthInterval);
        if (this.autoSaveInterval) clearInterval(this.autoSaveInterval);
        
        this.clearAllResources();
        this.clearCache(1.0);
    }

  update(delta) {
    // Updated for v3.0.0 - modernized system
  }
}
