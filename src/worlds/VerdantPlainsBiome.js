/**
 * Verdant Plains Biome - Grassland Zone (Level 10-25)
 * Per README: Rolling hills with scattered villages
 * 
 * Features:
 * - Rolling hills with scattered villages
 * - Centaurs, griffins, wild horses, cattle
 * - Wheat, cotton, basic materials
 * - Harvest Town, Windmill Hill, Nomad Camp
 * - 16+ quests about protecting villagers
 */

import * as THREE from 'three';
import { assetRegistry } from '../core/AssetRegistry.js';

export class VerdantPlainsBiome {
    constructor(scene, modelLoader) {
        this.scene = scene;
        this.modelLoader = modelLoader;
        this.assetRegistry = assetRegistry;
        
        this.center = { x: -2000, z: 0 };
        this.size = 1000;
        
        this.terrain = null;
        this.grass = [];
        this.flowers = [];
        this.structures = [];
    }
    
    async build() {
        console.log('🌾 Building Verdant Plains Biome...');
        
        try {
            await this.setupEnvironment();
            await this.createGrasslandTerrain();
            await this.addGrassFields();
            await this.addFlowers();
            await this.buildHarvestTown();
            await this.buildWindmillHill();
            
            console.log('✅ Verdant Plains complete!');
            console.log(`   - Grass patches: ${this.grass.length}`);
            console.log(`   - Flowers: ${this.flowers.length}`);
            console.log(`   - Structures: ${this.structures.length}`);
        } catch (error) {
            console.error('Error building Verdant Plains:', error);
        }
    }
    
    async setupEnvironment() {
        // Use bright green/blue skybox for peaceful plains
        const textureLoader = new THREE.TextureLoader();
        
        try {
            const skyboxTexture = await new Promise((resolve, reject) => {
                textureLoader.load('/assets/skyboxes/GreenSky.png', resolve, undefined, reject);
            });
            
            const skyGeo = new THREE.SphereGeometry(500, 32, 32);
            const skyMat = new THREE.MeshBasicMaterial({ map: skyboxTexture, side: THREE.BackSide });
            this.scene.add(new THREE.Mesh(skyGeo, skyMat));
        } catch (error) {
            this.scene.background = new THREE.Color(0x87CEEB);
        }
        
        // Light fog for pastoral feel
        this.scene.fog = new THREE.FogExp2(0xa0d0ff, 0.005);
        
        // Bright sunny lighting
        const ambient = new THREE.AmbientLight(0xffffee, 0.9);
        this.scene.add(ambient);
        
        const sunlight = new THREE.DirectionalLight(0xffffaa, 1.2);
        sunlight.position.set(80, 150, 50);
        sunlight.castShadow = true;
        this.scene.add(sunlight);
    }
    
    async createGrasslandTerrain() {
        console.log('🗺️ Creating grassland terrain...');
        
        const groundTiles = [
            '/assets/models/buildings/Floor_WoodLight.gltf',
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
                tile.position.set(posX, 0, posZ);
                tile.rotation.y = Math.floor(Math.random() * 4) * (Math.PI / 2);
                tile.scale.setScalar(tileSize / 2);
                tile.receiveShadow = true;
                
                // Light green tint for grassland
                tile.traverse((child) => {
                    if (child.isMesh) {
                        child.material = child.material.clone();
                        child.material.color.r = Math.min(1, child.material.color.r * 0.9);
                        child.material.color.g = Math.min(1, child.material.color.g * 1.2);
                        child.material.color.b = Math.min(1, child.material.color.b * 0.9);
                    }
                });
                
                this.scene.add(tile);
            }
        }
        
        console.log('   ✅ Grassland terrain created');
    }
    
    async addGrassFields() {
        console.log('🌱 Adding grass fields...');
        
        const grassCount = 200;
        const grassPaths = [
            '/assets/models/nature/Grass_Common_Tall.gltf',
            '/assets/models/nature/Grass_Common_Short.gltf'
        ];
        
        const grassVariants = [];
        for (const path of grassPaths) {
            const grass = await this.modelLoader.load(path);
            if (grass) grassVariants.push(grass);
        }
        
        if (grassVariants.length === 0) return;
        
        for (let i = 0; i < grassCount; i++) {
            const variant = grassVariants[i % grassVariants.length];
            const grass = variant.clone();
            
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 95;
            
            grass.position.set(
                Math.cos(angle) * radius,
                0,
                Math.sin(angle) * radius
            );
            grass.rotation.y = Math.random() * Math.PI * 2;
            grass.scale.setScalar(1 + Math.random() * 0.5);
            
            this.scene.add(grass);
            this.grass.push(grass);
        }
        
        console.log(`   ✅ Added ${this.grass.length} grass patches`);
    }
    
    async addFlowers() {
        console.log('🌸 Adding wildflowers...');
        
        const flowerCount = 100;
        const flowerPaths = [
            '/assets/models/nature/Flower_3_Single.gltf',
            '/assets/models/nature/Flower_4_Single.gltf'
        ];
        
        const flowerVariants = [];
        for (const path of flowerPaths) {
            const flower = await this.modelLoader.load(path);
            if (flower) flowerVariants.push(flower);
        }
        
        if (flowerVariants.length === 0) return;
        
        for (let i = 0; i < flowerCount; i++) {
            const variant = flowerVariants[i % flowerVariants.length];
            const flower = variant.clone();
            
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 90;
            
            flower.position.set(
                Math.cos(angle) * radius,
                0,
                Math.sin(angle) * radius
            );
            flower.rotation.y = Math.random() * Math.PI * 2;
            flower.scale.setScalar(0.8 + Math.random() * 0.4);
            
            this.scene.add(flower);
            this.flowers.push(flower);
        }
        
        console.log(`   ✅ Added ${this.flowers.length} wildflowers`);
    }
    
    async buildHarvestTown() {
        console.log('🏡 Building Harvest Town (farming village)...');
        
        const buildingPaths = [
            '/assets/models/buildings/Wall_Wood.gltf',
            '/assets/models/buildings/Door_1_Flat.gltf',
            '/assets/models/props/Barrel.gltf'
        ];
        
        let buildingCount = 0;
        for (let i = 0; i < 8; i++) {
            const path = buildingPaths[i % buildingPaths.length];
            const building = await this.modelLoader.load(path);
            if (building) {
                const angle = (i / 8) * Math.PI * 2;
                const radius = 40;
                
                building.position.set(
                    Math.cos(angle) * radius,
                    0,
                    Math.sin(angle) * radius
                );
                building.scale.setScalar(2);
                building.rotation.y = angle + Math.PI;
                
                this.scene.add(building);
                buildingCount++;
            }
        }
        
        this.structures.push({ name: 'Harvest Town', type: 'village', buildings: buildingCount });
        console.log(`   ✅ Harvest Town built with ${buildingCount} structures`);
    }
    
    async buildWindmillHill() {
        console.log('🌬️ Building Windmill Hill...');
        
        // Create windmill using props
        const windmillBase = await this.modelLoader.load('/assets/models/buildings/Wall_Wood.gltf');
        if (windmillBase) {
            windmillBase.position.set(60, 5, 60);
            windmillBase.scale.setScalar(3);
            this.scene.add(windmillBase);
            
            this.structures.push({ name: 'Windmill Hill', type: 'landmark' });
            console.log('   ✅ Windmill Hill created');
        }
    }
}
