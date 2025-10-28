/**
 * Endless Battle Loop System
 * Infinite dungeon crawling with escalating difficulty and rewards
 */

export class EndlessBattleSystem {
    constructor() {
        this.currentWave = 1;
        this.currentFloor = 1;
        this.battleCount = 0;
        this.killStreak = 0;
        this.maxKillStreak = 0;
        this.totalKills = 0;
        this.survivalTime = 0;
        this.difficulties = this.initializeDifficulties();
        this.waveRewards = [];
        this.streakBonuses = this.initializeStreakBonuses();
        this.floorModifiers = [];
        this.bossWaves = [10, 25, 50, 75, 100]; // Boss appears on these waves
    }

    initializeDifficulties() {
        return {
            easy: {
                name: 'Easy',
                enemyMultiplier: 0.5,
                expMultiplier: 0.8,
                goldMultiplier: 0.8,
                dropRateMultiplier: 1.0
            },
            normal: {
                name: 'Normal',
                enemyMultiplier: 1.0,
                expMultiplier: 1.0,
                goldMultiplier: 1.0,
                dropRateMultiplier: 1.0
            },
            hard: {
                name: 'Hard',
                enemyMultiplier: 1.5,
                expMultiplier: 1.3,
                goldMultiplier: 1.3,
                dropRateMultiplier: 1.2
            },
            expert: {
                name: 'Expert',
                enemyMultiplier: 2.0,
                expMultiplier: 1.8,
                goldMultiplier: 1.8,
                dropRateMultiplier: 1.5
            },
            master: {
                name: 'Master',
                enemyMultiplier: 3.0,
                expMultiplier: 2.5,
                goldMultiplier: 2.5,
                dropRateMultiplier: 2.0
            },
            insane: {
                name: 'Insane',
                enemyMultiplier: 5.0,
                expMultiplier: 4.0,
                goldMultiplier: 4.0,
                dropRateMultiplier: 3.0
            },
            hell: {
                name: 'Hell',
                enemyMultiplier: 10.0,
                expMultiplier: 8.0,
                goldMultiplier: 8.0,
                dropRateMultiplier: 5.0
            },
            nightmare: {
                name: 'Nightmare',
                enemyMultiplier: 20.0,
                expMultiplier: 15.0,
                goldMultiplier: 15.0,
                dropRateMultiplier: 10.0
            }
        };
    }

    initializeStreakBonuses() {
        return [
            { streak: 10, bonus: 'Double Damage', multiplier: 2.0 },
            { streak: 25, bonus: 'Triple Gold', goldMultiplier: 3.0 },
            { streak: 50, bonus: 'Quad Experience', expMultiplier: 4.0 },
            { streak: 100, bonus: 'Legendary Drop Guarantee', guaranteedLegendary: true },
            { streak: 250, bonus: 'God Mode (30s)', invulnerability: 30000 },
            { streak: 500, bonus: 'Mythic Weapon Drop', guaranteedMythic: true },
            { streak: 1000, bonus: 'Ultimate Power Boost', allMultiplier: 10.0 }
        ];
    }

    startWave(difficulty = 'normal') {
        const difficultyData = this.difficulties[difficulty];
        
        // Calculate wave scaling
        const waveScaling = 1 + (this.currentWave * 0.05); // 5% increase per wave
        const floorScaling = 1 + (this.currentFloor * 0.1); // 10% increase per floor
        
        // Determine if boss wave
        const isBossWave = this.bossWaves.includes(this.currentWave);
        
        // Calculate enemy count and stats
        const baseEnemyCount = isBossWave ? 1 : 5 + Math.floor(this.currentWave / 10);
        const enemyCount = Math.min(baseEnemyCount, 50); // Cap at 50 enemies
        
        const enemies = [];
        for (let i = 0; i < enemyCount; i++) {
            enemies.push({
                type: isBossWave ? 'boss' : this.getEnemyType(),
                hp: this.calculateEnemyHP(difficultyData, waveScaling, floorScaling, isBossWave),
                attack: this.calculateEnemyAttack(difficultyData, waveScaling, floorScaling, isBossWave),
                defense: this.calculateEnemyDefense(difficultyData, waveScaling, floorScaling, isBossWave),
                level: this.currentWave + Math.floor(this.currentFloor / 10)
            });
        }

        return {
            wave: this.currentWave,
            floor: this.currentFloor,
            enemies: enemies,
            isBossWave: isBossWave,
            modifiers: this.floorModifiers,
            streakBonuses: this.getActiveStreakBonuses(),
            rewards: this.calculateWaveRewards(difficultyData, waveScaling, floorScaling, isBossWave)
        };
    }

    getEnemyType() {
        const random = Math.random();
        if (random < 0.5) return 'normal';
        if (random < 0.75) return 'elite';
        if (random < 0.95) return 'champion';
        return 'legendary';
    }

    calculateEnemyHP(difficulty, waveScaling, floorScaling, isBoss) {
        const baseHP = isBoss ? 100000 : 1000;
        return Math.floor(baseHP * difficulty.enemyMultiplier * waveScaling * floorScaling * (isBoss ? 10 : 1));
    }

    calculateEnemyAttack(difficulty, waveScaling, floorScaling, isBoss) {
        const baseAttack = isBoss ? 5000 : 100;
        return Math.floor(baseAttack * difficulty.enemyMultiplier * waveScaling * floorScaling * (isBoss ? 8 : 1));
    }

    calculateEnemyDefense(difficulty, waveScaling, floorScaling, isBoss) {
        const baseDefense = isBoss ? 3000 : 50;
        return Math.floor(baseDefense * difficulty.enemyMultiplier * waveScaling * floorScaling * (isBoss ? 6 : 1));
    }

    calculateWaveRewards(difficulty, waveScaling, floorScaling, isBoss) {
        const baseExp = isBoss ? 10000 : 1000;
        const baseGold = isBoss ? 5000 : 500;
        
        const streakBonus = 1 + (this.killStreak * 0.01); // 1% per streak
        
        return {
            exp: Math.floor(baseExp * difficulty.expMultiplier * waveScaling * floorScaling * streakBonus),
            gold: Math.floor(baseGold * difficulty.goldMultiplier * waveScaling * floorScaling * streakBonus),
            powerExp: Math.floor((baseExp / 10) * waveScaling * floorScaling),
            dropChance: 0.1 * difficulty.dropRateMultiplier * (isBoss ? 5 : 1)
        };
    }

    completeWave(enemiesKilled, performance) {
        this.currentWave++;
        this.totalKills += enemiesKilled;
        this.battleCount++;
        
        // Update kill streak
        if (performance === 'perfect' || performance === 'flawless') {
            this.killStreak += enemiesKilled;
            if (this.killStreak > this.maxKillStreak) {
                this.maxKillStreak = this.killStreak;
            }
        } else if (performance === 'death' || performance === 'failed') {
            this.killStreak = 0;
        }

        // Check for floor advancement (every 10 waves)
        if (this.currentWave % 10 === 1 && this.currentWave > 1) {
            this.advanceFloor();
        }

        // Check for streak bonuses
        const newBonuses = this.checkStreakBonuses();

        return {
            wave: this.currentWave,
            floor: this.currentFloor,
            killStreak: this.killStreak,
            totalKills: this.totalKills,
            newBonuses: newBonuses,
            nextWave: this.startWave()
        };
    }

    advanceFloor() {
        this.currentFloor++;
        
        // Add floor modifiers every 5 floors
        if (this.currentFloor % 5 === 0) {
            this.addFloorModifier();
        }

        return {
            floor: this.currentFloor,
            modifiers: this.floorModifiers,
            bonus: this.getFloorBonus()
        };
    }

    addFloorModifier() {
        const modifiers = [
            { id: 'increased_spawn', name: 'Swarm', effect: 'enemyCount', multiplier: 1.5 },
            { id: 'elite_enemies', name: 'Elite Force', effect: 'eliteChance', multiplier: 2.0 },
            { id: 'enraged', name: 'Enraged', effect: 'enemyDamage', multiplier: 1.5 },
            { id: 'fortified', name: 'Fortified', effect: 'enemyDefense', multiplier: 1.5 },
            { id: 'swift', name: 'Swift', effect: 'enemySpeed', multiplier: 1.3 },
            { id: 'regenerating', name: 'Regenerating', effect: 'enemyRegen', value: 0.02 },
            { id: 'explosive', name: 'Explosive', effect: 'deathExplosion', damage: 1000 },
            { id: 'vampiric', name: 'Vampiric', effect: 'lifesteal', value: 0.3 },
            { id: 'shielded', name: 'Shielded', effect: 'shield', value: 0.2 },
            { id: 'berserk', name: 'Berserk', effect: 'lowHPBoost', multiplier: 2.0 }
        ];

        const randomModifier = modifiers[Math.floor(Math.random() * modifiers.length)];
        
        // Don't add duplicate modifiers
        if (!this.floorModifiers.find(m => m.id === randomModifier.id)) {
            this.floorModifiers.push(randomModifier);
        }
    }

    getFloorBonus() {
        const bonuses = {
            10: { type: 'checkpoint', reward: 'Can restart from floor 10' },
            25: { type: 'powerup', reward: '+50% Permanent Attack' },
            50: { type: 'legendary', reward: 'Guaranteed Legendary Drop' },
            75: { type: 'ultimate', reward: 'Ultimate Skill Unlock' },
            100: { type: 'mythic', reward: 'Mythic Tier Equipment' },
            150: { type: 'ascension', reward: 'Ascension Point' },
            200: { type: 'godly', reward: 'Godly Artifact' },
            250: { type: 'supreme', reward: 'Supreme Title' },
            300: { type: 'transcendent', reward: 'Transcendent Power' },
            500: { type: 'ultimate', reward: 'Ultimate God Weapon' }
        };

        return bonuses[this.currentFloor] || null;
    }

    checkStreakBonuses() {
        const newBonuses = [];
        
        this.streakBonuses.forEach(bonus => {
            if (this.killStreak === bonus.streak) {
                newBonuses.push(bonus);
            }
        });

        return newBonuses;
    }

    getActiveStreakBonuses() {
        return this.streakBonuses.filter(bonus => this.killStreak >= bonus.streak);
    }

    failWave() {
        // Reset streak but keep other progress
        this.killStreak = 0;
        
        // Optional: penalty for failure
        const penalty = {
            waveSetback: Math.max(1, this.currentWave - 5),
            goldLoss: Math.floor(this.waveRewards.reduce((sum, r) => sum + r.gold, 0) * 0.1)
        };

        return penalty;
    }

    resetProgress() {
        // Full reset (for practice mode or intentional restart)
        this.currentWave = 1;
        this.currentFloor = 1;
        this.killStreak = 0;
        this.floorModifiers = [];
        this.waveRewards = [];
    }

    getLeaderboardStats() {
        return {
            highestWave: this.currentWave,
            highestFloor: this.currentFloor,
            maxKillStreak: this.maxKillStreak,
            totalKills: this.totalKills,
            battleCount: this.battleCount,
            survivalTime: this.survivalTime,
            score: this.calculateScore()
        };
    }

    calculateScore() {
        // Comprehensive score calculation
        return (
            this.currentWave * 1000 +
            this.currentFloor * 10000 +
            this.maxKillStreak * 100 +
            this.totalKills * 10 +
            Math.floor(this.survivalTime / 1000)
        );
    }

    update(deltaTime) {
        this.survivalTime += deltaTime;
    }

    getStats() {
        return {
            currentWave: this.currentWave,
            currentFloor: this.currentFloor,
            killStreak: this.killStreak,
            maxKillStreak: this.maxKillStreak,
            totalKills: this.totalKills,
            battleCount: this.battleCount,
            survivalTime: this.survivalTime,
            floorModifiers: this.floorModifiers,
            activeStreakBonuses: this.getActiveStreakBonuses(),
            score: this.calculateScore()
        };
    }
}
