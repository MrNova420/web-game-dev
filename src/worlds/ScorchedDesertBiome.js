/**
 * Scorched Desert Biome - Desert Zone (Level 45-60)
 * Per README: Vast desert with sandstorms and oases
 * 
 * Features:
 * - Vast desert with sandstorms and oases
 * - Sand worms, scorpions, mummies, jackals
 * - Ancient relics, rare spices, desert herbs
 * - Pyramid of Ancients, Oasis Haven, Sandstorm Keep
 * - 21+ quests about lost civilizations
 */

import * as THREE from 'three';
import { assetRegistry } from '../core/AssetRegistry.js';

export class ScorchedDesertBiome {
    constructor(scene, modelLoader) {
        this.scene = scene;
        this.modelLoader = modelLoader;
        this.assetRegistry = assetRegistry;
        
        this.center = { x: 1000, z: -1000 };
        this.size = 1000;
        
        this.terrain = null;
        this.sandDunes = [];
        this.cacti = [];
        this.structures = [];
    }
    
    async build() {
        console.log('🏜️ Building Scorched Desert Biome...');
        
        try {
            await this.setupEnvironment();
            await this.createDesertTerrain();
            await this.addSandDunes();
            await this.addDesertPlants();
            await this.buildPyramidOfAncients();
            await this.buildOasisHaven();
            
            console.log('✅ Scorched Desert complete!');
            console.log(`   - Sand dunes: ${this.sandDunes.length}`);
            console.log(`   - Desert plants: ${this.cacti.length}`);
            console.log(`   - Structures: ${this.structures.length}`);
        } catch (error) {
            console.error('Error building Scorched Desert:', error);
        }
    }
    
    async setupEnvironment() {
        // Use sunset/orange skybox for desert
        const textureLoader = new THREE.TextureLoader();
        
        try {
            const skyboxTexture = await new Promise((resolve, reject) => {
                textureLoader.load('/assets/skyboxes/SunsetSky.png', resolve, undefined, reject);
            });
            
            const skyGeo = new THREE.SphereGeometry(500, 32, 32);
            const skyMat = new THREE.MeshBasicMaterial({ map: skyboxTexture, side: THREE.BackSide });
            this.scene.add(new THREE.Mesh(skyGeo, skyMat));
        } catch (error) {
            this.scene.background = new THREE.Color(0xffcc66);
        }
        
        // Orange/yellow fog for sandstorm
        this.scene.fog = new THREE.FogExp2(0xffd088, 0.012);
        
        // Harsh desert sunlight
        const ambient = new THREE.AmbientLight(0xffeeaa, 1.0);
        this.scene.add(ambient);
        
        const sunlight = new THREE.DirectionalLight(0xffddaa, 1.5);
        sunlight.position.set(100, 200, 50);
        sunlight.castShadow = true;
        this.scene.add(sunlight);
    }
    
    async createDesertTerrain() {
        console.log('🗺️ Creating desert terrain...');
        
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
                tile.position.set(posX, 0, posZ);
                tile.rotation.y = Math.floor(Math.random() * 4) * (Math.PI / 2);
                tile.scale.setScalar(tileSize / 2);
                tile.receiveShadow = true;
                
                // Sandy yellow/orange tint
                tile.traverse((child) => {
                    if (child.isMesh) {
                        child.material = child.material.clone();
                        child.material.color.set(0xddaa66);
                        child.material.roughness = 0.9;
                    }
                });
                
                this.scene.add(tile);
            }
        }
        
        console.log('   ✅ Desert terrain created');
    }
    
    async addSandDunes() {
        console.log('⛰️ Adding sand dunes...');
        
        const duneCount = 40;
        const rockPath = this.assetRegistry.getRandomRock();
        const duneBase = await this.modelLoader.load(rockPath);
        
        if (!duneBase) return;
        
        for (let i = 0; i < duneCount; i++) {
            const dune = duneBase.clone();
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 90;
            
            dune.position.set(
                Math.cos(angle) * radius,
                -1,
                Math.sin(angle) * radius
            );
            
            // Wide, low dune shape
            dune.scale.set(
                3 + Math.random() * 2,
                0.8 + Math.random() * 0.5,
                2 + Math.random() * 2
            );
            dune.rotation.y = Math.random() * Math.PI * 2;
            
            // Sandy color
            dune.traverse((child) => {
                if (child.isMesh) {
                    child.material = new THREE.MeshStandardMaterial({
                        color: 0xddaa55,
                        roughness: 0.95
                    });
                }
            });
            
            this.scene.add(dune);
            this.sandDunes.push(dune);
        }
        
        console.log(`   ✅ Added ${this.sandDunes.length} sand dunes`);
    }
    
    async addDesertPlants() {
        console.log('🌵 Adding desert plants (cacti)...');
        
        const plantCount = 50;
        const plantPath = '/assets/models/nature/Plant_1.gltf';
        const plantModel = await this.modelLoader.load(plantPath);
        
        if (!plantModel) return;
        
        for (let i = 0; i < plantCount; i++) {
            const plant = plantModel.clone();
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 85;
            
            plant.position.set(
                Math.cos(angle) * radius,
                0,
                Math.sin(angle) * radius
            );
            
            // Tall cactus shape
            plant.scale.set(0.5, 2 + Math.random(), 0.5);
            plant.rotation.y = Math.random() * Math.PI * 2;
            
            // Green cactus color
            plant.traverse((child) => {
                if (child.isMesh) {
                    child.material = child.material.clone();
                    child.material.color.set(0x558855);
                }
            });
            
            this.scene.add(plant);
            this.cacti.push(plant);
        }
        
        console.log(`   ✅ Added ${this.cacti.length} desert plants`);
    }
    
    async buildPyramidOfAncients() {
        console.log('🔺 Building Pyramid of Ancients (ancient tomb)...');
        
        // Build pyramid using building blocks
        const buildingPath = '/assets/models/buildings/Wall_Brick.gltf';
        const building = await this.modelLoader.load(buildingPath);
        
        if (building) {
            // Base
            building.position.set(60, 0, 60);
            building.scale.set(10, 15, 10);
            
            building.traverse((child) => {
                if (child.isMesh) {
                    child.material = child.material.clone();
                    child.material.color.set(0xccaa77);
                }
            });
            
            this.scene.add(building);
            this.structures.push({ name: 'Pyramid of Ancients', type: 'tomb' });
            console.log('   ✅ Pyramid of Ancients created');
        }
    }
    
    async buildOasisHaven() {
        console.log('🌴 Building Oasis Haven (trading post)...');
        
        // Create small oasis with structures
        const buildingPaths = [
            '/assets/models/props/Barrel.gltf',
            '/assets/models/props/Chest_Wood.gltf'
        ];
        
        let buildingCount = 0;
        for (let i = 0; i < 6; i++) {
            const path = buildingPaths[i % buildingPaths.length];
            const structure = await this.modelLoader.load(path);
            if (structure) {
                const angle = (i / 6) * Math.PI * 2;
                structure.position.set(
                    Math.cos(angle) * 25 - 60,
                    0,
                    Math.sin(angle) * 25 - 60
                );
                this.scene.add(structure);
                buildingCount++;
            }
        }
        
        this.structures.push({ name: 'Oasis Haven', type: 'trading_post', buildings: buildingCount });
        console.log(`   ✅ Oasis Haven built with ${buildingCount} structures`);
    }
}
