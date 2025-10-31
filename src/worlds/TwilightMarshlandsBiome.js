/**
import { logger } from '../core/Logger.js';
 * Twilight Marshlands Biome - Swamp Zone (Level 25-40)
 * Per README: Murky swamps with poisonous plants
 * 
 * Features:
 * - Murky swamps with poisonous plants
 * - Swamp dragons, plague rats, corrupt ents, frogs
 * - Rare alchemical ingredients, mushrooms
 * - Witch's Hut, Bog of Despair, Lizardfolk Village
 * - 17+ quests about lifting the marsh curse
 */

import * as THREE from 'three';
import { assetRegistry } from '../core/AssetRegistry.js';

export class TwilightMarshlandsBiome {
    constructor(scene, modelLoader) {
        this.scene = scene;
        this.modelLoader = modelLoader;
        this.assetRegistry = assetRegistry;
        
        this.center = { x: -2000, z: -1000 };
        this.size = 1000;
        
        this.terrain = null;
        this.swampTrees = [];
        this.mushrooms = [];
        this.structures = [];
    }
    
    async build() {
        logger.info('🐸 Building Twilight Marshlands Biome...');
        
        try {
            await this.setupEnvironment();
            await this.createSwampTerrain();
            await this.addSwampTrees();
            await this.addMushrooms();
            await this.buildWitchsHut();
            await this.buildLizardfolkVillage();
            
            logger.info('✅ Twilight Marshlands complete!');
            logger.info(`   - Swamp trees: ${this.swampTrees.length}`);
            logger.info(`   - Mushrooms: ${this.mushrooms.length}`);
            logger.info(`   - Structures: ${this.structures.length}`);
        } catch (error) {
            logger.error('Error building Twilight Marshlands:', error);
        }
    }
    
    async setupEnvironment() {
        // Use dark greenish skybox
        const textureLoader = new THREE.TextureLoader();
        
        try {
            const skyboxTexture = await new Promise((resolve, reject) => {
                textureLoader.load('/assets/skyboxes/GreenSky.png', resolve, undefined, reject);
            });
            
            const skyGeo = new THREE.SphereGeometry(500, 32, 32);
            const skyMat = new THREE.MeshBasicMaterial({ map: skyboxTexture, side: THREE.BackSide });
            this.scene.add(new THREE.Mesh(skyGeo, skyMat));
        } catch (error) {
            this.scene.background = new THREE.Color(0x3a4a3a);
        }
        
        // Thick green fog
        this.scene.fog = new THREE.FogExp2(0x4a5a4a, 0.018);
        
        // Dim greenish lighting
        const ambient = new THREE.AmbientLight(0x6a7a6a, 0.4);
        this.scene.add(ambient);
        
        const swampLight = new THREE.DirectionalLight(0x8a9a7a, 0.6);
        swampLight.position.set(40, 80, 40);
        swampLight.castShadow = true;
        this.scene.add(swampLight);
        
        // Add eerie green lights
        for (let i = 0; i < 12; i++) {
            const light = new THREE.PointLight(0x44ff44, 0.5, 25);
            const angle = (i / 12) * Math.PI * 2;
            const radius = 35 + Math.random() * 50;
            light.position.set(
                Math.cos(angle) * radius,
                1,
                Math.sin(angle) * radius
            );
            this.scene.add(light);
        }
    }
    
    async createSwampTerrain() {
        logger.info('🗺️ Creating swamp terrain...');
        
        const groundTiles = [
            '/assets/models/buildings/Floor_UnevenBrick.gltf',
            '/assets/models/nature/RockPath_Round_Wide.gltf'
        ];
        
        const tileVariants = [];
        for (const tilePath of groundTiles) {
            const tile = await this.modelLoader.load(tilePath);
            if (tile) tileVariants.push(tile);
        }
        
        if (tileVariants.length === 0) return;
        
        const tileSize = 10;
        const tilesX = 20;
        const tilesZ = 20;
        
        for (let x = 0; x < tilesX; x++) {
            for (let z = 0; z < tilesZ; z++) {
                const variant = tileVariants[Math.floor(Math.random() * tileVariants.length)];
                const tile = variant.clone();
                
                const posX = (x - tilesX / 2) * tileSize;
                const posZ = (z - tilesZ / 2) * tileSize;
                tile.position.set(posX, -1, posZ);
                tile.rotation.y = Math.floor(Math.random() * 4) * (Math.PI / 2);
                tile.scale.setScalar(tileSize / 2);
                tile.receiveShadow = true;
                
                // Dark muddy green tint
                tile.traverse((child) => {
                    if (child.isMesh) {
                        child.material = child.material.clone();
                        child.material.color.set(0x3a4a2a);
                        child.material.roughness = 0.95;
                    }
                });
                
                this.scene.add(tile);
            }
        }
        
        logger.info('   ✅ Swamp terrain created');
    }
    
    async addSwampTrees() {
        logger.info('🌳 Adding swamp trees...');
        
        const treeCount = 80;
        const deadTreePath = '/assets/models/nature/DeadTree_1.gltf';
        const treeModel = await this.modelLoader.load(deadTreePath);
        
        if (!treeModel) return;
        
        for (let i = 0; i < treeCount; i++) {
            const tree = treeModel.clone();
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 90;
            
            tree.position.set(
                Math.cos(angle) * radius,
                -0.5,
                Math.sin(angle) * radius
            );
            tree.rotation.y = Math.random() * Math.PI * 2;
            tree.scale.setScalar(1 + Math.random() * 0.5);
            
            // Dark mossy appearance
            tree.traverse((child) => {
                if (child.isMesh) {
                    child.material = child.material.clone();
                    child.material.color.multiplyScalar(0.5);
                    child.material.color.g *= 1.2;
                }
            });
            
            this.scene.add(tree);
            this.swampTrees.push(tree);
        }
        
        logger.info(`   ✅ Added ${this.swampTrees.length} swamp trees`);
    }
    
    async addMushrooms() {
        logger.info('🍄 Adding poisonous mushrooms...');
        
        const mushroomCount = 60;
        const plantPath = this.assetRegistry.getRandomPlant();
        const mushroomBase = await this.modelLoader.load(plantPath);
        
        if (!mushroomBase) return;
        
        for (let i = 0; i < mushroomCount; i++) {
            const mushroom = mushroomBase.clone();
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 85;
            
            mushroom.position.set(
                Math.cos(angle) * radius,
                -0.5,
                Math.sin(angle) * radius
            );
            
            // Mushroom shape - wide cap
            mushroom.scale.set(
                1.5 + Math.random(),
                0.8 + Math.random() * 0.4,
                1.5 + Math.random()
            );
            
            // Toxic purple/green color
            mushroom.traverse((child) => {
                if (child.isMesh) {
                    const color = Math.random() > 0.5 ? 0x9944ff : 0x44ff99;
                    child.material = new THREE.MeshStandardMaterial({
                        color,
                        emissive: color,
                        emissiveIntensity: 0.3
                    });
                }
            });
            
            this.scene.add(mushroom);
            this.mushrooms.push(mushroom);
        }
        
        logger.info(`   ✅ Added ${this.mushrooms.length} mushrooms`);
    }
    
    async buildWitchsHut() {
        logger.info('🧙 Building Witch\'s Hut (potions shop)...');
        
        const buildingPath = '/assets/models/buildings/Wall_Wood.gltf';
        const hut = await this.modelLoader.load(buildingPath);
        
        if (hut) {
            hut.position.set(-50, -0.5, -50);
            hut.scale.setScalar(2);
            
            hut.traverse((child) => {
                if (child.isMesh) {
                    child.material = child.material.clone();
                    child.material.color.set(0x3a2a1a);
                }
            });
            
            this.scene.add(hut);
            this.structures.push({ name: 'Witch\'s Hut', type: 'shop' });
            logger.info('   ✅ Witch\'s Hut created');
        }
    }
    
    async buildLizardfolkVillage() {
        logger.info('🦎 Building Lizardfolk Village...');
        
        const buildingPaths = [
            '/assets/models/props/Barrel.gltf',
            '/assets/models/props/Chest_Wood.gltf'
        ];
        
        let buildingCount = 0;
        for (let i = 0; i < 5; i++) {
            const path = buildingPaths[i % buildingPaths.length];
            const structure = await this.modelLoader.load(path);
            if (structure) {
                const angle = (i / 5) * Math.PI * 2;
                structure.position.set(
                    Math.cos(angle) * 30 + 50,
                    -0.5,
                    Math.sin(angle) * 30 + 50
                );
                this.scene.add(structure);
                buildingCount++;
            }
        }
        
        this.structures.push({ name: 'Lizardfolk Village', type: 'settlement', buildings: buildingCount });
        logger.info(`   ✅ Lizardfolk Village built with ${buildingCount} structures`);
    }
}
