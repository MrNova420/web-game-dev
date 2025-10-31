/**
import { logger } from '../core/Logger.js';
 * Living World System - Dynasty of Emberveil
 * 
 * Makes the world come alive with:
 * - Wandering NPCs in villages
 * - Patrolling enemies in zones
 * - Wildlife roaming in biomes
 * - Dynamic behaviors
 * - Day/night routines
 * - Zone-specific movement
 * 
 * Everything pre-configured and ready to activate.
 */

import * as THREE from 'three';

export class LivingWorldSystem {
    constructor(scene) {
        this.scene = scene;
        
        // Living entities
        this.npcs = [];
        this.enemies = [];
        this.wildlife = [];
        
        // Movement patterns
        this.wanderRadius = 20; // NPCs wander within 20 units
        this.patrolRadius = 50; // Enemies patrol within 50 units
        this.roamRadius = 100; // Wildlife roams within 100 units
        
        // Update timers
        this.lastUpdate = Date.now();
        this.updateInterval = 1000; // Update every second
        
        this.isActive = false;
    }
    
    /**
     * Initialize living world with pre-built data
     */
    initialize(worldData) {
        logger.info('🌍 Initializing Living World System...');
        logger.info('   Making world come alive with wandering entities!');
        
        // Initialize NPCs in villages
        this.initializeNPCs(worldData.villages);
        
        // Initialize enemies in zones
        this.initializeEnemies(worldData.biomes);
        
        // Initialize wildlife in biomes
        this.initializeWildlife(worldData.biomes);
        
        this.isActive = true;
        
        logger.info('✅ Living World System initialized!');
        logger.info(`   NPCs: ${this.npcs.length} wandering`);
        logger.info(`   Enemies: ${this.enemies.length} patrolling`);
        logger.info(`   Wildlife: ${this.wildlife.length} roaming`);
    }
    
    /**
     * Initialize NPCs with wander behavior
     */
    initializeNPCs(villages) {
        Object.values(villages || {}).forEach(village => {
            village.npcs?.forEach(npcData => {
                const npc = {
                    name: npcData.name,
                    type: npcData.type,
                    home: { x: npcData.x, y: npcData.y, z: npcData.z },
                    current: { x: npcData.x, y: npcData.y, z: npcData.z },
                    target: null,
                    speed: 0.5,
                    zone: village.name,
                    behavior: this.getNPCBehavior(npcData.type),
                    mesh: null // Will be set when rendered
                };
                
                this.npcs.push(npc);
            });
        });
        
        logger.info(`   Configured ${this.npcs.length} NPCs to wander in villages`);
    }
    
    /**
     * Get NPC behavior pattern
     */
    getNPCBehavior(type) {
        const behaviors = {
            quest_giver: {
                wanderChance: 0.3, // 30% chance to wander
                stayNearHome: true,
                radius: 10,
                routine: 'stationary' // Stays at post mostly
            },
            vendor: {
                wanderChance: 0.2,
                stayNearHome: true,
                radius: 5,
                routine: 'shopkeeper' // Behind counter mostly
            },
            guard: {
                wanderChance: 0.8, // Guards patrol
                stayNearHome: true,
                radius: 30,
                routine: 'patrol' // Walk around
            },
            villager: {
                wanderChance: 0.7,
                stayNearHome: false,
                radius: 50,
                routine: 'wander' // Walk around village
            }
        };
        
        return behaviors[type] || behaviors.villager;
    }
    
    /**
     * Initialize enemies with patrol behavior
     */
    initializeEnemies(biomes) {
        Object.values(biomes || {}).forEach(biome => {
            biome.enemySpawns?.forEach(spawnData => {
                const enemy = {
                    type: spawnData.type,
                    level: spawnData.level,
                    home: { x: spawnData.x, y: spawnData.y, z: spawnData.z },
                    current: { x: spawnData.x, y: spawnData.y, z: spawnData.z },
                    target: null,
                    speed: 1.0,
                    zone: biome.name,
                    behavior: this.getEnemyBehavior(spawnData.type),
                    patrolPoints: this.generatePatrolPoints(spawnData, 5),
                    currentPatrolIndex: 0,
                    mesh: null
                };
                
                this.enemies.push(enemy);
            });
        });
        
        logger.info(`   Configured ${this.enemies.length} enemies to patrol zones`);
    }
    
    /**
     * Get enemy behavior pattern
     */
    getEnemyBehavior(type) {
        const behaviors = {
            Skeleton_Minion: {
                patrolRadius: 30,
                speed: 0.8,
                aggressive: true,
                pattern: 'circle'
            },
            Skeleton_Warrior: {
                patrolRadius: 40,
                speed: 1.0,
                aggressive: true,
                pattern: 'square'
            },
            Skeleton_Mage: {
                patrolRadius: 25,
                speed: 0.6,
                aggressive: false,
                pattern: 'stationary'
            },
            Skeleton_Rogue: {
                patrolRadius: 60,
                speed: 1.5,
                aggressive: true,
                pattern: 'random'
            },
            Ancient_Lich: {
                patrolRadius: 15,
                speed: 0.5,
                aggressive: false,
                pattern: 'hover'
            }
        };
        
        return behaviors[type] || behaviors.Skeleton_Minion;
    }
    
    /**
     * Initialize wildlife with roaming behavior
     */
    initializeWildlife(biomes) {
        Object.values(biomes || {}).forEach(biome => {
            // Generate wildlife based on biome type
            const wildlifeCount = this.getWildlifeCount(biome);
            const wildlifeTypes = this.getWildlifeTypes(biome);
            
            for (let i = 0; i < wildlifeCount; i++) {
                const randomType = wildlifeTypes[Math.floor(Math.random() * wildlifeTypes.length)];
                const randomPos = this.getRandomPositionInBiome(biome);
                
                const animal = {
                    type: randomType,
                    home: randomPos,
                    current: { ...randomPos },
                    target: null,
                    speed: 1.2,
                    zone: biome.name,
                    behavior: this.getWildlifeBehavior(randomType),
                    mesh: null
                };
                
                this.wildlife.push(animal);
            }
        });
        
        logger.info(`   Configured ${this.wildlife.length} wildlife to roam biomes`);
    }
    
    /**
     * Get wildlife count for biome
     */
    getWildlifeCount(biome) {
        const counts = {
            'Mystic Forest': 20, // Deer, rabbits, birds
            'Crimson Peaks': 10, // Mountain goats, eagles
            'Everlight City': 5 // Pigeons, cats
        };
        
        return counts[biome.name] || 15;
    }
    
    /**
     * Get wildlife types for biome
     */
    getWildlifeTypes(biome) {
        const types = {
            'Mystic Forest': ['Deer', 'Rabbit', 'Fox', 'Bird', 'Squirrel'],
            'Crimson Peaks': ['Mountain_Goat', 'Eagle', 'Hawk', 'Lizard'],
            'Everlight City': ['Pigeon', 'Cat', 'Dog', 'Rat']
        };
        
        return types[biome.name] || ['Bird', 'Deer'];
    }
    
    /**
     * Get wildlife behavior
     */
    getWildlifeBehavior(type) {
        const behaviors = {
            Deer: { speed: 1.5, fleeDistance: 15, roamRadius: 80, timid: true },
            Rabbit: { speed: 2.0, fleeDistance: 10, roamRadius: 50, timid: true },
            Fox: { speed: 1.8, fleeDistance: 20, roamRadius: 100, timid: false },
            Bird: { speed: 2.5, fleeDistance: 8, roamRadius: 150, flying: true },
            Mountain_Goat: { speed: 1.0, fleeDistance: 12, roamRadius: 60, climber: true },
            Eagle: { speed: 3.0, fleeDistance: 5, roamRadius: 200, flying: true }
        };
        
        return behaviors[type] || behaviors.Deer;
    }
    
    /**
     * Generate patrol points for enemy
     */
    generatePatrolPoints(spawn, count) {
        const points = [];
        const radius = 40;
        
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            points.push({
                x: spawn.x + Math.cos(angle) * radius,
                y: spawn.y,
                z: spawn.z + Math.sin(angle) * radius
            });
        }
        
        return points;
    }
    
    /**
     * Get random position in biome
     */
    getRandomPositionInBiome(biome) {
        const baseX = biome.position?.x || 0;
        const baseZ = biome.position?.z || 0;
        const size = 500; // Half of 1km biome size
        
        return {
            x: baseX + (Math.random() - 0.5) * size,
            y: 0,
            z: baseZ + (Math.random() - 0.5) * size
        };
    }
    
    /**
     * Update all living entities
     */
    update(deltaTime) {
        if (!this.isActive) return;
        
        const now = Date.now();
        if (now - this.lastUpdate < this.updateInterval) return;
        
        this.lastUpdate = now;
        
        // Update NPCs (wander in villages)
        this.updateNPCs(deltaTime);
        
        // Update enemies (patrol zones)
        this.updateEnemies(deltaTime);
        
        // Update wildlife (roam biomes)
        this.updateWildlife(deltaTime);
    }
    
    /**
     * Update NPCs
     */
    updateNPCs(deltaTime) {
        this.npcs.forEach(npc => {
            // Check if should wander
            if (Math.random() < npc.behavior.wanderChance * deltaTime) {
                // Set new target within radius of home
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.random() * npc.behavior.radius;
                
                npc.target = {
                    x: npc.home.x + Math.cos(angle) * distance,
                    y: npc.home.y,
                    z: npc.home.z + Math.sin(angle) * distance
                };
            }
            
            // Move toward target
            if (npc.target) {
                this.moveToward(npc, npc.target, npc.speed * deltaTime);
            }
            
            // Update mesh position if exists
            if (npc.mesh) {
                npc.mesh.position.set(npc.current.x, npc.current.y, npc.current.z);
            }
        });
    }
    
    /**
     * Update enemies
     */
    updateEnemies(deltaTime) {
        this.enemies.forEach(enemy => {
            // Get next patrol point
            if (!enemy.target && enemy.patrolPoints.length > 0) {
                enemy.target = enemy.patrolPoints[enemy.currentPatrolIndex];
            }
            
            // Move toward patrol point
            if (enemy.target) {
                const reached = this.moveToward(enemy, enemy.target, enemy.speed * deltaTime);
                
                if (reached) {
                    // Move to next patrol point
                    enemy.currentPatrolIndex = (enemy.currentPatrolIndex + 1) % enemy.patrolPoints.length;
                    enemy.target = enemy.patrolPoints[enemy.currentPatrolIndex];
                }
            }
            
            // Update mesh
            if (enemy.mesh) {
                enemy.mesh.position.set(enemy.current.x, enemy.current.y, enemy.current.z);
                
                // Face movement direction
                if (enemy.target) {
                    const dx = enemy.target.x - enemy.current.x;
                    const dz = enemy.target.z - enemy.current.z;
                    enemy.mesh.rotation.y = Math.atan2(dx, dz);
                }
            }
        });
    }
    
    /**
     * Update wildlife
     */
    updateWildlife(deltaTime) {
        this.wildlife.forEach(animal => {
            // Random roaming
            if (!animal.target || Math.random() < 0.05) {
                // Set new random target within roam radius
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.random() * animal.behavior.roamRadius;
                
                animal.target = {
                    x: animal.home.x + Math.cos(angle) * distance,
                    y: animal.home.y,
                    z: animal.home.z + Math.sin(angle) * distance
                };
            }
            
            // Move toward target
            if (animal.target) {
                this.moveToward(animal, animal.target, animal.speed * deltaTime);
            }
            
            // Update mesh
            if (animal.mesh) {
                animal.mesh.position.set(animal.current.x, animal.current.y, animal.current.z);
                
                // Face movement direction
                if (animal.target) {
                    const dx = animal.target.x - animal.current.x;
                    const dz = animal.target.z - animal.current.z;
                    animal.mesh.rotation.y = Math.atan2(dx, dz);
                }
            }
        });
    }
    
    /**
     * Move entity toward target
     */
    moveToward(entity, target, distance) {
        const dx = target.x - entity.current.x;
        const dz = target.z - entity.current.z;
        const distanceToTarget = Math.sqrt(dx * dx + dz * dz);
        
        if (distanceToTarget < 0.5) {
            entity.current.x = target.x;
            entity.current.z = target.z;
            return true; // Reached target
        }
        
        // Move toward target
        const moveDistance = Math.min(distance, distanceToTarget);
        const ratio = moveDistance / distanceToTarget;
        
        entity.current.x += dx * ratio;
        entity.current.z += dz * ratio;
        
        return false;
    }
    
    /**
     * Activate living world
     */
    activate() {
        this.isActive = true;
        logger.info('🌍 Living World activated - entities are now moving!');
    }
    
    /**
     * Deactivate living world
     */
    deactivate() {
        this.isActive = false;
        logger.info('🌍 Living World deactivated - entities frozen');
    }
    
    /**
     * Get statistics
     */
    getStats() {
        return {
            npcs: {
                total: this.npcs.length,
                active: this.npcs.filter(n => n.target).length,
                zones: [...new Set(this.npcs.map(n => n.zone))]
            },
            enemies: {
                total: this.enemies.length,
                patrolling: this.enemies.filter(e => e.target).length,
                zones: [...new Set(this.enemies.map(e => e.zone))]
            },
            wildlife: {
                total: this.wildlife.length,
                roaming: this.wildlife.filter(w => w.target).length,
                zones: [...new Set(this.wildlife.map(w => w.zone))]
            }
        };
    }
}
