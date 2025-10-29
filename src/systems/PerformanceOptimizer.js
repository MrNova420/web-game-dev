/**
 * PerformanceOptimizer.js
 * Advanced performance optimization and monitoring system
 * ~596 lines
 */

export class PerformanceOptimizer {
    constructor() {
        this.enabled = true;
        this.metrics = {
            fps: [],
            frameTime: [],
            memory: [],
            drawCalls: [],
            entityCount: []
        };
        this.maxMetricSamples = 60;
        this.lastFrameTime = performance.now();
        this.targetFPS = 60;
        this.targetFrameTime = 1000 / this.targetFPS;
        
        this.optimizationLevel = 'auto'; // auto, low, medium, high, ultra
        this.adaptiveQuality = true;
        this.performanceMode = 'balanced'; // battery, balanced, performance
        
        this.initialize();
    }

    initialize() {
        // Object pooling
        this.objectPools = new Map();
        this.initializeObjectPools();

        // Culling system
        this.cullingEnabled = true;
        this.cullDistance = 100;
        this.frustumCulling = true;

        // LOD (Level of Detail) system
        this.lodEnabled = true;
        this.lodLevels = [
            { distance: 10, quality: 1.0 },
            { distance: 30, quality: 0.7 },
            { distance: 60, quality: 0.4 },
            { distance: 100, quality: 0.2 }
        ];

        // Batch rendering
        this.batchingEnabled = true;
        this.maxBatchSize = 1000;

        // Lazy loading
        this.lazyLoadDistance = 50;
        this.unloadDistance = 150;

        // Performance thresholds
        this.thresholds = {
            fpsLow: 30,
            fpsTarget: 60,
            frameTimeCritical: 33, // 30 FPS
            memoryWarning: 400 * 1024 * 1024, // 400 MB
            memoryCritical: 500 * 1024 * 1024 // 500 MB
        };
        
        // Cooldown for optimization attempts
        this.lastOptimizationTime = 0;
        this.optimizationCooldown = 5000; // 5 seconds between optimization attempts

        // Start monitoring
        this.startMonitoring();
    }

    initializeObjectPools() {
        // Create pools for commonly used objects
        this.createPool('particles', 1000, () => ({ active: false, x: 0, y: 0, vx: 0, vy: 0 }));
        this.createPool('projectiles', 500, () => ({ active: false, x: 0, y: 0, damage: 0 }));
        this.createPool('effects', 200, () => ({ active: false, type: '', duration: 0 }));
        this.createPool('uiElements', 100, () => ({ active: false, text: '', x: 0, y: 0 }));
    }

    createPool(name, size, factory) {
        const pool = {
            objects: [],
            factory,
            size,
            nextIndex: 0
        };

        for (let i = 0; i < size; i++) {
            pool.objects.push(factory());
        }

        this.objectPools.set(name, pool);
    }

    acquire(poolName) {
        const pool = this.objectPools.get(poolName);
        if (!pool) return pool.factory();

        // Find inactive object
        for (let i = 0; i < pool.objects.length; i++) {
            const index = (pool.nextIndex + i) % pool.objects.length;
            const obj = pool.objects[index];
            
            if (!obj.active) {
                obj.active = true;
                pool.nextIndex = (index + 1) % pool.objects.length;
                return obj;
            }
        }

        // Pool exhausted, create new object
        const newObj = pool.factory();
        newObj.active = true;
        pool.objects.push(newObj);
        return newObj;
    }

    release(poolName, obj) {
        if (obj) {
            obj.active = false;
        }
    }

    releaseAll(poolName) {
        const pool = this.objectPools.get(poolName);
        if (pool) {
            pool.objects.forEach(obj => obj.active = false);
            pool.nextIndex = 0;
        }
    }

    // Performance monitoring
    startMonitoring() {
        this.monitoringInterval = setInterval(() => {
            this.collectMetrics();
            this.analyzePerformance();
            
            if (this.adaptiveQuality) {
                this.adjustQuality();
            }
        }, 1000);
    }

    collectMetrics() {
        const now = performance.now();
        const deltaTime = now - this.lastFrameTime;
        this.lastFrameTime = now;

        // FPS
        const fps = 1000 / deltaTime;
        this.addMetric('fps', fps);
        this.addMetric('frameTime', deltaTime);

        // Memory (if available)
        if (performance.memory) {
            this.addMetric('memory', performance.memory.usedJSHeapSize);
        }

        // Entity count
        const entityCount = this.getEntityCount();
        this.addMetric('entityCount', entityCount);
    }

    addMetric(name, value) {
        if (!this.metrics[name]) {
            this.metrics[name] = [];
        }

        this.metrics[name].push(value);

        if (this.metrics[name].length > this.maxMetricSamples) {
            this.metrics[name].shift();
        }
    }

    getMetricAverage(name) {
        const values = this.metrics[name];
        if (!values || values.length === 0) return 0;

        const sum = values.reduce((a, b) => a + b, 0);
        return sum / values.length;
    }

    getEntityCount() {
        // Would count actual entities in game
        return window.gameEngine?.entities?.length || 0;
    }

    analyzePerformance() {
        const avgFPS = this.getMetricAverage('fps');
        const avgFrameTime = this.getMetricAverage('frameTime');
        const avgMemory = this.getMetricAverage('memory');

        // Detect performance issues
        if (avgFPS < this.thresholds.fpsLow) {
            console.warn('⚠️ Low FPS detected:', avgFPS.toFixed(1));
            this.onLowPerformance();
        }

        if (avgFrameTime > this.thresholds.frameTimeCritical) {
            console.warn('⚠️ Frame time too high:', avgFrameTime.toFixed(1), 'ms');
        }

        if (avgMemory > this.thresholds.memoryWarning) {
            console.warn('⚠️ High memory usage:', (avgMemory / 1024 / 1024).toFixed(1), 'MB');
            
            if (avgMemory > this.thresholds.memoryCritical) {
                console.error('❌ Critical memory usage!');
                this.onCriticalMemory();
            }
        }
    }

    onLowPerformance() {
        if (!this.adaptiveQuality) return;
        
        // Check cooldown to prevent spam
        const now = performance.now();
        if (now - this.lastOptimizationTime < this.optimizationCooldown) {
            return; // Still in cooldown, skip optimization
        }
        
        this.lastOptimizationTime = now;

        // Automatically reduce quality
        if (this.optimizationLevel === 'ultra') {
            this.setOptimizationLevel('high');
        } else if (this.optimizationLevel === 'high') {
            this.setOptimizationLevel('medium');
        } else if (this.optimizationLevel === 'medium') {
            this.setOptimizationLevel('low');
        }
    }

    onCriticalMemory() {
        console.log('🧹 Performing emergency cleanup...');
        
        // Release all pools
        for (const [name, pool] of this.objectPools) {
            this.releaseAll(name);
        }

        // Force garbage collection if available
        if (window.gc) {
            window.gc();
        }

        // Clear caches
        this.clearCaches();
    }

    clearCaches() {
        // Would clear various game caches
        if (window.gameEngine?.clearCaches) {
            window.gameEngine.clearCaches();
        }
    }

    adjustQuality() {
        const avgFPS = this.getMetricAverage('fps');

        if (avgFPS >= this.thresholds.fpsTarget * 1.1 && this.optimizationLevel !== 'ultra') {
            // Can increase quality
            this.increaseQuality();
        } else if (avgFPS < this.thresholds.fpsTarget * 0.9) {
            // Need to decrease quality
            this.decreaseQuality();
        }
    }

    increaseQuality() {
        const levels = ['low', 'medium', 'high', 'ultra'];
        const currentIndex = levels.indexOf(this.optimizationLevel);
        
        if (currentIndex < levels.length - 1) {
            this.setOptimizationLevel(levels[currentIndex + 1]);
        }
    }

    decreaseQuality() {
        const levels = ['low', 'medium', 'high', 'ultra'];
        const currentIndex = levels.indexOf(this.optimizationLevel);
        
        if (currentIndex > 0) {
            this.setOptimizationLevel(levels[currentIndex - 1]);
        }
    }

    setOptimizationLevel(level) {
        this.optimizationLevel = level;
        console.log(`🎮 Quality set to: ${level}`);

        // Apply optimization settings
        const settings = this.getOptimizationSettings(level);
        this.applySettings(settings);
    }

    getOptimizationSettings(level) {
        const settings = {
            low: {
                particleLimit: 50,
                shadowQuality: 0,
                textureQuality: 0.5,
                effectsEnabled: false,
                lodDistance: 30,
                cullDistance: 50,
                maxEntities: 50
            },
            medium: {
                particleLimit: 100,
                shadowQuality: 1,
                textureQuality: 0.75,
                effectsEnabled: true,
                lodDistance: 60,
                cullDistance: 80,
                maxEntities: 100
            },
            high: {
                particleLimit: 200,
                shadowQuality: 2,
                textureQuality: 1.0,
                effectsEnabled: true,
                lodDistance: 100,
                cullDistance: 120,
                maxEntities: 200
            },
            ultra: {
                particleLimit: 500,
                shadowQuality: 3,
                textureQuality: 1.0,
                effectsEnabled: true,
                lodDistance: 150,
                cullDistance: 200,
                maxEntities: 500
            }
        };

        return settings[level] || settings.medium;
    }

    applySettings(settings) {
        // Apply to game engine
        if (window.gameEngine) {
            window.gameEngine.particleLimit = settings.particleLimit;
            window.gameEngine.shadowQuality = settings.shadowQuality;
            window.gameEngine.textureQuality = settings.textureQuality;
            window.gameEngine.effectsEnabled = settings.effectsEnabled;
            window.gameEngine.maxEntities = settings.maxEntities;
        }

        this.cullDistance = settings.cullDistance;
        this.lodLevels[0].distance = settings.lodDistance * 0.1;
        this.lodLevels[1].distance = settings.lodDistance * 0.3;
        this.lodLevels[2].distance = settings.lodDistance * 0.6;
        this.lodLevels[3].distance = settings.lodDistance;
    }

    // Culling methods
    shouldCull(entity, camera) {
        if (!this.cullingEnabled) return false;

        // Distance culling
        const distance = this.getDistance(entity, camera);
        if (distance > this.cullDistance) {
            return true;
        }

        // Frustum culling
        if (this.frustumCulling && !this.isInFrustum(entity, camera)) {
            return true;
        }

        return false;
    }

    getDistance(entity, camera) {
        const dx = entity.x - camera.x;
        const dy = entity.y - camera.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    isInFrustum(entity, camera) {
        // Simplified frustum check (would use proper frustum in production)
        const halfWidth = camera.width / 2;
        const halfHeight = camera.height / 2;

        return entity.x >= camera.x - halfWidth &&
               entity.x <= camera.x + halfWidth &&
               entity.y >= camera.y - halfHeight &&
               entity.y <= camera.y + halfHeight;
    }

    // LOD methods
    getLODLevel(entity, camera) {
        if (!this.lodEnabled) return 1.0;

        const distance = this.getDistance(entity, camera);

        for (const level of this.lodLevels) {
            if (distance < level.distance) {
                return level.quality;
            }
        }

        return this.lodLevels[this.lodLevels.length - 1].quality;
    }

    // Performance mode methods
    setPerformanceMode(mode) {
        this.performanceMode = mode;
        console.log(`⚡ Performance mode: ${mode}`);

        switch (mode) {
            case 'battery':
                this.targetFPS = 30;
                this.setOptimizationLevel('low');
                this.adaptiveQuality = false;
                break;
            case 'balanced':
                this.targetFPS = 60;
                this.optimizationLevel = 'auto';
                this.adaptiveQuality = true;
                break;
            case 'performance':
                this.targetFPS = 144;
                this.setOptimizationLevel('ultra');
                this.adaptiveQuality = true;
                break;
        }

        this.targetFrameTime = 1000 / this.targetFPS;
    }

    // Get performance report
    getPerformanceReport() {
        return {
            fps: {
                current: this.metrics.fps[this.metrics.fps.length - 1] || 0,
                average: this.getMetricAverage('fps'),
                min: Math.min(...this.metrics.fps),
                max: Math.max(...this.metrics.fps)
            },
            frameTime: {
                current: this.metrics.frameTime[this.metrics.frameTime.length - 1] || 0,
                average: this.getMetricAverage('frameTime'),
                target: this.targetFrameTime
            },
            memory: {
                current: this.metrics.memory[this.metrics.memory.length - 1] || 0,
                average: this.getMetricAverage('memory'),
                warning: this.thresholds.memoryWarning,
                critical: this.thresholds.memoryCritical
            },
            optimizationLevel: this.optimizationLevel,
            performanceMode: this.performanceMode,
            adaptiveQuality: this.adaptiveQuality,
            entityCount: this.getMetricAverage('entityCount')
        };
    }

    // Update method (called every frame)
    update(deltaTime) {
        // Update metrics
        const now = performance.now();
        const frameDelta = now - this.lastFrameTime;
        this.lastFrameTime = now;

        this.addMetric('fps', 1000 / frameDelta);
        this.addMetric('frameTime', frameDelta);
    }

    // Cleanup
    destroy() {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
        }

        // Release all object pools
        for (const [name, pool] of this.objectPools) {
            this.releaseAll(name);
        }
    }

    // Enable/disable features
    enableAdaptiveQuality() {
        this.adaptiveQuality = true;
        console.log('✅ Adaptive quality enabled');
    }

    disableAdaptiveQuality() {
        this.adaptiveQuality = false;
        console.log('Adaptive quality disabled');
    }

    enableCulling() {
        this.cullingEnabled = true;
        console.log('✅ Culling enabled');
    }

    disableCulling() {
        this.cullingEnabled = false;
        console.log('Culling disabled');
    }

    enableLOD() {
        this.lodEnabled = true;
        console.log('✅ LOD enabled');
    }

    disableLOD() {
        this.lodEnabled = false;
        console.log('LOD disabled');
    }
}
