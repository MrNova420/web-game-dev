/**
 * Mystic Forest Biome - First Complete Biome Implementation
 * The starting zone as described in README
 * 
 * Features:
 * - Lush ancient forest with glowing flora
 * - Forest spirits, wolves, tree ents, deer, rabbits
 * - Ancient Tree of Beginnings (World Tree)
 * - Moonlit Glade (hidden village)
 * - Whispering Grove (mystical area)
 */

import * as THREE from 'three';
import { assetRegistry } from '../core/AssetRegistry.js';
import { MoonlitGladeVillage } from './MoonlitGladeVillage.js';

export class MysticForestBiome {
    constructor(scene, modelLoader) {
        this.scene = scene;
        this.modelLoader = modelLoader;
        this.assetRegistry = assetRegistry;
        
        this.terrain = null;
        this.trees = [];
        this.rocks = [];
        this.plants = [];
        this.structures = [];
        this.village = null;
        
        this.worldSize = 200; // 200x200 world
    }
    
    /**
     * Build the complete Mystic Forest biome
     */
    async build() {
        console.log('🌲 Building Mystic Forest Biome...');
        
        try {
            // Setup environment
            this.setupEnvironment();
            
            // Create terrain
            this.createTerrain();
            
            // Build world in parallel where possible
            await Promise.all([
                this.plantForest(),
                this.addRocks(),
                this.addGroundCover()
            ]);
            
            // Build special locations
            await this.buildAncientTree();
            
            // Build Moonlit Glade Village - complete with buildings, NPCs, props
            this.village = new MoonlitGladeVillage(this.scene, this.modelLoader);
            await this.village.build();
            
            // Add atmospheric effects
            this.addMist();
            this.addGlowingParticles();
            
            console.log('✅ Mystic Forest complete!');
            console.log(`   - Trees: ${this.trees.length}`);
            console.log(`   - Rocks: ${this.rocks.length}`);
            console.log(`   - Plants: ${this.plants.length}`);
            
        } catch (error) {
            console.error('Error building Mystic Forest:', error);
        }
    }
    
    /**
     * Setup environmental lighting and atmosphere
     */
    setupEnvironment() {
        // Mystical forest colors
        this.scene.background = new THREE.Color(0x1a2f3a);
        this.scene.fog = new THREE.FogExp2(0x1a3f5a, 0.008);
        
        // Ambient light - mystical blue-green tint
        const ambient = new THREE.AmbientLight(0x4a7c8c, 0.6);
        this.scene.add(ambient);
        
        // Directional light - soft sunlight through trees
        const sunlight = new THREE.DirectionalLight(0xffffff, 0.8);
        sunlight.position.set(50, 100, 50);
        sunlight.castShadow = true;
        sunlight.shadow.camera.left = -100;
        sunlight.shadow.camera.right = 100;
        sunlight.shadow.camera.top = 100;
        sunlight.shadow.camera.bottom = -100;
        this.scene.add(sunlight);
        
        // Mystical glow lights (multiple point lights)
        const glowColors = [0x00ffff, 0x00ff88, 0x4477ff];
        for (let i = 0; i < 10; i++) {
            const light = new THREE.PointLight(
                glowColors[Math.floor(Math.random() * glowColors.length)],
                0.5,
                20
            );
            const angle = (i / 10) * Math.PI * 2;
            const radius = 30 + Math.random() * 50;
            light.position.set(
                Math.cos(angle) * radius,
                2 + Math.random() * 3,
                Math.sin(angle) * radius
            );
            this.scene.add(light);
        }
        
        console.log('🌄 Environment setup complete');
    }
    
    /**
     * Create the forest terrain
     */
    createTerrain() {
        const geometry = new THREE.PlaneGeometry(
            this.worldSize, 
            this.worldSize, 
            100, 
            100
        );
        
        // Add elevation variation
        const vertices = geometry.attributes.position.array;
        for (let i = 0; i < vertices.length; i += 3) {
            const x = vertices[i];
            const z = vertices[i + 1];
            
            // Gentle hills using multiple noise octaves
            const height = 
                Math.sin(x * 0.02) * 2 +
                Math.cos(z * 0.03) * 1.5 +
                Math.sin(x * 0.1) * Math.cos(z * 0.1) * 0.5;
            
            vertices[i + 2] = height;
        }
        
        geometry.computeVertexNormals();
        
        // Forest floor material - mossy green
        const material = new THREE.MeshStandardMaterial({
            color: 0x2d5016,
            roughness: 0.9,
            metalness: 0.1
        });
        
        this.terrain = new THREE.Mesh(geometry, material);
        this.terrain.rotation.x = -Math.PI / 2;
        this.terrain.receiveShadow = true;
        this.scene.add(this.terrain);
        
        console.log('🗺️ Terrain created');
    }
    
    /**
     * Plant forest with varied trees
     */
    async plantForest() {
        console.log('🌲 Planting forest...');
        
        const treeCount = 150; // Dense forest
        const loadedTrees = [];
        
        // Load tree models ONE AT A TIME for reliable loading
        // This prevents overwhelming the browser with 150 simultaneous requests
        for (let i = 0; i < treeCount; i++) {
            try {
                const tree = await this.placeTree(i);
                if (tree) {
                    loadedTrees.push(tree);
                }
                
                // Progress feedback every 25 trees
                if ((i + 1) % 25 === 0) {
                    console.log(`   🌲 Planted ${i + 1}/${treeCount} trees...`);
                }
            } catch (error) {
                // Continue even if one tree fails
                this.createFallbackTree(i);
            }
        }
        
        console.log(`   ✅ Planted ${this.trees.length} trees`);
    }
    
    /**
     * Place a single tree
     */
    async placeTree(index) {
        try {
            const treePath = this.assetRegistry.getRandomTree();
            const model = await this.modelLoader.load(treePath);
            
            if (!model) {
                // Fallback tree
                return this.createFallbackTree(index);
            }
            
            // Position in forest pattern (clustered but not overlapping)
            const angle = (index / 150) * Math.PI * 2 + Math.random() * 0.5;
            const radius = 10 + Math.random() * 80;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            
            model.position.set(x, this.getTerrainHeight(x, z), z);
            model.rotation.y = Math.random() * Math.PI * 2;
            
            // Scale variation for natural look
            const scale = 0.8 + Math.random() * 0.6;
            model.scale.setScalar(scale);
            
            model.castShadow = true;
            model.receiveShadow = true;
            
            this.scene.add(model);
            this.trees.push(model);
            
            return model;
        } catch (error) {
            return this.createFallbackTree(index);
        }
    }
    
    /**
     * Create a fallback tree if model fails to load
     */
    createFallbackTree(index) {
        // Simple tree made of primitives
        const group = new THREE.Group();
        
        // Trunk
        const trunkGeom = new THREE.CylinderGeometry(0.3, 0.4, 4, 8);
        const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4a2511 });
        const trunk = new THREE.Mesh(trunkGeom, trunkMat);
        trunk.position.y = 2;
        trunk.castShadow = true;
        group.add(trunk);
        
        // Foliage - 3 spheres
        const foliageGeom = new THREE.SphereGeometry(2, 8, 8);
        const foliageMat = new THREE.MeshStandardMaterial({ color: 0x2d5016 });
        
        for (let i = 0; i < 3; i++) {
            const foliage = new THREE.Mesh(foliageGeom, foliageMat);
            foliage.position.y = 3.5 + i * 1;
            foliage.position.x = (Math.random() - 0.5) * 0.5;
            foliage.position.z = (Math.random() - 0.5) * 0.5;
            foliage.scale.setScalar(0.8 + i * 0.2);
            foliage.castShadow = true;
            group.add(foliage);
        }
        
        // Position
        const angle = (index / 150) * Math.PI * 2 + Math.random() * 0.5;
        const radius = 10 + Math.random() * 80;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        group.position.set(x, this.getTerrainHeight(x, z), z);
        
        this.scene.add(group);
        this.trees.push(group);
        
        return group;
    }
    
    /**
     * Add rocks scattered throughout
     */
    async addRocks() {
        console.log('🪨 Adding rocks...');
        
        const rockCount = 80;
        
        for (let i = 0; i < rockCount; i++) {
            try {
                const rockPath = this.assetRegistry.getRandomRock();
                const model = await this.modelLoader.load(rockPath);
                
                if (model) {
                    const angle = Math.random() * Math.PI * 2;
                    const radius = Math.random() * 90;
                    const x = Math.cos(angle) * radius;
                    const z = Math.sin(angle) * radius;
                    
                    model.position.set(x, this.getTerrainHeight(x, z), z);
                    model.rotation.set(
                        (Math.random() - 0.5) * 0.3,
                        Math.random() * Math.PI * 2,
                        (Math.random() - 0.5) * 0.3
                    );
                    
                    const scale = 0.5 + Math.random() * 1.5;
                    model.scale.setScalar(scale);
                    
                    model.castShadow = true;
                    model.receiveShadow = true;
                    
                    this.scene.add(model);
                    this.rocks.push(model);
                }
            } catch (error) {
                // Fallback rock
                this.createFallbackRock(i);
            }
        }
        
        console.log(`   ✅ Added ${this.rocks.length} rocks`);
    }
    
    /**
     * Create fallback rock
     */
    createFallbackRock(index) {
        const geometry = new THREE.DodecahedronGeometry(0.5 + Math.random(), 0);
        const material = new THREE.MeshStandardMaterial({ 
            color: 0x666666,
            roughness: 0.8 
        });
        const rock = new THREE.Mesh(geometry, material);
        
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 90;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        rock.position.set(x, this.getTerrainHeight(x, z), z);
        rock.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        
        const scale = 0.5 + Math.random() * 1.5;
        rock.scale.setScalar(scale);
        
        rock.castShadow = true;
        rock.receiveShadow = true;
        
        this.scene.add(rock);
        this.rocks.push(rock);
    }
    
    /**
     * Add ground cover (grass, flowers, plants)
     */
    async addGroundCover() {
        console.log('🌿 Adding ground cover...');
        
        const plantCount = 200;
        
        for (let i = 0; i < plantCount; i++) {
            try {
                const plantPath = this.assetRegistry.getRandomPlant();
                const model = await this.modelLoader.load(plantPath);
                
                if (model) {
                    const angle = Math.random() * Math.PI * 2;
                    const radius = Math.random() * 95;
                    const x = Math.cos(angle) * radius;
                    const z = Math.sin(angle) * radius;
                    
                    model.position.set(x, this.getTerrainHeight(x, z), z);
                    model.rotation.y = Math.random() * Math.PI * 2;
                    
                    const scale = 0.5 + Math.random() * 0.5;
                    model.scale.setScalar(scale);
                    
                    this.scene.add(model);
                    this.plants.push(model);
                }
            } catch (error) {
                // Skip failed plants - we have plenty
            }
        }
        
        console.log(`   ✅ Added ${this.plants.length} plants`);
    }
    
    /**
     * Build the Ancient Tree of Beginnings (centerpiece)
     */
    async buildAncientTree() {
        console.log('🌳 Building Ancient Tree of Beginnings...');
        
        // Massive tree in center
        const group = new THREE.Group();
        
        // Huge trunk
        const trunkGeom = new THREE.CylinderGeometry(2, 3, 20, 12);
        const trunkMat = new THREE.MeshStandardMaterial({ 
            color: 0x3a1f0f,
            roughness: 0.9
        });
        const trunk = new THREE.Mesh(trunkGeom, trunkMat);
        trunk.position.y = 10;
        trunk.castShadow = true;
        group.add(trunk);
        
        // Massive canopy
        const canopyGeom = new THREE.SphereGeometry(12, 16, 16);
        const canopyMat = new THREE.MeshStandardMaterial({ 
            color: 0x1a4d2e,
            emissive: 0x00ff44,
            emissiveIntensity: 0.2
        });
        const canopy = new THREE.Mesh(canopyGeom, canopyMat);
        canopy.position.y = 20;
        canopy.castShadow = true;
        group.add(canopy);
        
        // Glowing effect
        const glowLight = new THREE.PointLight(0x00ff44, 2, 30);
        glowLight.position.y = 20;
        group.add(glowLight);
        
        group.position.set(0, 0, 0);
        this.scene.add(group);
        
        console.log('   ✅ Ancient Tree created');
    }
    
    /**
     * Build Moonlit Glade (hidden village area)
     */
    async buildMoonlitGlade() {
        console.log('🏘️ Building Moonlit Glade...');
        
        const gladeCenter = { x: 50, z: 50 };
        
        // Try to load village structures
        const structureCount = 5;
        
        for (let i = 0; i < structureCount; i++) {
            try {
                // Try to get a building prop
                const propPath = this.assetRegistry.getProp('furniture');
                if (propPath) {
                    const model = await this.modelLoader.load(propPath);
                    if (model) {
                        const angle = (i / structureCount) * Math.PI * 2;
                        const radius = 10;
                        const x = gladeCenter.x + Math.cos(angle) * radius;
                        const z = gladeCenter.z + Math.sin(angle) * radius;
                        
                        model.position.set(x, this.getTerrainHeight(x, z), z);
                        model.rotation.y = angle + Math.PI;
                        model.scale.setScalar(2);
                        
                        this.scene.add(model);
                        this.structures.push(model);
                    }
                }
            } catch (error) {
                // Create simple structure fallback
                const hut = this.createSimpleHut(i, gladeCenter);
                this.structures.push(hut);
            }
        }
        
        // Add mystical light to glade
        const gladeLight = new THREE.PointLight(0xaaccff, 1.5, 40);
        gladeLight.position.set(gladeCenter.x, 10, gladeCenter.z);
        this.scene.add(gladeLight);
        
        console.log('   ✅ Moonlit Glade created');
    }
    
    /**
     * Create simple hut fallback
     */
    createSimpleHut(index, center) {
        const group = new THREE.Group();
        
        // Walls
        const wallGeom = new THREE.BoxGeometry(4, 3, 4);
        const wallMat = new THREE.MeshStandardMaterial({ color: 0x8b6f47 });
        const walls = new THREE.Mesh(wallGeom, wallMat);
        walls.position.y = 1.5;
        walls.castShadow = true;
        group.add(walls);
        
        // Roof
        const roofGeom = new THREE.ConeGeometry(3.5, 2, 4);
        const roofMat = new THREE.MeshStandardMaterial({ color: 0x654321 });
        const roof = new THREE.Mesh(roofGeom, roofMat);
        roof.position.y = 4;
        roof.rotation.y = Math.PI / 4;
        roof.castShadow = true;
        group.add(roof);
        
        const angle = (index / 5) * Math.PI * 2;
        const radius = 10;
        const x = center.x + Math.cos(angle) * radius;
        const z = center.z + Math.sin(angle) * radius;
        
        group.position.set(x, this.getTerrainHeight(x, z), z);
        group.rotation.y = angle + Math.PI;
        
        this.scene.add(group);
        return group;
    }
    
    /**
     * Add atmospheric mist/fog particles
     */
    addMist() {
        const particleCount = 1000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * this.worldSize;
            positions[i + 1] = Math.random() * 10;
            positions[i + 2] = (Math.random() - 0.5) * this.worldSize;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const material = new THREE.PointsMaterial({
            color: 0xaaccee,
            size: 2,
            transparent: true,
            opacity: 0.3,
            blending: THREE.AdditiveBlending
        });
        
        const mist = new THREE.Points(geometry, material);
        this.scene.add(mist);
        
        // Animate mist slowly
        const animateMist = () => {
            const positions = mist.geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                positions[i + 1] += Math.sin(Date.now() * 0.001 + i) * 0.01;
            }
            mist.geometry.attributes.position.needsUpdate = true;
            requestAnimationFrame(animateMist);
        };
        animateMist();
    }
    
    /**
     * Add magical glowing particles
     */
    addGlowingParticles() {
        const particleCount = 500;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * this.worldSize * 0.8;
            positions[i + 1] = Math.random() * 15 + 1;
            positions[i + 2] = (Math.random() - 0.5) * this.worldSize * 0.8;
            
            // Mystical colors - cyan, green, blue
            const colorChoice = Math.random();
            if (colorChoice < 0.33) {
                colors[i] = 0;
                colors[i + 1] = 1;
                colors[i + 2] = 1;
            } else if (colorChoice < 0.66) {
                colors[i] = 0;
                colors[i + 1] = 1;
                colors[i + 2] = 0.5;
            } else {
                colors[i] = 0.3;
                colors[i + 1] = 0.6;
                colors[i + 2] = 1;
            }
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 0.5,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        
        const particles = new THREE.Points(geometry, material);
        this.scene.add(particles);
        
        // Animate particles floating
        const animateParticles = () => {
            const time = Date.now() * 0.001;
            const positions = particles.geometry.attributes.position.array;
            
            for (let i = 0; i < positions.length; i += 3) {
                positions[i + 1] += Math.sin(time + i) * 0.02;
                positions[i] += Math.cos(time * 0.5 + i) * 0.01;
            }
            
            particles.geometry.attributes.position.needsUpdate = true;
            particles.rotation.y += 0.0005;
            
            requestAnimationFrame(animateParticles);
        };
        animateParticles();
    }
    
    /**
     * Get terrain height at X, Z position
     */
    getTerrainHeight(x, z) {
        // Simple height calculation matching terrain generation
        return Math.sin(x * 0.02) * 2 + Math.cos(z * 0.03) * 1.5;
    }
    
    /**
     * Cleanup biome
     */
    destroy() {
        // Remove all objects
        [...this.trees, ...this.rocks, ...this.plants, ...this.structures].forEach(obj => {
            this.scene.remove(obj);
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) obj.material.dispose();
        });
        
        if (this.terrain) {
            this.scene.remove(this.terrain);
            this.terrain.geometry.dispose();
            this.terrain.material.dispose();
        }
        
        this.trees = [];
        this.rocks = [];
        this.plants = [];
        this.structures = [];
    }
}
