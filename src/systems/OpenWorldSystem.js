/**
 * OpenWorldSystem - Full open-world exploration system
 * Transforms the game from dungeon crawler to open-world MMORPG
 */

import * as THREE from 'three';

export class OpenWorldSystem {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.scene = gameEngine.scene;
        this.camera = gameEngine.camera;
        
        this.worldSize = 1000; // 1km x 1km world
        this.chunkSize = 50; // 50m chunks
        this.loadDistance = 3; // Load 3 chunks in each direction
        
        this.chunks = new Map();
        this.activeChunks = new Set();
        this.playerPosition = new THREE.Vector3();
        
        this.biomes = {
            forest: { color: 0x2d5016, density: 0.8, height: 0.3 },
            plains: { color: 0x7cb342, density: 0.3, height: 0.1 },
            mountains: { color: 0x5d4037, density: 0.2, height: 2.0 },
            desert: { color: 0xffd54f, density: 0.1, height: 0.05 },
            tundra: { color: 0xb0bec5, density: 0.2, height: 0.2 },
            swamp: { color: 0x558b2f, density: 0.9, height: 0.0 }
        };
        
        this.pointsOfInterest = [];
        this.landmarks = [];
        
        this.init();
    }
    
    init() {
        this.createTerrain();
        this.generatePointsOfInterest();
        
        console.log('🌍 Open World System initialized');
    }
    
    createTerrain() {
        // Create base terrain mesh
        const resolution = 128;
        const geometry = new THREE.PlaneGeometry(
            this.worldSize,
            this.worldSize,
            resolution,
            resolution
        );
        
        // Generate heightmap with Perlin-like noise
        const vertices = geometry.attributes.position.array;
        
        for (let i = 0; i < vertices.length; i += 3) {
            const x = vertices[i];
            const z = vertices[i + 1];
            
            // Multi-octave noise for realistic terrain
            let height = 0;
            let frequency = 0.01;
            let amplitude = 10;
            
            for (let octave = 0; octave < 4; octave++) {
                height += this.noise(x * frequency, z * frequency) * amplitude;
                frequency *= 2;
                amplitude *= 0.5;
            }
            
            vertices[i + 2] = height;
        }
        
        geometry.computeVertexNormals();
        geometry.attributes.position.needsUpdate = true;
        
        // Apply texture based on height and biome
        const material = new THREE.MeshStandardMaterial({
            color: 0x7cb342,
            roughness: 0.8,
            metalness: 0.1,
            flatShading: false
        });
        
        this.terrain = new THREE.Mesh(geometry, material);
        this.terrain.rotation.x = -Math.PI / 2;
        this.terrain.receiveShadow = true;
        this.scene.add(this.terrain);
        
        console.log('🗺️ Terrain generated');
    }
    
    noise(x, y) {
        // Simple pseudo-random noise function
        const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
        return n - Math.floor(n);
    }
    
    generatePointsOfInterest() {
        const poiTypes = [
            { name: 'Village', icon: '🏘️', radius: 20 },
            { name: 'Dungeon', icon: '⚔️', radius: 10 },
            { name: 'Boss Arena', icon: '👹', radius: 30 },
            { name: 'Shrine', icon: '⛩️', radius: 5 },
            { name: 'Trading Post', icon: '🏪', radius: 8 },
            { name: 'Treasure Cache', icon: '💎', radius: 3 },
            { name: 'Portal', icon: '🌀', radius: 5 },
            { name: 'Ancient Ruins', icon: '🏛️', radius: 25 }
        ];
        
        // Generate 50 POIs across the world
        for (let i = 0; i < 50; i++) {
            const type = poiTypes[Math.floor(Math.random() * poiTypes.length)];
            const position = new THREE.Vector3(
                (Math.random() - 0.5) * this.worldSize * 0.8,
                0,
                (Math.random() - 0.5) * this.worldSize * 0.8
            );
            
            // Get terrain height at this position
            position.y = this.getTerrainHeight(position.x, position.z);
            
            this.pointsOfInterest.push({
                type: type.name,
                icon: type.icon,
                position: position.clone(),
                radius: type.radius,
                discovered: false
            });
        }
        
        console.log(`📍 Generated ${this.pointsOfInterest.length} points of interest`);
    }
    
    getTerrainHeight(x, z) {
        // Sample terrain height at position
        let height = 0;
        let frequency = 0.01;
        let amplitude = 10;
        
        for (let octave = 0; octave < 4; octave++) {
            height += this.noise(x * frequency, z * frequency) * amplitude;
            frequency *= 2;
            amplitude *= 0.5;
        }
        
        return height;
    }
    
    updateChunks(playerPosition) {
        this.playerPosition.copy(playerPosition);
        
        // Calculate which chunk the player is in
        const chunkX = Math.floor(playerPosition.x / this.chunkSize);
        const chunkZ = Math.floor(playerPosition.z / this.chunkSize);
        
        const newActiveChunks = new Set();
        
        // Load chunks around player
        for (let x = chunkX - this.loadDistance; x <= chunkX + this.loadDistance; x++) {
            for (let z = chunkZ - this.loadDistance; z <= chunkZ + this.loadDistance; z++) {
                const chunkKey = `${x},${z}`;
                newActiveChunks.add(chunkKey);
                
                if (!this.activeChunks.has(chunkKey)) {
                    this.loadChunk(x, z);
                }
            }
        }
        
        // Unload chunks that are too far
        this.activeChunks.forEach(chunkKey => {
            if (!newActiveChunks.has(chunkKey)) {
                this.unloadChunk(chunkKey);
            }
        });
        
        this.activeChunks = newActiveChunks;
    }
    
    loadChunk(x, z) {
        const chunkKey = `${x},${z}`;
        if (this.chunks.has(chunkKey)) return;
        
        const chunk = {
            x, z,
            objects: []
        };
        
        // Generate objects for this chunk
        this.populateChunk(chunk);
        
        this.chunks.set(chunkKey, chunk);
    }
    
    unloadChunk(chunkKey) {
        const chunk = this.chunks.get(chunkKey);
        if (!chunk) return;
        
        // Remove all objects from scene
        chunk.objects.forEach(obj => {
            this.scene.remove(obj);
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) {
                if (Array.isArray(obj.material)) {
                    obj.material.forEach(mat => mat.dispose());
                } else {
                    obj.material.dispose();
                }
            }
        });
        
        this.chunks.delete(chunkKey);
    }
    
    populateChunk(chunk) {
        const baseX = chunk.x * this.chunkSize;
        const baseZ = chunk.z * this.chunkSize;
        
        // Add trees/rocks based on biome
        const objectCount = 10 + Math.floor(Math.random() * 20);
        
        for (let i = 0; i < objectCount; i++) {
            const x = baseX + Math.random() * this.chunkSize;
            const z = baseZ + Math.random() * this.chunkSize;
            const y = this.getTerrainHeight(x, z);
            
            const obj = this.createEnvironmentObject(x, y, z);
            if (obj) {
                this.scene.add(obj);
                chunk.objects.push(obj);
            }
        }
    }
    
    createEnvironmentObject(x, y, z) {
        const type = Math.random();
        
        if (type < 0.6) {
            // Tree
            return this.createTree(x, y, z);
        } else {
            // Rock
            return this.createRock(x, y, z);
        }
    }
    
    createTree(x, y, z) {
        const group = new THREE.Group();
        
        // Trunk
        const trunkHeight = 3 + Math.random() * 2;
        const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.3, trunkHeight, 8);
        const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x4a3728 });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = trunkHeight / 2;
        trunk.castShadow = true;
        group.add(trunk);
        
        // Foliage
        const foliageGeometry = new THREE.ConeGeometry(1.5, 3, 8);
        const foliageMaterial = new THREE.MeshStandardMaterial({ color: 0x2d5016 });
        const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
        foliage.position.y = trunkHeight + 1;
        foliage.castShadow = true;
        group.add(foliage);
        
        group.position.set(x, y, z);
        return group;
    }
    
    createRock(x, y, z) {
        const size = 0.5 + Math.random() * 1.5;
        const geometry = new THREE.DodecahedronGeometry(size, 0);
        const material = new THREE.MeshStandardMaterial({
            color: 0x666666,
            roughness: 0.9,
            metalness: 0.1
        });
        
        const rock = new THREE.Mesh(geometry, material);
        rock.position.set(x, y + size * 0.5, z);
        rock.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        rock.castShadow = true;
        rock.receiveShadow = true;
        
        return rock;
    }
    
    discoverPOI(position, radius = 10) {
        this.pointsOfInterest.forEach(poi => {
            if (!poi.discovered) {
                const distance = position.distanceTo(poi.position);
                if (distance < radius) {
                    poi.discovered = true;
                    console.log(`🗺️ Discovered: ${poi.icon} ${poi.type}`);
                    
                    // Trigger discovery event
                    if (this.gameEngine.modernUISystem) {
                        this.gameEngine.modernUISystem.showNotification(
                            `Discovered: ${poi.type}`,
                            'achievement',
                            4000
                        );
                    }
                }
            }
        });
    }
    
    getNearbyPOIs(position, maxDistance = 50) {
        return this.pointsOfInterest
            .filter(poi => position.distanceTo(poi.position) <= maxDistance)
            .sort((a, b) => {
                const distA = position.distanceTo(a.position);
                const distB = position.distanceTo(b.position);
                return distA - distB;
            });
    }
    
    createWorldMap() {
        // Create minimap texture
        const mapSize = 512;
        const canvas = document.createElement('canvas');
        canvas.width = mapSize;
        canvas.height = mapSize;
        const ctx = canvas.getContext('2d');
        
        // Draw terrain
        ctx.fillStyle = '#7cb342';
        ctx.fillRect(0, 0, mapSize, mapSize);
        
        // Draw POIs
        this.pointsOfInterest.forEach(poi => {
            const mapX = ((poi.position.x / this.worldSize) + 0.5) * mapSize;
            const mapY = ((poi.position.z / this.worldSize) + 0.5) * mapSize;
            
            ctx.fillStyle = poi.discovered ? '#ffeb3b' : '#666666';
            ctx.beginPath();
            ctx.arc(mapX, mapY, 5, 0, Math.PI * 2);
            ctx.fill();
        });
        
        return canvas;
    }
    
    update(deltaTime) {
        // Update chunk loading based on player position
        if (this.gameEngine.player) {
            this.updateChunks(this.gameEngine.player.mesh.position);
            this.discoverPOI(this.gameEngine.player.mesh.position);
        }
    }
    
    dispose() {
        // Clean up all chunks
        this.chunks.forEach((chunk, key) => {
            this.unloadChunk(key);
        });
        
        if (this.terrain) {
            this.scene.remove(this.terrain);
            if (this.terrain.geometry) this.terrain.geometry.dispose();
            if (this.terrain.material) this.terrain.material.dispose();
        }
        
        console.log('🌍 Open World System disposed');
    }
}
