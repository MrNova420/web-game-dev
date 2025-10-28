/**
 * EnemyManager - Manages enemy spawning and behavior
 */

import { Enemy } from '../entities/Enemy.js';
import * as THREE from 'three';

export class EnemyManager {
    constructor(scene, dungeonGenerator) {
        this.scene = scene;
        this.dungeonGenerator = dungeonGenerator;
        this.enemies = [];
        this.spawnTimer = 0;
        this.spawnInterval = 10; // seconds
        this.maxEnemies = 10;
    }
    
    spawnEnemiesForDungeon(dungeon, count) {
        const enemyTypes = this.getEnemyTypesForBiome(dungeon.biome);
        
        for (let i = 0; i < count && this.enemies.length < this.maxEnemies; i++) {
            const spawnPoint = dungeon.spawnPoints[i % dungeon.spawnPoints.length];
            const enemyType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
            
            const enemy = new Enemy(this.scene, enemyType, spawnPoint);
            this.enemies.push(enemy);
        }
        
        console.log(`👾 Spawned ${count} enemies in ${dungeon.name}`);
    }
    
    getEnemyTypesForBiome(biome) {
        const biomeEnemies = {
            crystal_cavern: ['smoke_imp', 'essence_wraith'],
            fungal_city: ['weed_golem', 'essence_wraith'],
            vine_cathedral: ['corrupted_angel', 'shadow_bard'],
            broken_starship: ['essence_wraith', 'shadow_bard'],
            twilight_throne: ['corrupted_angel', 'shadow_bard', 'weed_golem']
        };
        
        return biomeEnemies[biome] || ['smoke_imp'];
    }
    
    update(delta, player) {
        // Update all enemies
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            
            if (!enemy.isAlive) {
                // Remove dead enemies
                this.enemies.splice(i, 1);
                continue;
            }
            
            // Update enemy behavior
            enemy.update(delta, player);
            
            // Enemy attacks player if close enough
            enemy.attackPlayer(player);
        }
        
        // Spawn new enemies over time
        this.spawnTimer += delta;
        if (this.spawnTimer >= this.spawnInterval && this.enemies.length < this.maxEnemies) {
            this.spawnRandomEnemy();
            this.spawnTimer = 0;
        }
    }
    
    spawnRandomEnemy() {
        const enemyTypes = ['smoke_imp', 'essence_wraith', 'shadow_bard', 'corrupted_angel', 'weed_golem'];
        const randomType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
        
        // Spawn at random position around the edges
        const angle = Math.random() * Math.PI * 2;
        const distance = 15 + Math.random() * 5;
        const position = new THREE.Vector3(
            Math.cos(angle) * distance,
            1,
            Math.sin(angle) * distance
        );
        
        const enemy = new Enemy(this.scene, randomType, position);
        this.enemies.push(enemy);
    }
    
    getEnemies() {
        return this.enemies;
    }
    
    clearAllEnemies() {
        this.enemies.forEach(enemy => {
            if (enemy.mesh) {
                this.scene.remove(enemy.mesh);
            }
        });
        this.enemies = [];
    }
}
