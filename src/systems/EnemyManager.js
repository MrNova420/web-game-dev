/**
import { logger } from '../core/Logger.js';
 * EnemyManager - Manages enemy spawning and behavior
 */

import { Enemy } from '../entities/Enemy.js';
import { Boss } from '../entities/Boss.js';
import * as THREE from 'three';

export class EnemyManager {
    constructor(scene, dungeonGenerator) {
        this.scene = scene;
        this.dungeonGenerator = dungeonGenerator;
        this.enemies = [];
        this.spawnTimer = 0;
        this.spawnInterval = 10; // seconds
        this.maxEnemies = 10;
        
        // All available enemy types
        this.allEnemyTypes = ['smoke_imp', 'essence_wraith', 'shadow_bard', 'corrupted_angel', 'weed_golem'];
    }
    
    spawnEnemiesForDungeon(dungeon, count) {
        const enemyTypes = this.getEnemyTypesForBiome(dungeon.biome);
        let spawned = 0;
        
        for (let i = 0; i < count && this.enemies.length < this.maxEnemies; i++) {
            const spawnPoint = dungeon.spawnPoints[i % dungeon.spawnPoints.length];
            const enemyType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
            
            const enemy = new Enemy(this.scene, enemyType, spawnPoint);
            this.enemies.push(enemy);
            spawned++;
        }
        
        logger.info(`👾 Spawned ${spawned} enemies in ${dungeon.name}`);
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
        const randomType = this.allEnemyTypes[Math.floor(Math.random() * this.allEnemyTypes.length)];
        
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
    
    spawnBoss(dungeon) {
        // Choose boss type based on biome
        const bossTypes = {
            crystal_cavern: 'essence_wraith',
            fungal_city: 'weed_golem',
            vine_cathedral: 'corrupted_angel',
            broken_starship: 'shadow_bard',
            twilight_throne: 'corrupted_angel'
        };
        
        const bossType = bossTypes[dungeon.biome] || 'corrupted_angel';
        
        // Spawn boss in center of dungeon
        const spawnPosition = new THREE.Vector3(0, 1, 0);
        
        const boss = new Boss(this.scene, bossType, spawnPosition);
        this.enemies.push(boss);
        
        logger.info(`👑 Boss spawned: ${boss.stats.name} in ${dungeon.name}`);
        
        // Show boss intro
        this.showBossIntro(boss.stats.name);
    }
    
    showBossIntro(bossName) {
        const intro = document.createElement('div');
        intro.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #1a0033, #4a0e7a);
            border: 3px solid #ffd60a;
            border-radius: 20px;
            padding: 40px 60px;
            color: #ffd60a;
            font-size: 2.5em;
            font-weight: bold;
            z-index: 9999;
            animation: bossIntro 4s ease-out;
            box-shadow: 0 0 60px #ffd60a;
            text-align: center;
        `;
        intro.innerHTML = `
            <div style="font-size: 0.6em; color: #c77dff; margin-bottom: 10px;">⚠️ BOSS ENCOUNTER ⚠️</div>
            <div>${bossName}</div>
            <div style="font-size: 0.5em; color: #e0aaff; margin-top: 10px;">Prepare for Battle!</div>
        `;
        
        document.body.appendChild(intro);
        
        setTimeout(() => {
            if (intro.parentNode) {
                intro.style.animation = 'fadeOut 0.5s ease-out';
                setTimeout(() => {
                    document.body.removeChild(intro);
                }, 500);
            }
        }, 3500);
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

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes bossIntro {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
        20% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
        80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    }
`;
document.head.appendChild(style);
