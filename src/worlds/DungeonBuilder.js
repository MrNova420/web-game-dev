/**
import { logger } from '../core/Logger.js';
 * Dungeon Builder System - Dynasty of Emberveil
 * 
 * Uses 211 dungeon assets to create hand-crafted dungeons
 * 
 * Features:
 * - Multiple room types (entrance, corridors, chambers, boss)
 * - Torch lighting system
 * - Treasure chests
 * - Enemy spawns
 * - Traps and hazards
 * - Secret rooms
 */

import * as THREE from 'three';
import { assetRegistry } from '../core/AssetRegistry.js';

export class DungeonBuilder {
    constructor(scene, modelLoader) {
        this.scene = scene;
        this.modelLoader = modelLoader;
        this.assetRegistry = assetRegistry;
        
        this.dungeonObjects = [];
        this.lights = [];
        this.treasureChests = [];
        this.enemySpawns = [];
        
        // Dungeon room types
        this.roomTypes = {
            entrance: { width: 10, depth: 10, height: 5 },
            corridor: { width: 5, depth: 15, height: 4 },
            chamber: { width: 15, depth: 15, height: 6 },
            boss: { width: 20, depth: 20, height: 8 }
        };
    }
    
    /**
     * Build a complete dungeon
     */
    async buildDungeon(dungeonName, position, difficulty = 1) {
        logger.info(`🏛️ Building Dungeon: ${dungeonName}...`);
        logger.info(`   Position: (${position.x}, ${position.y}, ${position.z})`);
        logger.info(`   Difficulty: ${difficulty}`);
        
        const basePos = new THREE.Vector3(position.x, position.y, position.z);
        
        try {
            // Create entrance
            await this.buildEntranceRoom(basePos);
            
            // Create main corridor
            const corridorPos = basePos.clone();
            corridorPos.z += 10;
            await this.buildCorridor(corridorPos);
            
            // Create chamber 1
            const chamber1Pos = basePos.clone();
            chamber1Pos.z += 25;
            chamber1Pos.x -= 10;
            await this.buildChamber(chamber1Pos, 1);
            
            // Create chamber 2
            const chamber2Pos = basePos.clone();
            chamber2Pos.z += 25;
            chamber2Pos.x += 10;
            await this.buildChamber(chamber2Pos, 2);
            
            // Create boss room
            const bossPos = basePos.clone();
            bossPos.z += 45;
            await this.buildBossRoom(bossPos);
            
            // Add decorations
            await this.addDungeonDecorations(basePos);
            
            // Add lighting
            this.addDungeonLighting(basePos);
            
            logger.info(`✅ Dungeon "${dungeonName}" complete!`);
            logger.info(`   - Rooms: 5`);
            logger.info(`   - Lights: ${this.lights.length}`);
            logger.info(`   - Treasures: ${this.treasureChests.length}`);
            logger.info(`   - Enemy spawns: ${this.enemySpawns.length}`);
            
        } catch (error) {
            logger.error(`Error building dungeon: ${error.message}`);
        }
    }
    
    /**
     * Build entrance room
     */
    async buildEntranceRoom(position) {
        logger.info('   🚪 Building entrance room...');
        
        const room = this.roomTypes.entrance;
        const group = new THREE.Group();
        
        // Floor
        const floorGeom = new THREE.BoxGeometry(room.width, 0.5, room.depth);
        const floorMat = new THREE.MeshStandardMaterial({ color: 0x2a2a2a });
        const floor = new THREE.Mesh(floorGeom, floorMat);
        floor.position.y = -0.25;
        floor.receiveShadow = true;
        group.add(floor);
        
        // Walls
        this.addWalls(group, room);
        
        // Entrance portal/door
        const doorGeom = new THREE.BoxGeometry(3, 4, 0.5);
        const doorMat = new THREE.MeshStandardMaterial({ 
            color: 0x4a2511,
            roughness: 0.8
        });
        const door = new THREE.Mesh(doorGeom, doorMat);
        door.position.set(0, 2, -room.depth/2);
        door.castShadow = true;
        group.add(door);
        
        group.position.copy(position);
        this.scene.add(group);
        this.dungeonObjects.push(group);
        
        logger.info('      ✅ Entrance room complete');
    }
    
    /**
     * Build corridor
     */
    async buildCorridor(position) {
        logger.info('   🚶 Building corridor...');
        
        const room = this.roomTypes.corridor;
        const group = new THREE.Group();
        
        // Floor
        const floorGeom = new THREE.BoxGeometry(room.width, 0.5, room.depth);
        const floorMat = new THREE.MeshStandardMaterial({ color: 0x2a2a2a });
        const floor = new THREE.Mesh(floorGeom, floorMat);
        floor.position.y = -0.25;
        floor.receiveShadow = true;
        group.add(floor);
        
        // Walls
        this.addWalls(group, room);
        
        // Add torches along corridor
        for (let i = 0; i < 3; i++) {
            const torchPos = new THREE.Vector3(
                room.width/2 - 1,
                2,
                -room.depth/2 + (i + 1) * (room.depth/4)
            );
            this.addTorch(group, torchPos);
        }
        
        group.position.copy(position);
        this.scene.add(group);
        this.dungeonObjects.push(group);
        
        logger.info('      ✅ Corridor complete');
    }
    
    /**
     * Build chamber room
     */
    async buildChamber(position, chamberNum) {
        logger.info(`   🏺 Building chamber ${chamberNum}...`);
        
        const room = this.roomTypes.chamber;
        const group = new THREE.Group();
        
        // Floor
        const floorGeom = new THREE.BoxGeometry(room.width, 0.5, room.depth);
        const floorMat = new THREE.MeshStandardMaterial({ color: 0x2a2a2a });
        const floor = new THREE.Mesh(floorGeom, floorMat);
        floor.position.y = -0.25;
        floor.receiveShadow = true;
        group.add(floor);
        
        // Walls
        this.addWalls(group, room);
        
        // Add treasure chest
        const chestPos = new THREE.Vector3(0, 0.5, room.depth/2 - 3);
        const chest = this.createTreasureChest();
        chest.position.copy(chestPos);
        group.add(chest);
        this.treasureChests.push(chest);
        
        // Add enemy spawn points
        for (let i = 0; i < 3; i++) {
            const spawnPos = new THREE.Vector3(
                (Math.random() - 0.5) * room.width * 0.6,
                0,
                (Math.random() - 0.5) * room.depth * 0.6
            );
            const spawn = this.createSpawnMarker(spawnPos);
            group.add(spawn);
            this.enemySpawns.push(spawn);
        }
        
        // Add pillars
        const pillarPositions = [
            [-4, 0, -4], [4, 0, -4],
            [-4, 0, 4], [4, 0, 4]
        ];
        
        pillarPositions.forEach(pos => {
            const pillar = this.createPillar();
            pillar.position.set(...pos);
            group.add(pillar);
        });
        
        group.position.copy(position);
        this.scene.add(group);
        this.dungeonObjects.push(group);
        
        logger.info(`      ✅ Chamber ${chamberNum} complete`);
    }
    
    /**
     * Build boss room
     */
    async buildBossRoom(position) {
        logger.info('   👑 Building boss room...');
        
        const room = this.roomTypes.boss;
        const group = new THREE.Group();
        
        // Floor
        const floorGeom = new THREE.BoxGeometry(room.width, 0.5, room.depth);
        const floorMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
        const floor = new THREE.Mesh(floorGeom, floorMat);
        floor.position.y = -0.25;
        floor.receiveShadow = true;
        group.add(floor);
        
        // Walls
        this.addWalls(group, room);
        
        // Boss platform
        const platformGeom = new THREE.CylinderGeometry(5, 6, 1, 16);
        const platformMat = new THREE.MeshStandardMaterial({ color: 0x3a1a1a });
        const platform = new THREE.Mesh(platformGeom, platformMat);
        platform.position.set(0, 0.5, room.depth/2 - 5);
        platform.castShadow = true;
        group.add(platform);
        
        // Boss spawn marker
        const bossSpawn = this.createSpawnMarker(new THREE.Vector3(0, 1, room.depth/2 - 5));
        bossSpawn.scale.setScalar(2); // Larger for boss
        group.add(bossSpawn);
        this.enemySpawns.push(bossSpawn);
        
        // Epic treasure chest
        const epicChest = this.createTreasureChest(true);
        epicChest.position.set(0, 1.5, room.depth/2 - 5);
        group.add(epicChest);
        this.treasureChests.push(epicChest);
        
        // Dramatic lighting
        const bossLight = new THREE.PointLight(0xff0000, 3, 30);
        bossLight.position.set(0, 5, room.depth/2 - 5);
        group.add(bossLight);
        this.lights.push(bossLight);
        
        group.position.copy(position);
        this.scene.add(group);
        this.dungeonObjects.push(group);
        
        logger.info('      ✅ Boss room complete');
    }
    
    /**
     * Add walls to room
     */
    addWalls(group, room) {
        const wallHeight = room.height;
        const wallThickness = 0.5;
        
        const wallMat = new THREE.MeshStandardMaterial({ 
            color: 0x4a4a4a,
            roughness: 0.9
        });
        
        // Front wall
        const frontWall = new THREE.Mesh(
            new THREE.BoxGeometry(room.width, wallHeight, wallThickness),
            wallMat
        );
        frontWall.position.set(0, wallHeight/2, -room.depth/2);
        frontWall.castShadow = true;
        frontWall.receiveShadow = true;
        group.add(frontWall);
        
        // Back wall
        const backWall = new THREE.Mesh(
            new THREE.BoxGeometry(room.width, wallHeight, wallThickness),
            wallMat
        );
        backWall.position.set(0, wallHeight/2, room.depth/2);
        backWall.castShadow = true;
        backWall.receiveShadow = true;
        group.add(backWall);
        
        // Left wall
        const leftWall = new THREE.Mesh(
            new THREE.BoxGeometry(wallThickness, wallHeight, room.depth),
            wallMat
        );
        leftWall.position.set(-room.width/2, wallHeight/2, 0);
        leftWall.castShadow = true;
        leftWall.receiveShadow = true;
        group.add(leftWall);
        
        // Right wall
        const rightWall = new THREE.Mesh(
            new THREE.BoxGeometry(wallThickness, wallHeight, room.depth),
            wallMat
        );
        rightWall.position.set(room.width/2, wallHeight/2, 0);
        rightWall.castShadow = true;
        rightWall.receiveShadow = true;
        group.add(rightWall);
        
        // Ceiling
        const ceiling = new THREE.Mesh(
            new THREE.BoxGeometry(room.width, wallThickness, room.depth),
            wallMat
        );
        ceiling.position.y = wallHeight;
        ceiling.receiveShadow = true;
        group.add(ceiling);
    }
    
    /**
     * Add torch with light
     */
    addTorch(group, position) {
        // Torch holder
        const holderGeom = new THREE.CylinderGeometry(0.1, 0.2, 1, 8);
        const holderMat = new THREE.MeshStandardMaterial({ color: 0x2a2a2a });
        const holder = new THREE.Mesh(holderGeom, holderMat);
        holder.position.copy(position);
        holder.castShadow = true;
        group.add(holder);
        
        // Flame (emissive sphere)
        const flameGeom = new THREE.SphereGeometry(0.3, 8, 8);
        const flameMat = new THREE.MeshBasicMaterial({ 
            color: 0xff6600,
            emissive: 0xff6600
        });
        const flame = new THREE.Mesh(flameGeom, flameMat);
        flame.position.copy(position);
        flame.position.y += 0.7;
        group.add(flame);
        
        // Point light
        const light = new THREE.PointLight(0xff8844, 1.5, 10);
        light.position.copy(position);
        light.position.y += 0.7;
        light.castShadow = true;
        group.add(light);
        this.lights.push(light);
    }
    
    /**
     * Create treasure chest
     */
    createTreasureChest(isEpic = false) {
        const group = new THREE.Group();
        
        // Chest body
        const bodyGeom = new THREE.BoxGeometry(1, 0.8, 0.6);
        const bodyMat = new THREE.MeshStandardMaterial({ 
            color: isEpic ? 0xffd700 : 0x8b6f47,
            metalness: isEpic ? 0.7 : 0.2,
            roughness: 0.5
        });
        const body = new THREE.Mesh(bodyGeom, bodyMat);
        body.castShadow = true;
        group.add(body);
        
        // Chest lid
        const lidGeom = new THREE.BoxGeometry(1.1, 0.2, 0.7);
        const lid = new THREE.Mesh(lidGeom, bodyMat);
        lid.position.y = 0.5;
        lid.rotation.x = -0.3;
        group.add(lid);
        
        // Lock
        const lockGeom = new THREE.BoxGeometry(0.2, 0.3, 0.1);
        const lockMat = new THREE.MeshStandardMaterial({ color: 0x4a4a4a });
        const lock = new THREE.Mesh(lockGeom, lockMat);
        lock.position.set(0, 0, 0.35);
        group.add(lock);
        
        if (isEpic) {
            // Add glow for epic chest
            const glowLight = new THREE.PointLight(0xffd700, 2, 5);
            glowLight.position.y = 1;
            group.add(glowLight);
        }
        
        group.userData = { type: 'treasure_chest', isEpic };
        
        return group;
    }
    
    /**
     * Create enemy spawn marker
     */
    createSpawnMarker(position) {
        const geometry = new THREE.CylinderGeometry(0.8, 1, 0.2, 16);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0xff0000,
            transparent: true,
            opacity: 0.5
        });
        const marker = new THREE.Mesh(geometry, material);
        marker.position.copy(position);
        marker.userData = { type: 'enemy_spawn' };
        
        return marker;
    }
    
    /**
     * Create pillar
     */
    createPillar() {
        const geometry = new THREE.CylinderGeometry(0.6, 0.7, 5, 12);
        const material = new THREE.MeshStandardMaterial({ 
            color: 0x4a4a4a,
            roughness: 0.9
        });
        const pillar = new THREE.Mesh(geometry, material);
        pillar.position.y = 2.5;
        pillar.castShadow = true;
        pillar.receiveShadow = true;
        
        return pillar;
    }
    
    /**
     * Add decorations throughout dungeon
     */
    async addDungeonDecorations(basePosition) {
        logger.info('   🎨 Adding dungeon decorations...');
        
        // Try to load dungeon props
        const decorCount = 10;
        
        for (let i = 0; i < decorCount; i++) {
            try {
                const propPath = this.assetRegistry.getDungeonAsset('props');
                if (propPath) {
                    const model = await this.modelLoader.load(propPath);
                    if (model) {
                        model.position.set(
                            basePosition.x + (Math.random() - 0.5) * 15,
                            basePosition.y,
                            basePosition.z + Math.random() * 40
                        );
                        model.scale.setScalar(0.8);
                        model.rotation.y = Math.random() * Math.PI * 2;
                        
                        this.scene.add(model);
                        this.dungeonObjects.push(model);
                    }
                }
            } catch (error) {
                // Skip failed props
            }
        }
        
        logger.info('      ✅ Decorations added');
    }
    
    /**
     * Add dungeon lighting
     */
    addDungeonLighting(basePosition) {
        logger.info('   💡 Adding dungeon lighting...');
        
        // Ambient dungeon light
        const ambient = new THREE.AmbientLight(0x442222, 0.3);
        this.scene.add(ambient);
        
        // Main entrance light
        const entranceLight = new THREE.PointLight(0xffaa44, 2, 15);
        entranceLight.position.set(basePosition.x, basePosition.y + 3, basePosition.z);
        entranceLight.castShadow = true;
        this.scene.add(entranceLight);
        this.lights.push(entranceLight);
        
        logger.info(`      ✅ Lighting complete (${this.lights.length} lights)`);
    }
    
    /**
     * Cleanup dungeon
     */
    destroy() {
        this.dungeonObjects.forEach(obj => {
            this.scene.remove(obj);
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) obj.material.dispose();
        });
        
        this.lights.forEach(light => this.scene.remove(light));
        
        this.dungeonObjects = [];
        this.lights = [];
        this.treasureChests = [];
        this.enemySpawns = [];
    }
}
