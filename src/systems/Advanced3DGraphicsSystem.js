/**
import { logger } from '../core/Logger.js';
 * Advanced3DGraphicsSystem - Enhanced 3D rendering with post-processing
 * Transforms basic geometric shapes into realistic 3D models and effects
 */

import * as THREE from 'three';

export class Advanced3DGraphicsSystem {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.scene = gameEngine.scene;
        this.camera = gameEngine.camera;
        this.renderer = gameEngine.renderer;
        
        this.postProcessing = {
            enabled: true,
            bloom: true,
            dof: false,
            motionBlur: false
        };
        
        this.graphicsQuality = 'high'; // low, medium, high, ultra
        
        this.init();
    }
    
    init() {
        this.setupAdvancedLighting();
        this.setupShadows();
        this.setupFog();
        this.createSkybox();
        
        logger.info('🎮 Advanced 3D Graphics System initialized');
    }
    
    setupAdvancedLighting() {
        // Enhanced ambient light
        const ambientLight = new THREE.AmbientLight(0x404060, 0.5);
        this.scene.add(ambientLight);
        
        // Main directional light (sun/moon)
        const mainLight = new THREE.DirectionalLight(0xffffff, 1.0);
        mainLight.position.set(50, 100, 50);
        mainLight.castShadow = true;
        
        // High quality shadows
        mainLight.shadow.mapSize.width = 4096;
        mainLight.shadow.mapSize.height = 4096;
        mainLight.shadow.camera.near = 0.5;
        mainLight.shadow.camera.far = 500;
        mainLight.shadow.camera.left = -100;
        mainLight.shadow.camera.right = 100;
        mainLight.shadow.camera.top = 100;
        mainLight.shadow.camera.bottom = -100;
        mainLight.shadow.bias = -0.0001;
        mainLight.shadow.radius = 2; // Soft shadows
        
        this.scene.add(mainLight);
        this.mainLight = mainLight;
        
        // Hemisphere light for more natural lighting
        const hemiLight = new THREE.HemisphereLight(0x4488ff, 0x223344, 0.4);
        this.scene.add(hemiLight);
        
        // Add rim lighting
        const rimLight = new THREE.DirectionalLight(0x6699ff, 0.5);
        rimLight.position.set(-50, 50, -50);
        this.scene.add(rimLight);
    }
    
    setupShadows() {
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Soft shadows
        
        // Enable additional renderer features - Updated for Three.js r160+
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0;
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    }
    
    setupFog() {
        // Atmospheric fog - DISABLED for better visibility
        // const fogColor = new THREE.Color(0x1a2847);
        // this.scene.fog = new THREE.FogExp2(fogColor, 0.015);
        // KEEP SKY BLUE BACKGROUND FOR VISIBILITY
        // this.scene.background = fogColor;
        logger.info('⚠️ Fog disabled for better 3D world visibility');
    }
    
    createSkybox() {
        // Skybox DISABLED for better visibility - was blocking 3D world view
        logger.info('⚠️ Skybox disabled for better 3D world visibility');
        // The original dark skybox was preventing players from seeing the 3D world
        // Keeping scene.background = sky blue (set in GameEngine.js) for visibility
    }
    
    createEnhancedPlayerModel(player) {
        // Replace basic player model with enhanced version
        if (player.mesh) {
            this.scene.remove(player.mesh);
        }
        
        // Create player group
        const playerGroup = new THREE.Group();
        
        // Body - capsule shape
        const bodyGeometry = new THREE.CapsuleGeometry(0.5, 1.5, 8, 16);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0x4a90e2,
            metalness: 0.3,
            roughness: 0.7,
            emissive: 0x1a3a5a,
            emissiveIntensity: 0.2
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.castShadow = true;
        body.receiveShadow = true;
        playerGroup.add(body);
        
        // Head
        const headGeometry = new THREE.SphereGeometry(0.4, 16, 16);
        const headMaterial = new THREE.MeshStandardMaterial({
            color: 0xffdbac,
            metalness: 0.1,
            roughness: 0.8
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 1.5;
        head.castShadow = true;
        playerGroup.add(head);
        
        // Eyes glow
        const eyeGlow1 = this.createEyeGlow();
        eyeGlow1.position.set(0.15, 1.55, 0.35);
        playerGroup.add(eyeGlow1);
        
        const eyeGlow2 = this.createEyeGlow();
        eyeGlow2.position.set(-0.15, 1.55, 0.35);
        playerGroup.add(eyeGlow2);
        
        // Weapon - glowing sword
        const weapon = this.createEnhancedWeapon();
        weapon.position.set(0.6, 0.5, 0);
        weapon.rotation.z = -Math.PI / 4;
        playerGroup.add(weapon);
        
        // Particle aura
        this.addPlayerAura(playerGroup);
        
        player.mesh = playerGroup;
        this.scene.add(playerGroup);
        
        return playerGroup;
    }
    
    createEyeGlow() {
        const eyeGeometry = new THREE.SphereGeometry(0.08, 8, 8);
        const eyeMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ffff,
            transparent: true,
            opacity: 0.9
        });
        const eye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        
        // Add point light for glow
        const eyeLight = new THREE.PointLight(0x00ffff, 0.5, 2);
        eye.add(eyeLight);
        
        return eye;
    }
    
    createEnhancedWeapon() {
        const weaponGroup = new THREE.Group();
        
        // Blade
        const bladeGeometry = new THREE.BoxGeometry(0.1, 1.5, 0.02);
        const bladeMaterial = new THREE.MeshStandardMaterial({
            color: 0xc0c0c0,
            metalness: 0.9,
            roughness: 0.1,
            emissive: 0x4488ff,
            emissiveIntensity: 0.3
        });
        const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
        blade.position.y = 0.75;
        blade.castShadow = true;
        weaponGroup.add(blade);
        
        // Hilt
        const hiltGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.4, 8);
        const hiltMaterial = new THREE.MeshStandardMaterial({
            color: 0x8b4513,
            metalness: 0.6,
            roughness: 0.4
        });
        const hilt = new THREE.Mesh(hiltGeometry, hiltMaterial);
        hilt.castShadow = true;
        weaponGroup.add(hilt);
        
        // Guard
        const guardGeometry = new THREE.BoxGeometry(0.4, 0.05, 0.1);
        const guardMaterial = new THREE.MeshStandardMaterial({
            color: 0xd4af37,
            metalness: 0.8,
            roughness: 0.2
        });
        const guard = new THREE.Mesh(guardGeometry, guardMaterial);
        guard.position.y = 0.2;
        guard.castShadow = true;
        weaponGroup.add(guard);
        
        return weaponGroup;
    }
    
    addPlayerAura(playerGroup) {
        // Create magical aura particles
        const particleCount = 20;
        const particles = new THREE.Group();
        
        for (let i = 0; i < particleCount; i++) {
            const particleGeometry = new THREE.SphereGeometry(0.05, 4, 4);
            const particleMaterial = new THREE.MeshBasicMaterial({
                color: 0x4488ff,
                transparent: true,
                opacity: 0.6
            });
            const particle = new THREE.Mesh(particleGeometry, particleMaterial);
            
            // Random position around player
            const angle = (i / particleCount) * Math.PI * 2;
            const radius = 0.8;
            particle.position.set(
                Math.cos(angle) * radius,
                Math.random() * 2,
                Math.sin(angle) * radius
            );
            
            particle.userData.angle = angle;
            particle.userData.speed = 1 + Math.random();
            particle.userData.radius = radius;
            
            particles.add(particle);
        }
        
        playerGroup.add(particles);
        playerGroup.userData.auraParticles = particles;
    }
    
    createEnhancedEnemy(enemy, type = 'default') {
        const enemyGroup = new THREE.Group();
        
        switch(type) {
            case 'demon':
                this.createDemonModel(enemyGroup);
                break;
            case 'dragon':
                this.createDragonModel(enemyGroup);
                break;
            case 'succubus':
                this.createSuccubusModel(enemyGroup);
                break;
            default:
                this.createDefaultEnemyModel(enemyGroup);
        }
        
        return enemyGroup;
    }
    
    createDemonModel(group) {
        // Demonic body
        const bodyGeometry = new THREE.CapsuleGeometry(0.6, 1.2, 8, 16);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0x8b0000,
            metalness: 0.4,
            roughness: 0.6,
            emissive: 0xff0000,
            emissiveIntensity: 0.3
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.castShadow = true;
        group.add(body);
        
        // Horns
        const hornGeometry = new THREE.ConeGeometry(0.15, 0.6, 8);
        const hornMaterial = new THREE.MeshStandardMaterial({
            color: 0x2f1f1f,
            metalness: 0.7,
            roughness: 0.3
        });
        
        const horn1 = new THREE.Mesh(hornGeometry, hornMaterial);
        horn1.position.set(0.3, 1.2, 0);
        horn1.rotation.z = -Math.PI / 6;
        horn1.castShadow = true;
        group.add(horn1);
        
        const horn2 = new THREE.Mesh(hornGeometry, hornMaterial);
        horn2.position.set(-0.3, 1.2, 0);
        horn2.rotation.z = Math.PI / 6;
        horn2.castShadow = true;
        group.add(horn2);
        
        // Fire aura
        const fireLight = new THREE.PointLight(0xff4500, 1, 5);
        fireLight.position.y = 0.5;
        group.add(fireLight);
    }
    
    createDragonModel(group) {
        // Simplified dragon body
        const bodyGeometry = new THREE.CylinderGeometry(0.6, 0.8, 2, 8);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0x2e8b57,
            metalness: 0.5,
            roughness: 0.5,
            emissive: 0x00ff00,
            emissiveIntensity: 0.2
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.rotation.x = Math.PI / 2;
        body.castShadow = true;
        group.add(body);
        
        // Head
        const headGeometry = new THREE.SphereGeometry(0.5, 12, 12);
        const head = new THREE.Mesh(headGeometry, bodyMaterial);
        head.position.set(0, 0, 1.5);
        head.scale.set(1, 0.8, 1.2);
        head.castShadow = true;
        group.add(head);
        
        // Wings
        const wingGeometry = new THREE.PlaneGeometry(1.5, 1);
        const wingMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a4d2e,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.8
        });
        
        const wing1 = new THREE.Mesh(wingGeometry, wingMaterial);
        wing1.position.set(1, 0.5, 0);
        wing1.rotation.y = Math.PI / 4;
        group.add(wing1);
        
        const wing2 = new THREE.Mesh(wingGeometry, wingMaterial);
        wing2.position.set(-1, 0.5, 0);
        wing2.rotation.y = -Math.PI / 4;
        group.add(wing2);
    }
    
    createSuccubusModel(group) {
        // Seductive humanoid form
        const bodyGeometry = new THREE.CapsuleGeometry(0.4, 1.6, 12, 16);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0xff69b4,
            metalness: 0.3,
            roughness: 0.6,
            emissive: 0xc71585,
            emissiveIntensity: 0.3
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.castShadow = true;
        group.add(body);
        
        // Head with elegant shape
        const headGeometry = new THREE.SphereGeometry(0.35, 16, 16);
        const headMaterial = new THREE.MeshStandardMaterial({
            color: 0xffb6c1,
            metalness: 0.2,
            roughness: 0.7
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 1.5;
        head.castShadow = true;
        group.add(head);
        
        // Glowing eyes
        const eyeGlow1 = new THREE.Mesh(
            new THREE.SphereGeometry(0.08, 8, 8),
            new THREE.MeshBasicMaterial({ color: 0xff1493 })
        );
        eyeGlow1.position.set(0.15, 1.55, 0.3);
        group.add(eyeGlow1);
        
        const eyeGlow2 = eyeGlow1.clone();
        eyeGlow2.position.set(-0.15, 1.55, 0.3);
        group.add(eyeGlow2);
        
        // Wings (bat-like, seductive)
        const wingGeometry = new THREE.PlaneGeometry(1, 1.2);
        const wingMaterial = new THREE.MeshStandardMaterial({
            color: 0x800020,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.7,
            emissive: 0xff1493,
            emissiveIntensity: 0.2
        });
        
        const wing1 = new THREE.Mesh(wingGeometry, wingMaterial);
        wing1.position.set(0.6, 0.8, -0.2);
        wing1.rotation.y = Math.PI / 6;
        group.add(wing1);
        
        const wing2 = new THREE.Mesh(wingGeometry, wingMaterial);
        wing2.position.set(-0.6, 0.8, -0.2);
        wing2.rotation.y = -Math.PI / 6;
        group.add(wing2);
        
        // Charm aura
        const charmLight = new THREE.PointLight(0xff69b4, 0.8, 5);
        charmLight.position.y = 0.5;
        group.add(charmLight);
    }
    
    createDefaultEnemyModel(group) {
        const bodyGeometry = new THREE.CapsuleGeometry(0.5, 1, 8, 16);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0xff4444,
            metalness: 0.3,
            roughness: 0.7
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.castShadow = true;
        group.add(body);
    }
    
    createEnhancedEnvironment(dungeon) {
        // Add environmental details based on dungeon type
        const details = [];
        
        switch(dungeon.theme) {
            case 'crystal_cavern':
                details.push(...this.createCrystalEnvironment());
                break;
            case 'infernal':
                details.push(...this.createInfernalEnvironment());
                break;
            case 'nature':
                details.push(...this.createNatureEnvironment());
                break;
        }
        
        details.forEach(obj => this.scene.add(obj));
        return details;
    }
    
    createCrystalEnvironment() {
        const crystals = [];
        
        for (let i = 0; i < 20; i++) {
            const size = 0.5 + Math.random() * 2;
            const crystalGeometry = new THREE.ConeGeometry(size * 0.3, size, 6);
            const crystalMaterial = new THREE.MeshStandardMaterial({
                color: 0x00ffff,
                metalness: 0.9,
                roughness: 0.1,
                emissive: 0x0088ff,
                emissiveIntensity: 0.5,
                transparent: true,
                opacity: 0.8
            });
            
            const crystal = new THREE.Mesh(crystalGeometry, crystalMaterial);
            crystal.position.set(
                (Math.random() - 0.5) * 40,
                size / 2,
                (Math.random() - 0.5) * 40
            );
            crystal.rotation.z = (Math.random() - 0.5) * 0.5;
            crystal.castShadow = true;
            
            // Add glow
            const light = new THREE.PointLight(0x00ffff, 0.5, 5);
            light.position.copy(crystal.position);
            light.position.y += size / 2;
            this.scene.add(light);
            
            crystals.push(crystal);
        }
        
        return crystals;
    }
    
    createInfernalEnvironment() {
        const objects = [];
        
        // Lava pools
        for (let i = 0; i < 10; i++) {
            const poolGeometry = new THREE.CircleGeometry(2 + Math.random() * 2, 32);
            const poolMaterial = new THREE.MeshStandardMaterial({
                color: 0xff4500,
                emissive: 0xff0000,
                emissiveIntensity: 0.8
            });
            
            const pool = new THREE.Mesh(poolGeometry, poolMaterial);
            pool.rotation.x = -Math.PI / 2;
            pool.position.set(
                (Math.random() - 0.5) * 40,
                0.01,
                (Math.random() - 0.5) * 40
            );
            
            // Add orange glow
            const light = new THREE.PointLight(0xff4500, 2, 10);
            light.position.copy(pool.position);
            light.position.y = 1;
            this.scene.add(light);
            
            objects.push(pool);
        }
        
        return objects;
    }
    
    createNatureEnvironment() {
        const objects = [];
        
        // Trees
        for (let i = 0; i < 15; i++) {
            const tree = new THREE.Group();
            
            // Trunk
            const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.4, 4, 8);
            const trunkMaterial = new THREE.MeshStandardMaterial({
                color: 0x8b4513,
                roughness: 0.9
            });
            const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
            trunk.position.y = 2;
            trunk.castShadow = true;
            tree.add(trunk);
            
            // Foliage
            const foliageGeometry = new THREE.SphereGeometry(2, 8, 8);
            const foliageMaterial = new THREE.MeshStandardMaterial({
                color: 0x228b22,
                roughness: 0.8
            });
            const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
            foliage.position.y = 5;
            foliage.castShadow = true;
            tree.add(foliage);
            
            tree.position.set(
                (Math.random() - 0.5) * 40,
                0,
                (Math.random() - 0.5) * 40
            );
            
            objects.push(tree);
        }
        
        return objects;
    }
    
    update(deltaTime) {
        // Animate player aura particles
        if (this.gameEngine.player && this.gameEngine.player.mesh) {
            const auraParticles = this.gameEngine.player.mesh.userData.auraParticles;
            if (auraParticles) {
                auraParticles.children.forEach(particle => {
                    particle.userData.angle += deltaTime * particle.userData.speed;
                    particle.position.x = Math.cos(particle.userData.angle) * particle.userData.radius;
                    particle.position.z = Math.sin(particle.userData.angle) * particle.userData.radius;
                    particle.position.y += Math.sin(particle.userData.angle * 2) * 0.01;
                });
            }
        }
        
        // Animate day/night cycle (slowly)
        const timeOfDay = (Date.now() * 0.00001) % (Math.PI * 2);
        if (this.mainLight) {
            const sunPosition = new THREE.Vector3(
                Math.cos(timeOfDay) * 50,
                Math.sin(timeOfDay) * 100 + 20,
                50
            );
            this.mainLight.position.copy(sunPosition);
            
            // Adjust intensity based on time
            const intensity = Math.max(0.3, Math.sin(timeOfDay));
            this.mainLight.intensity = intensity;
        }
    }
    
    setGraphicsQuality(quality) {
        this.graphicsQuality = quality;
        
        const settings = {
            low: {
                shadowMapSize: 1024,
                shadowRadius: 0,
                particleCount: 10,
                postProcessing: false
            },
            medium: {
                shadowMapSize: 2048,
                shadowRadius: 1,
                particleCount: 20,
                postProcessing: false
            },
            high: {
                shadowMapSize: 4096,
                shadowRadius: 2,
                particleCount: 50,
                postProcessing: true
            },
            ultra: {
                shadowMapSize: 8192,
                shadowRadius: 3,
                particleCount: 100,
                postProcessing: true
            }
        };
        
        const config = settings[quality];
        
        // Apply shadow settings
        if (this.mainLight) {
            this.mainLight.shadow.mapSize.width = config.shadowMapSize;
            this.mainLight.shadow.mapSize.height = config.shadowMapSize;
            this.mainLight.shadow.radius = config.shadowRadius;
        }
        
        this.postProcessing.enabled = config.postProcessing;
        
        logger.info(`🎮 Graphics quality set to: ${quality}`);
    }
}
