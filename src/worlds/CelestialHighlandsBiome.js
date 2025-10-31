/**
 * Celestial Highlands Biome - Sky Zone (Level 50-65)
 * Per README: Floating islands among clouds
 * 
 * Features:
 * - Floating islands among clouds
 * - Griffins, phoenixes, cloud giants, birds
 * - Star metal, cloud cotton, celestial essence
 * - Sky Castle, Rainbow Bridge, Wind Temple
 * - 23+ quests about sky gods
 */

import * as THREE from 'three';
import { assetRegistry } from '../core/AssetRegistry.js';

export class CelestialHighlandsBiome {
    constructor(scene, modelLoader) {
        this.scene = scene;
        this.modelLoader = modelLoader;
        this.assetRegistry = assetRegistry;
        
        this.center = { x: 0, z: 2000 };
        this.size = 1000;
        
        this.floatingIslands = [];
        this.structures = [];
    }
    
    async build() {
        console.log('☁️ Building Celestial Highlands Biome...');
        
        try {
            await this.setupEnvironment();
            await this.createFloatingSkyIslands();
            await this.addCloudEffects();
            await this.buildSkyCastle();
            await this.buildRainbowBridge();
            
            console.log('✅ Celestial Highlands complete!');
            console.log(`   - Floating islands: ${this.floatingIslands.length}`);
            console.log(`   - Structures: ${this.structures.length}`);
        } catch (error) {
            console.error('Error building Celestial Highlands:', error);
        }
    }
    
    async setupEnvironment() {
        // Use bright sky skybox
        const textureLoader = new THREE.TextureLoader();
        
        try {
            const skyboxTexture = await new Promise((resolve, reject) => {
                textureLoader.load('/assets/skyboxes/SkySkybox.png', resolve, undefined, reject);
            });
            
            const skyGeo = new THREE.SphereGeometry(500, 32, 32);
            const skyMat = new THREE.MeshBasicMaterial({ map: skyboxTexture, side: THREE.BackSide });
            this.scene.add(new THREE.Mesh(skyGeo, skyMat));
        } catch (error) {
            this.scene.background = new THREE.Color(0x87CEEB);
        }
        
        // Light blue fog for clouds
        this.scene.fog = new THREE.FogExp2(0xb0d0ff, 0.006);
        
        // Bright heavenly lighting
        const ambient = new THREE.AmbientLight(0xfff8dd, 1.2);
        this.scene.add(ambient);
        
        const sunlight = new THREE.DirectionalLight(0xffffee, 1.8);
        sunlight.position.set(100, 250, 100);
        sunlight.castShadow = true;
        this.scene.add(sunlight);
        
        // Rainbow-colored lights
        const rainbowColors = [0xff0000, 0xff7700, 0xffff00, 0x00ff00, 0x0000ff, 0x9400d3];
        for (let i = 0; i < 6; i++) {
            const light = new THREE.PointLight(rainbowColors[i], 0.8, 60);
            const angle = (i / 6) * Math.PI * 2;
            const radius = 70;
            light.position.set(
                Math.cos(angle) * radius,
                40 + i * 10,
                Math.sin(angle) * radius
            );
            this.scene.add(light);
        }
    }
    
    async createFloatingSkyIslands() {
        console.log('🏝️ Creating floating sky islands...');
        
        const islandCount = 15;
        const groundTile = '/assets/models/nature/RockPath_Round_Wide.gltf';
        
        for (let i = 0; i < islandCount; i++) {
            const island = await this.modelLoader.load(groundTile);
            if (island) {
                const angle = (i / islandCount) * Math.PI * 2;
                const radius = 30 + Math.random() * 60;
                const height = 20 + Math.random() * 50;
                
                island.position.set(
                    Math.cos(angle) * radius,
                    height,
                    Math.sin(angle) * radius
                );
                island.scale.setScalar(6 + Math.random() * 4);
                
                // Bright white/gold appearance
                island.traverse((child) => {
                    if (child.isMesh) {
                        child.material = child.material.clone();
                        child.material.color.set(0xfff8dd);
                        child.material.emissive = new THREE.Color(0xffeeaa);
                        child.material.emissiveIntensity = 0.2;
                    }
                });
                
                this.scene.add(island);
                this.floatingIslands.push(island);
            }
        }
        
        console.log(`   ✅ Created ${this.floatingIslands.length} floating islands`);
    }
    
    async addCloudEffects() {
        console.log('☁️ Adding cloud effects...');
        
        // Add fluffy cloud particles
        const cloudCount = 300;
        const cloudGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(cloudCount * 3);
        
        for (let i = 0; i < cloudCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 250;
            positions[i + 1] = Math.random() * 80 + 10;
            positions[i + 2] = (Math.random() - 0.5) * 250;
        }
        
        cloudGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const cloudMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 3,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });
        
        const clouds = new THREE.Points(cloudGeometry, cloudMaterial);
        this.scene.add(clouds);
        
        console.log('   ✅ Cloud effects added');
    }
    
    async buildSkyCastle() {
        console.log('🏰 Building Sky Castle (ancient fortress)...');
        
        const buildingPaths = [
            '/assets/models/buildings/Wall_Plaster.gltf',
            '/assets/models/buildings/Door_4_Flat.gltf'
        ];
        
        let buildingCount = 0;
        for (const path of buildingPaths) {
            const building = await this.modelLoader.load(path);
            if (building) {
                building.position.set(0, 50, 0);
                building.scale.setScalar(6);
                
                building.traverse((child) => {
                    if (child.isMesh) {
                        child.material = child.material.clone();
                        child.material.color.set(0xffffff);
                        child.material.emissive = new THREE.Color(0xddddff);
                        child.material.emissiveIntensity = 0.4;
                    }
                });
                
                this.scene.add(building);
                buildingCount++;
            }
        }
        
        this.structures.push({ name: 'Sky Castle', type: 'fortress', buildings: buildingCount });
        console.log(`   ✅ Sky Castle built with ${buildingCount} structures`);
    }
    
    async buildRainbowBridge() {
        console.log('🌈 Building Rainbow Bridge...');
        
        // Create rainbow bridge using colored floor tiles
        const bridgePath = '/assets/models/buildings/Floor_WoodLight.gltf';
        const rainbowColors = [0xff0000, 0xff7700, 0xffff00, 0x00ff00, 0x0000ff, 0x9400d3];
        
        for (let i = 0; i < 6; i++) {
            const segment = await this.modelLoader.load(bridgePath);
            if (segment) {
                segment.position.set(i * 8 - 24, 30, 60);
                segment.scale.setScalar(4);
                
                segment.traverse((child) => {
                    if (child.isMesh) {
                        child.material = new THREE.MeshStandardMaterial({
                            color: rainbowColors[i],
                            emissive: rainbowColors[i],
                            emissiveIntensity: 0.5
                        });
                    }
                });
                
                this.scene.add(segment);
            }
        }
        
        this.structures.push({ name: 'Rainbow Bridge', type: 'landmark' });
        console.log('   ✅ Rainbow Bridge created');
    }
}
