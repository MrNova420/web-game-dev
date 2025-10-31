/**
import { logger } from '../core/Logger.js';
 * Enhanced3DGraphicsSystem.js
 * Advanced 3D graphics, models, animations, and visual effects
 * Creates amazing visuals for players, monsters, world, weather, and all game elements
 * ~700 lines
 */

import * as THREE from 'three';

export class Enhanced3DGraphicsSystem {
    constructor(scene, renderer, camera) {
        this.scene = scene;
        this.renderer = renderer;
        this.camera = camera;
        
        // Graphics settings
        this.settings = {
            quality: 'ultra', // low, medium, high, ultra
            shadows: true,
            postProcessing: true,
            particleQuality: 'high',
            textureQuality: 'high',
            modelDetail: 'high',
            animationSmoothing: true
        };
        
        // Model library
        this.modelCache = new Map();
        this.materialCache = new Map();
        this.animationMixers = [];
        
        // Enhanced lighting system
        this.lights = {
            ambient: null,
            directional: [],
            point: [],
            spot: [],
            hemisphere: null
        };
        
        // Particle systems
        this.particleSystems = [];
        
        // Post-processing effects
        this.postProcessing = {
            bloom: true,
            dof: false, // depth of field
            motionBlur: false,
            ssao: false, // screen space ambient occlusion
            colorGrading: true
        };
        
        logger.info('🎨 Enhanced3DGraphicsSystem initialized');
    }
    
    /**
     * Initialize advanced graphics
     */
    init() {
        this.setupRenderer();
        this.setupLighting();
        this.setupShadows();
        this.setupPostProcessing();
        
        logger.info('✨ Advanced 3D graphics initialized');
    }
    
    /**
     * Setup enhanced renderer
     */
    setupRenderer() {
        // Enable advanced renderer features
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0;
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.physicallyCorrectLights = true;
        
        // Enable anti-aliasing
        if (this.settings.quality === 'ultra' || this.settings.quality === 'high') {
            this.renderer.antialias = true;
        }
    }
    
    /**
     * Setup advanced lighting
     */
    setupLighting() {
        // Hemisphere light for natural ambient
        this.lights.hemisphere = new THREE.HemisphereLight(0x87ceeb, 0x8b6f47, 0.6);
        this.scene.add(this.lights.hemisphere);
        
        // Main directional light (sun)
        const sunLight = new THREE.DirectionalLight(0xfff5e6, 1.2);
        sunLight.position.set(50, 100, 50);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 4096;
        sunLight.shadow.mapSize.height = 4096;
        sunLight.shadow.camera.near = 0.5;
        sunLight.shadow.camera.far = 500;
        sunLight.shadow.camera.left = -100;
        sunLight.shadow.camera.right = 100;
        sunLight.shadow.camera.top = 100;
        sunLight.shadow.camera.bottom = -100;
        sunLight.shadow.bias = -0.0001;
        this.lights.directional.push(sunLight);
        this.scene.add(sunLight);
        
        // Rim light for character definition
        const rimLight = new THREE.DirectionalLight(0x9d4edd, 0.4);
        rimLight.position.set(-50, 50, -50);
        this.lights.directional.push(rimLight);
        this.scene.add(rimLight);
        
        // Dynamic point lights for atmosphere
        for (let i = 0; i < 5; i++) {
            const light = new THREE.PointLight(0x9d4edd, 0.8, 30);
            light.position.set(
                Math.random() * 40 - 20,
                Math.random() * 10 + 5,
                Math.random() * 40 - 20
            );
            this.lights.point.push(light);
            this.scene.add(light);
        }
    }
    
    /**
     * Setup shadow system
     */
    setupShadows() {
        if (!this.settings.shadows) return;
        
        // Enable shadows for all directional lights
        this.lights.directional.forEach(light => {
            light.castShadow = true;
        });
    }
    
    /**
     * Setup post-processing
     */
    setupPostProcessing() {
        if (!this.settings.postProcessing) return;
        
        // This would integrate with EffectComposer for advanced effects
        // For now, we'll enable tone mapping and color grading
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
    }
    
    /**
     * Create advanced player model
     */
    createPlayerModel(playerClass) {
        const model = new THREE.Group();
        
        // Create detailed player mesh with materials
        const bodyGeometry = new THREE.CapsuleGeometry(0.5, 1.5, 16, 32);
        const bodyMaterial = this.createAdvancedMaterial({
            color: 0x4a90e2,
            metalness: 0.3,
            roughness: 0.4,
            emissive: 0x1a3a5a,
            emissiveIntensity: 0.2
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.castShadow = true;
        body.receiveShadow = true;
        model.add(body);
        
        // Add glowing outline effect
        const outlineGeometry = new THREE.CapsuleGeometry(0.52, 1.52, 16, 32);
        const outlineMaterial = new THREE.MeshBasicMaterial({
            color: 0x9d4edd,
            side: THREE.BackSide,
            transparent: true,
            opacity: 0.3
        });
        const outline = new THREE.Mesh(outlineGeometry, outlineMaterial);
        model.add(outline);
        
        // Add particle effect trail
        this.addCharacterParticles(model);
        
        // Add class-specific visual effects
        this.addClassEffects(model, playerClass);
        
        model.userData.type = 'player';
        model.userData.class = playerClass;
        
        return model;
    }
    
    /**
     * Create advanced enemy model
     */
    createEnemyModel(enemyType, level) {
        const model = new THREE.Group();
        
        // Base enemy geometry with detail
        const geometry = this.getEnemyGeometry(enemyType);
        const material = this.createAdvancedMaterial({
            color: this.getEnemyColor(enemyType),
            metalness: 0.5,
            roughness: 0.3,
            emissive: this.getEnemyColor(enemyType),
            emissiveIntensity: 0.3
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        model.add(mesh);
        
        // Add level-scaled size
        const scale = 1 + (level * 0.05);
        model.scale.setScalar(scale);
        
        // Add threatening aura for high-level enemies
        if (level > 10) {
            this.addEnemyAura(model, level);
        }
        
        // Add animated features
        this.addEnemyAnimations(model, enemyType);
        
        model.userData.type = 'enemy';
        model.userData.enemyType = enemyType;
        model.userData.level = level;
        
        return model;
    }
    
    /**
     * Get enemy geometry based on type
     */
    getEnemyGeometry(enemyType) {
        const geometries = {
            wraith: new THREE.ConeGeometry(0.6, 2, 8),
            golem: new THREE.BoxGeometry(1.5, 2, 1),
            dragon: new THREE.SphereGeometry(1, 16, 16),
            demon: new THREE.IcosahedronGeometry(0.8, 1),
            elemental: new THREE.OctahedronGeometry(0.7),
            default: new THREE.SphereGeometry(0.7, 16, 16)
        };
        
        return geometries[enemyType.toLowerCase()] || geometries.default;
    }
    
    /**
     * Get enemy color based on type
     */
    getEnemyColor(enemyType) {
        const colors = {
            shadow: 0x2d004d,
            flame: 0xff4500,
            frost: 0x00ffff,
            toxic: 0x00ff00,
            void: 0x1a0033,
            default: 0x8b0000
        };
        
        return colors[enemyType.toLowerCase()] || colors.default;
    }
    
    /**
     * Create advanced material with PBR
     */
    createAdvancedMaterial(options) {
        const material = new THREE.MeshStandardMaterial({
            color: options.color || 0xffffff,
            metalness: options.metalness || 0,
            roughness: options.roughness || 1,
            emissive: options.emissive || 0x000000,
            emissiveIntensity: options.emissiveIntensity || 0
        });
        
        // Enable environment mapping for reflections
        if (this.settings.quality === 'ultra') {
            material.envMapIntensity = 1.0;
        }
        
        return material;
    }
    
    /**
     * Add character particle effects
     */
    addCharacterParticles(model) {
        const particleCount = 50;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 2;
            positions[i + 1] = Math.random() * 2;
            positions[i + 2] = (Math.random() - 0.5) * 2;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const material = new THREE.PointsMaterial({
            color: 0x9d4edd,
            size: 0.05,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });
        
        const particles = new THREE.Points(geometry, material);
        particles.userData.isParticleEffect = true;
        model.add(particles);
    }
    
    /**
     * Add class-specific effects
     */
    addClassEffects(model, playerClass) {
        // Different visual effects per class
        const effects = {
            warrior: { color: 0xff0000, intensity: 0.5 },
            mage: { color: 0x0099ff, intensity: 0.8 },
            rogue: { color: 0x9d4edd, intensity: 0.4 },
            default: { color: 0xffffff, intensity: 0.3 }
        };
        
        const effect = effects[playerClass] || effects.default;
        
        // Add glowing aura
        const auraGeometry = new THREE.SphereGeometry(0.7, 16, 16);
        const auraMaterial = new THREE.MeshBasicMaterial({
            color: effect.color,
            transparent: true,
            opacity: 0.2,
            blending: THREE.AdditiveBlending
        });
        const aura = new THREE.Mesh(auraGeometry, auraMaterial);
        aura.userData.isAura = true;
        model.add(aura);
    }
    
    /**
     * Add enemy aura
     */
    addEnemyAura(model, level) {
        const intensity = Math.min(level / 50, 1);
        const auraGeometry = new THREE.SphereGeometry(1.5, 16, 16);
        const auraMaterial = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            transparent: true,
            opacity: 0.1 + intensity * 0.2,
            blending: THREE.AdditiveBlending
        });
        const aura = new THREE.Mesh(auraGeometry, auraMaterial);
        aura.userData.isAura = true;
        model.add(aura);
    }
    
    /**
     * Add enemy animations
     */
    addEnemyAnimations(model, enemyType) {
        // Store animation data
        model.userData.animations = {
            idle: { type: 'float', speed: 0.5 },
            attack: { type: 'lunge', speed: 2 },
            hurt: { type: 'shake', speed: 5 }
        };
    }
    
    /**
     * Create advanced world terrain
     */
    createTerrainMesh(size, detail) {
        const geometry = new THREE.PlaneGeometry(size, size, detail, detail);
        
        // Generate height map
        const vertices = geometry.attributes.position.array;
        for (let i = 0; i < vertices.length; i += 3) {
            const x = vertices[i];
            const z = vertices[i + 1];
            vertices[i + 2] = Math.sin(x * 0.1) * Math.cos(z * 0.1) * 2;
        }
        geometry.computeVertexNormals();
        
        const material = this.createAdvancedMaterial({
            color: 0x2d5016,
            metalness: 0,
            roughness: 0.9
        });
        
        const terrain = new THREE.Mesh(geometry, material);
        terrain.rotation.x = -Math.PI / 2;
        terrain.receiveShadow = true;
        terrain.userData.type = 'terrain';
        
        return terrain;
    }
    
    /**
     * Create weather effects
     */
    createWeatherEffect(weatherType) {
        const particleCount = 1000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 50;
            positions[i + 1] = Math.random() * 50;
            positions[i + 2] = (Math.random() - 0.5) * 50;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const material = new THREE.PointsMaterial({
            color: this.getWeatherColor(weatherType),
            size: 0.2,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });
        
        const weather = new THREE.Points(geometry, material);
        weather.userData.weatherType = weatherType;
        weather.userData.isWeather = true;
        
        return weather;
    }
    
    /**
     * Get weather effect color
     */
    getWeatherColor(weatherType) {
        const colors = {
            rain: 0x88ccff,
            snow: 0xffffff,
            fire: 0xff4500,
            ash: 0x333333,
            leaves: 0x7fb069,
            default: 0xffffff
        };
        
        return colors[weatherType] || colors.default;
    }
    
    /**
     * Create item model with visual quality
     */
    createItemModel(itemData) {
        const model = new THREE.Group();
        
        // Base item mesh
        const geometry = new THREE.IcosahedronGeometry(0.3, 2);
        const material = this.createAdvancedMaterial({
            color: this.getRarityColor(itemData.rarity),
            metalness: 0.8,
            roughness: 0.2,
            emissive: this.getRarityColor(itemData.rarity),
            emissiveIntensity: 0.5
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        model.add(mesh);
        
        // Add glow effect based on rarity
        if (itemData.rarity === 'legendary' || itemData.rarity === 'epic') {
            this.addItemGlow(model, itemData.rarity);
        }
        
        // Rotate slowly
        model.userData.rotationSpeed = 0.5;
        
        return model;
    }
    
    /**
     * Get rarity color
     */
    getRarityColor(rarity) {
        const colors = {
            common: 0xcccccc,
            uncommon: 0x00ff00,
            rare: 0x0099ff,
            epic: 0x9d4edd,
            legendary: 0xffaa00
        };
        
        return colors[rarity] || colors.common;
    }
    
    /**
     * Add item glow effect
     */
    addItemGlow(model, rarity) {
        const glowGeometry = new THREE.SphereGeometry(0.5, 16, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: this.getRarityColor(rarity),
            transparent: true,
            opacity: 0.3,
            blending: THREE.AdditiveBlending
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.userData.isGlow = true;
        model.add(glow);
    }
    
    /**
     * Create power/ability visual effect
     */
    createAbilityEffect(abilityType, position) {
        const effect = new THREE.Group();
        
        // Create particle burst
        const particleCount = 100;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const velocities = [];
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            positions[i3] = position.x;
            positions[i3 + 1] = position.y;
            positions[i3 + 2] = position.z;
            
            velocities.push({
                x: (Math.random() - 0.5) * 2,
                y: Math.random() * 2,
                z: (Math.random() - 0.5) * 2
            });
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const material = new THREE.PointsMaterial({
            color: this.getAbilityColor(abilityType),
            size: 0.3,
            transparent: true,
            opacity: 1,
            blending: THREE.AdditiveBlending
        });
        
        const particles = new THREE.Points(geometry, material);
        particles.userData.velocities = velocities;
        particles.userData.isAbilityEffect = true;
        particles.userData.lifetime = 2000; // 2 seconds
        particles.userData.createdAt = Date.now();
        
        effect.add(particles);
        this.particleSystems.push(particles);
        
        return effect;
    }
    
    /**
     * Get ability effect color
     */
    getAbilityColor(abilityType) {
        const colors = {
            fire: 0xff4500,
            ice: 0x00ffff,
            lightning: 0xffff00,
            shadow: 0x9d4edd,
            holy: 0xffffff,
            default: 0x9d4edd
        };
        
        return colors[abilityType] || colors.default;
    }
    
    /**
     * Update animations and effects
     */
    update(deltaTime) {
        // Update particle systems
        for (let i = this.particleSystems.length - 1; i >= 0; i--) {
            const particles = this.particleSystems[i];
            
            if (particles.userData.isAbilityEffect) {
                const age = Date.now() - particles.userData.createdAt;
                if (age > particles.userData.lifetime) {
                    this.scene.remove(particles);
                    this.particleSystems.splice(i, 1);
                    continue;
                }
                
                // Update particle positions
                const positions = particles.geometry.attributes.position.array;
                const velocities = particles.userData.velocities;
                
                for (let j = 0; j < velocities.length; j++) {
                    const j3 = j * 3;
                    positions[j3] += velocities[j].x * deltaTime * 0.01;
                    positions[j3 + 1] += velocities[j].y * deltaTime * 0.01;
                    positions[j3 + 2] += velocities[j].z * deltaTime * 0.01;
                }
                
                particles.geometry.attributes.position.needsUpdate = true;
                
                // Fade out
                const opacity = 1 - (age / particles.userData.lifetime);
                particles.material.opacity = opacity;
            }
        }
        
        // Update dynamic lights
        this.lights.point.forEach((light, index) => {
            const time = Date.now() * 0.001;
            light.intensity = 0.5 + Math.sin(time + index) * 0.3;
        });
        
        // Rotate items
        this.scene.traverse((object) => {
            if (object.userData.rotationSpeed) {
                object.rotation.y += object.userData.rotationSpeed * deltaTime * 0.01;
            }
            
            // Animate auras
            if (object.userData.isAura) {
                const scale = 1 + Math.sin(Date.now() * 0.002) * 0.1;
                object.scale.setScalar(scale);
            }
        });
    }
    
    /**
     * Adjust graphics quality
     */
    setQuality(quality) {
        this.settings.quality = quality;
        
        // Adjust settings based on quality
        switch (quality) {
            case 'low':
                this.settings.shadows = false;
                this.settings.postProcessing = false;
                this.settings.particleQuality = 'low';
                break;
            case 'medium':
                this.settings.shadows = true;
                this.settings.postProcessing = false;
                this.settings.particleQuality = 'medium';
                break;
            case 'high':
                this.settings.shadows = true;
                this.settings.postProcessing = true;
                this.settings.particleQuality = 'high';
                break;
            case 'ultra':
                this.settings.shadows = true;
                this.settings.postProcessing = true;
                this.settings.particleQuality = 'ultra';
                break;
        }
        
        this.applyQualitySettings();
    }
    
    /**
     * Apply quality settings
     */
    applyQualitySettings() {
        // Update renderer
        this.setupRenderer();
        
        // Update shadows
        this.lights.directional.forEach(light => {
            light.castShadow = this.settings.shadows;
        });
        
        logger.info(`🎨 Graphics quality set to: ${this.settings.quality}`);
    }
}
