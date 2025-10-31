/**
import { logger } from '../core/Logger.js';
 * AssetLoaderSystem.js
 * Asset Loading and Management System
 * Loads FREE external 3D models, textures, audio from public/assets/
 * Uses assets from: Mixamo, Sketchfab, Quaternius, Kenney, Poly Pizza, etc.
 * ~800 lines
 */

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

export class AssetLoaderSystem {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        
        // Asset loaders
        this.gltfLoader = new GLTFLoader();
        this.fbxLoader = new FBXLoader();
        this.textureLoader = new THREE.TextureLoader();
        this.audioLoader = new THREE.AudioLoader();
        
        // Asset registry (tracks loaded assets)
        this.loadedAssets = new Map();
        this.assetManifest = this.createAssetManifest();
        
        // Loading state
        this.loadingProgress = 0;
        this.isLoading = false;
        this.loadQueue = [];
    }
    
    /**
     * Asset manifest - Maps game objects to FREE external asset files
     * All assets are from free sources: Mixamo, Sketchfab, Quaternius, Kenney, etc.
     */
    createAssetManifest() {
        return {
            // Player characters (FREE from Mixamo.com)
            players: {
                warrior: '/assets/models/characters/player/warrior.glb',
                mage: '/assets/models/characters/player/mage.glb',
                rogue: '/assets/models/characters/player/rogue.glb',
                archer: '/assets/models/characters/player/archer.glb'
            },
            
            // Companions (FREE from Mixamo.com or Sketchfab)
            companions: {
                smoke_siren: '/assets/models/characters/companions/smoke_siren.glb',
                blade_muse: '/assets/models/characters/companions/blade_muse.glb',
                herb_witch: '/assets/models/characters/companions/herb_witch.glb',
                cyber_dryad: '/assets/models/characters/companions/cyber_dryad.glb'
            },
            
            // Enemies (FREE from Quaternius Ultimate Modular Pack - CC0)
            enemies: {
                goblin_scout: '/assets/models/enemies/goblin_scout.glb',
                goblin_warrior: '/assets/models/enemies/goblin_warrior.glb',
                orc_grunt: '/assets/models/enemies/orc_grunt.glb',
                dragon_whelp: '/assets/models/enemies/dragon_whelp.glb',
                slime: '/assets/models/enemies/slime.glb'
            },
            
            // Bosses (FREE from Sketchfab or Mixamo)
            bosses: {
                crimson_empress: '/assets/models/bosses/crimson_empress.glb',
                frost_queen: '/assets/models/bosses/frost_queen.glb',
                shadow_assassin: '/assets/models/bosses/shadow_assassin.glb',
                lightning_valkyrie: '/assets/models/bosses/lightning_valkyrie.glb',
                dragon_empress: '/assets/models/bosses/dragon_empress.glb'
            },
            
            // Weapons (FREE from Sketchfab or Poly Pizza)
            weapons: {
                iron_sword: '/assets/models/weapons/swords/iron_sword.glb',
                steel_sword: '/assets/models/weapons/swords/steel_sword.glb',
                battle_axe: '/assets/models/weapons/axes/battle_axe.glb',
                dagger: '/assets/models/weapons/daggers/dagger.glb',
                bow: '/assets/models/weapons/bows/short_bow.glb',
                staff: '/assets/models/weapons/staves/wooden_staff.glb'
            },
            
            // Environment (FREE from Quaternius or Poly Pizza - CC0)
            environment: {
                tree_1: '/assets/models/environment/trees/tree_1.glb',
                rock_1: '/assets/models/environment/rocks/rock_1.glb',
                grass: '/assets/models/environment/grass/grass_patch.glb',
                building_1: '/assets/models/environment/buildings/house_1.glb'
            },
            
            // Textures (FREE from Poly Haven - CC0)
            textures: {
                grass: '/assets/textures/environment/grass_albedo.jpg',
                stone: '/assets/textures/environment/stone_albedo.jpg',
                wood: '/assets/textures/environment/wood_albedo.jpg',
                metal: '/assets/textures/materials/metal_albedo.jpg'
            },
            
            // Audio (FREE from Freesound or Incompetech)
            audio: {
                music_menu: '/assets/audio/music/menu_theme.mp3',
                music_battle: '/assets/audio/music/battle_theme.mp3',
                sfx_sword: '/assets/audio/sfx/sword_swing.mp3',
                sfx_hit: '/assets/audio/sfx/hit_impact.mp3'
            },
            
            // UI (FREE from Game-icons.net CC BY 3.0 or Kenney)
            ui: {
                icon_health: '/assets/ui/icons/health.png',
                icon_mana: '/assets/ui/icons/mana.png',
                icon_sword: '/assets/ui/icons/sword.png',
                button_normal: '/assets/ui/buttons/button_normal.png'
            }
        };
    }
    
    /**
     * Load player character model (FREE from Mixamo)
     */
    async loadPlayerCharacter(characterClass) {
        const assetPath = this.assetManifest.players[characterClass];
        if (!assetPath) {
            logger.warn(`Player character ${characterClass} not found in manifest`);
            return this.createPlaceholder('player');
        }
        
        try {
            const model = await this.loadGLTF(assetPath);
            this.loadedAssets.set(`player_${characterClass}`, model);
            logger.info(`✅ Loaded FREE player model from Mixamo: ${characterClass}`);
            return model;
        } catch (error) {
            logger.warn(`Asset not found: ${assetPath}. Using placeholder.`);
            return this.createPlaceholder('player');
        }
    }
    
    /**
     * Load companion model (FREE from Mixamo or Sketchfab)
     */
    async loadCompanionModel(companionId) {
        const assetPath = this.assetManifest.companions[companionId];
        if (!assetPath) {
            logger.warn(`Companion ${companionId} not found in manifest`);
            return this.createPlaceholder('companion');
        }
        
        try {
            const model = await this.loadGLTF(assetPath);
            this.loadedAssets.set(`companion_${companionId}`, model);
            logger.info(`✅ Loaded FREE companion model: ${companionId}`);
            return model;
        } catch (error) {
            logger.warn(`Asset not found: ${assetPath}. Using placeholder.`);
            return this.createPlaceholder('companion');
        }
    }
    
    /**
     * Load enemy model (FREE from Quaternius - CC0)
     */
    async loadEnemyModel(enemyType) {
        const assetPath = this.assetManifest.enemies[enemyType];
        if (!assetPath) {
            logger.warn(`Enemy ${enemyType} not found in manifest`);
            return this.createPlaceholder('enemy');
        }
        
        try {
            const model = await this.loadGLTF(assetPath);
            this.loadedAssets.set(`enemy_${enemyType}`, model);
            logger.info(`✅ Loaded FREE enemy model from Quaternius: ${enemyType}`);
            return model;
        } catch (error) {
            logger.warn(`Asset not found: ${assetPath}. Using placeholder.`);
            return this.createPlaceholder('enemy');
        }
    }
    
    /**
     * Load boss model (FREE from Sketchfab)
     */
    async loadBossModel(bossId) {
        const assetPath = this.assetManifest.bosses[bossId];
        if (!assetPath) {
            logger.warn(`Boss ${bossId} not found in manifest`);
            return this.createPlaceholder('boss');
        }
        
        try {
            const model = await this.loadGLTF(assetPath);
            this.loadedAssets.set(`boss_${bossId}`, model);
            logger.info(`✅ Loaded FREE boss model from Sketchfab: ${bossId}`);
            return model;
        } catch (error) {
            logger.warn(`Asset not found: ${assetPath}. Using placeholder.`);
            return this.createPlaceholder('boss');
        }
    }
    
    /**
     * Load weapon model (FREE from Sketchfab or Poly Pizza)
     */
    async loadWeaponModel(weaponId) {
        const assetPath = this.assetManifest.weapons[weaponId];
        if (!assetPath) {
            logger.warn(`Weapon ${weaponId} not found in manifest`);
            return this.createPlaceholder('weapon');
        }
        
        try {
            const model = await this.loadGLTF(assetPath);
            this.loadedAssets.set(`weapon_${weaponId}`, model);
            logger.info(`✅ Loaded FREE weapon model: ${weaponId}`);
            return model;
        } catch (error) {
            logger.warn(`Asset not found: ${assetPath}. Using placeholder.`);
            return this.createPlaceholder('weapon');
        }
    }
    
    /**
     * Load environment model (FREE from Quaternius or Poly Pizza - CC0)
     */
    async loadEnvironmentModel(objectType) {
        const assetPath = this.assetManifest.environment[objectType];
        if (!assetPath) {
            logger.warn(`Environment object ${objectType} not found in manifest`);
            return this.createPlaceholder('environment');
        }
        
        try {
            const model = await this.loadGLTF(assetPath);
            this.loadedAssets.set(`env_${objectType}`, model);
            logger.info(`✅ Loaded FREE environment model from Quaternius/Poly Pizza: ${objectType}`);
            return model;
        } catch (error) {
            logger.warn(`Asset not found: ${assetPath}. Using placeholder.`);
            return this.createPlaceholder('environment');
        }
    }
    
    /**
     * Load texture (FREE from Poly Haven - CC0)
     */
    async loadTexture(textureId) {
        const assetPath = this.assetManifest.textures[textureId];
        if (!assetPath) {
            logger.warn(`Texture ${textureId} not found in manifest`);
            return new THREE.Texture();
        }
        
        try {
            const texture = await this.loadTextureFile(assetPath);
            this.loadedAssets.set(`texture_${textureId}`, texture);
            logger.info(`✅ Loaded FREE texture from Poly Haven: ${textureId}`);
            return texture;
        } catch (error) {
            logger.warn(`Texture not found: ${assetPath}. Using default.`);
            return new THREE.Texture();
        }
    }
    
    /**
     * Load audio file (FREE from Freesound or Incompetech)
     */
    async loadAudio(audioId) {
        const assetPath = this.assetManifest.audio[audioId];
        if (!assetPath) {
            logger.warn(`Audio ${audioId} not found in manifest`);
            return null;
        }
        
        try {
            const audioBuffer = await this.loadAudioFile(assetPath);
            this.loadedAssets.set(`audio_${audioId}`, audioBuffer);
            logger.info(`✅ Loaded FREE audio from Freesound/Incompetech: ${audioId}`);
            return audioBuffer;
        } catch (error) {
            logger.warn(`Audio not found: ${assetPath}`);
            return null;
        }
    }
    
    /**
     * Load GLTF/GLB model
     */
    loadGLTF(path) {
        return new Promise((resolve, reject) => {
            this.gltfLoader.load(
                path,
                (gltf) => {
                    resolve(gltf.scene);
                },
                (progress) => {
                    // Loading progress
                },
                (error) => {
                    reject(error);
                }
            );
        });
    }
    
    /**
     * Load texture file
     */
    loadTextureFile(path) {
        return new Promise((resolve, reject) => {
            this.textureLoader.load(
                path,
                (texture) => {
                    resolve(texture);
                },
                undefined,
                (error) => {
                    reject(error);
                }
            );
        });
    }
    
    /**
     * Load audio file
     */
    loadAudioFile(path) {
        return new Promise((resolve, reject) => {
            this.audioLoader.load(
                path,
                (buffer) => {
                    resolve(buffer);
                },
                undefined,
                (error) => {
                    reject(error);
                }
            );
        });
    }
    
    /**
     * Create placeholder geometry when asset file doesn't exist
     * (Temporary until FREE assets are downloaded)
     */
    createPlaceholder(type) {
        const placeholders = {
            player: () => {
                const geometry = new THREE.CapsuleGeometry(0.5, 1, 4, 8);
                const material = new THREE.MeshStandardMaterial({ color: 0x0066ff });
                return new THREE.Mesh(geometry, material);
            },
            companion: () => {
                const geometry = new THREE.CapsuleGeometry(0.5, 1, 4, 8);
                const material = new THREE.MeshStandardMaterial({ color: 0xff0066 });
                return new THREE.Mesh(geometry, material);
            },
            enemy: () => {
                const geometry = new THREE.BoxGeometry(1, 1, 1);
                const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
                return new THREE.Mesh(geometry, material);
            },
            boss: () => {
                const geometry = new THREE.CapsuleGeometry(1, 2, 4, 8);
                const material = new THREE.MeshStandardMaterial({ color: 0xaa0000 });
                return new THREE.Mesh(geometry, material);
            },
            weapon: () => {
                const geometry = new THREE.BoxGeometry(0.1, 1, 0.1);
                const material = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
                return new THREE.Mesh(geometry, material);
            },
            environment: () => {
                const geometry = new THREE.BoxGeometry(1, 1, 1);
                const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
                return new THREE.Mesh(geometry, material);
            }
        };
        
        logger.info(`📦 Using placeholder for ${type} (download FREE asset from sources in ASSET_INTEGRATION_PLAN.md)`);
        return placeholders[type] ? placeholders[type]() : new THREE.Mesh();
    }
    
    /**
     * Batch load multiple assets
     */
    async loadAssetBatch(assetList) {
        this.isLoading = true;
        const promises = [];
        
        for (const asset of assetList) {
            switch (asset.type) {
                case 'player':
                    promises.push(this.loadPlayerCharacter(asset.id));
                    break;
                case 'companion':
                    promises.push(this.loadCompanionModel(asset.id));
                    break;
                case 'enemy':
                    promises.push(this.loadEnemyModel(asset.id));
                    break;
                case 'boss':
                    promises.push(this.loadBossModel(asset.id));
                    break;
                case 'weapon':
                    promises.push(this.loadWeaponModel(asset.id));
                    break;
                case 'texture':
                    promises.push(this.loadTexture(asset.id));
                    break;
                case 'audio':
                    promises.push(this.loadAudio(asset.id));
                    break;
            }
        }
        
        const results = await Promise.allSettled(promises);
        this.isLoading = false;
        
        return results.map((result, index) => ({
            asset: assetList[index],
            success: result.status === 'fulfilled',
            data: result.status === 'fulfilled' ? result.value : null,
            error: result.status === 'rejected' ? result.reason : null
        }));
    }
    
    /**
     * Get loaded asset from cache
     */
    getAsset(assetKey) {
        return this.loadedAssets.get(assetKey);
    }
    
    /**
     * Check if asset is loaded
     */
    isAssetLoaded(assetKey) {
        return this.loadedAssets.has(assetKey);
    }
    
    /**
     * Get loading progress
     */
    getLoadingProgress() {
        return this.loadingProgress;
    }
    
    /**
     * Clear asset cache
     */
    clearCache() {
        for (const [key, asset] of this.loadedAssets) {
            if (asset.geometry) asset.geometry.dispose();
            if (asset.material) {
                if (Array.isArray(asset.material)) {
                    asset.material.forEach(m => m.dispose());
                } else {
                    asset.material.dispose();
                }
            }
        }
        this.loadedAssets.clear();
    }
    
    /**
     * Get asset statistics
     */
    getStats() {
        return {
            totalLoaded: this.loadedAssets.size,
            isLoading: this.isLoading,
            progress: this.loadingProgress,
            manifestSize: Object.keys(this.assetManifest).length
        };
    }
}

/**
 * USAGE INSTRUCTIONS:
 * 
 * 1. Download FREE assets from sources listed in ASSET_INTEGRATION_PLAN.md:
 *    - Mixamo.com (characters)
 *    - Quaternius.com (enemies, environment)
 *    - Poly.pizza (objects)
 *    - Sketchfab.com/free (bosses, weapons)
 *    - Kenney.nl (UI)
 * 
 * 2. Place downloaded assets in /public/assets/ folders
 * 
 * 3. Update assetManifest paths to match your downloaded files
 * 
 * 4. Load assets in game:
 *    const loader = new AssetLoaderSystem(gameEngine);
 *    const playerModel = await loader.loadPlayerCharacter('warrior');
 *    scene.add(playerModel);
 * 
 * 5. Credit asset creators in CREDITS.md
 */
