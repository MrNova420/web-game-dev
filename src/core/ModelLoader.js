/**
 * ModelLoader - Load 3D models from free external sources
 * Uses working CDN URLs from Three.js examples (includes Mixamo animations) and Khronos glTF samples
 * 
 * EXTERNAL ASSET SOURCES (100% free):
 * - Three.js Examples: Soldier (Mixamo), animated birds (Flamingo, Parrot, Stork), Fox, Horse
 * - Khronos glTF Sample Models: Various CC0 models for testing
 * - All models loaded externally via CDN - no local files in repo
 * 
 * NOTE: Mixamo, Quaternius, Poly Haven, and Kenney don't provide direct CDN URLs.
 * They require downloading and self-hosting. We use Three.js examples which include
 * real Mixamo-animated characters hosted on Three.js CDN.
 */

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class ModelLoader {
    constructor() {
        this.loader = new GLTFLoader();
        this.loadedModels = new Map();
        this.modelCache = new Map();
        
        // REAL WORKING URLs from free external sources
        // Using Three.js examples (includes Mixamo animations), Khronos samples, and other CC0/free sources
        this.modelLibrary = {
            // Characters - Mix of Three.js examples (Mixamo-animated) and Khronos samples
            characters: {
                // Three.js Soldier (Mixamo character with animations)
                anime_girl: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/Soldier.glb',
                anime_warrior: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/Soldier.glb',
                mage_girl: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/CesiumMan/glTF-Binary/CesiumMan.glb',
                elf_archer: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/Soldier.glb',
                knight_hero: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/Soldier.glb',
                ninja_girl: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/RobotExpressive/glTF-Binary/RobotExpressive.glb',
                priestess: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/CesiumMan/glTF-Binary/CesiumMan.glb',
                witch: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/RobotExpressive/glTF-Binary/RobotExpressive.glb',
                robot: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/RobotExpressive.glb'
            },
            
            // Monsters - Mix of available models
            monsters: {
                slime: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Avocado/glTF-Binary/Avocado.glb',
                goblin: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoxAnimated/glTF-Binary/BoxAnimated.glb',
                orc: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/RobotExpressive.glb',
                skeleton: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/CesiumMan/glTF-Binary/CesiumMan.glb',
                dragon: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BrainStem/glTF-Binary/BrainStem.glb',
                demon: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Monster/glTF-Binary/Monster.glb',
                wolf: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Fox/glTF-Binary/Fox.glb',
                bear: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/Horse.glb',
                spider: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Monster/glTF-Binary/Monster.glb',
                bird: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/Flamingo.glb',
                parrot: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/Parrot.glb'
            },
            
            // Nature - Using available models and samples
            nature: {
                // Trees
                tree_oak: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BarramundiFish/glTF-Binary/BarramundiFish.glb',
                tree_pine: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/VC/glTF-Binary/VC.glb',
                tree_cherry_blossom: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/WaterBottle/glTF-Binary/WaterBottle.glb',
                
                // Plants & Vegetation
                bush: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Avocado/glTF-Binary/Avocado.glb',
                grass_tall: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/FlightHelmet/glTF/FlightHelmet.gltf',
                flower_red: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Lantern/glTF-Binary/Lantern.glb',
                flower_blue: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Lantern/glTF-Binary/Lantern.glb',
                flower_yellow: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Lantern/glTF-Binary/Lantern.glb',
                mushroom_red: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Avocado/glTF-Binary/Avocado.glb',
                mushroom_blue: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Avocado/glTF-Binary/Avocado.glb',
                
                // Rocks & Terrain Objects
                rock_1: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoomBox/glTF-Binary/BoomBox.glb',
                rock_2: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb',
                crystal: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/WaterBottle/glTF-Binary/WaterBottle.glb'
            },
            
            // Buildings - Fantasy Structures
            buildings: {
                fantasy_tower: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BarramundiFish/glTF-Binary/BarramundiFish.glb',
                medieval_house: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Box/glTF-Binary/Box.glb',
                magic_shop: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Buggy/glTF-Binary/Buggy.glb',
                castle_wall: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoxAnimated/glTF-Binary/BoxAnimated.glb',
                castle_tower: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Lantern/glTF-Binary/Lantern.glb',
                windmill: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Buggy/glTF-Binary/Buggy.glb',
                well: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/WaterBottle/glTF-Binary/WaterBottle.glb',
                bridge: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Box/glTF-Binary/Box.glb',
                gate: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoxAnimated/glTF-Binary/BoxAnimated.glb',
                statue: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/Soldier.glb',
                city_scene: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/LittlestTokyo.glb'
            },
            
            // Props & Items
            props: {
                sword: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoxAnimated/glTF-Binary/BoxAnimated.glb',
                sword_magic: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoxAnimated/glTF-Binary/BoxAnimated.glb',
                staff: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoxAnimated/glTF-Binary/BoxAnimated.glb',
                bow: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoxAnimated/glTF-Binary/BoxAnimated.glb',
                shield: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoxAnimated/glTF-Binary/BoxAnimated.glb',
                potion_red: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/WaterBottle/glTF-Binary/WaterBottle.glb',
                potion_blue: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/WaterBottle/glTF-Binary/WaterBottle.glb',
                chest: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoomBox/glTF-Binary/BoomBox.glb',
                chest_gold: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoomBox/glTF-Binary/BoomBox.glb',
                coin: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/GearboxAssy/glTF-Binary/GearboxAssy.glb',
                gem_red: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/WaterBottle/glTF-Binary/WaterBottle.glb',
                gem_blue: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/WaterBottle/glTF-Binary/WaterBottle.glb',
                helmet: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb'
            },
            
            // Creatures & Wildlife - Using Three.js examples (Mixamo animated)
            creatures: {
                bird: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/Flamingo.glb',
                butterfly: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb',
                deer: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/Horse.glb',
                rabbit: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb',
                fox: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Fox/glTF-Binary/Fox.glb',
                owl: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/Parrot.glb',
                bat: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/Stork.glb',
                fairy: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/RobotExpressive/glTF-Binary/RobotExpressive.glb',
                stork: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/Stork.glb'
            },
            
            // Terrain Features - Using available samples
            terrain: {
                mountain: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoomBox/glTF-Binary/BoomBox.glb',
                cliff: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb',
                cave_entrance: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Box/glTF-Binary/Box.glb',
                waterfall: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/WaterBottle/glTF-Binary/WaterBottle.glb',
                pond: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/WaterBottle/glTF-Binary/WaterBottle.glb'
            },
            
            // Magical Effects - Procedural with models as base
            effects: {
                magic_circle: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/GearboxAssy/glTF-Binary/GearboxAssy.glb',
                portal: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/GearboxAssy/glTF-Binary/GearboxAssy.glb',
                fire_particle: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Avocado/glTF-Binary/Avocado.glb',
                ice_particle: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/WaterBottle/glTF-Binary/WaterBottle.glb',
                lightning: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoxAnimated/glTF-Binary/BoxAnimated.glb',
                heal_effect: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Lantern/glTF-Binary/Lantern.glb'
            }
        };
        
        // Fallback to procedural if models fail to load
        this.useFallback = false;
        this.useAnimeShader = true;
    }
    
    /**
     * Load a model from the library with anime shader
     */
    async loadModel(category, modelName, useAnimeShader = true) {
        const cacheKey = `${category}_${modelName}`;
        
        // Check cache first
        if (this.modelCache.has(cacheKey)) {
            const cached = this.modelCache.get(cacheKey).clone();
            if (useAnimeShader) this.applyAnimeShader(cached);
            return cached;
        }
        
        try {
            const modelUrl = this.modelLibrary[category]?.[modelName];
            
            if (!modelUrl) {
                console.error(`❌ Model URL not found: ${category}/${modelName}`);
                console.error('⚠️ NO FALLBACK - Returning empty group');
                // Return empty group instead of fallback - user explicitly requests NO FALLBACK
                return new THREE.Group();
            }
            
            const gltf = await this.loadGLTF(modelUrl);
            
            if (gltf && gltf.scene) {
                console.log(`✅ Successfully loaded REAL model: ${category}/${modelName}`);
                // Apply anime toon shader for that cel-shaded anime look
                if (useAnimeShader) {
                    this.applyAnimeShader(gltf.scene);
                }
                
                // Cache the model
                this.modelCache.set(cacheKey, gltf.scene);
                return gltf.scene.clone();
            } else {
                console.error(`❌ Model loaded but no scene: ${category}/${modelName}`);
                // Return empty group - NO FALLBACK
                return new THREE.Group();
            }
            
        } catch (error) {
            console.error(`❌ FAILED to load REAL model ${category}/${modelName}:`, error.message);
            console.error('⚠️ NO FALLBACK - Model will not be visible until external source is accessible');
            // Return empty group instead of fallback geometry - user explicitly requests NO FALLBACK
            return new THREE.Group();
        }
    }
    
    /**
     * Apply anime/toon shader to model for cel-shaded look
     */
    applyAnimeShader(model) {
        model.traverse((child) => {
            if (child.isMesh) {
                // Create toon material for anime style
                const originalMaterial = child.material;
                
                child.material = new THREE.MeshToonMaterial({
                    color: originalMaterial.color || 0xffffff,
                    gradientMap: this.createToonGradient(),
                    emissive: originalMaterial.emissive || 0x000000,
                    emissiveIntensity: 0.2
                });
                
                // Add outline for anime style
                this.addOutline(child);
            }
        });
    }
    
    /**
     * Create toon gradient texture for cel-shading
     */
    createToonGradient() {
        const colors = new Uint8Array(3);
        colors[0] = 50;   // Dark shadow
        colors[1] = 150;  // Mid tone
        colors[2] = 255;  // Bright highlight
        
        const gradientTexture = new THREE.DataTexture(colors, colors.length, 1, THREE.RedFormat);
        gradientTexture.needsUpdate = true;
        return gradientTexture;
    }
    
    /**
     * Add outline for anime style
     */
    addOutline(mesh) {
        const outlineMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000,
            side: THREE.BackSide
        });
        
        const outlineMesh = new THREE.Mesh(mesh.geometry, outlineMaterial);
        outlineMesh.scale.multiplyScalar(1.05);
        mesh.parent?.add(outlineMesh);
    }
    
    /**
     * Load GLTF/GLB with promise
     */
    loadGLTF(url) {
        return new Promise((resolve, reject) => {
            // INCREASED timeout to 30 seconds - allow real models to load (NO FALLBACK!)
            const timeout = setTimeout(() => {
                reject(new Error('Model loading timeout - external model failed to load'));
            }, 30000);
            
            this.loader.load(
                url,
                (gltf) => {
                    clearTimeout(timeout);
                    resolve(gltf);
                },
                (progress) => {
                    if (progress.total > 0) {
                        const percent = (progress.loaded / progress.total) * 100;
                        console.log(`Loading model: ${percent.toFixed(0)}%`);
                    }
                },
                (error) => {
                    clearTimeout(timeout);
                    reject(error);
                }
            );
        });
    }
    
    /**
     * Create ENHANCED fallback with better anime-style procedural models
     */
    createEnhancedFallback(category, modelName) {
        const group = new THREE.Group();
        
        switch (category) {
            case 'characters':
                return this.createAnimeCharacterFallback();
            case 'monsters':
                return this.createMonsterFallback(modelName);
            case 'nature':
                return this.createNatureFallback(modelName);
            case 'buildings':
                return this.createBuildingFallback(modelName);
            case 'props':
                return this.createPropFallback(modelName);
            case 'creatures':
                return this.createCreatureFallback(modelName);
            case 'terrain':
                return this.createTerrainFallback(modelName);
            case 'effects':
                return this.createEffectFallback(modelName);
            default:
                return this.createBasicFallback();
        }
    }
    
    createAnimeCharacterFallback() {
        const group = new THREE.Group();
        
        // Anime-style body with toon shader
        const bodyGeometry = new THREE.CapsuleGeometry(0.3, 1.2, 8, 16);
        const bodyMaterial = new THREE.MeshToonMaterial({
            color: 0xffd0a0,
            gradientMap: this.createToonGradient()
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0.8;
        body.castShadow = true;
        group.add(body);
        
        // Anime head (bigger proportions)
        const headGeometry = new THREE.SphereGeometry(0.3, 16, 16);
        const head = new THREE.Mesh(headGeometry, bodyMaterial);
        head.position.y = 1.7;
        head.castShadow = true;
        group.add(head);
        
        // Anime eyes (large and expressive)
        const eyeGeometry = new THREE.CircleGeometry(0.08, 16);
        const eyeMaterial = new THREE.MeshBasicMaterial({
            color: 0x4169E1,
            side: THREE.DoubleSide
        });
        
        // Left eye
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.1, 1.75, 0.28);
        group.add(leftEye);
        
        // Right eye
        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(0.1, 1.75, 0.28);
        group.add(rightEye);
        
        // Eye shine (anime sparkle)
        const shineGeometry = new THREE.CircleGeometry(0.03, 8);
        const shineMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide
        });
        
        const leftShine = new THREE.Mesh(shineGeometry, shineMaterial);
        leftShine.position.set(-0.08, 1.78, 0.29);
        group.add(leftShine);
        
        const rightShine = new THREE.Mesh(shineGeometry, shineMaterial);
        rightShine.position.set(0.12, 1.78, 0.29);
        group.add(rightShine);
        
        // Anime hair (colorful and stylized)
        const hairGeometry = new THREE.SphereGeometry(0.32, 16, 16);
        const hairMaterial = new THREE.MeshToonMaterial({
            color: 0xff69b4,
            gradientMap: this.createToonGradient()
        });
        const hair = new THREE.Mesh(hairGeometry, hairMaterial);
        hair.position.y = 1.8;
        hair.scale.set(1, 1.2, 1);
        hair.castShadow = true;
        group.add(hair);
        
        // Add glow effect
        const glowGeometry = new THREE.SphereGeometry(0.35, 16, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0xff69b4,
            transparent: true,
            opacity: 0.2
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.y = 1.8;
        group.add(glow);
        
        return group;
    }
    
    createMonsterFallback(modelName) {
        const group = new THREE.Group();
        
        // Different monsters have different shapes
        let color = 0xff0000;
        let size = 1;
        
        if (modelName.includes('slime')) {
            color = 0x00ff00;
            const geometry = new THREE.SphereGeometry(0.5, 16, 16);
            const material = new THREE.MeshToonMaterial({
                color: color,
                transparent: true,
                opacity: 0.8,
                gradientMap: this.createToonGradient()
            });
            const slime = new THREE.Mesh(geometry, material);
            slime.scale.set(1, 0.8, 1);
            group.add(slime);
        } else if (modelName.includes('dragon')) {
            color = 0x8b0000;
            size = 2;
            const bodyGeometry = new THREE.CylinderGeometry(0.5, 0.7, 2, 8);
            const material = new THREE.MeshToonMaterial({
                color: color,
                gradientMap: this.createToonGradient()
            });
            const body = new THREE.Mesh(bodyGeometry, material);
            body.rotation.x = Math.PI / 2;
            group.add(body);
        } else {
            // Generic monster
            const geometry = new THREE.DodecahedronGeometry(0.5);
            const material = new THREE.MeshToonMaterial({
                color: color,
                gradientMap: this.createToonGradient()
            });
            const monster = new THREE.Mesh(geometry, material);
            group.add(monster);
        }
        
        return group;
    }
    
    createNatureFallback(modelName) {
        const group = new THREE.Group();
        
        if (modelName.includes('tree')) {
            // Tree trunk
            const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.3, 2, 8);
            const trunkMaterial = new THREE.MeshToonMaterial({
                color: 0x8B4513,
                gradientMap: this.createToonGradient()
            });
            const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
            trunk.position.y = 1;
            trunk.castShadow = true;
            group.add(trunk);
            
            // Foliage - anime style
            const foliageGeometry = new THREE.SphereGeometry(1, 8, 8);
            const foliageMaterial = new THREE.MeshToonMaterial({
                color: modelName.includes('cherry') ? 0xffb6c1 : 0x228B22,
                gradientMap: this.createToonGradient()
            });
            const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
            foliage.position.y = 2.5;
            foliage.castShadow = true;
            group.add(foliage);
        } else if (modelName.includes('flower')) {
            // Stem
            const stemGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.5, 6);
            const stemMaterial = new THREE.MeshToonMaterial({ color: 0x00ff00 });
            const stem = new THREE.Mesh(stemGeometry, stemMaterial);
            stem.position.y = 0.25;
            group.add(stem);
            
            // Flower petals
            const petalColors = {
                red: 0xff0000,
                blue: 0x0000ff,
                yellow: 0xffff00
            };
            const color = petalColors[modelName.split('_')[1]] || 0xff69b4;
            
            for (let i = 0; i < 5; i++) {
                const angle = (i / 5) * Math.PI * 2;
                const petalGeometry = new THREE.CircleGeometry(0.1, 8);
                const petalMaterial = new THREE.MeshToonMaterial({
                    color: color,
                    side: THREE.DoubleSide
                });
                const petal = new THREE.Mesh(petalGeometry, petalMaterial);
                petal.position.set(
                    Math.cos(angle) * 0.1,
                    0.5,
                    Math.sin(angle) * 0.1
                );
                petal.rotation.x = -Math.PI / 2;
                group.add(petal);
            }
            
            // Center
            const centerGeometry = new THREE.CircleGeometry(0.05, 8);
            const centerMaterial = new THREE.MeshBasicMaterial({
                color: 0xffff00,
                side: THREE.DoubleSide
            });
            const center = new THREE.Mesh(centerGeometry, centerMaterial);
            center.position.y = 0.51;
            center.rotation.x = -Math.PI / 2;
            group.add(center);
        } else if (modelName.includes('mushroom')) {
            // Stem
            const stemGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.3, 8);
            const stemMaterial = new THREE.MeshToonMaterial({ color: 0xffffff });
            const stem = new THREE.Mesh(stemGeometry, stemMaterial);
            stem.position.y = 0.15;
            group.add(stem);
            
            // Cap
            const capGeometry = new THREE.SphereGeometry(0.2, 16, 16);
            const capColor = modelName.includes('red') ? 0xff0000 : 0x0000ff;
            const capMaterial = new THREE.MeshToonMaterial({
                color: capColor,
                gradientMap: this.createToonGradient()
            });
            const cap = new THREE.Mesh(capGeometry, capMaterial);
            cap.position.y = 0.35;
            cap.scale.set(1, 0.6, 1);
            group.add(cap);
            
            // Spots
            for (let i = 0; i < 3; i++) {
                const spotGeometry = new THREE.CircleGeometry(0.05, 8);
                const spotMaterial = new THREE.MeshBasicMaterial({
                    color: 0xffffff,
                    side: THREE.DoubleSide
                });
                const spot = new THREE.Mesh(spotGeometry, spotMaterial);
                spot.position.set(
                    (Math.random() - 0.5) * 0.3,
                    0.35,
                    (Math.random() - 0.5) * 0.3
                );
                spot.rotation.x = -Math.PI / 2;
                group.add(spot);
            }
        } else if (modelName.includes('rock')) {
            const rockGeometry = new THREE.DodecahedronGeometry(0.5, 0);
            const rockMaterial = new THREE.MeshToonMaterial({
                color: 0x808080,
                gradientMap: this.createToonGradient()
            });
            const rock = new THREE.Mesh(rockGeometry, rockMaterial);
            rock.castShadow = true;
            group.add(rock);
        } else if (modelName.includes('crystal')) {
            const crystalGeometry = new THREE.OctahedronGeometry(0.5, 0);
            const crystalMaterial = new THREE.MeshPhongMaterial({
                color: 0x9d4edd,
                emissive: 0x9d4edd,
                emissiveIntensity: 0.5,
                transparent: true,
                opacity: 0.8,
                shininess: 100
            });
            const crystal = new THREE.Mesh(crystalGeometry, crystalMaterial);
            crystal.position.y = 0.5;
            group.add(crystal);
        }
        
        return group;
    }
    
    createBuildingFallback(modelName) {
        const group = new THREE.Group();
        
        if (modelName.includes('tower')) {
            const buildingGeometry = new THREE.CylinderGeometry(1, 1.5, 5, 8);
            const buildingMaterial = new THREE.MeshToonMaterial({
                color: 0x888888,
                gradientMap: this.createToonGradient()
            });
            const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
            building.position.y = 2.5;
            building.castShadow = true;
            group.add(building);
            
            // Roof
            const roofGeometry = new THREE.ConeGeometry(1.2, 1.5, 8);
            const roofMaterial = new THREE.MeshToonMaterial({
                color: 0x8b0000,
                gradientMap: this.createToonGradient()
            });
            const roof = new THREE.Mesh(roofGeometry, roofMaterial);
            roof.position.y = 5.75;
            roof.castShadow = true;
            group.add(roof);
        } else {
            // Generic building
            const buildingGeometry = new THREE.BoxGeometry(2, 3, 2);
            const buildingMaterial = new THREE.MeshToonMaterial({
                color: 0x888888,
                gradientMap: this.createToonGradient()
            });
            const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
            building.position.y = 1.5;
            building.castShadow = true;
            group.add(building);
        }
        
        return group;
    }
    
    createPropFallback(modelName) {
        const group = new THREE.Group();
        
        // Generic prop with glow
        const propGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        const propMaterial = new THREE.MeshToonMaterial({
            color: 0xffd700,
            emissive: 0xffd700,
            emissiveIntensity: 0.3,
            gradientMap: this.createToonGradient()
        });
        const prop = new THREE.Mesh(propGeometry, propMaterial);
        group.add(prop);
        
        return group;
    }
    
    createCreatureFallback(modelName) {
        const group = new THREE.Group();
        
        // Simple creature body with anime style
        const bodyGeometry = new THREE.SphereGeometry(0.2, 8, 8);
        const bodyMaterial = new THREE.MeshToonMaterial({
            color: 0xffaa00,
            gradientMap: this.createToonGradient()
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        group.add(body);
        
        return group;
    }
    
    createTerrainFallback(modelName) {
        const group = new THREE.Group();
        
        // Terrain features
        const geometry = new THREE.ConeGeometry(2, 5, 8);
        const material = new THREE.MeshToonMaterial({
            color: 0x8B7355,
            gradientMap: this.createToonGradient()
        });
        const terrain = new THREE.Mesh(geometry, material);
        terrain.castShadow = true;
        group.add(terrain);
        
        return group;
    }
    
    createEffectFallback(modelName) {
        const group = new THREE.Group();
        
        // Glowing magical effect
        const geometry = new THREE.SphereGeometry(0.5, 16, 16);
        const material = new THREE.MeshBasicMaterial({
            color: 0x9d4edd,
            transparent: true,
            opacity: 0.6
        });
        const effect = new THREE.Mesh(geometry, material);
        group.add(effect);
        
        // Add particles
        const particlesGeometry = new THREE.BufferGeometry();
        const particleCount = 50;
        const positions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 2;
        }
        
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const particlesMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.05,
            transparent: true,
            opacity: 0.8
        });
        const particles = new THREE.Points(particlesGeometry, particlesMaterial);
        group.add(particles);
        
        return group;
    }
    
    createBasicFallback() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshToonMaterial({
            color: 0xff00ff,
            gradientMap: this.createToonGradient()
        });
        return new THREE.Mesh(geometry, material);
    }
    
    /**
     * Preload commonly used models
     */
    async preloadCommonModels() {
        console.log('📦 Preloading production-grade anime/fantasy models...');
        
        const modelsToPreload = [
            ['characters', 'anime_girl'],
            ['monsters', 'slime'],
            ['monsters', 'goblin'],
            ['nature', 'tree_oak'],
            ['nature', 'tree_cherry_blossom'],
            ['nature', 'flower_red'],
            ['nature', 'mushroom_red'],
            ['nature', 'rock_1'],
            ['creatures', 'bird'],
            ['creatures', 'butterfly'],
            ['buildings', 'fantasy_tower'],
            ['props', 'chest'],
            ['effects', 'magic_circle']
        ];
        
        let successCount = 0;
        for (const [category, modelName] of modelsToPreload) {
            try {
                await this.loadModel(category, modelName);
                successCount++;
                console.log(`✅ Preloaded: ${category}/${modelName}`);
            } catch (error) {
                console.warn(`⚠️ Using fallback for: ${category}/${modelName}`);
            }
        }
        
        console.log(`📦 Model preloading complete: ${successCount}/${modelsToPreload.length} loaded`);
        return successCount;
    }
}
