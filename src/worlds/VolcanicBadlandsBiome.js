/**
import { logger } from '../core/Logger.js';
 * Volcanic Badlands Biome - Fire Zone (Level 55-70)
 * Per README: Active volcanoes with lava rivers
 * 
 * Features:
 * - Active volcanoes with lava rivers
 * - Lava golems, fire demons, hell hounds, salamanders
 * - Magma core, obsidian, fire gems
 * - Mt. Inferno, Ember Forge, Hellgate
 * - 20+ quests about preventing demon invasion
 */

import * as THREE from 'three';
import { assetRegistry } from '../core/AssetRegistry.js';

export class VolcanicBadlandsBiome {
    constructor(scene, modelLoader) {
        this.scene = scene;
        this.modelLoader = modelLoader;
        this.assetRegistry = assetRegistry;
        
        this.center = { x: 2000, z: 1000 };
        this.size = 1000;
        
        this.terrain = null;
        this.lavaFlows = [];
        this.volcanicRocks = [];
        this.structures = [];
    }
    
    async build() {
        logger.info('🌋 Building Volcanic Badlands Biome...');
        
        try {
            await this.setupEnvironment();
            await this.createVolcanicTerrain();
            await this.addLavaFlows();
            await this.addVolcanicRocks();
            await this.buildMtInferno();
            await this.buildEmberForge();
            
            logger.info('✅ Volcanic Badlands complete!');
            logger.info(`   - Lava flows: ${this.lavaFlows.length}`);
            logger.info(`   - Volcanic rocks: ${this.volcanicRocks.length}`);
            logger.info(`   - Structures: ${this.structures.length}`);
        } catch (error) {
            logger.error('Error building Volcanic Badlands:', error);
        }
    }
    
    async setupEnvironment() {
        // Use sunset/red skybox for volcanic
        const textureLoader = new THREE.TextureLoader();
        
        try {
            const skyboxTexture = await new Promise((resolve, reject) => {
                textureLoader.load('/assets/skyboxes/SunsetSky.png', resolve, undefined, reject);
            });
            
            const skyGeo = new THREE.SphereGeometry(500, 32, 32);
            const skyMat = new THREE.MeshBasicMaterial({ map: skyboxTexture, side: THREE.BackSide });
            this.scene.add(new THREE.Mesh(skyGeo, skyMat));
        } catch (error) {
            this.scene.background = new THREE.Color(0x6a1a1a);
        }
        
        // Red/orange fog for volcanic atmosphere
        this.scene.fog = new THREE.FogExp2(0x8a2020, 0.012);
        
        // Red ambient light
        const ambient = new THREE.AmbientLight(0xff6644, 0.6);
        this.scene.add(ambient);
        
        const sunlight = new THREE.DirectionalLight(0xff8844, 0.9);
        sunlight.position.set(50, 100, 50);
        sunlight.castShadow = true;
        this.scene.add(sunlight);
        
        // Add glowing lava lights
        for (let i = 0; i < 20; i++) {
            const light = new THREE.PointLight(0xff3300, 1.5, 40);
            const angle = (i / 20) * Math.PI * 2;
            const radius = 40 + Math.random() * 50;
            light.position.set(
                Math.cos(angle) * radius,
                1,
                Math.sin(angle) * radius
            );
            this.scene.add(light);
        }
    }
    
    async createVolcanicTerrain() {
        logger.info('🗺️ Creating volcanic terrain...');
        
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
                
                // Dark red/black volcanic rock
                tile.traverse((child) => {
                    if (child.isMesh) {
                        child.material = child.material.clone();
                        child.material.color.set(0x3a1a1a);
                        child.material.roughness = 0.8;
                        child.material.emissive = new THREE.Color(0x441100);
                        child.material.emissiveIntensity = 0.1;
                    }
                });
                
                this.scene.add(tile);
            }
        }
        
        logger.info('   ✅ Volcanic terrain created');
    }
    
    async addLavaFlows() {
        logger.info('🔥 Adding lava flows...');
        
        const lavaCount = 50;
        const rockPath = this.assetRegistry.getRandomRock();
        const lavaBase = await this.modelLoader.load(rockPath);
        
        if (!lavaBase) return;
        
        for (let i = 0; i < lavaCount; i++) {
            const lava = lavaBase.clone();
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 90;
            
            lava.position.set(
                Math.cos(angle) * radius,
                -0.5,
                Math.sin(angle) * radius
            );
            
            // Wide flowing lava shape
            lava.scale.set(
                2 + Math.random(),
                0.3,
                1 + Math.random()
            );
            lava.rotation.y = Math.random() * Math.PI * 2;
            
            // Glowing lava material
            lava.traverse((child) => {
                if (child.isMesh) {
                    child.material = new THREE.MeshStandardMaterial({
                        color: 0xff4400,
                        emissive: 0xff3300,
                        emissiveIntensity: 1.5,
                        roughness: 0.2
                    });
                }
            });
            
            this.scene.add(lava);
            this.lavaFlows.push(lava);
        }
        
        logger.info(`   ✅ Added ${this.lavaFlows.length} lava flows`);
    }
    
    async addVolcanicRocks() {
        logger.info('🪨 Adding volcanic rocks...');
        
        const rockCount = 100;
        const rockPath = this.assetRegistry.getRandomRock();
        const rockModel = await this.modelLoader.load(rockPath);
        
        if (!rockModel) return;
        
        for (let i = 0; i < rockCount; i++) {
            const rock = rockModel.clone();
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 95;
            
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
            rock.scale.setScalar(1 + Math.random() * 2);
            
            // Dark volcanic rock with heat glow
            rock.traverse((child) => {
                if (child.isMesh) {
                    child.material = child.material.clone();
                    child.material.color.set(0x2a1a1a);
                    child.material.emissive = new THREE.Color(0x661100);
                    child.material.emissiveIntensity = 0.3;
                }
            });
            
            this.scene.add(rock);
            this.volcanicRocks.push(rock);
        }
        
        logger.info(`   ✅ Added ${this.volcanicRocks.length} volcanic rocks`);
    }
    
    async buildMtInferno() {
        logger.info('🌋 Building Mt. Inferno (main volcano)...');
        
        // Build giant volcano using scaled rocks
        const rockPath = this.assetRegistry.getRandomRock();
        const volcano = await this.modelLoader.load(rockPath);
        
        if (volcano) {
            volcano.position.set(0, 15, 0);
            volcano.scale.set(25, 50, 25);
            
            volcano.traverse((child) => {
                if (child.isMesh) {
                    child.material = new THREE.MeshStandardMaterial({
                        color: 0x3a1a1a,
                        emissive: 0xff3300,
                        emissiveIntensity: 0.5,
                        roughness: 0.9
                    });
                }
            });
            
            this.scene.add(volcano);
            this.structures.push({ name: 'Mt. Inferno', type: 'volcano' });
            logger.info('   ✅ Mt. Inferno created');
        }
    }
    
    async buildEmberForge() {
        logger.info('⚒️ Building Ember Forge (legendary smithy)...');
        
        const buildingPath = '/assets/models/buildings/Wall_Brick.gltf';
        const forge = await this.modelLoader.load(buildingPath);
        
        if (forge) {
            forge.position.set(70, 0, 70);
            forge.scale.setScalar(3);
            
            forge.traverse((child) => {
                if (child.isMesh) {
                    child.material = child.material.clone();
                    child.material.color.set(0x4a2a2a);
                    child.material.emissive = new THREE.Color(0xff4400);
                    child.material.emissiveIntensity = 0.6;
                }
            });
            
            this.scene.add(forge);
            this.structures.push({ name: 'Ember Forge', type: 'smithy' });
            logger.info('   ✅ Ember Forge created');
        }
    }
}
