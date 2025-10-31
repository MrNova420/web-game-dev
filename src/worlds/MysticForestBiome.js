/**
import { logger } from '../core/Logger.js';
 * Mystic Forest Biome - First Complete Biome Implementation
 * The starting zone as described in README
 * 
 * Features:
 * - Lush ancient forest with glowing flora
 * - Forest spirits, wolves, tree ents, deer, rabbits
 * - Ancient Tree of Beginnings (World Tree)
 * - Moonlit Glade (hidden village)
 * - Whispering Grove (mystical area)
 */

import * as THREE from 'three';
import { assetRegistry } from '../core/AssetRegistry.js';
import { MoonlitGladeVillage } from './MoonlitGladeVillage.js';

export class MysticForestBiome {
    constructor(scene, modelLoader) {
        this.scene = scene;
        this.modelLoader = modelLoader;
        this.assetRegistry = assetRegistry;
        
        this.terrain = null;
        this.trees = [];
        this.rocks = [];
        this.plants = [];
        this.structures = [];
        this.village = null;
        
        this.worldSize = 200; // 200x200 world
    }
    
    /**
     * Preload the most common models to cache them
     * After this, all trees/rocks/plants will clone from cache instantly
     */
    async preloadCommonModels() {
        logger.info('📦 Preloading forest models for fast cloning...');
        
        const commonPaths = [
            this.assetRegistry.getRandomTree(),  // Load one tree model
            this.assetRegistry.getRandomTree(),  // Load another variant
            this.assetRegistry.getRandomRock(),  // Load one rock
            this.assetRegistry.getRandomPlant()  // Load one plant
        ];
        
        for (const path of commonPaths) {
            await this.modelLoader.load(path);
        }
        
        logger.info('   ✅ Models preloaded and cached!');
    }
    
    /**
     * Build the complete Mystic Forest biome
     */
    async build() {
        logger.info('🌲 Building Mystic Forest Biome...');
        
        try {
            // Setup environment with REAL skybox
            await this.setupEnvironment();
            
            // Create terrain with REAL ground tiles
            await this.createTerrain();
            
            // OPTIMIZED: Preload common models first (loads once, reuses many times)
            await this.preloadCommonModels();
            
            // Build world elements sequentially with progress feedback
            // This prevents overwhelming the browser
            await this.plantForest();
            await this.addRocks();
            await this.addGroundCover();
            
            // Build special locations
            await this.buildAncientTree();
            
            // Build Moonlit Glade Village - complete with buildings, NPCs, props
            this.village = new MoonlitGladeVillage(this.scene, this.modelLoader);
            await this.village.build();
            
            // Add atmospheric effects
            this.addMist();
            this.addGlowingParticles();
            
            logger.info('✅ Mystic Forest complete!');
            logger.info(`   - Trees: ${this.trees.length}`);
            logger.info(`   - Rocks: ${this.rocks.length}`);
            logger.info(`   - Plants: ${this.plants.length}`);
            
        } catch (error) {
            logger.error('Error building Mystic Forest:', error);
        }
    }
    
    /**
     * Setup environmental lighting and atmosphere
     * USING YOUR REAL SKYBOX ASSETS!
     */
    async setupEnvironment() {
        // Load REAL skybox texture from your assets
        const textureLoader = new THREE.TextureLoader();
        
        try {
            // Use your actual GreenSky skybox for forest biome
            const skyboxTexture = await new Promise((resolve, reject) => {
                textureLoader.load(
                    '/assets/skyboxes/GreenSky.png',
                    resolve,
                    undefined,
                    reject
                );
            });
            
            // Create skybox sphere using YOUR actual asset
            const skyGeo = new THREE.SphereGeometry(500, 32, 32);
            const skyMat = new THREE.MeshBasicMaterial({
                map: skyboxTexture,
                side: THREE.BackSide
            });
            const sky = new THREE.Mesh(skyGeo, skyMat);
            this.scene.add(sky);
            
            logger.info('   ✅ Loaded GreenSky.png skybox from your assets');
        } catch (error) {
            logger.error('   ⚠️ Failed to load skybox, using fallback color');
            this.scene.background = new THREE.Color(0x1a2f3a);
        }
        
        // Fog for mystical atmosphere
        this.scene.fog = new THREE.FogExp2(0x1a3f5a, 0.008);
        
        // Ambient light - mystical blue-green tint
        const ambient = new THREE.AmbientLight(0x4a7c8c, 0.6);
        this.scene.add(ambient);
        
        // Directional light - soft sunlight through trees
        const sunlight = new THREE.DirectionalLight(0xffffff, 0.8);
        sunlight.position.set(50, 100, 50);
        sunlight.castShadow = true;
        sunlight.shadow.camera.left = -100;
        sunlight.shadow.camera.right = 100;
        sunlight.shadow.camera.top = 100;
        sunlight.shadow.camera.bottom = -100;
        this.scene.add(sunlight);
        
        // Mystical glow lights (multiple point lights)
        const glowColors = [0x00ffff, 0x00ff88, 0x4477ff];
        for (let i = 0; i < 10; i++) {
            const light = new THREE.PointLight(
                glowColors[Math.floor(Math.random() * glowColors.length)],
                0.5,
                20
            );
            const angle = (i / 10) * Math.PI * 2;
            const radius = 30 + Math.random() * 50;
            light.position.set(
                Math.cos(angle) * radius,
                2 + Math.random() * 3,
                Math.sin(angle) * radius
            );
            this.scene.add(light);
        }
        
        logger.info('🌄 Environment setup complete');
    }
    
    /**
     * Create the forest terrain using REAL ground models from mega packs
     * NO MORE CODED GEOMETRY - USING YOUR ACTUAL ASSETS!
     */
    async createTerrain() {
        logger.info('🗺️ Creating terrain from ground tile models...');
        
        // Use actual ground path models from Nature MegaKit
        const groundTiles = [
            '/assets/models/nature/RockPath_Round_Wide.gltf',
            '/assets/models/nature/RockPath_Square_Wide.gltf',
            '/assets/models/buildings/Floor_UnevenBrick.gltf'
        ];
        
        // Load ground tile models
        const tileVariants = [];
        for (const tilePath of groundTiles) {
            const tile = await this.modelLoader.load(tilePath);
            if (tile) tileVariants.push(tile);
        }
        
        if (tileVariants.length === 0) {
            logger.error('❌ No ground tiles loaded! Cannot create terrain.');
            return;
        }
        
        logger.info(`   Using ${tileVariants.length} ground tile variants`);
        
        // Create terrain grid using actual tile models
        const tileSize = 10; // Size of each tile
        const tilesX = Math.floor(this.worldSize / tileSize);
        const tilesZ = Math.floor(this.worldSize / tileSize);
        
        let tileCount = 0;
        
        for (let x = 0; x < tilesX; x++) {
            for (let z = 0; z < tilesZ; z++) {
                // Pick a random tile variant and clone it
                const variant = tileVariants[Math.floor(Math.random() * tileVariants.length)];
                const tile = variant.clone();
                
                // Position tile
                const posX = (x - tilesX / 2) * tileSize;
                const posZ = (z - tilesZ / 2) * tileSize;
                tile.position.set(posX, 0, posZ);
                
                // Random rotation for variety
                tile.rotation.y = Math.floor(Math.random() * 4) * (Math.PI / 2);
                
                // Scale to fit tileSize
                tile.scale.setScalar(tileSize / 2);
                
                tile.receiveShadow = true;
                
                this.scene.add(tile);
                this.terrain = tile; // Keep reference to first tile
                tileCount++;
            }
        }
        
        logger.info(`   ✅ Created terrain with ${tileCount} ground tile models`);
    }
    
    /**
     * Get terrain height at position (for object placement)
     */
    getTerrainHeight(x, z) {
        // Simple flat terrain since we're using tile models
        return 0;
    }
    
    /**
     * Plant forest with varied trees
     * OPTIMIZED: Uses model caching - only loads each unique tree once, then clones!
     */
    async plantForest() {
        logger.info('🌲 Planting forest...');
        
        const treeCount = 150; // Dense forest
        
        // Load a few tree variants once
        const treeVariants = [
            await this.modelLoader.load(this.assetRegistry.getRandomTree()),
            await this.modelLoader.load(this.assetRegistry.getRandomTree()),
            await this.modelLoader.load(this.assetRegistry.getRandomTree())
        ].filter(t => t !== null);
        
        if (treeVariants.length === 0) {
            logger.warn('   ⚠️ No tree models loaded, using fallbacks');
            // Create all fallback trees
            for (let i = 0; i < treeCount; i++) {
                this.createFallbackTree(i);
            }
            return;
        }
        
        logger.info(`   Using ${treeVariants.length} tree variants for ${treeCount} trees`);
        
        // Now plant trees by cloning the loaded variants (instant!)
        for (let i = 0; i < treeCount; i++) {
            try {
                // Pick a random variant and clone it (instant since it's cached)
                const variant = treeVariants[i % treeVariants.length];
                const tree = variant.clone();
                
                // Position in forest pattern
                const angle = (i / 150) * Math.PI * 2 + Math.random() * 0.5;
                const radius = 10 + Math.random() * 80;
                const x = Math.cos(angle) * radius;
                const z = Math.sin(angle) * radius;
                
                tree.position.set(x, this.getTerrainHeight(x, z), z);
                tree.rotation.y = Math.random() * Math.PI * 2;
                
                // Scale variation
                const scale = 0.8 + Math.random() * 0.6;
                tree.scale.setScalar(scale);
                
                tree.castShadow = true;
                tree.receiveShadow = true;
                
                this.scene.add(tree);
                this.trees.push(tree);
                
                // Progress feedback every 25 trees
                if ((i + 1) % 25 === 0) {
                    logger.info(`   🌲 Planted ${i + 1}/${treeCount} trees...`);
                }
            } catch (error) {
                this.createFallbackTree(i);
            }
        }
        
        logger.info(`   ✅ Planted ${this.trees.length} trees`);
    }
    
    /**
     * Place a single tree
     */
    async placeTree(index) {
        try {
            const treePath = this.assetRegistry.getRandomTree();
            const model = await this.modelLoader.load(treePath);
            
            if (!model) {
                // Fallback tree
                return this.createFallbackTree(index);
            }
            
            // Position in forest pattern (clustered but not overlapping)
            const angle = (index / 150) * Math.PI * 2 + Math.random() * 0.5;
            const radius = 10 + Math.random() * 80;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            
            model.position.set(x, this.getTerrainHeight(x, z), z);
            model.rotation.y = Math.random() * Math.PI * 2;
            
            // Scale variation for natural look
            const scale = 0.8 + Math.random() * 0.6;
            model.scale.setScalar(scale);
            
            model.castShadow = true;
            model.receiveShadow = true;
            
            this.scene.add(model);
            this.trees.push(model);
            
            return model;
        } catch (error) {
            return this.createFallbackTree(index);
        }
    }
    
    /**
     * Create a fallback tree if model fails to load
     */
    createFallbackTree(index) {
        // Simple tree made of primitives
        const group = new THREE.Group();
        
        // Trunk
        const trunkGeom = new THREE.CylinderGeometry(0.3, 0.4, 4, 8);
        const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4a2511 });
        const trunk = new THREE.Mesh(trunkGeom, trunkMat);
        trunk.position.y = 2;
        trunk.castShadow = true;
        group.add(trunk);
        
        // Foliage - 3 spheres
        const foliageGeom = new THREE.SphereGeometry(2, 8, 8);
        const foliageMat = new THREE.MeshStandardMaterial({ color: 0x2d5016 });
        
        for (let i = 0; i < 3; i++) {
            const foliage = new THREE.Mesh(foliageGeom, foliageMat);
            foliage.position.y = 3.5 + i * 1;
            foliage.position.x = (Math.random() - 0.5) * 0.5;
            foliage.position.z = (Math.random() - 0.5) * 0.5;
            foliage.scale.setScalar(0.8 + i * 0.2);
            foliage.castShadow = true;
            group.add(foliage);
        }
        
        // Position
        const angle = (index / 150) * Math.PI * 2 + Math.random() * 0.5;
        const radius = 10 + Math.random() * 80;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        group.position.set(x, this.getTerrainHeight(x, z), z);
        
        this.scene.add(group);
        this.trees.push(group);
        
        return group;
    }
    
    /**
     * Add rocks scattered throughout
     * OPTIMIZED: Load once, clone many times!
     */
    async addRocks() {
        logger.info('🪨 Adding rocks...');
        
        const rockCount = 80;
        
        // Load 2-3 rock variants once
        const rockVariants = [
            await this.modelLoader.load(this.assetRegistry.getRandomRock()),
            await this.modelLoader.load(this.assetRegistry.getRandomRock())
        ].filter(r => r !== null);
        
        if (rockVariants.length === 0) {
            logger.warn('   ⚠️ No rock models, using fallbacks');
            for (let i = 0; i < rockCount; i++) {
                this.createFallbackRock(i);
            }
            return;
        }
        
        // Clone rocks quickly
        for (let i = 0; i < rockCount; i++) {
            try {
                const variant = rockVariants[i % rockVariants.length];
                const rock = variant.clone();
                
                const angle = Math.random() * Math.PI * 2;
                const radius = Math.random() * 90;
                const x = Math.cos(angle) * radius;
                const z = Math.sin(angle) * radius;
                
                rock.position.set(x, this.getTerrainHeight(x, z), z);
                rock.rotation.set(
                    (Math.random() - 0.5) * 0.3,
                    Math.random() * Math.PI * 2,
                    (Math.random() - 0.5) * 0.3
                );
                
                const scale = 0.5 + Math.random() * 1.5;
                rock.scale.setScalar(scale);
                
                rock.castShadow = true;
                rock.receiveShadow = true;
                
                this.scene.add(rock);
                this.rocks.push(rock);
            } catch (error) {
                this.createFallbackRock(i);
            }
        }
        
        logger.info(`   ✅ Added ${this.rocks.length} rocks`);
    }
    
    /**
     * Create fallback rock
     */
    createFallbackRock(index) {
        const geometry = new THREE.DodecahedronGeometry(0.5 + Math.random(), 0);
        const material = new THREE.MeshStandardMaterial({ 
            color: 0x666666,
            roughness: 0.8 
        });
        const rock = new THREE.Mesh(geometry, material);
        
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 90;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        rock.position.set(x, this.getTerrainHeight(x, z), z);
        rock.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        
        const scale = 0.5 + Math.random() * 1.5;
        rock.scale.setScalar(scale);
        
        rock.castShadow = true;
        rock.receiveShadow = true;
        
        this.scene.add(rock);
        this.rocks.push(rock);
    }
    
    /**
     * Add ground cover (grass, flowers, plants)
     * OPTIMIZED: Load once, clone many times!
     */
    async addGroundCover() {
        logger.info('🌿 Adding ground cover...');
        
        const plantCount = 200;
        
        // Load 2-3 plant variants once
        const plantVariants = [
            await this.modelLoader.load(this.assetRegistry.getRandomPlant()),
            await this.modelLoader.load(this.assetRegistry.getRandomPlant())
        ].filter(p => p !== null);
        
        if (plantVariants.length === 0) {
            logger.warn('   ⚠️ No plant models loaded, skipping ground cover');
            return;
        }
        
        // Clone plants quickly
        for (let i = 0; i < plantCount; i++) {
            try {
                const variant = plantVariants[i % plantVariants.length];
                const plant = variant.clone();
                
                const angle = Math.random() * Math.PI * 2;
                const radius = Math.random() * 95;
                const x = Math.cos(angle) * radius;
                const z = Math.sin(angle) * radius;
                
                plant.position.set(x, this.getTerrainHeight(x, z), z);
                plant.rotation.y = Math.random() * Math.PI * 2;
                
                const scale = 0.5 + Math.random() * 0.5;
                plant.scale.setScalar(scale);
                
                this.scene.add(plant);
                this.plants.push(plant);
            } catch (error) {
                // Skip failed plants
            }
        }
        
        logger.info(`   ✅ Added ${this.plants.length} plants`);
    }
    
    /**
     * Build the Ancient Tree of Beginnings (centerpiece)
     */
    async buildAncientTree() {
        logger.info('🌳 Building Ancient Tree of Beginnings...');
        
        // Massive tree in center
        const group = new THREE.Group();
        
        // Huge trunk
        const trunkGeom = new THREE.CylinderGeometry(2, 3, 20, 12);
        const trunkMat = new THREE.MeshStandardMaterial({ 
            color: 0x3a1f0f,
            roughness: 0.9
        });
        const trunk = new THREE.Mesh(trunkGeom, trunkMat);
        trunk.position.y = 10;
        trunk.castShadow = true;
        group.add(trunk);
        
        // Massive canopy
        const canopyGeom = new THREE.SphereGeometry(12, 16, 16);
        const canopyMat = new THREE.MeshStandardMaterial({ 
            color: 0x1a4d2e,
            emissive: 0x00ff44,
            emissiveIntensity: 0.2
        });
        const canopy = new THREE.Mesh(canopyGeom, canopyMat);
        canopy.position.y = 20;
        canopy.castShadow = true;
        group.add(canopy);
        
        // Glowing effect
        const glowLight = new THREE.PointLight(0x00ff44, 2, 30);
        glowLight.position.y = 20;
        group.add(glowLight);
        
        group.position.set(0, 0, 0);
        this.scene.add(group);
        
        logger.info('   ✅ Ancient Tree created');
    }
    
    /**
     * Build Moonlit Glade (hidden village area)
     */
    async buildMoonlitGlade() {
        logger.info('🏘️ Building Moonlit Glade...');
        
        const gladeCenter = { x: 50, z: 50 };
        
        // Try to load village structures
        const structureCount = 5;
        
        for (let i = 0; i < structureCount; i++) {
            try {
                // Try to get a building prop
                const propPath = this.assetRegistry.getProp('furniture');
                if (propPath) {
                    const model = await this.modelLoader.load(propPath);
                    if (model) {
                        const angle = (i / structureCount) * Math.PI * 2;
                        const radius = 10;
                        const x = gladeCenter.x + Math.cos(angle) * radius;
                        const z = gladeCenter.z + Math.sin(angle) * radius;
                        
                        model.position.set(x, this.getTerrainHeight(x, z), z);
                        model.rotation.y = angle + Math.PI;
                        model.scale.setScalar(2);
                        
                        this.scene.add(model);
                        this.structures.push(model);
                    }
                }
            } catch (error) {
                // Create simple structure fallback
                const hut = this.createSimpleHut(i, gladeCenter);
                this.structures.push(hut);
            }
        }
        
        // Add mystical light to glade
        const gladeLight = new THREE.PointLight(0xaaccff, 1.5, 40);
        gladeLight.position.set(gladeCenter.x, 10, gladeCenter.z);
        this.scene.add(gladeLight);
        
        logger.info('   ✅ Moonlit Glade created');
    }
    
    /**
     * Create simple hut fallback
     */
    createSimpleHut(index, center) {
        const group = new THREE.Group();
        
        // Walls
        const wallGeom = new THREE.BoxGeometry(4, 3, 4);
        const wallMat = new THREE.MeshStandardMaterial({ color: 0x8b6f47 });
        const walls = new THREE.Mesh(wallGeom, wallMat);
        walls.position.y = 1.5;
        walls.castShadow = true;
        group.add(walls);
        
        // Roof
        const roofGeom = new THREE.ConeGeometry(3.5, 2, 4);
        const roofMat = new THREE.MeshStandardMaterial({ color: 0x654321 });
        const roof = new THREE.Mesh(roofGeom, roofMat);
        roof.position.y = 4;
        roof.rotation.y = Math.PI / 4;
        roof.castShadow = true;
        group.add(roof);
        
        const angle = (index / 5) * Math.PI * 2;
        const radius = 10;
        const x = center.x + Math.cos(angle) * radius;
        const z = center.z + Math.sin(angle) * radius;
        
        group.position.set(x, this.getTerrainHeight(x, z), z);
        group.rotation.y = angle + Math.PI;
        
        this.scene.add(group);
        return group;
    }
    
    /**
     * Add atmospheric mist/fog particles
     */
    addMist() {
        const particleCount = 1000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * this.worldSize;
            positions[i + 1] = Math.random() * 10;
            positions[i + 2] = (Math.random() - 0.5) * this.worldSize;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const material = new THREE.PointsMaterial({
            color: 0xaaccee,
            size: 2,
            transparent: true,
            opacity: 0.3,
            blending: THREE.AdditiveBlending
        });
        
        const mist = new THREE.Points(geometry, material);
        this.scene.add(mist);
        
        // Animate mist slowly
        const animateMist = () => {
            const positions = mist.geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                positions[i + 1] += Math.sin(Date.now() * 0.001 + i) * 0.01;
            }
            mist.geometry.attributes.position.needsUpdate = true;
            requestAnimationFrame(animateMist);
        };
        animateMist();
    }
    
    /**
     * Add magical glowing particles
     */
    addGlowingParticles() {
        const particleCount = 500;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * this.worldSize * 0.8;
            positions[i + 1] = Math.random() * 15 + 1;
            positions[i + 2] = (Math.random() - 0.5) * this.worldSize * 0.8;
            
            // Mystical colors - cyan, green, blue
            const colorChoice = Math.random();
            if (colorChoice < 0.33) {
                colors[i] = 0;
                colors[i + 1] = 1;
                colors[i + 2] = 1;
            } else if (colorChoice < 0.66) {
                colors[i] = 0;
                colors[i + 1] = 1;
                colors[i + 2] = 0.5;
            } else {
                colors[i] = 0.3;
                colors[i + 1] = 0.6;
                colors[i + 2] = 1;
            }
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 0.5,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        
        const particles = new THREE.Points(geometry, material);
        this.scene.add(particles);
        
        // Animate particles floating
        const animateParticles = () => {
            const time = Date.now() * 0.001;
            const positions = particles.geometry.attributes.position.array;
            
            for (let i = 0; i < positions.length; i += 3) {
                positions[i + 1] += Math.sin(time + i) * 0.02;
                positions[i] += Math.cos(time * 0.5 + i) * 0.01;
            }
            
            particles.geometry.attributes.position.needsUpdate = true;
            particles.rotation.y += 0.0005;
            
            requestAnimationFrame(animateParticles);
        };
        animateParticles();
    }
    
    /**
     * Get terrain height at X, Z position
     */
    getTerrainHeight(x, z) {
        // Simple height calculation matching terrain generation
        return Math.sin(x * 0.02) * 2 + Math.cos(z * 0.03) * 1.5;
    }
    
    /**
     * Cleanup biome
     */
    destroy() {
        // Remove all objects
        [...this.trees, ...this.rocks, ...this.plants, ...this.structures].forEach(obj => {
            this.scene.remove(obj);
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) obj.material.dispose();
        });
        
        if (this.terrain) {
            this.scene.remove(this.terrain);
            this.terrain.geometry.dispose();
            this.terrain.material.dispose();
        }
        
        this.trees = [];
        this.rocks = [];
        this.plants = [];
        this.structures = [];
    }
}
