/**
 * Void Rift Biome - Endgame Zone (Level 65-80)
 * Per README: Chaotic dimension with shifting reality
 * 
 * Features:
 * - Chaotic dimension with shifting reality
 * - Void lords, chaos beasts, reality warpers
 * - Void crystals, chaos essence, reality shards
 * - Portal of Infinity, Chaos Throne, Dimension Maze
 * - 25+ endgame quests
 */

import * as THREE from 'three';
import { assetRegistry } from '../core/AssetRegistry.js';

export class VoidRiftBiome {
    constructor(scene, modelLoader) {
        this.scene = scene;
        this.modelLoader = modelLoader;
        this.assetRegistry = assetRegistry;
        
        this.center = { x: 0, z: -2000 };
        this.size = 1000;
        
        this.terrain = null;
        this.voidCrystals = [];
        this.chaosFormations = [];
        this.structures = [];
    }
    
    async build() {
        console.log('🌀 Building Void Rift Biome...');
        
        try {
            await this.setupEnvironment();
            await this.createVoidTerrain();
            await this.addVoidCrystals();
            await this.addChaosFormations();
            await this.buildPortalOfInfinity();
            await this.buildChaosThrone();
            
            console.log('✅ Void Rift complete!');
            console.log(`   - Void crystals: ${this.voidCrystals.length}`);
            console.log(`   - Chaos formations: ${this.chaosFormations.length}`);
            console.log(`   - Structures: ${this.structures.length}`);
        } catch (error) {
            console.error('Error building Void Rift:', error);
        }
    }
    
    async setupEnvironment() {
        // Use purple/dark skybox for void
        const textureLoader = new THREE.TextureLoader();
        
        try {
            const skyboxTexture = await new Promise((resolve, reject) => {
                textureLoader.load('/assets/skyboxes/PurplyBlueSky.png', resolve, undefined, reject);
            });
            
            const skyGeo = new THREE.SphereGeometry(500, 32, 32);
            const skyMat = new THREE.MeshBasicMaterial({ map: skyboxTexture, side: THREE.BackSide });
            this.scene.add(new THREE.Mesh(skyGeo, skyMat));
        } catch (error) {
            this.scene.background = new THREE.Color(0x1a0a2a);
        }
        
        // Dark purple fog
        this.scene.fog = new THREE.FogExp2(0x2a1a4a, 0.020);
        
        // Very dim purple ambient
        const ambient = new THREE.AmbientLight(0x6a4a9a, 0.3);
        this.scene.add(ambient);
        
        const voidLight = new THREE.DirectionalLight(0x9a6aff, 0.5);
        voidLight.position.set(40, 100, 40);
        voidLight.castShadow = true;
        this.scene.add(voidLight);
        
        // Add chaotic multi-colored lights
        const chaosColors = [0xff00ff, 0x00ffff, 0xffff00, 0xff0000, 0x00ff00, 0x0000ff];
        for (let i = 0; i < 25; i++) {
            const light = new THREE.PointLight(
                chaosColors[Math.floor(Math.random() * chaosColors.length)],
                1.0,
                35
            );
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 100;
            light.position.set(
                Math.cos(angle) * radius,
                Math.random() * 30,
                Math.sin(angle) * radius
            );
            this.scene.add(light);
        }
    }
    
    async createVoidTerrain() {
        console.log('🗺️ Creating void terrain...');
        
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
                
                // Floating at random heights for chaotic effect
                const chaosHeight = Math.random() * 5 - 2;
                tile.position.set(posX, chaosHeight, posZ);
                tile.rotation.set(
                    Math.random() * 0.3 - 0.15,
                    Math.floor(Math.random() * 4) * (Math.PI / 2),
                    Math.random() * 0.3 - 0.15
                );
                tile.scale.setScalar(tileSize / 2);
                tile.receiveShadow = true;
                
                // Void black/purple with random color shifts
                tile.traverse((child) => {
                    if (child.isMesh) {
                        const voidColor = new THREE.Color().setHSL(
                            Math.random(),
                            0.6,
                            0.1 + Math.random() * 0.2
                        );
                        child.material = child.material.clone();
                        child.material.color.copy(voidColor);
                        child.material.emissive.copy(voidColor);
                        child.material.emissiveIntensity = 0.4;
                        child.material.roughness = 0.3;
                        child.material.metalness = 0.8;
                    }
                });
                
                this.scene.add(tile);
            }
        }
        
        console.log('   ✅ Void terrain created');
    }
    
    async addVoidCrystals() {
        console.log('💠 Adding void crystals...');
        
        const crystalCount = 100;
        const rockPath = this.assetRegistry.getRandomRock();
        const crystalBase = await this.modelLoader.load(rockPath);
        
        if (!crystalBase) return;
        
        for (let i = 0; i < crystalCount; i++) {
            const crystal = crystalBase.clone();
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 95;
            
            crystal.position.set(
                Math.cos(angle) * radius,
                Math.random() * 10,
                Math.sin(angle) * radius
            );
            
            // Chaotic crystal shape
            crystal.scale.set(
                0.4 + Math.random() * 0.4,
                3 + Math.random() * 4,
                0.4 + Math.random() * 0.4
            );
            crystal.rotation.set(
                Math.random() * 0.5,
                Math.random() * Math.PI * 2,
                Math.random() * 0.5
            );
            
            // Random void colors
            const voidColor = new THREE.Color().setHSL(Math.random(), 0.8, 0.5);
            crystal.traverse((child) => {
                if (child.isMesh) {
                    child.material = new THREE.MeshStandardMaterial({
                        color: voidColor,
                        emissive: voidColor,
                        emissiveIntensity: 1.2,
                        roughness: 0.1,
                        metalness: 1.0,
                        transparent: true,
                        opacity: 0.8
                    });
                }
            });
            
            this.scene.add(crystal);
            this.voidCrystals.push(crystal);
        }
        
        console.log(`   ✅ Added ${this.voidCrystals.length} void crystals`);
    }
    
    async addChaosFormations() {
        console.log('⚡ Adding chaos formations...');
        
        const formationCount = 80;
        const rockPath = this.assetRegistry.getRandomRock();
        const formationBase = await this.modelLoader.load(rockPath);
        
        if (!formationBase) return;
        
        for (let i = 0; i < formationCount; i++) {
            const formation = formationBase.clone();
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 90;
            
            formation.position.set(
                Math.cos(angle) * radius,
                Math.random() * 8 - 2,
                Math.sin(angle) * radius
            );
            formation.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI * 2,
                Math.random() * Math.PI
            );
            formation.scale.setScalar(1 + Math.random() * 2);
            
            // Chaotic multi-colored materials
            formation.traverse((child) => {
                if (child.isMesh) {
                    const chaosColor = new THREE.Color().setHSL(Math.random(), 1.0, 0.5);
                    child.material = new THREE.MeshStandardMaterial({
                        color: chaosColor,
                        emissive: chaosColor,
                        emissiveIntensity: 0.8,
                        roughness: 0.2,
                        metalness: 0.9
                    });
                }
            });
            
            this.scene.add(formation);
            this.chaosFormations.push(formation);
        }
        
        console.log(`   ✅ Added ${this.chaosFormations.length} chaos formations`);
    }
    
    async buildPortalOfInfinity() {
        console.log('🌀 Building Portal of Infinity (main entrance)...');
        
        // Create giant portal using rocks
        const rockPath = this.assetRegistry.getRandomRock();
        const portal = await this.modelLoader.load(rockPath);
        
        if (portal) {
            portal.position.set(0, 10, 0);
            portal.scale.set(15, 20, 2);
            
            portal.traverse((child) => {
                if (child.isMesh) {
                    child.material = new THREE.MeshStandardMaterial({
                        color: 0xff00ff,
                        emissive: 0xff00ff,
                        emissiveIntensity: 2.0,
                        roughness: 0.0,
                        metalness: 1.0,
                        transparent: true,
                        opacity: 0.7
                    });
                }
            });
            
            this.scene.add(portal);
            this.structures.push({ name: 'Portal of Infinity', type: 'portal' });
            console.log('   ✅ Portal of Infinity created');
        }
    }
    
    async buildChaosThrone() {
        console.log('👑 Building Chaos Throne (void king seat)...');
        
        const buildingPath = '/assets/models/buildings/Wall_Plaster.gltf';
        const throne = await this.modelLoader.load(buildingPath);
        
        if (throne) {
            throne.position.set(80, 5, 80);
            throne.scale.setScalar(5);
            
            throne.traverse((child) => {
                if (child.isMesh) {
                    child.material = new THREE.MeshStandardMaterial({
                        color: 0x9900ff,
                        emissive: 0x9900ff,
                        emissiveIntensity: 1.5,
                        roughness: 0.1,
                        metalness: 1.0
                    });
                }
            });
            
            this.scene.add(throne);
            this.structures.push({ name: 'Chaos Throne', type: 'boss_area' });
            console.log('   ✅ Chaos Throne created');
        }
    }
}
