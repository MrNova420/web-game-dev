/**
 * Frozen Wastes Biome - Ice Zone (Level 40-55)
 * Per README: Endless snow and ice with ancient ruins
 * 
 * Features:
 * - Endless snow and ice with ancient ruins
 * - Frost giants, ice dragons, yetis, polar bears
 * - Ice crystals, frozen timber, rare pelts
 * - Frostheim Stronghold, Eternal Glacier, Aurora Shrine
 * - 19+ quests about ancient ice civilization
 */

import * as THREE from 'three';
import { assetRegistry } from '../core/AssetRegistry.js';

export class FrozenWastesBiome {
    constructor(scene, modelLoader) {
        this.scene = scene;
        this.modelLoader = modelLoader;
        this.assetRegistry = assetRegistry;
        
        this.center = { x: -2000, z: 2000 };
        this.size = 1000;
        
        this.terrain = null;
        this.iceFormations = [];
        this.frozenTrees = [];
        this.structures = [];
    }
    
    async build() {
        console.log('❄️ Building Frozen Wastes Biome...');
        
        try {
            await this.setupEnvironment();
            await this.createIcyTerrain();
            await this.addIceCrystals();
            await this.addFrozenTrees();
            await this.buildFrostheimStronghold();
            await this.buildEternalGlacier();
            
            console.log('✅ Frozen Wastes complete!');
            console.log(`   - Ice formations: ${this.iceFormations.length}`);
            console.log(`   - Frozen trees: ${this.frozenTrees.length}`);
            console.log(`   - Structures: ${this.structures.length}`);
        } catch (error) {
            console.error('Error building Frozen Wastes:', error);
        }
    }
    
    async setupEnvironment() {
        // Use bright blue/white skybox for arctic feel
        const textureLoader = new THREE.TextureLoader();
        
        try {
            const skyboxTexture = await new Promise((resolve, reject) => {
                textureLoader.load('/assets/skyboxes/BlueSkySkybox.png', resolve, undefined, reject);
            });
            
            const skyGeo = new THREE.SphereGeometry(500, 32, 32);
            const skyMat = new THREE.MeshBasicMaterial({ map: skyboxTexture, side: THREE.BackSide });
            this.scene.add(new THREE.Mesh(skyGeo, skyMat));
        } catch (error) {
            this.scene.background = new THREE.Color(0xd0e8ff);
        }
        
        // White fog for blizzard effect
        this.scene.fog = new THREE.FogExp2(0xeef8ff, 0.015);
        
        // Cold blue-white lighting
        const ambient = new THREE.AmbientLight(0xe0f0ff, 0.7);
        this.scene.add(ambient);
        
        const sunlight = new THREE.DirectionalLight(0xffffff, 0.9);
        sunlight.position.set(50, 120, 80);
        sunlight.castShadow = true;
        this.scene.add(sunlight);
        
        // Add blue tinted point lights for aurora effect
        for (let i = 0; i < 10; i++) {
            const light = new THREE.PointLight(0x00ffff, 0.6, 50);
            const angle = (i / 10) * Math.PI * 2;
            const radius = 50 + Math.random() * 40;
            light.position.set(
                Math.cos(angle) * radius,
                20 + Math.random() * 30,
                Math.sin(angle) * radius
            );
            this.scene.add(light);
        }
    }
    
    async createIcyTerrain() {
        console.log('🗺️ Creating icy terrain...');
        
        const groundTiles = [
            '/assets/models/buildings/Floor_Brick.gltf',
            '/assets/models/nature/RockPath_Square_Wide.gltf'
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
                
                // White/blue tint for ice
                tile.traverse((child) => {
                    if (child.isMesh) {
                        child.material = child.material.clone();
                        child.material.color.set(0xddeeff);
                        child.material.roughness = 0.2;
                        child.material.metalness = 0.6;
                    }
                });
                
                this.scene.add(tile);
            }
        }
        
        console.log('   ✅ Icy terrain created');
    }
    
    async addIceCrystals() {
        console.log('💎 Adding ice crystals...');
        
        const crystalCount = 80;
        const rockPath = this.assetRegistry.getRandomRock();
        const crystalBase = await this.modelLoader.load(rockPath);
        
        if (!crystalBase) return;
        
        for (let i = 0; i < crystalCount; i++) {
            const crystal = crystalBase.clone();
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 95;
            
            crystal.position.set(
                Math.cos(angle) * radius,
                1,
                Math.sin(angle) * radius
            );
            
            // Tall icy crystal shape
            crystal.scale.set(
                0.5 + Math.random() * 0.5,
                2 + Math.random() * 3,
                0.5 + Math.random() * 0.5
            );
            crystal.rotation.set(
                Math.random() * 0.3,
                Math.random() * Math.PI * 2,
                Math.random() * 0.3
            );
            
            // Icy blue crystal material
            crystal.traverse((child) => {
                if (child.isMesh) {
                    child.material = new THREE.MeshStandardMaterial({
                        color: 0xaaddff,
                        emissive: 0x88ccff,
                        emissiveIntensity: 0.3,
                        roughness: 0.1,
                        metalness: 0.9,
                        transparent: true,
                        opacity: 0.8
                    });
                }
            });
            
            this.scene.add(crystal);
            this.iceFormations.push(crystal);
        }
        
        console.log(`   ✅ Added ${this.iceFormations.length} ice crystals`);
    }
    
    async addFrozenTrees() {
        console.log('🌲 Adding frozen trees...');
        
        const treeCount = 60;
        const deadTreePath = '/assets/models/nature/DeadTree_1.gltf';
        const treeModel = await this.modelLoader.load(deadTreePath);
        
        if (!treeModel) return;
        
        for (let i = 0; i < treeCount; i++) {
            const tree = treeModel.clone();
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 90;
            
            tree.position.set(
                Math.cos(angle) * radius,
                0,
                Math.sin(angle) * radius
            );
            tree.rotation.y = Math.random() * Math.PI * 2;
            tree.scale.setScalar(0.9 + Math.random() * 0.4);
            
            // Frost-covered appearance
            tree.traverse((child) => {
                if (child.isMesh) {
                    child.material = child.material.clone();
                    child.material.color.multiplyScalar(1.5);
                    child.material.color.b = 1.0;
                }
            });
            
            this.scene.add(tree);
            this.frozenTrees.push(tree);
        }
        
        console.log(`   ✅ Added ${this.frozenTrees.length} frozen trees`);
    }
    
    async buildFrostheimStronghold() {
        console.log('🏰 Building Frostheim Stronghold (ice fortress)...');
        
        const buildingPaths = [
            '/assets/models/buildings/Wall_Brick.gltf',
            '/assets/models/buildings/Door_8_Flat.gltf'
        ];
        
        let buildingCount = 0;
        for (const path of buildingPaths) {
            const building = await this.modelLoader.load(path);
            if (building) {
                building.position.set(-70, 0, -70);
                building.scale.setScalar(4);
                
                building.traverse((child) => {
                    if (child.isMesh) {
                        child.material = child.material.clone();
                        child.material.color.set(0xccddff);
                    }
                });
                
                this.scene.add(building);
                buildingCount++;
            }
        }
        
        this.structures.push({ name: 'Frostheim Stronghold', type: 'fortress', buildings: buildingCount });
        console.log(`   ✅ Frostheim Stronghold built with ${buildingCount} structures`);
    }
    
    async buildEternalGlacier() {
        console.log('🧊 Building Eternal Glacier (massive ice wall)...');
        
        // Create massive ice wall using scaled rocks
        const rockPath = this.assetRegistry.getRandomRock();
        const glacier = await this.modelLoader.load(rockPath);
        
        if (glacier) {
            glacier.position.set(0, 10, -90);
            glacier.scale.set(30, 40, 10);
            
            glacier.traverse((child) => {
                if (child.isMesh) {
                    child.material = new THREE.MeshStandardMaterial({
                        color: 0xbbddff,
                        roughness: 0.2,
                        metalness: 0.7,
                        transparent: true,
                        opacity: 0.9
                    });
                }
            });
            
            this.scene.add(glacier);
            this.structures.push({ name: 'Eternal Glacier', type: 'landmark' });
            console.log('   ✅ Eternal Glacier created');
        }
    }
}
