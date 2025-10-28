/**
 * Power Leveling System
 * Advanced power progression with multipliers, prestige, and infinite scaling
 */

export class PowerLevelingSystem {
    constructor() {
        this.powerLevel = 1;
        this.powerExp = 0;
        this.powerMultiplier = 1.0;
        this.prestigeTier = 0;
        this.trainingMultipliers = this.initializeTrainingMultipliers();
        this.powerRanks = this.initializePowerRanks();
        this.evolutionStages = this.initializeEvolutionStages();
        this.powerAuras = [];
        this.trainingBonuses = {};
    }

    initializeTrainingMultipliers() {
        return {
            combat: 1.0,      // From battles
            dungeon: 1.5,     // From dungeon clears
            boss: 3.0,        // From boss kills
            raid: 5.0,        // From raid completions
            pvp: 2.5,         // From PvP victories
            quest: 1.2,       // From quest completions
            training: 0.8     // From training grounds (safe but slower)
        };
    }

    initializePowerRanks() {
        return [
            { rank: 'F', minPower: 1, maxPower: 100, title: 'Novice', color: '#808080' },
            { rank: 'E', minPower: 101, maxPower: 500, title: 'Beginner', color: '#CD7F32' },
            { rank: 'D', minPower: 501, maxPower: 2000, title: 'Intermediate', color: '#C0C0C0' },
            { rank: 'C', minPower: 2001, maxPower: 5000, title: 'Advanced', color: '#FFD700' },
            { rank: 'B', minPower: 5001, maxPower: 10000, title: 'Expert', color: '#00CED1' },
            { rank: 'A', minPower: 10001, maxPower: 25000, title: 'Master', color: '#9370DB' },
            { rank: 'S', minPower: 25001, maxPower: 50000, title: 'Grandmaster', color: '#FF1493' },
            { rank: 'SS', minPower: 50001, maxPower: 100000, title: 'Legend', color: '#FF4500' },
            { rank: 'SSS', minPower: 100001, maxPower: 250000, title: 'Mythic', color: '#FF0000' },
            { rank: 'EX', minPower: 250001, maxPower: 500000, title: 'Transcendent', color: '#8B00FF' },
            { rank: 'Z', minPower: 500001, maxPower: 1000000, title: 'God-Slayer', color: '#FFD700' },
            { rank: 'ZZ', minPower: 1000001, maxPower: 5000000, title: 'Demigod', color: '#00FFFF' },
            { rank: 'ZZZ', minPower: 5000001, maxPower: 10000000, title: 'True God', color: '#FFFFFF' },
            { rank: 'OMEGA', minPower: 10000001, maxPower: Infinity, title: 'Supreme Being', color: '#FF00FF' }
        ];
    }

    initializeEvolutionStages() {
        return [
            {
                stage: 1,
                name: 'Mortal',
                powerCap: 10000,
                bonuses: { stats: 1.0, skills: 1.0 }
            },
            {
                stage: 2,
                name: 'Awakened',
                powerCap: 50000,
                bonuses: { stats: 2.0, skills: 1.5 },
                requirement: 'Defeat 1000 enemies'
            },
            {
                stage: 3,
                name: 'Ascended',
                powerCap: 250000,
                bonuses: { stats: 4.0, skills: 2.0 },
                requirement: 'Reach power level 25000'
            },
            {
                stage: 4,
                name: 'Transcendent',
                powerCap: 1000000,
                bonuses: { stats: 8.0, skills: 3.0 },
                requirement: 'Defeat 10 Legendary bosses'
            },
            {
                stage: 5,
                name: 'Divine',
                powerCap: 5000000,
                bonuses: { stats: 16.0, skills: 5.0 },
                requirement: 'Complete Divine Trials'
            },
            {
                stage: 6,
                name: 'Godhood',
                powerCap: Infinity,
                bonuses: { stats: 32.0, skills: 10.0 },
                requirement: 'Defeat all Demon Lords and achieve SSS rank'
            }
        ];
    }

    gainPowerExp(amount, source = 'combat') {
        const multiplier = this.trainingMultipliers[source] || 1.0;
        const prestigeBonus = 1 + (this.prestigeTier * 0.1); // 10% per prestige tier
        
        const finalAmount = amount * multiplier * this.powerMultiplier * prestigeBonus;
        this.powerExp += finalAmount;

        // Check for level up
        const levelUps = [];
        while (this.powerExp >= this.getExpForNextLevel()) {
            this.powerExp -= this.getExpForNextLevel();
            this.powerLevel++;
            levelUps.push(this.powerLevel);
            
            // Every 10 levels, increase multiplier slightly
            if (this.powerLevel % 10 === 0) {
                this.powerMultiplier += 0.05;
            }
        }

        return {
            gained: finalAmount,
            levelUps: levelUps,
            currentLevel: this.powerLevel,
            currentExp: this.powerExp,
            nextLevelExp: this.getExpForNextLevel()
        };
    }

    getExpForNextLevel() {
        // Exponential growth with diminishing returns at high levels
        const basePower = 100;
        const exponent = 1.15;
        const levelFactor = Math.pow(this.powerLevel, exponent);
        return Math.floor(basePower * levelFactor);
    }

    getCurrentPowerRank() {
        const totalPower = this.calculateTotalPower();
        return this.powerRanks.find(r => totalPower >= r.minPower && totalPower <= r.maxPower) || this.powerRanks[this.powerRanks.length - 1];
    }

    calculateTotalPower() {
        // Base power from level
        let power = this.powerLevel * 100;

        // Prestige multiplier
        power *= (1 + this.prestigeTier * 0.5);

        // Training bonuses
        Object.values(this.trainingBonuses).forEach(bonus => {
            power *= (1 + bonus);
        });

        // Power auras
        this.powerAuras.forEach(aura => {
            power *= aura.multiplier;
        });

        return Math.floor(power);
    }

    prestige() {
        // Requirements for prestige
        if (this.powerLevel < 100) {
            return { success: false, reason: 'Must reach power level 100' };
        }

        const currentRank = this.getCurrentPowerRank();
        if (currentRank.rank !== 'SSS' && currentRank.rank !== 'EX' && currentRank.rank !== 'Z' && currentRank.rank !== 'ZZ' && currentRank.rank !== 'ZZZ' && currentRank.rank !== 'OMEGA') {
            if (this.prestigeTier === 0 && currentRank.rank !== 'S') {
                return { success: false, reason: 'Must reach at least S rank for first prestige' };
            }
        }

        // Reset with bonuses
        const previousPower = this.calculateTotalPower();
        this.prestigeTier++;
        this.powerLevel = 1;
        this.powerExp = 0;
        this.powerMultiplier += 0.5; // 50% permanent bonus

        return {
            success: true,
            prestigeTier: this.prestigeTier,
            powerRetained: Math.floor(previousPower * 0.1), // Keep 10% of power
            newMultiplier: this.powerMultiplier,
            rewards: this.getPrestigeRewards()
        };
    }

    getPrestigeRewards() {
        return {
            title: `Prestige ${this.prestigeTier} Warrior`,
            cosmetic: `Prestige ${this.prestigeTier} Aura`,
            statBonus: this.prestigeTier * 100,
            specialAbility: this.prestigeTier >= 5 ? 'Prestige Ultimate Skill' : null
        };
    }

    addTrainingBonus(bonusId, multiplier, duration = null) {
        this.trainingBonuses[bonusId] = {
            multiplier: multiplier,
            duration: duration,
            startTime: Date.now()
        };
    }

    addPowerAura(auraId, multiplier, duration = null) {
        this.powerAuras.push({
            id: auraId,
            multiplier: multiplier,
            duration: duration,
            startTime: Date.now()
        });
    }

    getNextRank() {
        const currentRank = this.getCurrentPowerRank();
        const currentIndex = this.powerRanks.indexOf(currentRank);
        
        if (currentIndex < this.powerRanks.length - 1) {
            const nextRank = this.powerRanks[currentIndex + 1];
            const currentPower = this.calculateTotalPower();
            
            return {
                rank: nextRank,
                progress: currentPower - currentRank.minPower,
                total: nextRank.minPower - currentRank.minPower,
                percentage: ((currentPower - currentRank.minPower) / (nextRank.minPower - currentRank.minPower)) * 100
            };
        }

        return null; // Max rank reached
    }

    getEvolutionStage() {
        const power = this.calculateTotalPower();
        return this.evolutionStages.findLast(stage => power >= (stage.powerCap === Infinity ? 0 : stage.powerCap)) || this.evolutionStages[0];
    }

    canEvolve() {
        const currentStage = this.getEvolutionStage();
        const currentIndex = this.evolutionStages.indexOf(currentStage);
        
        if (currentIndex < this.evolutionStages.length - 1) {
            const nextStage = this.evolutionStages[currentIndex + 1];
            const power = this.calculateTotalPower();
            return power >= nextStage.powerCap;
        }

        return false;
    }

    getPowerLeaderboardPosition(allPlayers) {
        const playerPower = this.calculateTotalPower();
        const sorted = allPlayers.sort((a, b) => b.power - a.power);
        return sorted.findIndex(p => p.power <= playerPower) + 1;
    }

    update(deltaTime) {
        // Update temporary bonuses
        Object.entries(this.trainingBonuses).forEach(([id, bonus]) => {
            if (bonus.duration) {
                const elapsed = Date.now() - bonus.startTime;
                if (elapsed >= bonus.duration) {
                    delete this.trainingBonuses[id];
                }
            }
        });

        // Update power auras
        this.powerAuras = this.powerAuras.filter(aura => {
            if (aura.duration) {
                const elapsed = Date.now() - aura.startTime;
                return elapsed < aura.duration;
            }
            return true;
        });
    }

    getStats() {
        return {
            powerLevel: this.powerLevel,
            totalPower: this.calculateTotalPower(),
            rank: this.getCurrentPowerRank(),
            prestigeTier: this.prestigeTier,
            powerMultiplier: this.powerMultiplier,
            evolutionStage: this.getEvolutionStage(),
            nextRank: this.getNextRank(),
            expProgress: {
                current: this.powerExp,
                needed: this.getExpForNextLevel(),
                percentage: (this.powerExp / this.getExpForNextLevel()) * 100
            }
        };
    }
}
