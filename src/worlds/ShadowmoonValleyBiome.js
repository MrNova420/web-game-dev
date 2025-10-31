/**
 * Shadowmoon Valley Biome - Dark Zone (Level 30-45)
 * Per README: Perpetual twilight with corrupted landscape
 * 
 * Features:
 * - Perpetual twilight atmosphere
 * - Shadow demons, corrupted beasts, undead, wraiths
 * - Dark crystals, shadowstone, cursed wood
 * - Eclipse Citadel, Graveyard of Heroes, Void Rift
 * - 22+ quests about stopping demonic invasion
 */

import * as THREE from 'three';
import { assetRegistry } from '../core/AssetRegistry.js';

export class ShadowmoonValleyBiome {
    constructor(scene, modelLoader) {
        this.scene = scene;
        this.modelLoader = modelLoader;
        this.assetRegistry = assetRegistry;
        
        this.center = { x: 2000, z: -1000 };
        this.size = 1000;
        
        this.terrain = null;
        this.deadTrees = [];
        this.rocks = [];
        this.darkCrystals = [];
        this.structures = [];
    }
    
    async build() {
        console.log('🌑 Building Shadowmoon Valley Biome...');
        
        try {
            await this.setupEnvironment();
            await this.createCorruptedTerrain();
            await this.addDeadTrees();
            await this.addDarkCrystals();
            await this.addCorruptedRocks();
            await this.buildEclipseCitadel();
            await this.buildGraveyardOfHeroes();
            
            console.log('✅ Shadowmoon Valley complete!');
            console.log(`   - Dead Trees: ${this.deadTrees.length}`);
            console.log(`   - Dark Crystals: ${this.darkCrystals.length}`);
            console.log(`   - Structures: ${this.structures.length}`);
        } catch (error) {
            console.error('Error building Shadowmoon Valley:', error);
        }
    }
    
    async setupEnvironment() {
        // Use purply/dark skybox for twilight
        const textureLoader = new THREE.TextureLoader();
        
        try {
            const skyboxTexture = await new Promise((resolve, reject) => {
                textureLoader.load('/assets/skyboxes/PurplyBlueSky.png', resolve, undefined, reject);
            });
            
            const skyGeo = new THREE.SphereGeometry(500, 32, 32);
            const skyMat = new THREE.MeshBasicMaterial({ map: skyboxTexture, side: THREE.BackSide });
            this.scene.add(new THREE.Mesh(skyGeo, skyMat));
        } catch (error) {
            this.scene.background = new THREE.Color(0x1a1a2e);
        }
        
        // Dark purple fog
        this.scene.fog = new THREE.FogExp2(0x2a1a3e, 0.012);
        
        // Purple-tinted ambient light
        const ambient = new THREE.AmbientLight(0x6a4a8c, 0.3);
        this.scene.add(ambient);
        
        // Pale moonlight
        const moonlight = new THREE.DirectionalLight(0x8a8aff, 0.4);
        moonlight.position.set(-50, 100, -50);
        moonlight.castShadow = true;
        this.scene.add(moonlight);
        
        // Purple point lights scattered around
        for (let i = 0; i < 15; i++) {
            const light = new THREE.PointLight(0xaa00ff, 0.8, 30);
            const angle = (i / 15) * Math.PI * 2;
            const radius = 40 + Math.random() * 50;
            light.position.set(
                Math.cos(angle) * radius,
                3 + Math.random() * 5,
                Math.sin(angle) * radius
            );
            this.scene.add(light);
        }
    }
    
    async createCorruptedTerrain() {
        console.log('🗺️ Creating corrupted terrain...');
        
        const groundTiles = [
            '/assets/models/buildings/Floor_UnevenBrick.gltf',
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
                
                // Darken and purple-tint for corruption
                tile.traverse((child) => {
                    if (child.isMesh) {
                        child.material = child.material.clone();
                        child.material.color.multiplyScalar(0.4);
                        child.material.color.r = Math.min(1, child.material.color.r * 1.2);
                        child.material.color.b = Math.min(1, child.material.color.b * 1.3);
                    }
                });
                
                this.scene.add(tile);
            }
        }
        
        console.log('   ✅ Corrupted terrain created');
    }
    
    async addDeadTrees() {
        console.log('🌲 Adding dead trees...');
        
        const treeCount = 120;
        
        // Load dead tree models
        const treeVariants = [
            await this.modelLoader.load('/assets/models/nature/DeadTree_1.gltf'),
            await this.modelLoader.load('/assets/models/nature/DeadTree_2.gltf'),
            await this.modelLoader.load('/assets/models/nature/DeadTree_3.gltf')
        ].filter(t => t !== null);
        
        if (treeVariants.length === 0) return;
        
        for (let i = 0; i < treeCount; i++) {
            const variant = treeVariants[i % treeVariants.length];
            const tree = variant.clone();
            
            const angle = (i / treeCount) * Math.PI * 2 + Math.random() * 0.5;
            const radius = 15 + Math.random() * 85;
            
            tree.position.set(
                Math.cos(angle) * radius,
                0,
                Math.sin(angle) * radius
            );
            tree.rotation.y = Math.random() * Math.PI * 2;
            tree.scale.setScalar(0.9 + Math.random() * 0.5);
            tree.castShadow = true;
            
            this.scene.add(tree);
            this.deadTrees.push(tree);
        }
        
        console.log(`   ✅ Added ${this.deadTrees.length} dead trees`);
    }
    
    async addDarkCrystals() {
        console.log('💎 Adding dark crystals...');
        
        const crystalCount = 50;
        
        // Use rocks as crystal bases
        const rockPath = this.assetRegistry.getRandomRock();
        const crystalModel = await this.modelLoader.load(rockPath);
        
        if (!crystalModel) return;
        
        const darkColors = [0x4a00aa, 0x6a00ff, 0x2a0055, 0x8a00dd];
        
        for (let i = 0; i < crystalCount; i++) {
            const crystal = crystalModel.clone();
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 95;
            
            crystal.position.set(
                Math.cos(angle) * radius,
                0.5,
                Math.sin(angle) * radius
            );
            crystal.rotation.set(
                Math.random() * 0.3,
                Math.random() * Math.PI * 2,
                Math.random() * 0.3
            );
            crystal.scale.set(0.5, 2 + Math.random() * 2, 0.5);
            
            // Make them glow purple
            crystal.traverse((child) => {
                if (child.isMesh) {
                    const color = darkColors[Math.floor(Math.random() * darkColors.length)];
                    child.material = new THREE.MeshStandardMaterial({
                        color,
                        emissive: color,
                        emissiveIntensity: 0.5,
                        roughness: 0.3,
                        metalness: 0.8
                    });
                }
            });
            
            this.scene.add(crystal);
            this.darkCrystals.push(crystal);
        }
        
        console.log(`   ✅ Added ${this.darkCrystals.length} dark crystals`);
    }
    
    async addCorruptedRocks() {
        console.log('🪨 Adding corrupted rocks...');
        
        const rockCount = 70;
        const rockPath = this.assetRegistry.getRandomRock();
        const rockModel = await this.modelLoader.load(rockPath);
        
        if (!rockModel) return;
        
        for (let i = 0; i < rockCount; i++) {
            const rock = rockModel.clone();
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 90;
            
            rock.position.set(
                Math.cos(angle) * radius,
                0,
                Math.sin(angle) * radius
            );
            rock.rotation.set(
                Math.random() * 0.5,
                Math.random() * Math.PI * 2,
                Math.random() * 0.5
            );
            rock.scale.setScalar(1 + Math.random() * 1.5);
            
            // Darken rocks
            rock.traverse((child) => {
                if (child.isMesh) {
                    child.material = child.material.clone();
                    child.material.color.multiplyScalar(0.3);
                }
            });
            
            this.scene.add(rock);
            this.rocks.push(rock);
        }
        
        console.log(`   ✅ Added ${this.rocks.length} corrupted rocks`);
    }
    
    async buildEclipseCitadel() {
        console.log('🏰 Building Eclipse Citadel (demon fortress)...');
        
        // Load building models for fortress
        const buildingPaths = [
            '/assets/models/buildings/Wall_Brick.gltf',
            '/assets/models/buildings/Door_8_Flat.gltf'
        ];
        
        let buildingCount = 0;
        for (const path of buildingPaths) {
            const building = await this.modelLoader.load(path);
            if (building) {
                building.position.set(50, 0, 50);
                building.scale.setScalar(3);
                building.traverse((child) => {
                    if (child.isMesh) {
                        child.material = child.material.clone();
                        child.material.color.set(0x2a1a2a);
                    }
                });
                this.scene.add(building);
                buildingCount++;
            }
        }
        
        this.structures.push({ name: 'Eclipse Citadel', type: 'fortress', buildings: buildingCount });
        console.log(`   ✅ Eclipse Citadel built with ${buildingCount} structures`);
    }
    
    async buildGraveyardOfHeroes() {
        console.log('⚰️ Building Graveyard of Heroes...');
        
        // Create graveyard with props
        const propPaths = [
            '/assets/models/props/Barrel.gltf',
            '/assets/models/props/Chest_Wood.gltf'
        ];
        
        let graveCount = 0;
        for (let i = 0; i < 30; i++) {
            const path = propPaths[Math.floor(Math.random() * propPaths.length)];
            const grave = await this.modelLoader.load(path);
            if (grave) {
                const angle = (i / 30) * Math.PI * 2;
                const radius = 60 + Math.random() * 10;
                
                grave.position.set(
                    Math.cos(angle) * radius,
                    0,
                    Math.sin(angle) * radius
                );
                grave.scale.setScalar(0.8);
                
                grave.traverse((child) => {
                    if (child.isMesh) {
                        child.material = child.material.clone();
                        child.material.color.multiplyScalar(0.3);
                    }
                });
                
                this.scene.add(grave);
                graveCount++;
            }
        }
        
        this.structures.push({ name: 'Graveyard of Heroes', type: 'cemetery', graves: graveCount });
        console.log(`   ✅ Graveyard built with ${graveCount} graves`);
    }
}
