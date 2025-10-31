/**
 * Azure Depths Biome - Underwater Zone (Level 20-35)
 * Per README: Vast underwater realm with coral cities
 * 
 * Features:
 * - Underwater environment with coral cities
 * - Merfolk, sea serpents, krakens, fish, crabs
 * - Pearls, underwater plants, sea crystals
 * - Atlantean Ruins, Coral Palace, Trench of Shadows
 * - 18+ quests about mer-people and ancient sea gods
 */

import * as THREE from 'three';
import { assetRegistry } from '../core/AssetRegistry.js';

export class AzureDepthsBiome {
    constructor(scene, modelLoader) {
        this.scene = scene;
        this.modelLoader = modelLoader;
        this.assetRegistry = assetRegistry;
        
        this.center = { x: -1000, z: 1000 };
        this.size = 1000;
        
        this.terrain = null;
        this.coral = [];
        this.rocks = [];
        this.plants = [];
        this.structures = [];
    }
    
    async build() {
        console.log('🌊 Building Azure Depths Biome...');
        
        try {
            await this.setupEnvironment();
            await this.createUnderwaterTerrain();
            await this.addCoralReefs();
            await this.addSeaPlants();
            await this.addRocks();
            await this.buildAtlanteanRuins();
            await this.buildCoralPalace();
            
            console.log('✅ Azure Depths complete!');
            console.log(`   - Coral: ${this.coral.length}`);
            console.log(`   - Plants: ${this.plants.length}`);
            console.log(`   - Structures: ${this.structures.length}`);
        } catch (error) {
            console.error('Error building Azure Depths:', error);
        }
    }
    
    async setupEnvironment() {
        // Use blue/cyan skybox for underwater feel
        const textureLoader = new THREE.TextureLoader();
        
        try {
            const skyboxTexture = await new Promise((resolve, reject) => {
                textureLoader.load('/assets/skyboxes/BlueSkySkybox.png', resolve, undefined, reject);
            });
            
            const skyGeo = new THREE.SphereGeometry(500, 32, 32);
            const skyMat = new THREE.MeshBasicMaterial({ map: skyboxTexture, side: THREE.BackSide });
            this.scene.add(new THREE.Mesh(skyGeo, skyMat));
        } catch (error) {
            this.scene.background = new THREE.Color(0x1a4a6a);
        }
        
        // Underwater fog
        this.scene.fog = new THREE.FogExp2(0x2a5a7a, 0.015);
        
        // Blue-tinted lighting
        const ambient = new THREE.AmbientLight(0x4a7c9c, 0.5);
        this.scene.add(ambient);
        
        const sunlight = new THREE.DirectionalLight(0x6ac5ff, 0.6);
        sunlight.position.set(30, 80, 30);
        sunlight.castShadow = true;
        this.scene.add(sunlight);
    }
    
    async createUnderwaterTerrain() {
        console.log('🗺️ Creating underwater terrain...');
        
        const groundTiles = [
            '/assets/models/nature/RockPath_Round_Wide.gltf',
            '/assets/models/buildings/Floor_UnevenBrick.gltf'
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
                tile.position.set(posX, -5, posZ);
                tile.rotation.y = Math.floor(Math.random() * 4) * (Math.PI / 2);
                tile.scale.setScalar(tileSize / 2);
                tile.receiveShadow = true;
                
                // Tint blue for underwater
                tile.traverse((child) => {
                    if (child.isMesh) {
                        child.material = child.material.clone();
                        child.material.color.multiplyScalar(0.6);
                        child.material.color.b = Math.min(1, child.material.color.b * 1.5);
                    }
                });
                
                this.scene.add(tile);
            }
        }
        
        console.log('   ✅ Underwater terrain created');
    }
    
    async addCoralReefs() {
        console.log('🪸 Adding coral reefs...');
        
        // Use colorful rocks as coral
        const coralCount = 100;
        const rockPath = this.assetRegistry.getRandomRock();
        const coralModel = await this.modelLoader.load(rockPath);
        
        if (!coralModel) return;
        
        const coralColors = [0xff6b9d, 0x9d6bff, 0x6bfff9, 0xffd06b, 0xff6b6b];
        
        for (let i = 0; i < coralCount; i++) {
            const coral = coralModel.clone();
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 95;
            
            coral.position.set(
                Math.cos(angle) * radius,
                Math.random() * 3 - 2,
                Math.sin(angle) * radius
            );
            coral.rotation.set(0, Math.random() * Math.PI * 2, 0);
            coral.scale.setScalar(0.5 + Math.random() * 1);
            
            // Color as coral
            coral.traverse((child) => {
                if (child.isMesh) {
                    const color = coralColors[Math.floor(Math.random() * coralColors.length)];
                    child.material = new THREE.MeshStandardMaterial({ color, roughness: 0.7 });
                }
            });
            
            this.scene.add(coral);
            this.coral.push(coral);
        }
        
        console.log(`   ✅ Added ${this.coral.length} coral pieces`);
    }
    
    async addSeaPlants() {
        console.log('🌿 Adding sea plants...');
        
        const plantCount = 80;
        const plantPath = this.assetRegistry.getRandomPlant();
        const plantModel = await this.modelLoader.load(plantPath);
        
        if (!plantModel) return;
        
        for (let i = 0; i < plantCount; i++) {
            const plant = plantModel.clone();
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 90;
            
            plant.position.set(
                Math.cos(angle) * radius,
                -4,
                Math.sin(angle) * radius
            );
            plant.rotation.y = Math.random() * Math.PI * 2;
            plant.scale.setScalar(1 + Math.random() * 0.5);
            
            this.scene.add(plant);
            this.plants.push(plant);
        }
        
        console.log(`   ✅ Added ${this.plants.length} sea plants`);
    }
    
    async addRocks() {
        console.log('🪨 Adding underwater rocks...');
        
        const rockCount = 60;
        const rockPath = this.assetRegistry.getRandomRock();
        const rockModel = await this.modelLoader.load(rockPath);
        
        if (!rockModel) return;
        
        for (let i = 0; i < rockCount; i++) {
            const rock = rockModel.clone();
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 95;
            
            rock.position.set(
                Math.cos(angle) * radius,
                Math.random() * 5 - 3,
                Math.sin(angle) * radius
            );
            rock.scale.setScalar(1 + Math.random() * 2);
            
            this.scene.add(rock);
            this.rocks.push(rock);
        }
        
        console.log(`   ✅ Added ${this.rocks.length} rocks`);
    }
    
    async buildAtlanteanRuins() {
        console.log('🏛️ Building Atlantean Ruins...');
        // Placeholder for ancient underwater ruins
        this.structures.push({ name: 'Atlantean Ruins', type: 'ruins' });
    }
    
    async buildCoralPalace() {
        console.log('🏰 Building Coral Palace...');
        // Placeholder for merfolk kingdom
        this.structures.push({ name: 'Coral Palace', type: 'palace' });
    }
}
