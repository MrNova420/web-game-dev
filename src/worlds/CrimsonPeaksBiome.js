/**
import { logger } from '../core/Logger.js';
 * Crimson Peaks Biome - Mountain Dragon Territory
 * Level 15-30 zone with volcanic activity
 * 
 * Features:
 * - Towering mountains with lava flows
 * - Dragon roosts and nests
 * - Fire elementals and mountain trolls
 * - Ancient forge locations
 * - Volcanic glass mining areas
 * - Dragonspine Summit (highest peak)
 */

import * as THREE from 'three';
import { assetRegistry } from '../core/AssetRegistry.js';

export class CrimsonPeaksBiome {
    constructor(scene, modelLoader) {
        this.scene = scene;
        this.modelLoader = modelLoader;
        this.assetRegistry = assetRegistry;
        
        this.center = { x: 1000, z: 2000 }; // Position in world grid
        this.size = 1000;
        
        this.terrain = null;
        this.mountains = [];
        this.rocks = [];
        this.lavaFlows = [];
        this.deadTrees = [];
        this.props = [];
    }
    
    /**
     * Build complete Crimson Peaks biome
     */
    async build() {
        logger.info('🔥 Building Crimson Peaks Biome...');
        logger.info(`   Position: (${this.center.x}, ${this.center.z})`);
        logger.info('   Theme: Volcanic mountains, dragons, fire');
        
        try {
            // Environment with REAL skybox
            await this.setupEnvironment();
            
            // Terrain
            this.createMountainTerrain();
            
            // Features
            await Promise.all([
                this.addMountainRocks(),
                this.addDeadTrees(),
                this.addVolcanicProps(),
                this.createLavaFlows()
            ]);
            
            // Landmarks
            await this.buildDragonspineSummit();
            await this.buildForgeOfTitans();
            
            logger.info('✅ Crimson Peaks complete!');
            logger.info(`   - Mountains: ${this.mountains.length}`);
            logger.info(`   - Rocks: ${this.rocks.length}`);
            logger.info(`   - Lava flows: ${this.lavaFlows.length}`);
            logger.info(`   - Props: ${this.props.length}`);
            
        } catch (error) {
            logger.error('Error building Crimson Peaks:', error);
        }
    }
    
    /**
     * Setup volcanic environment - USING YOUR REAL SKYBOX
     */
    async setupEnvironment() {
        // Load SunsetSky for volcanic atmosphere
        const textureLoader = new THREE.TextureLoader();
        
        try {
            const skyboxTexture = await new Promise((resolve, reject) => {
                textureLoader.load('/assets/skyboxes/SunsetSky.png', resolve, undefined, reject);
            });
            
            const skyGeo = new THREE.SphereGeometry(500, 32, 32);
            const skyMat = new THREE.MeshBasicMaterial({ map: skyboxTexture, side: THREE.BackSide });
            this.scene.add(new THREE.Mesh(skyGeo, skyMat));
        } catch (error) {
            this.scene.background = new THREE.Color(0x4a1515);
        }
        
        this.scene.fog = new THREE.FogExp2(0x6a2020, 0.01);
        
        // Red ambient light
        const ambient = new THREE.AmbientLight(0xff6644, 0.5);
        this.scene.add(ambient);
        
        // Bright sun
        const sunlight = new THREE.DirectionalLight(0xffaa88, 1.2);
        sunlight.position.set(50, 100, 30);
        sunlight.castShadow = true;
        this.scene.add(sunlight);
        
        // Volcanic glow
        const volcanoGlow = new THREE.PointLight(0xff3300, 3, 50);
        volcanoGlow.position.set(this.center.x, 20, this.center.z);
        this.scene.add(volcanoGlow);
        
        logger.info('   🌋 Volcanic environment setup');
    }
    
    /**
     * Create mountainous terrain
     */
    createMountainTerrain() {
        const geometry = new THREE.PlaneGeometry(this.size, this.size, 100, 100);
        const vertices = geometry.attributes.position.array;
        
        // Create mountain peaks
        for (let i = 0; i < vertices.length; i += 3) {
            const x = vertices[i];
            const z = vertices[i + 1];
            
            // Multiple peaks
            const height = 
                Math.abs(Math.sin(x * 0.01) * Math.cos(z * 0.01)) * 50 +
                Math.abs(Math.sin(x * 0.05) * Math.cos(z * 0.05)) * 20;
            
            vertices[i + 2] = height;
        }
        
        geometry.computeVertexNormals();
        
        // Rocky mountain material
        const material = new THREE.MeshStandardMaterial({
            color: 0x4a2020,
            roughness: 0.95,
            metalness: 0.1
        });
        
        this.terrain = new THREE.Mesh(geometry, material);
        this.terrain.rotation.x = -Math.PI / 2;
        this.terrain.position.set(this.center.x, 0, this.center.z);
        this.terrain.receiveShadow = true;
        this.scene.add(this.terrain);
        
        logger.info('   ⛰️ Mountain terrain created');
    }
    
    /**
     * Add large mountain rocks
     */
    async addMountainRocks() {
        logger.info('   🪨 Adding mountain rocks...');
        
        const rockCount = 100;
        
        for (let i = 0; i < rockCount; i++) {
            try {
                const rockPath = this.assetRegistry.getRandomRock();
                const model = await this.modelLoader.load(rockPath);
                
                if (model) {
                    const angle = Math.random() * Math.PI * 2;
                    const radius = Math.random() * (this.size / 2) * 0.9;
                    const x = this.center.x + Math.cos(angle) * radius;
                    const z = this.center.z + Math.sin(angle) * radius;
                    const y = this.getTerrainHeight(x - this.center.x, z - this.center.z);
                    
                    model.position.set(x, y, z);
                    model.scale.setScalar(2 + Math.random() * 3); // Large rocks
                    model.rotation.set(
                        Math.random() * 0.5,
                        Math.random() * Math.PI * 2,
                        Math.random() * 0.5
                    );
                    model.castShadow = true;
                    model.receiveShadow = true;
                    
                    this.scene.add(model);
                    this.rocks.push(model);
                }
            } catch (error) {
                // Skip failed rocks
            }
        }
        
        logger.info(`      ✅ Added ${this.rocks.length} mountain rocks`);
    }
    
    /**
     * Add dead/burnt trees
     */
    async addDeadTrees() {
        logger.info('   🌲 Adding dead trees...');
        
        const treeCount = 40;
        
        for (let i = 0; i < treeCount; i++) {
            // Create dead tree
            const group = new THREE.Group();
            
            // Burnt trunk
            const trunkGeom = new THREE.CylinderGeometry(0.3, 0.5, 5, 8);
            const trunkMat = new THREE.MeshStandardMaterial({ color: 0x2a2a2a });
            const trunk = new THREE.Mesh(trunkGeom, trunkMat);
            trunk.position.y = 2.5;
            trunk.castShadow = true;
            group.add(trunk);
            
            // Dead branches
            for (let j = 0; j < 3; j++) {
                const branchGeom = new THREE.CylinderGeometry(0.1, 0.15, 2, 6);
                const branch = new THREE.Mesh(branchGeom, trunkMat);
                branch.position.set(
                    (Math.random() - 0.5) * 0.5,
                    3 + j * 0.5,
                    (Math.random() - 0.5) * 0.5
                );
                branch.rotation.z = Math.random() * 0.5;
                group.add(branch);
            }
            
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * (this.size / 2) * 0.8;
            const x = this.center.x + Math.cos(angle) * radius;
            const z = this.center.z + Math.sin(angle) * radius;
            const y = this.getTerrainHeight(x - this.center.x, z - this.center.z);
            
            group.position.set(x, y, z);
            group.rotation.y = Math.random() * Math.PI * 2;
            
            this.scene.add(group);
            this.deadTrees.push(group);
        }
        
        logger.info(`      ✅ Added ${this.deadTrees.length} dead trees`);
    }
    
    /**
     * Add volcanic props
     */
    async addVolcanicProps() {
        logger.info('   🔥 Adding volcanic props...');
        
        // Add some props if available
        const propCount = 20;
        
        for (let i = 0; i < propCount; i++) {
            try {
                const propPath = this.assetRegistry.getProp('containers');
                if (propPath) {
                    const model = await this.modelLoader.load(propPath);
                    if (model) {
                        const angle = Math.random() * Math.PI * 2;
                        const radius = Math.random() * (this.size / 2) * 0.7;
                        const x = this.center.x + Math.cos(angle) * radius;
                        const z = this.center.z + Math.sin(angle) * radius;
                        const y = this.getTerrainHeight(x - this.center.x, z - this.center.z);
                        
                        model.position.set(x, y, z);
                        model.scale.setScalar(1.5);
                        model.rotation.y = Math.random() * Math.PI * 2;
                        
                        this.scene.add(model);
                        this.props.push(model);
                    }
                }
            } catch (error) {
                // Skip
            }
        }
        
        logger.info(`      ✅ Added ${this.props.length} props`);
    }
    
    /**
     * Create lava flows
     */
    async createLavaFlows() {
        logger.info('   🌋 Creating lava flows...');
        
        const lavaCount = 15;
        
        for (let i = 0; i < lavaCount; i++) {
            const lavaGeom = new THREE.PlaneGeometry(5 + Math.random() * 10, 2 + Math.random() * 3);
            const lavaMat = new THREE.MeshBasicMaterial({
                color: 0xff3300,
                emissive: 0xff6600,
                emissiveIntensity: 1
            });
            const lava = new THREE.Mesh(lavaGeom, lavaMat);
            
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * (this.size / 2) * 0.6;
            const x = this.center.x + Math.cos(angle) * radius;
            const z = this.center.z + Math.sin(angle) * radius;
            const y = this.getTerrainHeight(x - this.center.x, z - this.center.z);
            
            lava.position.set(x, y + 0.1, z);
            lava.rotation.x = -Math.PI / 2;
            lava.rotation.z = Math.random() * Math.PI * 2;
            
            // Add light
            const light = new THREE.PointLight(0xff3300, 2, 10);
            light.position.copy(lava.position);
            light.position.y += 1;
            this.scene.add(light);
            
            this.scene.add(lava);
            this.lavaFlows.push(lava);
        }
        
        logger.info(`      ✅ Created ${this.lavaFlows.length} lava flows`);
    }
    
    /**
     * Build Dragonspine Summit
     */
    async buildDragonspineSummit() {
        logger.info('   🐉 Building Dragonspine Summit...');
        
        // Highest peak
        const peakGroup = new THREE.Group();
        
        // Main peak
        const peakGeom = new THREE.ConeGeometry(15, 80, 8);
        const peakMat = new THREE.MeshStandardMaterial({ color: 0x3a1a1a });
        const peak = new THREE.Mesh(peakGeom, peakMat);
        peak.position.y = 40;
        peak.castShadow = true;
        peakGroup.add(peak);
        
        // Dragon perch at top
        const perchGeom = new THREE.CylinderGeometry(8, 10, 5, 12);
        const perch = new THREE.Mesh(perchGeom, peakMat);
        perch.position.y = 82;
        peakGroup.add(perch);
        
        peakGroup.position.set(this.center.x, 0, this.center.z);
        this.scene.add(peakGroup);
        this.mountains.push(peakGroup);
        
        logger.info('      ✅ Dragonspine Summit complete');
    }
    
    /**
     * Build Forge of Titans
     */
    async buildForgeOfTitans() {
        logger.info('   ⚒️ Building Forge of Titans...');
        
        const forgePos = {
            x: this.center.x + 30,
            z: this.center.z + 30
        };
        
        // Forge building
        const forgeGroup = new THREE.Group();
        
        // Stone structure
        const buildingGeom = new THREE.BoxGeometry(15, 10, 15);
        const buildingMat = new THREE.MeshStandardMaterial({ color: 0x4a4a4a });
        const building = new THREE.Mesh(buildingGeom, buildingMat);
        building.position.y = 5;
        building.castShadow = true;
        forgeGroup.add(building);
        
        // Chimney with smoke
        const chimneyGeom = new THREE.CylinderGeometry(2, 2, 8, 8);
        const chimney = new THREE.Mesh(chimneyGeom, buildingMat);
        chimney.position.set(5, 14, 5);
        forgeGroup.add(chimney);
        
        // Forge fire light
        const forgeLight = new THREE.PointLight(0xff6600, 5, 30);
        forgeLight.position.set(0, 5, 0);
        forgeGroup.add(forgeLight);
        
        forgeGroup.position.set(forgePos.x, this.getTerrainHeight(30, 30), forgePos.z);
        this.scene.add(forgeGroup);
        
        logger.info('      ✅ Forge of Titans complete');
    }
    
    /**
     * Get terrain height at position
     */
    getTerrainHeight(x, z) {
        return Math.abs(Math.sin(x * 0.01) * Math.cos(z * 0.01)) * 50 +
               Math.abs(Math.sin(x * 0.05) * Math.cos(z * 0.05)) * 20;
    }
    
    /**
     * Cleanup
     */
    destroy() {
        [...this.mountains, ...this.rocks, ...this.lavaFlows, ...this.deadTrees, ...this.props].forEach(obj => {
            this.scene.remove(obj);
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) obj.material.dispose();
        });
        
        if (this.terrain) {
            this.scene.remove(this.terrain);
            this.terrain.geometry.dispose();
            this.terrain.material.dispose();
        }
    }
}
