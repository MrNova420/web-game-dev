/**
 * Crystal Peaks Biome - Magical Zone (Level 35-50)
 * Per README: Floating crystal islands with arcane energy
 * 
 * Features:
 * - Floating crystal islands with arcane energy
 * - Arcane golems, spell wraiths, crystal dragons
 * - Mana crystals, arcane dust, pure essence
 * - Mage Academy, Crystal Nexus, Astral Observatory
 * - 20+ quests about mastering magic
 */

import * as THREE from 'three';
import { assetRegistry } from '../core/AssetRegistry.js';

export class CrystalPeaksBiome {
    constructor(scene, modelLoader) {
        this.scene = scene;
        this.modelLoader = modelLoader;
        this.assetRegistry = assetRegistry;
        
        this.center = { x: 0, z: 2000 };
        this.size = 1000;
        
        this.islands = [];
        this.crystals = [];
        this.structures = [];
    }
    
    async build() {
        console.log('💎 Building Crystal Peaks Biome...');
        
        try {
            await this.setupEnvironment();
            await this.createFloatingIslands();
            await this.addManaCrystals();
            await this.addArcaneEffects();
            await this.buildMageAcademy();
            await this.buildCrystalNexus();
            
            console.log('✅ Crystal Peaks complete!');
            console.log(`   - Floating Islands: ${this.islands.length}`);
            console.log(`   - Mana Crystals: ${this.crystals.length}`);
            console.log(`   - Structures: ${this.structures.length}`);
        } catch (error) {
            console.error('Error building Crystal Peaks:', error);
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
            this.scene.background = new THREE.Color(0x5a7aff);
        }
        
        // Light blue fog for magical atmosphere
        this.scene.fog = new THREE.FogExp2(0x7a9aff, 0.008);
        
        // Bright magical lighting
        const ambient = new THREE.AmbientLight(0xaaccff, 0.8);
        this.scene.add(ambient);
        
        const sunlight = new THREE.DirectionalLight(0xffffff, 1.2);
        sunlight.position.set(60, 120, 60);
        sunlight.castShadow = true;
        this.scene.add(sunlight);
        
        // Magical colored lights
        const magicColors = [0xff00ff, 0x00ffff, 0xffff00, 0xff00aa, 0x00ffaa];
        for (let i = 0; i < 20; i++) {
            const light = new THREE.PointLight(
                magicColors[Math.floor(Math.random() * magicColors.length)],
                1.5,
                40
            );
            const angle = (i / 20) * Math.PI * 2;
            const radius = 30 + Math.random() * 60;
            light.position.set(
                Math.cos(angle) * radius,
                10 + Math.random() * 20,
                Math.sin(angle) * radius
            );
            this.scene.add(light);
        }
    }
    
    async createFloatingIslands() {
        console.log('🏝️ Creating floating crystal islands...');
        
        const islandCount = 12;
        
        const groundTiles = [
            '/assets/models/nature/RockPath_Round_Wide.gltf',
            '/assets/models/buildings/Floor_WoodLight.gltf'
        ];
        
        for (let i = 0; i < islandCount; i++) {
            const angle = (i / islandCount) * Math.PI * 2;
            const radius = 40 + Math.random() * 50;
            const height = 10 + Math.random() * 30;
            
            const tilePath = groundTiles[Math.floor(Math.random() * groundTiles.length)];
            const tile = await this.modelLoader.load(tilePath);
            
            if (tile) {
                tile.position.set(
                    Math.cos(angle) * radius,
                    height,
                    Math.sin(angle) * radius
                );
                tile.scale.setScalar(8);
                
                // Make islands glow slightly
                tile.traverse((child) => {
                    if (child.isMesh) {
                        child.material = child.material.clone();
                        child.material.emissive = new THREE.Color(0x3366ff);
                        child.material.emissiveIntensity = 0.2;
                    }
                });
                
                this.scene.add(tile);
                this.islands.push(tile);
            }
        }
        
        console.log(`   ✅ Created ${this.islands.length} floating islands`);
    }
    
    async addManaCrystals() {
        console.log('💠 Adding mana crystals...');
        
        const crystalCount = 150;
        const rockPath = this.assetRegistry.getRandomRock();
        const crystalBase = await this.modelLoader.load(rockPath);
        
        if (!crystalBase) return;
        
        const crystalColors = [
            0xff00ff, 0x00ffff, 0xffff00, 0xff0099, 
            0x00ff99, 0x9900ff, 0x99ff00, 0xff9900
        ];
        
        for (let i = 0; i < crystalCount; i++) {
            const crystal = crystalBase.clone();
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 95;
            
            crystal.position.set(
                Math.cos(angle) * radius,
                Math.random() * 8,
                Math.sin(angle) * radius
            );
            
            // Elongate to crystal shape
            crystal.scale.set(
                0.4 + Math.random() * 0.3,
                2 + Math.random() * 3,
                0.4 + Math.random() * 0.3
            );
            crystal.rotation.set(
                Math.random() * 0.5,
                Math.random() * Math.PI * 2,
                Math.random() * 0.5
            );
            
            // Make them glow with magic
            const color = crystalColors[Math.floor(Math.random() * crystalColors.length)];
            crystal.traverse((child) => {
                if (child.isMesh) {
                    child.material = new THREE.MeshStandardMaterial({
                        color,
                        emissive: color,
                        emissiveIntensity: 0.8,
                        roughness: 0.1,
                        metalness: 0.9,
                        transparent: true,
                        opacity: 0.9
                    });
                }
            });
            
            this.scene.add(crystal);
            this.crystals.push(crystal);
        }
        
        console.log(`   ✅ Added ${this.crystals.length} mana crystals`);
    }
    
    async addArcaneEffects() {
        console.log('✨ Adding arcane particle effects...');
        
        // Add glowing particles floating around
        const particleCount = 500;
        const particleGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 200;
            positions[i + 1] = Math.random() * 100;
            positions[i + 2] = (Math.random() - 0.5) * 200;
        }
        
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            color: 0xaaccff,
            size: 0.5,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        
        const particles = new THREE.Points(particleGeometry, particleMaterial);
        this.scene.add(particles);
        
        console.log('   ✅ Arcane effects added');
    }
    
    async buildMageAcademy() {
        console.log('🏛️ Building Mage Academy (floating school)...');
        
        const buildingPaths = [
            '/assets/models/buildings/Wall_Plaster.gltf',
            '/assets/models/buildings/Door_4_Flat.gltf',
            '/assets/models/buildings/Roof_Plaster.gltf'
        ];
        
        let buildingCount = 0;
        for (const path of buildingPaths) {
            const building = await this.modelLoader.load(path);
            if (building) {
                building.position.set(-60, 25, -60);
                building.scale.setScalar(4);
                
                building.traverse((child) => {
                    if (child.isMesh) {
                        child.material = child.material.clone();
                        child.material.color.set(0xddddff);
                        child.material.emissive = new THREE.Color(0x5577ff);
                        child.material.emissiveIntensity = 0.3;
                    }
                });
                
                this.scene.add(building);
                buildingCount++;
            }
        }
        
        this.structures.push({ name: 'Mage Academy', type: 'school', buildings: buildingCount });
        console.log(`   ✅ Mage Academy built with ${buildingCount} structures`);
    }
    
    async buildCrystalNexus() {
        console.log('⚡ Building Crystal Nexus (power source)...');
        
        // Create giant central crystal
        const rockPath = this.assetRegistry.getRandomRock();
        const nexus = await this.modelLoader.load(rockPath);
        
        if (nexus) {
            nexus.position.set(0, 15, 0);
            nexus.scale.set(5, 20, 5);
            
            nexus.traverse((child) => {
                if (child.isMesh) {
                    child.material = new THREE.MeshStandardMaterial({
                        color: 0x00ffff,
                        emissive: 0x00ffff,
                        emissiveIntensity: 1.5,
                        roughness: 0.1,
                        metalness: 1.0,
                        transparent: true,
                        opacity: 0.8
                    });
                }
            });
            
            this.scene.add(nexus);
            this.structures.push({ name: 'Crystal Nexus', type: 'power_source' });
            console.log('   ✅ Crystal Nexus created');
        }
    }
}
