/**
 * ModelLoaderSystem - 3D Model Loading & Management
 * 
 * Loads 3D models from external FREE sources:
 * - Mixamo (characters, animations)
 * - Quaternius (enemies, environment)
 * - Sketchfab Free (bosses, special models)
 * - Poly Pizza (props, items)
 * 
 * Supports GLTF, GLB, FBX formats with materials and textures.
 */

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

export class ModelLoaderSystem {
    constructor() {
        // Loaders
        this.gltfLoader = new GLTFLoader();
        this.fbxLoader = new FBXLoader();
        this.textureLoader = new THREE.TextureLoader();
        
        // Cache
        this.modelCache = new Map();
        this.textureCache = new Map();
        this.animationCache = new Map();
        
        // Loading queue
        this.loadQueue = [];
        this.isLoading = false;
        this.maxConcurrent = 3;
        this.currentLoading = 0;
        
        // Statistics
        this.stats = {
            modelsLoaded: 0,
            texturesLoaded: 0,
            animationsLoaded: 0,
            cacheHits: 0,
            cacheMisses: 0,
            totalLoadTime: 0
        };
        
        // Asset manifest (maps game objects to file paths)
        this.manifest = {
            characters: {
                // Player classes (Mixamo)
                warrior: '/assets/models/characters/player/warrior.glb',
                mage: '/assets/models/characters/player/mage.glb',
                rogue: '/assets/models/characters/player/rogue.glb',
                ranger: '/assets/models/characters/player/ranger.glb',
                paladin: '/assets/models/characters/player/paladin.glb',
                necromancer: '/assets/models/characters/player/necromancer.glb',
                druid: '/assets/models/characters/player/druid.glb',
                bard: '/assets/models/characters/player/bard.glb',
                monk: '/assets/models/characters/player/monk.glb',
                warlock: '/assets/models/characters/player/warlock.glb'
            },
            companions: {
                // 4 Main companions (Mixamo)
                smoke_siren: '/assets/models/characters/companions/smoke_siren.glb',
                blunt_wizard: '/assets/models/characters/companions/blunt_wizard.glb',
                ember_guardian: '/assets/models/characters/companions/ember_guardian.glb',
                mystical_merchant: '/assets/models/characters/companions/mystical_merchant.glb'
            },
            enemies: {
                // Common enemies (Quaternius)
                goblin: '/assets/models/enemies/goblin.glb',
                orc: '/assets/models/enemies/orc.glb',
                skeleton: '/assets/models/enemies/skeleton.glb',
                zombie: '/assets/models/enemies/zombie.glb',
                wolf: '/assets/models/enemies/wolf.glb',
                spider: '/assets/models/enemies/spider.glb',
                slime: '/assets/models/enemies/slime.glb',
                bat: '/assets/models/enemies/bat.glb'
            },
            bosses: {
                // Boss models (Sketchfab Free)
                dragon_tyrant: '/assets/models/bosses/dragon_tyrant.glb',
                void_lord: '/assets/models/bosses/void_lord.glb',
                crystal_empress: '/assets/models/bosses/crystal_empress.glb',
                shadow_reaper: '/assets/models/bosses/shadow_reaper.glb',
                ancient_golem: '/assets/models/bosses/ancient_golem.glb',
                demon_king: '/assets/models/bosses/demon_king.glb',
                phoenix_eternal: '/assets/models/bosses/phoenix_eternal.glb',
                kraken_depths: '/assets/models/bosses/kraken_depths.glb'
            },
            weapons: {
                // Weapon models (Sketchfab Free)
                sword_iron: '/assets/models/weapons/swords/iron_sword.glb',
                sword_steel: '/assets/models/weapons/swords/steel_sword.glb',
                axe_battle: '/assets/models/weapons/axes/battle_axe.glb',
                bow_long: '/assets/models/weapons/bows/longbow.glb',
                staff_crystal: '/assets/models/weapons/staves/crystal_staff.glb'
            },
            environment: {
                // Environment props (Quaternius)
                tree_pine: '/assets/models/environment/trees/pine.glb',
                rock_large: '/assets/models/environment/rocks/large_rock.glb',
                building_house: '/assets/models/environment/buildings/house.glb',
                crystal: '/assets/models/environment/props/crystal.glb'
            }
        };
    }
    
    /**
     * Load player character model from Mixamo
     * @param {string} className - Class name (warrior, mage, etc.)
     * @returns {Promise<Object>} Model with animations
     */
    async loadPlayerCharacter(className) {
        const modelPath = this.manifest.characters[className];
        if (!modelPath) {
            console.warn(`Character ${className} not found in manifest`);
            return this.createPlaceholder('character');
        }
        
        // Check cache
        const cacheKey = `char_${className}`;
        if (this.modelCache.has(cacheKey)) {
            this.stats.cacheHits++;
            return this.modelCache.get(cacheKey).clone();
        }
        
        this.stats.cacheMisses++;
        const startTime = performance.now();
        
        try {
            const gltf = await this.loadGLTF(modelPath);
            const model = gltf.scene;
            const animations = gltf.animations || [];
            
            // Process model
            this.processModel(model);
            
            // Store in cache
            const cached = {
                model: model.clone(),
                animations: animations,
                className: className
            };
            this.modelCache.set(cacheKey, cached);
            
            this.stats.modelsLoaded++;
            this.stats.animationsLoaded += animations.length;
            this.stats.totalLoadTime += performance.now() - startTime;
            
            return {
                model: model,
                animations: animations
            };
        } catch (error) {
            console.warn(`Failed to load character ${className}:`, error);
            return this.createPlaceholder('character');
        }
    }
    
    /**
     * Load companion model from Mixamo
     */
    async loadCompanion(companionId) {
        const modelPath = this.manifest.companions[companionId];
        if (!modelPath) {
            return this.createPlaceholder('companion');
        }
        
        const cacheKey = `comp_${companionId}`;
        if (this.modelCache.has(cacheKey)) {
            this.stats.cacheHits++;
            return this.modelCache.get(cacheKey).clone();
        }
        
        try {
            const gltf = await this.loadGLTF(modelPath);
            const model = gltf.scene;
            this.processModel(model);
            
            this.modelCache.set(cacheKey, { model: model.clone(), animations: gltf.animations });
            this.stats.modelsLoaded++;
            
            return { model, animations: gltf.animations };
        } catch (error) {
            console.warn(`Failed to load companion ${companionId}:`, error);
            return this.createPlaceholder('companion');
        }
    }
    
    /**
     * Load enemy model from Quaternius
     */
    async loadEnemy(enemyType) {
        const modelPath = this.manifest.enemies[enemyType];
        if (!modelPath) {
            return this.createPlaceholder('enemy');
        }
        
        const cacheKey = `enemy_${enemyType}`;
        if (this.modelCache.has(cacheKey)) {
            this.stats.cacheHits++;
            return this.modelCache.get(cacheKey).model.clone();
        }
        
        try {
            const gltf = await this.loadGLTF(modelPath);
            const model = gltf.scene;
            this.processModel(model);
            
            this.modelCache.set(cacheKey, { model: model.clone(), animations: gltf.animations });
            this.stats.modelsLoaded++;
            
            return model;
        } catch (error) {
            console.warn(`Failed to load enemy ${enemyType}:`, error);
            return this.createPlaceholder('enemy');
        }
    }
    
    /**
     * Load boss model from Sketchfab Free
     */
    async loadBoss(bossId) {
        const modelPath = this.manifest.bosses[bossId];
        if (!modelPath) {
            return this.createPlaceholder('boss');
        }
        
        const cacheKey = `boss_${bossId}`;
        if (this.modelCache.has(cacheKey)) {
            this.stats.cacheHits++;
            return this.modelCache.get(cacheKey).model.clone();
        }
        
        try {
            const gltf = await this.loadGLTF(modelPath);
            const model = gltf.scene;
            this.processModel(model);
            
            // Bosses are usually larger
            model.scale.set(2, 2, 2);
            
            this.modelCache.set(cacheKey, { model: model.clone(), animations: gltf.animations });
            this.stats.modelsLoaded++;
            
            return model;
        } catch (error) {
            console.warn(`Failed to load boss ${bossId}:`, error);
            return this.createPlaceholder('boss', 2);
        }
    }
    
    /**
     * Load weapon model from Sketchfab Free
     */
    async loadWeapon(weaponId) {
        const modelPath = this.manifest.weapons[weaponId];
        if (!modelPath) {
            return this.createPlaceholder('weapon');
        }
        
        const cacheKey = `weapon_${weaponId}`;
        if (this.modelCache.has(cacheKey)) {
            this.stats.cacheHits++;
            return this.modelCache.get(cacheKey).clone();
        }
        
        try {
            const gltf = await this.loadGLTF(modelPath);
            const model = gltf.scene;
            this.processModel(model);
            
            this.modelCache.set(cacheKey, model.clone());
            this.stats.modelsLoaded++;
            
            return model;
        } catch (error) {
            console.warn(`Failed to load weapon ${weaponId}:`, error);
            return this.createPlaceholder('weapon');
        }
    }
    
    /**
     * Load environment model from Quaternius
     */
    async loadEnvironment(envType) {
        const modelPath = this.manifest.environment[envType];
        if (!modelPath) {
            return this.createPlaceholder('environment');
        }
        
        const cacheKey = `env_${envType}`;
        if (this.modelCache.has(cacheKey)) {
            this.stats.cacheHits++;
            return this.modelCache.get(cacheKey).clone();
        }
        
        try {
            const gltf = await this.loadGLTF(modelPath);
            const model = gltf.scene;
            this.processModel(model);
            
            this.modelCache.set(cacheKey, model.clone());
            this.stats.modelsLoaded++;
            
            return model;
        } catch (error) {
            console.warn(`Failed to load environment ${envType}:`, error);
            return this.createPlaceholder('environment');
        }
    }
    
    /**
     * Load GLTF model
     */
    loadGLTF(path) {
        return new Promise((resolve, reject) => {
            this.gltfLoader.load(
                path,
                (gltf) => resolve(gltf),
                (xhr) => {
                    // Progress callback
                    const percentComplete = (xhr.loaded / xhr.total) * 100;
                    // console.log(`Loading ${path}: ${percentComplete.toFixed(2)}%`);
                },
                (error) => reject(error)
            );
        });
    }
    
    /**
     * Load FBX model (for Mixamo if in FBX format)
     */
    loadFBX(path) {
        return new Promise((resolve, reject) => {
            this.fbxLoader.load(
                path,
                (fbx) => resolve(fbx),
                undefined,
                (error) => reject(error)
            );
        });
    }
    
    /**
     * Process model after loading
     */
    processModel(model) {
        // Enable shadows
        model.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                
                // Ensure materials are properly set up
                if (child.material) {
                    child.material.needsUpdate = true;
                    
                    // Fix for some models
                    if (child.material.map) {
                        child.material.map.encoding = THREE.sRGBEncoding;
                    }
                }
            }
        });
        
        // Center model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);
        
        return model;
    }
    
    /**
     * Create placeholder model when external asset not available
     */
    createPlaceholder(type, scale = 1) {
        let geometry, material;
        
        switch (type) {
            case 'character':
            case 'companion':
                // Capsule for humanoid
                geometry = new THREE.CapsuleGeometry(0.5, 1.5, 4, 8);
                material = new THREE.MeshStandardMaterial({ 
                    color: type === 'character' ? 0x4488ff : 0xff8844
                });
                break;
                
            case 'enemy':
                // Sphere for enemy
                geometry = new THREE.SphereGeometry(0.5, 16, 16);
                material = new THREE.MeshStandardMaterial({ color: 0xff4444 });
                break;
                
            case 'boss':
                // Large cube for boss
                geometry = new THREE.BoxGeometry(2, 3, 2);
                material = new THREE.MeshStandardMaterial({ color: 0x880000 });
                break;
                
            case 'weapon':
                // Cylinder for weapon
                geometry = new THREE.CylinderGeometry(0.1, 0.1, 1.5, 8);
                material = new THREE.MeshStandardMaterial({ color: 0x888888 });
                break;
                
            case 'environment':
                // Box for environment
                geometry = new THREE.BoxGeometry(1, 1, 1);
                material = new THREE.MeshStandardMaterial({ color: 0x44aa44 });
                break;
                
            default:
                geometry = new THREE.BoxGeometry(1, 1, 1);
                material = new THREE.MeshStandardMaterial({ color: 0xcccccc });
        }
        
        const mesh = new THREE.Mesh(geometry, material);
        mesh.scale.set(scale, scale, scale);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        
        // Add to placeholder group
        const group = new THREE.Group();
        group.add(mesh);
        
        console.log(`Created placeholder for ${type}`);
        return type === 'character' || type === 'companion' ? 
            { model: group, animations: [] } : group;
    }
    
    /**
     * Preload multiple models
     */
    async preload(modelList) {
        const promises = modelList.map(item => {
            switch (item.type) {
                case 'character':
                    return this.loadPlayerCharacter(item.id);
                case 'companion':
                    return this.loadCompanion(item.id);
                case 'enemy':
                    return this.loadEnemy(item.id);
                case 'boss':
                    return this.loadBoss(item.id);
                case 'weapon':
                    return this.loadWeapon(item.id);
                case 'environment':
                    return this.loadEnvironment(item.id);
                default:
                    return Promise.resolve(null);
            }
        });
        
        return Promise.all(promises);
    }
    
    /**
     * Clear cache
     */
    clearCache() {
        this.modelCache.clear();
        this.textureCache.clear();
        this.animationCache.clear();
    }
    
    /**
     * Get loading statistics
     */
    getStats() {
        return {
            ...this.stats,
            cacheSize: this.modelCache.size,
            cacheHitRate: this.stats.cacheHits / (this.stats.cacheHits + this.stats.cacheMisses),
            avgLoadTime: this.stats.totalLoadTime / this.stats.modelsLoaded
        };
    }
}
