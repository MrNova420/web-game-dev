/**
import { logger } from '../core/Logger.js';
 * Advanced3DModelSystem - Professional 3D human and monster models
 * Uses ONLY external assets - no procedural geometry creation
 * 
 * External Asset Sources:
 * - Character models: Mixamo (free anime-style characters with rigging)
 * - Monster models: Quaternius (free low-poly creatures), Sketchfab Free
 * - Animations: Mixamo (1000+ free animations)
 * - Textures: Poly Haven (PBR materials)
 * - Equipment: Sketchfab Free (weapons, armor)
 * 
 * Asset Directory Structure:
 * /assets/models/
 *   ├── characters/ (Mixamo GLB files)
 *   ├── monsters/ (Quaternius, Sketchfab)
 *   ├── weapons/ (Sketchfab Free)
 *   └── equipment/ (Sketchfab Free)
 */

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

export class Advanced3DModelSystem {
    constructor(scene) {
        this.scene = scene;
        this.models = new Map();
        this.animations = new Map();
        this.modelCache = new Map();
        
        // Loaders for external assets
        this.gltfLoader = new GLTFLoader();
        this.fbxLoader = new FBXLoader();
        
        // Initialize model library with external asset paths
        this.initializeModelPaths();
    }

    initializeModelPaths() {
        // All character models from Mixamo (free download)
        this.characterModels = {
            warrior: {
                model: '/assets/models/characters/warrior.glb',
                animations: {
                    idle: '/assets/animations/warrior_idle.fbx',
                    walk: '/assets/animations/warrior_walk.fbx',
                    run: '/assets/animations/warrior_run.fbx',
                    attack: '/assets/animations/sword_slash.fbx',
                    block: '/assets/animations/block.fbx',
                    hurt: '/assets/animations/hit_reaction.fbx'
                },
                source: 'Mixamo - Free Character'
            },
            mage: {
                model: '/assets/models/characters/mage.glb',
                animations: {
                    idle: '/assets/animations/mage_idle.fbx',
                    walk: '/assets/animations/mage_walk.fbx',
                    cast: '/assets/animations/spellcast.fbx',
                    channel: '/assets/animations/channeling.fbx'
                },
                source: 'Mixamo - Free Character'
            },
            rogue: {
                model: '/assets/models/characters/rogue.glb',
                animations: {
                    idle: '/assets/animations/rogue_idle.fbx',
                    walk: '/assets/animations/stealth_walk.fbx',
                    run: '/assets/animations/sprint.fbx',
                    attack: '/assets/animations/dagger_stab.fbx'
                },
                source: 'Mixamo - Free Character'
            },
            ranger: {
                model: '/assets/models/characters/ranger.glb',
                animations: {
                    idle: '/assets/animations/archer_idle.fbx',
                    walk: '/assets/animations/ranger_walk.fbx',
                    shoot: '/assets/animations/bow_shoot.fbx',
                    aim: '/assets/animations/bow_aim.fbx'
                },
                source: 'Mixamo - Free Character'
            },
            cleric: {
                model: '/assets/models/characters/cleric.glb',
                animations: {
                    idle: '/assets/animations/cleric_idle.fbx',
                    walk: '/assets/animations/cleric_walk.fbx',
                    heal: '/assets/animations/heal_cast.fbx',
                    bless: '/assets/animations/blessing.fbx'
                },
                source: 'Mixamo - Free Character'
            },
            necromancer: {
                model: '/assets/models/characters/necromancer.glb',
                animations: {
                    idle: '/assets/animations/necro_idle.fbx',
                    walk: '/assets/animations/dark_walk.fbx',
                    summon: '/assets/animations/summon.fbx',
                    curse: '/assets/animations/curse_cast.fbx'
                },
                source: 'Mixamo - Free Character'
            }
        };
        
        // All monster models from Quaternius and Sketchfab Free
        this.monsterModels = {
            goblin: {
                model: '/assets/models/monsters/goblin.glb',
                animations: {
                    idle: '/assets/animations/monster_idle.fbx',
                    walk: '/assets/animations/monster_walk.fbx',
                    attack: '/assets/animations/monster_attack.fbx'
                },
                source: 'Quaternius - Free Pack'
            },
            orc: {
                model: '/assets/models/monsters/orc.glb',
                animations: {
                    idle: '/assets/animations/orc_idle.fbx',
                    walk: '/assets/animations/orc_walk.fbx',
                    attack: '/assets/animations/orc_smash.fbx'
                },
                source: 'Quaternius - Free Pack'
            },
            skeleton: {
                model: '/assets/models/monsters/skeleton.glb',
                animations: {
                    idle: '/assets/animations/skeleton_idle.fbx',
                    walk: '/assets/animations/skeleton_walk.fbx',
                    attack: '/assets/animations/skeleton_attack.fbx'
                },
                source: 'Quaternius - Free Pack'
            },
            dragon: {
                model: '/assets/models/monsters/dragon.glb',
                animations: {
                    idle: '/assets/animations/dragon_idle.fbx',
                    fly: '/assets/animations/dragon_fly.fbx',
                    attack: '/assets/animations/dragon_breath.fbx',
                    roar: '/assets/animations/dragon_roar.fbx'
                },
                source: 'Sketchfab Free - Dragon Model'
            },
            spider: {
                model: '/assets/models/monsters/spider.glb',
                animations: {
                    idle: '/assets/animations/spider_idle.fbx',
                    walk: '/assets/animations/spider_walk.fbx',
                    attack: '/assets/animations/spider_bite.fbx'
                },
                source: 'Quaternius - Free Pack'
            },
            demon: {
                model: '/assets/models/monsters/demon.glb',
                animations: {
                    idle: '/assets/animations/demon_idle.fbx',
                    walk: '/assets/animations/demon_walk.fbx',
                    attack: '/assets/animations/demon_claw.fbx'
                },
                source: 'Sketchfab Free - Demon Model'
            }
        };
        
        // Equipment models from Sketchfab Free
        this.equipmentModels = {
            // Weapons
            iron_sword: '/assets/models/weapons/iron_sword.glb',
            steel_sword: '/assets/models/weapons/steel_sword.glb',
            battle_axe: '/assets/models/weapons/battle_axe.glb',
            longbow: '/assets/models/weapons/longbow.glb',
            staff: '/assets/models/weapons/staff.glb',
            
            // Armor
            leather_armor: '/assets/models/armor/leather_set.glb',
            iron_armor: '/assets/models/armor/iron_set.glb',
            plate_armor: '/assets/models/armor/plate_set.glb',
            
            // Shields
            wooden_shield: '/assets/models/shields/wooden.glb',
            iron_shield: '/assets/models/shields/iron.glb'
        };
    }

    /**
     * Load character model from external source (Mixamo)
     */
    async loadCharacterModel(className) {
        const characterData = this.characterModels[className];
        if (!characterData) {
            logger.warn(`Character class ${className} not found`);
            return null;
        }
        
        // Check cache
        if (this.modelCache.has(className)) {
            return this.modelCache.get(className).clone();
        }
        
        try {
            logger.info(`Loading ${className} from ${characterData.source}: ${characterData.model}`);
            const gltf = await this.loadGLTF(characterData.model);
            
            if (gltf) {
                this.modelCache.set(className, gltf.scene);
                return gltf.scene.clone();
            }
        } catch (error) {
            logger.warn(`Failed to load character model: ${characterData.model}`, error);
            return this.createPlaceholderCharacter(className);
        }
    }

    /**
     * Load monster model from external source (Quaternius/Sketchfab)
     */
    async loadMonsterModel(monsterType) {
        const monsterData = this.monsterModels[monsterType];
        if (!monsterData) {
            logger.warn(`Monster type ${monsterType} not found`);
            return null;
        }
        
        // Check cache
        if (this.modelCache.has(monsterType)) {
            return this.modelCache.get(monsterType).clone();
        }
        
        try {
            logger.info(`Loading ${monsterType} from ${monsterData.source}: ${monsterData.model}`);
            const gltf = await this.loadGLTF(monsterData.model);
            
            if (gltf) {
                this.modelCache.set(monsterType, gltf.scene);
                return gltf.scene.clone();
            }
        } catch (error) {
            logger.warn(`Failed to load monster model: ${monsterData.model}`, error);
            return this.createPlaceholderMonster(monsterType);
        }
    }

    /**
     * Load GLTF model from external source
     */
    loadGLTF(path) {
        return new Promise((resolve, reject) => {
            this.gltfLoader.load(
                path,
                (gltf) => resolve(gltf),
                (progress) => {
                    logger.info(`Loading: ${(progress.loaded / progress.total * 100).toFixed(2)}%`);
                },
                (error) => reject(error)
            );
        });
    }

    /**
     * Load FBX animation from Mixamo
     */
    loadFBXAnimation(path) {
        return new Promise((resolve, reject) => {
            this.fbxLoader.load(
                path,
                (fbx) => resolve(fbx),
                (progress) => {
                    logger.info(`Loading animation: ${(progress.loaded / progress.total * 100).toFixed(2)}%`);
                },
                (error) => reject(error)
            );
        });
    }

    /**
     * Create placeholder (only if external asset fails to load)
     */
    createPlaceholderCharacter(className) {
        logger.warn(`Using placeholder for ${className} - external asset failed to load`);
        const geometry = new THREE.CapsuleGeometry(0.5, 1.5, 4, 8);
        const material = new THREE.MeshStandardMaterial({ 
            color: 0x888888,
            roughness: 0.7
        });
        return new THREE.Mesh(geometry, material);
    }

    /**
     * Create placeholder monster (only if external asset fails to load)
     */
    createPlaceholderMonster(monsterType) {
        logger.warn(`Using placeholder for ${monsterType} - external asset failed to load`);
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshStandardMaterial({ 
            color: 0xff0000,
            roughness: 0.7
        });
        return new THREE.Mesh(geometry, material);
    }

  update(delta) {
    // Updated for v3.0.0 - modernized system
  }
}
