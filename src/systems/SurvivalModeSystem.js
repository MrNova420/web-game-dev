/**
import { logger } from '../core/Logger.js';
 * SurvivalModeSystem - Wave-Based Survival Challenge with EXTERNAL ASSETS
 * Phase 8 - Mini-Games System #127
 * 
 * External Asset Sources:
 * - Arena models: Quaternius Arena Pack (10+ arena variations - free)
 * - Wave enemies: Quaternius Monster Pack (50+ creatures)
 * - Boss models: Sketchfab Free (epic bosses)
 * - Power-ups: Kenney Icon Pack (pickup sprites)
 * - Weapon drops: Sketchfab Free (weapon models)
 * - Environmental effects: Kenney Particle Pack
 * - UI elements: Kenney UI Pack
 * 
 * Features: Survive endless waves, progressive difficulty, elite waves, mega bosses
 * Zero custom assets - all from professional free sources
 */

import * as THREE from 'three';

export class SurvivalModeSystem {
    constructor(scene) {
        this.scene = scene;
        this.active = false;
        
        // External asset paths
        this.assets = {
            arenas: {
                forest: '/assets/models/arenas/survival_forest.glb',         // Quaternius
                desert: '/assets/models/arenas/survival_desert.glb',
                ice: '/assets/models/arenas/survival_ice.glb',
                volcano: '/assets/models/arenas/survival_volcano.glb',
                tech: '/assets/models/arenas/survival_tech.glb',
                void: '/assets/models/arenas/survival_void.glb'
            },
            enemies: {
                basic: '/assets/models/monsters/survival_basic.glb',         // Quaternius
                fast: '/assets/models/monsters/survival_fast.glb',
                tank: '/assets/models/monsters/survival_tank.glb',
                ranged: '/assets/models/monsters/survival_ranged.glb',
                exploder: '/assets/models/monsters/survival_exploder.glb',
                healer: '/assets/models/monsters/survival_healer.glb',
                summoner: '/assets/models/monsters/survival_summoner.glb',
                elite: '/assets/models/monsters/survival_elite.glb'
            },
            bosses: {
                wave5: '/assets/models/bosses/mini_boss_1.glb',              // Sketchfab Free
                wave10: '/assets/models/bosses/mega_boss_1.glb',
                wave15: '/assets/models/bosses/mini_boss_2.glb',
                wave20: '/assets/models/bosses/mega_boss_2.glb',
                wave25: '/assets/models/bosses/ultimate_boss.glb'
            },
            powerups: {
                health: '/assets/ui/icons/health_pickup.png',                // Kenney
                shield: '/assets/ui/icons/shield_pickup.png',
                damage: '/assets/ui/icons/damage_boost.png',
                speed: '/assets/ui/icons/speed_boost.png',
                freeze: '/assets/ui/icons/freeze_time.png',
                nuke: '/assets/ui/icons/nuke.png'
            },
            weaponDrops: [
                '/assets/models/weapons/sword_legendary.glb',                // Sketchfab Free
                '/assets/models/weapons/bow_legendary.glb',
                '/assets/models/weapons/staff_legendary.glb',
                '/assets/models/weapons/hammer_legendary.glb'
            ]
        };
        
        // Survival state
        this.wave = 0;
        this.enemiesKilled = 0;
        this.score = 0;
        this.survivalTime = 0;
        this.currentArena = 'forest';
        
        // Active entities
        this.enemies = [];
        this.powerups = [];
        this.weaponDrops = [];
        
        // Wave configuration
        this.waveConfig = {
            baseEnemyCount: 5,
            enemyCountIncrease: 3,
            baseEnemyHealth: 100,
            healthIncrease: 25,
            baseDamage: 10,
            damageIncrease: 5,
            spawnDelay: 2.0,
            eliteWaveInterval: 5,
            bossWaveInterval: 10,
            powerupDropChance: 0.15,
            weaponDropChance: 0.05
        };
        
        // Enemy types with scaling
        this.enemyTypes = [
            {
                type: 'basic',
                model: this.assets.enemies.basic,
                health: 100,
                damage: 10,
                speed: 3.0,
                spawnWeight: 40,
                description: 'Standard melee enemy'
            },
            {
                type: 'fast',
                model: this.assets.enemies.fast,
                health: 50,
                damage: 8,
                speed: 6.0,
                spawnWeight: 25,
                description: 'Quick, low health attacker'
            },
            {
                type: 'tank',
                model: this.assets.enemies.tank,
                health: 300,
                damage: 15,
                speed: 1.5,
                spawnWeight: 15,
                description: 'Slow, high health brute'
            },
            {
                type: 'ranged',
                model: this.assets.enemies.ranged,
                health: 75,
                damage: 12,
                speed: 2.5,
                spawnWeight: 20,
                description: 'Attacks from distance'
            },
            {
                type: 'exploder',
                model: this.assets.enemies.exploder,
                health: 60,
                damage: 30,
                speed: 4.0,
                spawnWeight: 10,
                description: 'Explodes on death or proximity'
            },
            {
                type: 'healer',
                model: this.assets.enemies.healer,
                health: 120,
                damage: 5,
                speed: 2.0,
                spawnWeight: 5,
                description: 'Heals nearby enemies'
            },
            {
                type: 'summoner',
                model: this.assets.enemies.summoner,
                health: 150,
                damage: 8,
                speed: 2.5,
                spawnWeight: 5,
                description: 'Spawns additional enemies'
            },
            {
                type: 'elite',
                model: this.assets.enemies.elite,
                health: 500,
                damage: 25,
                speed: 3.5,
                spawnWeight: 3,
                description: 'Powerful elite enemy'
            }
        ];
        
        // Boss encounters
        this.bossEncounters = [
            {
                wave: 5,
                name: 'Void Stalker',
                model: this.assets.bosses.wave5,
                health: 2000,
                damage: 30,
                abilities: ['charge', 'slam', 'roar'],
                reward: { score: 1000, powerup: 'health' }
            },
            {
                wave: 10,
                name: 'Inferno Titan',
                model: this.assets.bosses.wave10,
                health: 5000,
                damage: 50,
                abilities: ['fireball', 'meteor', 'flame_aura', 'lava_pool'],
                reward: { score: 3000, powerup: 'shield', weaponDrop: true }
            },
            {
                wave: 15,
                name: 'Frost Queen',
                model: this.assets.bosses.wave15,
                health: 8000,
                damage: 60,
                abilities: ['ice_shard', 'blizzard', 'freeze', 'ice_clone'],
                reward: { score: 5000, powerup: 'damage' }
            },
            {
                wave: 20,
                name: 'Thunder Lord',
                model: this.assets.bosses.wave20,
                health: 12000,
                damage: 80,
                abilities: ['lightning_strike', 'chain_lightning', 'teleport', 'storm'],
                reward: { score: 8000, powerup: 'speed', weaponDrop: true }
            },
            {
                wave: 25,
                name: 'Omega Destroyer',
                model: this.assets.bosses.wave25,
                health: 20000,
                damage: 100,
                abilities: ['laser_beam', 'missiles', 'shield', 'nuke', 'summon_minions'],
                reward: { score: 15000, powerup: 'nuke', weaponDrop: true }
            }
        ];
        
        // Arena progression
        this.arenaProgression = [
            { wave: 1, arena: 'forest' },
            { wave: 6, arena: 'desert' },
            { wave: 11, arena: 'ice' },
            { wave: 16, arena: 'volcano' },
            { wave: 21, arena: 'tech' },
            { wave: 26, arena: 'void' }
        ];
        
        // Player buffs
        this.activeBuffs = {
            damageMultiplier: 1.0,
            speedMultiplier: 1.0,
            shield: false,
            freezeTime: false,
            invincibility: false
        };
        
        // Leaderboard
        this.personalBest = {
            highestWave: 0,
            mostKills: 0,
            longestTime: 0,
            highScore: 0
        };
        
        this.initialize();
    }
    
    initialize() {
        logger.info('🛡️  Survival Mode System initialized');
        logger.info('   Using Quaternius + Sketchfab Free + Kenney');
    }
    
    startSurvival() {
        logger.info('🛡️  Starting Survival Mode');
        this.active = true;
        this.wave = 0;
        this.enemiesKilled = 0;
        this.score = 0;
        this.survivalTime = 0;
        this.enemies = [];
        
        this.loadArena(this.currentArena);
        this.startNextWave();
    }
    
    loadArena(arenaType) {
        logger.info(`🏟️  Loading arena: ${arenaType} (Quaternius Arena Pack)`);
        this.currentArena = arenaType;
        // Arena would be loaded using GLTFLoader from external Quaternius assets
    }
    
    startNextWave() {
        this.wave++;
        logger.info(`\n🌊 WAVE ${this.wave} STARTING`);
        
        // Check for arena change
        const arenaChange = this.arenaProgression.find(p => p.wave === this.wave);
        if (arenaChange) {
            logger.info(`🏟️  Arena changing to: ${arenaChange.arena}`);
            this.loadArena(arenaChange.arena);
        }
        
        // Check for boss wave
        const bossEncounter = this.bossEncounters.find(b => b.wave === this.wave);
        if (bossEncounter) {
            logger.info(`👹 BOSS WAVE: ${bossEncounter.name}`);
            this.spawnBoss(bossEncounter);
            return;
        }
        
        // Check for elite wave
        if (this.wave % this.waveConfig.eliteWaveInterval === 0) {
            logger.info('⭐ ELITE WAVE');
            this.spawnEliteWave();
            return;
        }
        
        // Normal wave
        this.spawnNormalWave();
    }
    
    spawnNormalWave() {
        const enemyCount = this.waveConfig.baseEnemyCount + 
                          (this.wave - 1) * this.waveConfig.enemyCountIncrease;
        
        logger.info(`   Spawning ${enemyCount} enemies`);
        logger.info(`   Using Quaternius Monster Pack models`);
        
        for (let i = 0; i < enemyCount; i++) {
            const enemyType = this.selectRandomEnemyType();
            this.spawnEnemy(enemyType, this.wave);
        }
    }
    
    spawnEliteWave() {
        const eliteCount = Math.floor(this.wave / 5) + 2;
        logger.info(`   Spawning ${eliteCount} elite enemies`);
        
        for (let i = 0; i < eliteCount; i++) {
            const eliteType = this.enemyTypes.find(t => t.type === 'elite');
            this.spawnEnemy(eliteType, this.wave);
        }
        
        // Also spawn some support enemies
        const supportCount = Math.floor(eliteCount / 2);
        for (let i = 0; i < supportCount; i++) {
            const supportType = this.selectRandomEnemyType();
            this.spawnEnemy(supportType, this.wave);
        }
    }
    
    spawnBoss(bossData) {
        logger.info(`   Boss: ${bossData.name}`);
        logger.info(`   Health: ${bossData.health}, Abilities: ${bossData.abilities.join(', ')}`);
        logger.info(`   Model: ${bossData.model} (Sketchfab Free)`);
        
        // Boss would be loaded using GLTFLoader from Sketchfab Free assets
        const boss = {
            type: 'boss',
            name: bossData.name,
            model: bossData.model,
            health: bossData.health,
            maxHealth: bossData.health,
            damage: bossData.damage,
            abilities: bossData.abilities,
            position: new THREE.Vector3(0, 0, 0),
            state: 'spawning',
            reward: bossData.reward
        };
        
        this.enemies.push(boss);
    }
    
    spawnEnemy(enemyType, wave) {
        const scaledHealth = enemyType.health + (wave - 1) * this.waveConfig.healthIncrease;
        const scaledDamage = enemyType.damage + (wave - 1) * this.waveConfig.damageIncrease;
        
        const enemy = {
            type: enemyType.type,
            model: enemyType.model,
            health: scaledHealth,
            maxHealth: scaledHealth,
            damage: scaledDamage,
            speed: enemyType.speed,
            position: this.getRandomSpawnPosition(),
            state: 'spawning'
        };
        
        this.enemies.push(enemy);
    }
    
    selectRandomEnemyType() {
        const totalWeight = this.enemyTypes.reduce((sum, e) => sum + e.spawnWeight, 0);
        let random = Math.random() * totalWeight;
        
        for (const enemyType of this.enemyTypes) {
            random -= enemyType.spawnWeight;
            if (random <= 0) {
                return enemyType;
            }
        }
        
        return this.enemyTypes[0];
    }
    
    getRandomSpawnPosition() {
        const angle = Math.random() * Math.PI * 2;
        const distance = 20 + Math.random() * 10;
        
        return new THREE.Vector3(
            Math.cos(angle) * distance,
            0,
            Math.sin(angle) * distance
        );
    }
    
    update(deltaTime) {
        if (!this.active) return;
        
        this.survivalTime += deltaTime;
        
        // Update all enemies
        this.updateEnemies(deltaTime);
        
        // Update powerups
        this.updatePowerups(deltaTime);
        
        // Update buffs
        this.updateBuffs(deltaTime);
        
        // Check if wave complete
        if (this.enemies.length === 0) {
            this.onWaveComplete();
        }
    }
    
    updateEnemies(deltaTime) {
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            
            // Update enemy AI, animations, attacks
            // Implementation would update external model animations from Mixamo
            
            if (enemy.health <= 0) {
                this.onEnemyKilled(enemy);
                this.enemies.splice(i, 1);
            }
        }
    }
    
    updatePowerups(deltaTime) {
        // Update powerup positions and check for collection
    }
    
    updateBuffs(deltaTime) {
        // Update active buff timers
    }
    
    onEnemyKilled(enemy) {
        this.enemiesKilled++;
        
        // Calculate score
        let scoreGain = 10;
        if (enemy.type === 'elite') scoreGain = 100;
        if (enemy.type === 'boss') scoreGain = enemy.reward.score;
        
        this.score += scoreGain * this.wave;
        
        // Chance to drop powerup
        if (Math.random() < this.waveConfig.powerupDropChance) {
            this.dropPowerup(enemy.position);
        }
        
        // Chance to drop weapon
        if (Math.random() < this.waveConfig.weaponDropChance) {
            this.dropWeapon(enemy.position);
        }
        
        // Boss rewards
        if (enemy.type === 'boss') {
            this.grantBossRewards(enemy.reward);
        }
    }
    
    dropPowerup(position) {
        const powerupTypes = Object.keys(this.assets.powerups);
        const randomType = powerupTypes[Math.floor(Math.random() * powerupTypes.length)];
        
        logger.info(`💊 Powerup dropped: ${randomType}`);
        
        this.powerups.push({
            type: randomType,
            position: position.clone(),
            sprite: this.assets.powerups[randomType]  // Kenney icon
        });
    }
    
    dropWeapon(position) {
        const randomWeapon = this.assets.weaponDrops[
            Math.floor(Math.random() * this.assets.weaponDrops.length)
        ];
        
        logger.info(`⚔️  Weapon dropped: ${randomWeapon}`);
        
        this.weaponDrops.push({
            model: randomWeapon,  // Sketchfab Free weapon
            position: position.clone()
        });
    }
    
    grantBossRewards(reward) {
        logger.info('🎁 Boss rewards granted:');
        logger.info(`   Score: +${reward.score}`);
        this.score += reward.score;
        
        if (reward.powerup) {
            logger.info(`   Powerup: ${reward.powerup}`);
            this.activatePowerup(reward.powerup);
        }
        
        if (reward.weaponDrop) {
            logger.info('   Legendary Weapon Drop!');
            this.dropWeapon(new THREE.Vector3(0, 0, 0));
        }
    }
    
    activatePowerup(type) {
        logger.info(`💊 Powerup activated: ${type}`);
        
        switch (type) {
            case 'health':
                // Heal player
                break;
            case 'shield':
                this.activeBuffs.shield = true;
                setTimeout(() => this.activeBuffs.shield = false, 10000);
                break;
            case 'damage':
                this.activeBuffs.damageMultiplier = 2.0;
                setTimeout(() => this.activeBuffs.damageMultiplier = 1.0, 15000);
                break;
            case 'speed':
                this.activeBuffs.speedMultiplier = 1.5;
                setTimeout(() => this.activeBuffs.speedMultiplier = 1.0, 15000);
                break;
            case 'freeze':
                this.activeBuffs.freezeTime = true;
                setTimeout(() => this.activeBuffs.freezeTime = false, 5000);
                break;
            case 'nuke':
                this.nukeAllEnemies();
                break;
        }
    }
    
    nukeAllEnemies() {
        logger.info('💥 NUKE ACTIVATED - All enemies destroyed!');
        const killCount = this.enemies.length;
        this.enemiesKilled += killCount;
        this.score += killCount * 50 * this.wave;
        this.enemies = [];
    }
    
    onWaveComplete() {
        logger.info(`✅ Wave ${this.wave} complete!`);
        logger.info(`   Enemies killed: ${this.enemiesKilled}`);
        logger.info(`   Score: ${this.score}`);
        logger.info(`   Time: ${Math.floor(this.survivalTime)}s`);
        
        // Brief pause before next wave
        setTimeout(() => this.startNextWave(), 3000);
    }
    
    gameOver() {
        logger.info('\n💀 SURVIVAL MODE - GAME OVER');
        logger.info(`   Final Wave: ${this.wave}`);
        logger.info(`   Total Kills: ${this.enemiesKilled}`);
        logger.info(`   Final Score: ${this.score}`);
        logger.info(`   Survival Time: ${Math.floor(this.survivalTime)}s`);
        
        // Update personal best
        if (this.wave > this.personalBest.highestWave) {
            logger.info('🏆 NEW RECORD: Highest Wave!');
            this.personalBest.highestWave = this.wave;
        }
        
        if (this.enemiesKilled > this.personalBest.mostKills) {
            logger.info('🏆 NEW RECORD: Most Kills!');
            this.personalBest.mostKills = this.enemiesKilled;
        }
        
        if (this.survivalTime > this.personalBest.longestTime) {
            logger.info('🏆 NEW RECORD: Longest Survival!');
            this.personalBest.longestTime = this.survivalTime;
        }
        
        if (this.score > this.personalBest.highScore) {
            logger.info('🏆 NEW RECORD: High Score!');
            this.personalBest.highScore = this.score;
        }
        
        this.active = false;
    }
    
    getStats() {
        return {
            active: this.active,
            wave: this.wave,
            enemiesKilled: this.enemiesKilled,
            score: this.score,
            survivalTime: Math.floor(this.survivalTime),
            arena: this.currentArena,
            enemiesRemaining: this.enemies.length,
            activeBuffs: this.activeBuffs,
            personalBest: this.personalBest,
            source: 'Quaternius Monster Pack + Sketchfab Free + Kenney'
        };
    }
}
