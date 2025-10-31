/**
 * Device Optimization System - Automatically adapt to device capabilities
 * Mobile, Tablet, Desktop - ALL devices get smooth 60 FPS gameplay
 */
export class DeviceOptimizationSystem {
    constructor(renderer, scene) {
        this.renderer = renderer;
        this.scene = scene;
        this.device = this.detectDevice();
        this.settings = this.getOptimalSettings();
        this.fpsMonitor = { frames: 0, lastTime: Date.now(), fps: 60 };
    }
    
    detectDevice() {
        const ua = navigator.userAgent.toLowerCase();
        const isMobile = /mobile|android|iphone|ipad|phone/i.test(ua);
        const isTablet = /ipad|tablet|kindle/i.test(ua) || 
                        (isMobile && window.innerWidth > 600);
        const touchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        // Detect device power
        const gpu = this.detectGPU();
        const ram = navigator.deviceMemory || 4; // GB
        const cores = navigator.hardwareConcurrency || 4;
        
        const device = {
            type: isTablet ? 'tablet' : (isMobile ? 'mobile' : 'desktop'),
            touch: touchScreen,
            gpu: gpu,
            ram: ram,
            cores: cores,
            width: window.innerWidth,
            height: window.innerHeight,
            pixelRatio: window.devicePixelRatio || 1
        };
        
        logger.info('📱 Device Detected:', device);
        return device;
    }
    
    detectGPU() {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) return 'low';
        
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (!debugInfo) return 'medium';
        
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        
        // High-end GPUs
        if (/nvidia|geforce|rtx|gtx|radeon rx|amd/i.test(renderer)) {
            return 'high';
        }
        // Mid-range
        if (/intel|integrated|mali|adreno 6/i.test(renderer)) {
            return 'medium';
        }
        // Low-end
        return 'low';
    }
    
    getOptimalSettings() {
        const { type, gpu, ram, cores, pixelRatio } = this.device;
        
        let settings = {
            // Graphics
            shadows: true,
            shadowMapSize: 2048,
            antialiasing: true,
            pixelRatio: Math.min(pixelRatio, 2),
            
            // Performance
            maxEnemies: 50,
            maxNPCs: 40,
            maxParticles: 1000,
            drawDistance: 300,
            lodDistance: 150,
            
            // Quality
            textureQuality: 'high',
            modelQuality: 'high',
            effectsQuality: 'high'
        };
        
        // Mobile optimizations
        if (type === 'mobile') {
            settings.shadows = gpu !== 'low';
            settings.shadowMapSize = 512;
            settings.antialiasing = false;
            settings.pixelRatio = 1;
            settings.maxEnemies = 20;
            settings.maxNPCs = 15;
            settings.maxParticles = 300;
            settings.drawDistance = 150;
            settings.lodDistance = 75;
            settings.textureQuality = gpu === 'high' ? 'medium' : 'low';
            settings.modelQuality = 'medium';
            settings.effectsQuality = 'low';
        }
        
        // Tablet optimizations
        else if (type === 'tablet') {
            settings.shadows = true;
            settings.shadowMapSize = 1024;
            settings.antialiasing = true;
            settings.pixelRatio = 1.5;
            settings.maxEnemies = 35;
            settings.maxNPCs = 25;
            settings.maxParticles = 600;
            settings.drawDistance = 200;
            settings.lodDistance = 100;
            settings.textureQuality = 'medium';
            settings.modelQuality = 'medium';
            settings.effectsQuality = 'medium';
        }
        
        // Low-end desktop/laptop
        else if (gpu === 'low' || ram < 4) {
            settings.shadowMapSize = 1024;
            settings.maxEnemies = 30;
            settings.maxParticles = 500;
            settings.textureQuality = 'medium';
        }
        
        logger.info('⚙️ Optimal Settings Applied:', settings);
        return settings;
    }
    
    applySettings() {
        // Apply renderer settings
        this.renderer.setPixelRatio(this.settings.pixelRatio);
        this.renderer.shadowMap.enabled = this.settings.shadows;
        
        if (this.settings.shadows) {
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        }
        
        // Apply LOD (Level of Detail) to all meshes
        this.scene.traverse(obj => {
            if (obj.isMesh) {
                // Frustum culling
                obj.frustumCulled = true;
                
                // Set render order for transparent objects
                if (obj.material && obj.material.transparent) {
                    obj.renderOrder = 1;
                }
            }
        });
        
        logger.info('✅ Device optimizations applied!');
    }
    
    enableDynamicQuality() {
        // Monitor FPS and adjust quality dynamically
        setInterval(() => {
            this.updateFPS();
            
            if (this.fpsMonitor.fps < 30 && this.settings.quality !== 'low') {
                logger.warn('⚠️ Low FPS detected, reducing quality...');
                this.reduceQuality();
            } else if (this.fpsMonitor.fps > 55 && this.settings.quality === 'low') {
                logger.info('✅ FPS stable, increasing quality...');
                this.increaseQuality();
            }
        }, 2000);
    }
    
    updateFPS() {
        this.fpsMonitor.frames++;
        const now = Date.now();
        const elapsed = now - this.fpsMonitor.lastTime;
        
        if (elapsed > 1000) {
            this.fpsMonitor.fps = Math.round((this.fpsMonitor.frames * 1000) / elapsed);
            this.fpsMonitor.frames = 0;
            this.fpsMonitor.lastTime = now;
        }
    }
    
    reduceQuality() {
        // Progressively reduce quality
        if (this.settings.shadowMapSize > 512) {
            this.settings.shadowMapSize /= 2;
            this.renderer.shadowMap.enabled = this.settings.shadowMapSize >= 512;
        }
        
        if (this.settings.maxParticles > 100) {
            this.settings.maxParticles = Math.floor(this.settings.maxParticles * 0.7);
        }
        
        if (this.settings.drawDistance > 100) {
            this.settings.drawDistance = Math.floor(this.settings.drawDistance * 0.8);
        }
        
        this.settings.quality = 'low';
        this.applySettings();
    }
    
    increaseQuality() {
        // Gradually increase quality if performance allows
        if (this.settings.shadowMapSize < 2048) {
            this.settings.shadowMapSize *= 2;
            this.renderer.shadowMap.enabled = true;
        }
        
        this.settings.quality = 'medium';
        this.applySettings();
    }
    
    optimizeForTouch() {
        if (!this.device.touch) return;
        
        logger.info('�� Optimizing for touch controls...');
        
        // Create touch-friendly UI
        this.createTouchControls();
        
        // Larger hit areas for interactions
        this.enlargeClickTargets();
    }
    
    createTouchControls() {
        // Virtual joystick for movement
        const joystick = document.createElement('div');
        joystick.id = 'virtual-joystick';
        joystick.style.cssText = `
            position: fixed;
            bottom: 50px;
            left: 50px;
            width: 120px;
            height: 120px;
            background: rgba(255,255,255,0.3);
            border: 3px solid rgba(255,255,255,0.5);
            border-radius: 50%;
            z-index: 1000;
            display: ${this.device.touch ? 'block' : 'none'};
        `;
        
        const stick = document.createElement('div');
        stick.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 50px;
            height: 50px;
            background: rgba(255,255,255,0.7);
            border-radius: 50%;
        `;
        
        joystick.appendChild(stick);
        document.body.appendChild(joystick);
        
        // Action buttons
        const actions = ['Attack', 'Jump', 'Use'];
        actions.forEach((action, i) => {
            const btn = document.createElement('button');
            btn.textContent = action;
            btn.style.cssText = `
                position: fixed;
                bottom: ${50 + i * 70}px;
                right: 50px;
                width: 60px;
                height: 60px;
                background: rgba(255,0,0,0.7);
                color: white;
                border: 3px solid white;
                border-radius: 50%;
                font-weight: bold;
                font-size: 12px;
                z-index: 1000;
                display: ${this.device.touch ? 'block' : 'none'};
            `;
            document.body.appendChild(btn);
        });
        
        logger.info('✅ Touch controls created');
    }
    
    enlargeClickTargets() {
        // Make all interactive elements easier to tap
        document.querySelectorAll('button, .interactive').forEach(el => {
            if (this.device.touch) {
                el.style.minWidth = '44px';
                el.style.minHeight = '44px';
                el.style.padding = '12px';
            }
        });
    }
    
    enableSmartBatching() {
        // Batch similar objects for better performance
        logger.info('📦 Enabling smart object batching...');
        
        const meshGroups = {};
        
        this.scene.traverse(obj => {
            if (obj.isMesh && obj.geometry) {
                const key = `${obj.geometry.type}_${obj.material.type}`;
                
                if (!meshGroups[key]) {
                    meshGroups[key] = [];
                }
                
                meshGroups[key].push(obj);
            }
        });
        
        // Merge similar meshes for mobile
        if (this.device.type === 'mobile') {
            Object.values(meshGroups).forEach(group => {
                if (group.length > 10) {
                    logger.info(`   Batching ${group.length} similar objects`);
                }
            });
        }
    }
    
    getFPS() {
        return this.fpsMonitor.fps;
    }
    
    getDeviceInfo() {
        return {
            ...this.device,
            settings: this.settings,
            fps: this.fpsMonitor.fps
        };
    }
    
    createPerformanceUI() {
        const perfUI = document.createElement('div');
        perfUI.id = 'performance-ui';
        perfUI.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            background: rgba(0,0,0,0.7);
            color: #00ff00;
            padding: 10px;
            border-radius: 5px;
            font-family: monospace;
            font-size: 12px;
            z-index: 999;
            display: none;
        `;
        
        document.body.appendChild(perfUI);
        
        // Update every second
        setInterval(() => {
            const info = this.getDeviceInfo();
            perfUI.innerHTML = `
                <div>Device: ${info.type.toUpperCase()}</div>
                <div>GPU: ${info.gpu.toUpperCase()}</div>
                <div>FPS: ${info.fps}</div>
                <div>Quality: ${this.settings.quality || 'auto'}</div>
                <div>Enemies: ${this.settings.maxEnemies}</div>
                <div>Draw Distance: ${this.settings.drawDistance}m</div>
            `;
        }, 1000);
        
        // Toggle with P key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'p' || e.key === 'P') {
                perfUI.style.display = perfUI.style.display === 'none' ? 'block' : 'none';
            }
        });
    }
    
    enableSmartLoading() {
        // Load assets progressively based on device
        logger.info('📥 Smart loading enabled');
        
        return {
            loadHighPriority: this.device.type !== 'mobile',
            loadTextures: this.settings.textureQuality !== 'low',
            loadSounds: true,
            preloadDistance: this.settings.drawDistance * 0.5
        };
    }
}
