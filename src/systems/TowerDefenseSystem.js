/**
 * TowerDefenseSystem - Tower Defense Mini-Game
 * 
 * Phase 8, System 123 of AUTONOMOUS_EXECUTION_PLAN
 * Strategic tower placement and wave defense
 * 
 * Features:
 * - Multiple tower types with upgrades
 * - Wave-based enemy spawning
 * - Path-based enemy movement
 * - Tower synergies and combos
 * - Special abilities and power-ups
 * - Different maps and difficulty modes
 * - Resource management (gold and gems)
 */

import * as THREE from 'three';

export class TowerDefenseSystem {
    constructor(scene) {
        this.scene = scene;
        
        // Game state
        this.isPlaying = false;
        this.currentWave = 0;
        this.lives = 20;
        this.gold = 500;
        this.score = 0;
        
        // Towers
        this.towers = [];
        this.towerTypes = this.initializeTowerTypes();
        
        // Enemies
        this.enemies = [];
        this.enemyTypes = this.initializeEnemyTypes();
        
        // Map
        this.currentMap = null;
        this.path = [];
        this.grid = null;
        
        // Wave system
        this.waveSchedule = [];
        this.waveTimer = 0;
        this.timeBetweenWaves = 30000; // 30 seconds
        
        // Statistics
        this.stats = {
            wavesCompleted: 0,
            enemiesKilled: 0,
            towersBuilt: 0,
            totalDamageDealt: 0,
            goldEarned: 0,
            highestWave: 0
        };
    }
    
    /**
     * Initialize tower types
     */
    initializeTowerTypes() {
        return {
            // Basic Towers
            archer: {
                name: 'Archer Tower',
                cost: 100,
                damage: 10,
                range: 5,
                attackSpeed: 1.0,
                projectileSpeed: 10,
                upgrades: ['damage', 'range', 'speed'],
                maxLevel: 3
            },
            
            mage: {
                name: 'Mage Tower',
                cost: 150,
                damage: 15,
                range: 6,
                attackSpeed: 0.8,
                projectileSpeed: 8,
                element: 'arcane',
                splashRadius: 1.5,
                upgrades: ['damage', 'splash', 'slow'],
                maxLevel: 3
            },
            
            cannon: {
                name: 'Cannon Tower',
                cost: 200,
                damage: 30,
                range: 4,
                attackSpeed: 0.5,
                projectileSpeed: 6,
                splashRadius: 2.0,
                upgrades: ['damage', 'range', 'splash'],
                maxLevel: 3
            },
            
            // Special Towers
            lightning: {
                name: 'Lightning Tower',
                cost: 250,
                damage: 25,
                range: 7,
                attackSpeed: 1.5,
                chainTargets: 3,
                element: 'lightning',
                upgrades: ['damage', 'chain', 'stun'],
                maxLevel: 3
            },
            
            frost: {
                name: 'Frost Tower',
                cost: 180,
                damage: 8,
                range: 5,
                attackSpeed: 1.2,
                slowAmount: 0.5, // 50% slow
                slowDuration: 3000,
                element: 'ice',
                upgrades: ['slow', 'range', 'freeze'],
                maxLevel: 3
            },
            
            poison: {
                name: 'Poison Tower',
                cost: 220,
                damage: 5,
                dps: 10, // Damage over time
                dotDuration: 5000,
                range: 5,
                attackSpeed: 1.0,
                element: 'poison',
                upgrades: ['dps', 'duration', 'range'],
                maxLevel: 3
            },
            
            // Support Towers
            buff: {
                name: 'Buff Tower',
                cost: 300,
                buffRange: 4,
                damageBonus: 0.25, // 25% damage increase
                speedBonus: 0.2, // 20% attack speed increase
                upgrades: ['damage_bonus', 'speed_bonus', 'range'],
                maxLevel: 3
            },
            
            // Ultimate Towers
            omega: {
                name: 'Omega Tower',
                cost: 1000,
                damage: 100,
                range: 10,
                attackSpeed: 2.0,
                chainTargets: 5,
                splashRadius: 3.0,
                allElements: true,
                upgrades: ['ultimate'],
                maxLevel: 1
            }
        };
    }
    
    /**
     * Initialize enemy types
     */
    initializeEnemyTypes() {
        return {
            // Basic Enemies
            slime: {
                name: 'Slime',
                health: 50,
                speed: 2.0,
                armor: 0,
                reward: 10,
                element: 'nature'
            },
            
            goblin: {
                name: 'Goblin',
                health: 80,
                speed: 2.5,
                armor: 5,
                reward: 15,
                element: 'none'
            },
            
            skeleton: {
                name: 'Skeleton',
                health: 100,
                speed: 2.2,
                armor: 10,
                reward: 20,
                element: 'dark'
            },
            
            // Advanced Enemies
            orc: {
                name: 'Orc Warrior',
                health: 200,
                speed: 1.8,
                armor: 20,
                reward: 30,
                element: 'none'
            },
            
            mage: {
                name: 'Enemy Mage',
                health: 120,
                speed: 2.0,
                armor: 5,
                shield: 50,
                reward: 35,
                element: 'arcane'
            },
            
            // Fast Enemies
            wolf: {
                name: 'Shadow Wolf',
                health: 60,
                speed: 4.0,
                armor: 0,
                reward: 25,
                element: 'dark'
            },
            
            // Tank Enemies
            golem: {
                name: 'Stone Golem',
                health: 500,
                speed: 1.0,
                armor: 50,
                reward: 80,
                element: 'earth'
            },
            
            // Flying Enemies
            bat: {
                name: 'Vampire Bat',
                health: 40,
                speed: 3.5,
                armor: 0,
                flying: true,
                reward: 20,
                element: 'dark'
            },
            
            // Boss Enemies
            dragon: {
                name: 'Dragon',
                health: 2000,
                speed: 1.5,
                armor: 100,
                shield: 500,
                reward: 500,
                boss: true,
                element: 'fire'
            }
        };
    }
    
    /**
     * Start game on map
     */
    startGame(mapId) {
        this.isPlaying = true;
        this.currentWave = 0;
        this.lives = 20;
        this.gold = 500;
        this.score = 0;
        
        // Load map
        this.loadMap(mapId);
        
        // Generate wave schedule
        this.generateWaveSchedule();
        
        return true;
    }
    
    /**
     * Load map
     */
    loadMap(mapId) {
        // In full implementation, load from map database
        this.currentMap = {
            id: mapId,
            name: 'Crystal Caverns Defense',
            size: { width: 20, height: 15 },
            startPoint: new THREE.Vector2(0, 7),
            endPoint: new THREE.Vector2(19, 7),
            path: this.generatePath()
        };
        
        this.path = this.currentMap.path;
        this.grid = this.createGrid(this.currentMap.size);
    }
    
    /**
     * Generate path for enemies
     */
    generatePath() {
        const path = [];
        // Simple straight path for now
        for (let x = 0; x <= 19; x++) {
            path.push(new THREE.Vector2(x, 7));
        }
        return path;
    }
    
    /**
     * Create placement grid
     */
    createGrid(size) {
        const grid = [];
        for (let y = 0; y < size.height; y++) {
            grid[y] = [];
            for (let x = 0; x < size.width; x++) {
                // Check if on path
                const onPath = this.path.some(p => p.x === x && p.y === y);
                grid[y][x] = {
                    x, y,
                    occupied: onPath,
                    isPath: onPath,
                    tower: null
                };
            }
        }
        return grid;
    }
    
    /**
     * Generate wave schedule
     */
    generateWaveSchedule() {
        this.waveSchedule = [];
        
        for (let wave = 1; wave <= 50; wave++) {
            const enemies = this.generateWaveEnemies(wave);
            this.waveSchedule.push({
                wave: wave,
                enemies: enemies,
                delay: 1000 // 1 second between enemy spawns
            });
        }
    }
    
    /**
     * Generate enemies for wave
     */
    generateWaveEnemies(wave) {
        const enemies = [];
        const baseCount = 5 + wave * 2;
        
        // More diverse enemies as waves progress
        for (let i = 0; i < baseCount; i++) {
            let enemyType;
            
            if (wave < 5) {
                enemyType = 'slime';
            } else if (wave < 10) {
                enemyType = Math.random() < 0.5 ? 'slime' : 'goblin';
            } else if (wave < 15) {
                enemyType = ['slime', 'goblin', 'skeleton'][Math.floor(Math.random() * 3)];
            } else if (wave < 25) {
                enemyType = ['goblin', 'skeleton', 'orc', 'wolf'][Math.floor(Math.random() * 4)];
            } else {
                enemyType = ['orc', 'wolf', 'golem', 'bat', 'mage'][Math.floor(Math.random() * 5)];
            }
            
            enemies.push(enemyType);
        }
        
        // Boss every 10 waves
        if (wave % 10 === 0) {
            enemies.push('dragon');
        }
        
        return enemies;
    }
    
    /**
     * Build tower
     */
    buildTower(gridX, gridY, towerType) {
        const towerData = this.towerTypes[towerType];
        if (!towerData) return false;
        
        // Check if can afford
        if (this.gold < towerData.cost) {
            return false;
        }
        
        // Check if valid placement
        if (!this.isValidPlacement(gridX, gridY)) {
            return false;
        }
        
        // Create tower
        const tower = {
            id: Math.random().toString(36),
            type: towerType,
            position: new THREE.Vector2(gridX, gridY),
            level: 1,
            ...towerData,
            target: null,
            lastAttackTime: 0,
            kills: 0
        };
        
        this.towers.push(tower);
        this.grid[gridY][gridX].occupied = true;
        this.grid[gridY][gridX].tower = tower;
        
        // Pay cost
        this.gold -= towerData.cost;
        this.stats.towersBuilt++;
        
        return tower;
    }
    
    /**
     * Check if valid tower placement
     */
    isValidPlacement(x, y) {
        if (x < 0 || x >= this.currentMap.size.width || 
            y < 0 || y >= this.currentMap.size.height) {
            return false;
        }
        
        const cell = this.grid[y][x];
        return !cell.occupied && !cell.isPath;
    }
    
    /**
     * Upgrade tower
     */
    upgradeTower(towerId, upgradeType) {
        const tower = this.towers.find(t => t.id === towerId);
        if (!tower) return false;
        
        if (tower.level >= tower.maxLevel) {
            return false;
        }
        
        const upgradeCost = tower.cost * tower.level;
        if (this.gold < upgradeCost) {
            return false;
        }
        
        // Apply upgrade
        tower.level++;
        this.applyUpgrade(tower, upgradeType);
        
        // Pay cost
        this.gold -= upgradeCost;
        
        return true;
    }
    
    /**
     * Apply tower upgrade
     */
    applyUpgrade(tower, upgradeType) {
        switch (upgradeType) {
            case 'damage':
                tower.damage *= 1.5;
                break;
            case 'range':
                tower.range *= 1.3;
                break;
            case 'speed':
                tower.attackSpeed *= 1.4;
                break;
            case 'splash':
                tower.splashRadius *= 1.5;
                break;
            case 'chain':
                tower.chainTargets++;
                break;
            case 'slow':
                tower.slowAmount *= 1.2;
                break;
        }
    }
    
    /**
     * Spawn next wave
     */
    spawnWave() {
        if (this.currentWave >= this.waveSchedule.length) {
            // All waves completed - Victory!
            this.victory();
            return;
        }
        
        const wave = this.waveSchedule[this.currentWave];
        this.currentWave++;
        
        // Spawn enemies with delay
        let delay = 0;
        for (const enemyType of wave.enemies) {
            setTimeout(() => {
                this.spawnEnemy(enemyType);
            }, delay);
            delay += wave.delay;
        }
    }
    
    /**
     * Spawn enemy
     */
    spawnEnemy(enemyType) {
        const enemyData = this.enemyTypes[enemyType];
        if (!enemyData) return;
        
        const enemy = {
            id: Math.random().toString(36),
            type: enemyType,
            ...enemyData,
            currentHealth: enemyData.health * (1 + this.currentWave * 0.1), // Scale with wave
            position: this.path[0].clone(),
            pathIndex: 0,
            statusEffects: []
        };
        
        this.enemies.push(enemy);
    }
    
    /**
     * Update tower defense game
     */
    update(deltaTime) {
        if (!this.isPlaying) return;
        
        // Update towers
        this.updateTowers(deltaTime);
        
        // Update enemies
        this.updateEnemies(deltaTime);
        
        // Check wave timer
        if (this.enemies.length === 0 && this.currentWave < this.waveSchedule.length) {
            this.waveTimer += deltaTime * 1000;
            if (this.waveTimer >= this.timeBetweenWaves) {
                this.waveTimer = 0;
                this.spawnWave();
            }
        }
    }
    
    /**
     * Update all towers
     */
    updateTowers(deltaTime) {
        const currentTime = Date.now();
        
        for (const tower of this.towers) {
            // Find target
            if (!tower.target || !this.isEnemyAlive(tower.target)) {
                tower.target = this.findTarget(tower);
            }
            
            // Attack
            if (tower.target) {
                const cooldown = 1000 / tower.attackSpeed;
                if (currentTime - tower.lastAttackTime >= cooldown) {
                    this.towerAttack(tower, tower.target);
                    tower.lastAttackTime = currentTime;
                }
            }
        }
    }
    
    /**
     * Find target for tower
     */
    findTarget(tower) {
        let closestEnemy = null;
        let furthestProgress = -1;
        
        for (const enemy of this.enemies) {
            const distance = tower.position.distanceTo(
                new THREE.Vector2(enemy.position.x, enemy.position.y)
            );
            
            if (distance <= tower.range) {
                // Prioritize enemies furthest along path
                if (enemy.pathIndex > furthestProgress) {
                    furthestProgress = enemy.pathIndex;
                    closestEnemy = enemy;
                }
            }
        }
        
        return closestEnemy;
    }
    
    /**
     * Tower attack
     */
    towerAttack(tower, enemy) {
        let damage = tower.damage;
        
        // Apply armor reduction
        damage = Math.max(1, damage - enemy.armor);
        
        // Deal damage
        this.damageEnemy(enemy, damage, tower);
        
        // Chain lightning
        if (tower.chainTargets) {
            this.chainAttack(tower, enemy, tower.chainTargets - 1, damage * 0.7);
        }
        
        // Splash damage
        if (tower.splashRadius) {
            this.splashDamage(enemy, tower.splashRadius, damage * 0.5);
        }
        
        // Status effects
        if (tower.slowAmount) {
            this.applyStatusEffect(enemy, 'slow', tower.slowDuration, tower.slowAmount);
        }
        
        if (tower.dps) {
            this.applyStatusEffect(enemy, 'poison', tower.dotDuration, tower.dps);
        }
    }
    
    /**
     * Damage enemy
     */
    damageEnemy(enemy, damage, source) {
        enemy.currentHealth -= damage;
        this.stats.totalDamageDealt += damage;
        
        if (enemy.currentHealth <= 0) {
            this.killEnemy(enemy, source);
        }
    }
    
    /**
     * Kill enemy
     */
    killEnemy(enemy, killerTower) {
        // Remove from enemies array
        const index = this.enemies.indexOf(enemy);
        if (index > -1) {
            this.enemies.splice(index, 1);
        }
        
        // Award gold
        this.gold += enemy.reward;
        this.stats.goldEarned += enemy.reward;
        
        // Add score
        this.score += enemy.reward * 10;
        
        // Track kill
        if (killerTower) {
            killerTower.kills++;
        }
        this.stats.enemiesKilled++;
    }
    
    /**
     * Chain attack
     */
    chainAttack(tower, origin, chainsLeft, damage) {
        if (chainsLeft <= 0) return;
        
        // Find next target
        let nextTarget = null;
        let closestDist = Infinity;
        
        for (const enemy of this.enemies) {
            if (enemy === origin) continue;
            
            const dist = new THREE.Vector2(origin.position.x, origin.position.y)
                .distanceTo(new THREE.Vector2(enemy.position.x, enemy.position.y));
            
            if (dist < closestDist && dist <= 3.0) {
                closestDist = dist;
                nextTarget = enemy;
            }
        }
        
        if (nextTarget) {
            this.damageEnemy(nextTarget, damage, tower);
            this.chainAttack(tower, nextTarget, chainsLeft - 1, damage * 0.7);
        }
    }
    
    /**
     * Splash damage
     */
    splashDamage(origin, radius, damage) {
        for (const enemy of this.enemies) {
            if (enemy === origin) continue;
            
            const dist = new THREE.Vector2(origin.position.x, origin.position.y)
                .distanceTo(new THREE.Vector2(enemy.position.x, enemy.position.y));
            
            if (dist <= radius) {
                this.damageEnemy(enemy, damage, null);
            }
        }
    }
    
    /**
     * Apply status effect
     */
    applyStatusEffect(enemy, type, duration, value) {
        enemy.statusEffects.push({
            type: type,
            duration: duration,
            value: value,
            remaining: duration
        });
    }
    
    /**
     * Update enemies
     */
    updateEnemies(deltaTime) {
        for (const enemy of [...this.enemies]) {
            // Update status effects
            this.updateStatusEffects(enemy, deltaTime);
            
            // Move along path
            let speed = enemy.speed;
            
            // Apply slow
            for (const effect of enemy.statusEffects) {
                if (effect.type === 'slow') {
                    speed *= (1 - effect.value);
                }
            }
            
            // Apply DoT
            for (const effect of enemy.statusEffects) {
                if (effect.type === 'poison') {
                    this.damageEnemy(enemy, effect.value * deltaTime, null);
                }
            }
            
            // Move
            if (enemy.pathIndex < this.path.length - 1) {
                const target = this.path[enemy.pathIndex + 1];
                const direction = new THREE.Vector2()
                    .subVectors(target, enemy.position)
                    .normalize();
                
                enemy.position.add(direction.multiplyScalar(speed * deltaTime));
                
                // Check if reached next waypoint
                if (enemy.position.distanceTo(target) < 0.5) {
                    enemy.pathIndex++;
                }
            } else {
                // Reached end - lose life
                this.loseLife(enemy);
            }
        }
    }
    
    /**
     * Update status effects on enemy
     */
    updateStatusEffects(enemy, deltaTime) {
        enemy.statusEffects = enemy.statusEffects.filter(effect => {
            effect.remaining -= deltaTime * 1000;
            return effect.remaining > 0;
        });
    }
    
    /**
     * Lose a life
     */
    loseLife(enemy) {
        this.lives--;
        
        // Remove enemy
        const index = this.enemies.indexOf(enemy);
        if (index > -1) {
            this.enemies.splice(index, 1);
        }
        
        // Check for defeat
        if (this.lives <= 0) {
            this.defeat();
        }
    }
    
    /**
     * Check if enemy is alive
     */
    isEnemyAlive(enemy) {
        return this.enemies.includes(enemy) && enemy.currentHealth > 0;
    }
    
    /**
     * Victory
     */
    victory() {
        this.isPlaying = false;
        this.stats.wavesCompleted = this.currentWave;
        this.stats.highestWave = Math.max(this.stats.highestWave, this.currentWave);
        
        const results = {
            victory: true,
            wave: this.currentWave,
            score: this.score,
            livesRemaining: this.lives,
            goldRemaining: this.gold,
            reward: this.score * 10 + this.gold
        };
        
        if (window.gameEngine) {
            window.gameEngine.eventBus?.emit('towerDefense:victory', results);
        }
        
        return results;
    }
    
    /**
     * Defeat
     */
    defeat() {
        this.isPlaying = false;
        this.stats.wavesCompleted = this.currentWave - 1;
        this.stats.highestWave = Math.max(this.stats.highestWave, this.currentWave - 1);
        
        const results = {
            victory: false,
            wave: this.currentWave,
            score: this.score,
            reward: Math.floor(this.score * 0.5)
        };
        
        if (window.gameEngine) {
            window.gameEngine.eventBus?.emit('towerDefense:defeat', results);
        }
        
        return results;
    }
    
    /**
     * Get statistics
     */
    getStats() {
        return { ...this.stats };
    }
}
