/**
import { logger } from '../core/Logger.js';
 * DungeonGenerator - Procedural dungeon generation system
 * Generates dungeons based on different biomes from Dynasty of Emberveil lore
 */

import * as THREE from 'three';

export class DungeonGenerator {
    constructor() {
        this.biomes = {
            crystal_cavern: {
                name: 'Crystal Caverns',
                description: 'Glowing crystalline caves pulsing with arcane energy',
                colors: {
                    floor: 0x4a0e7a,
                    wall: 0x7209b7,
                    accent: 0xc77dff
                },
                difficulty: 1
            },
            fungal_city: {
                name: 'Fungal City',
                description: 'An ancient civilization overtaken by bioluminescent mushrooms',
                colors: {
                    floor: 0x2d6a4f,
                    wall: 0x1b4332,
                    accent: 0x52b788
                },
                difficulty: 2
            },
            vine_cathedral: {
                name: 'Vine Cathedral',
                description: 'A once-holy place now wrapped in living vines',
                colors: {
                    floor: 0x3a5a40,
                    wall: 0x344e41,
                    accent: 0x588157
                },
                difficulty: 3
            },
            broken_starship: {
                name: 'Broken Starship',
                description: 'The crashed remains of an interdimensional vessel',
                colors: {
                    floor: 0x1a1a2e,
                    wall: 0x0f3460,
                    accent: 0x16213e
                },
                difficulty: 4
            },
            twilight_throne: {
                name: 'Twilight Throne',
                description: 'The corrupted heart of the Dynasty of Emberveil',
                colors: {
                    floor: 0x2d0a4e,
                    wall: 0x1a0033,
                    accent: 0x9d4edd
                },
                difficulty: 5
            }
        };
    }
    
    generate(biomeKey, level = 1) {
        const biome = this.biomes[biomeKey] || this.biomes.crystal_cavern;
        const size = 30 + (level * 5);
        
        const dungeon = {
            name: biome.name,
            biome: biomeKey,
            level: level,
            size: size,
            floor: null,
            walls: null,
            decorations: [],
            spawnPoints: [],
            bossRoom: null
        };
        
        // Generate floor
        dungeon.floor = this.createFloor(size, biome.colors.floor);
        
        // Generate walls
        dungeon.walls = this.createWalls(size, biome.colors.wall);
        
        // Generate decorations based on biome
        dungeon.decorations = this.createDecorations(biome, size);
        
        // Generate spawn points for enemies
        dungeon.spawnPoints = this.createSpawnPoints(size, 5 + level);
        
        logger.info(`🏰 Generated dungeon: ${dungeon.name} (Level ${level})`);
        
        return dungeon;
    }
    
    createFloor(size, color) {
        const geometry = new THREE.PlaneGeometry(size, size);
        const material = new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.8,
            metalness: 0.2
        });
        
        const floor = new THREE.Mesh(geometry, material);
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        
        return floor;
    }
    
    createWalls(size, color) {
        const walls = new THREE.Group();
        const wallHeight = 8;
        const thickness = 0.5;
        
        const material = new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.7,
            metalness: 0.3
        });
        
        // North wall
        const northWall = new THREE.Mesh(
            new THREE.BoxGeometry(size, wallHeight, thickness),
            material
        );
        northWall.position.set(0, wallHeight / 2, -size / 2);
        northWall.castShadow = true;
        northWall.receiveShadow = true;
        walls.add(northWall);
        
        // South wall
        const southWall = new THREE.Mesh(
            new THREE.BoxGeometry(size, wallHeight, thickness),
            material
        );
        southWall.position.set(0, wallHeight / 2, size / 2);
        southWall.castShadow = true;
        southWall.receiveShadow = true;
        walls.add(southWall);
        
        // East wall
        const eastWall = new THREE.Mesh(
            new THREE.BoxGeometry(thickness, wallHeight, size),
            material
        );
        eastWall.position.set(size / 2, wallHeight / 2, 0);
        eastWall.castShadow = true;
        eastWall.receiveShadow = true;
        walls.add(eastWall);
        
        // West wall
        const westWall = new THREE.Mesh(
            new THREE.BoxGeometry(thickness, wallHeight, size),
            material
        );
        westWall.position.set(-size / 2, wallHeight / 2, 0);
        westWall.castShadow = true;
        westWall.receiveShadow = true;
        walls.add(westWall);
        
        return walls;
    }
    
    createDecorations(biome, size) {
        const decorations = [];
        const count = Math.floor(Math.random() * 10) + 10;
        
        for (let i = 0; i < count; i++) {
            const decoration = this.createDecoration(biome);
            
            // Random position within dungeon bounds
            decoration.position.set(
                (Math.random() - 0.5) * (size - 10),
                0,
                (Math.random() - 0.5) * (size - 10)
            );
            
            decorations.push(decoration);
        }
        
        return decorations;
    }
    
    createDecoration(biome) {
        // Create different decorations based on biome
        const type = Math.random();
        
        if (type < 0.3) {
            // Pillar
            const geometry = new THREE.CylinderGeometry(0.5, 0.6, 4, 8);
            const material = new THREE.MeshStandardMaterial({
                color: biome.colors.accent,
                emissive: biome.colors.accent,
                emissiveIntensity: 0.2
            });
            const pillar = new THREE.Mesh(geometry, material);
            pillar.position.y = 2;
            pillar.castShadow = true;
            pillar.receiveShadow = true;
            return pillar;
        } else if (type < 0.6) {
            // Crystal/Mushroom
            const geometry = new THREE.ConeGeometry(0.5, 2, 6);
            const material = new THREE.MeshStandardMaterial({
                color: biome.colors.accent,
                emissive: biome.colors.accent,
                emissiveIntensity: 0.4,
                transparent: true,
                opacity: 0.8
            });
            const crystal = new THREE.Mesh(geometry, material);
            crystal.position.y = 1;
            crystal.castShadow = true;
            return crystal;
        } else {
            // Rock/Debris
            const geometry = new THREE.DodecahedronGeometry(0.8, 0);
            const material = new THREE.MeshStandardMaterial({
                color: biome.colors.wall,
                roughness: 1
            });
            const rock = new THREE.Mesh(geometry, material);
            rock.position.y = 0.4;
            rock.castShadow = true;
            rock.receiveShadow = true;
            return rock;
        }
    }
    
    createSpawnPoints(size, count) {
        const points = [];
        const margin = 5;
        
        for (let i = 0; i < count; i++) {
            points.push(new THREE.Vector3(
                (Math.random() - 0.5) * (size - margin * 2),
                1,
                (Math.random() - 0.5) * (size - margin * 2)
            ));
        }
        
        return points;
    }
}
