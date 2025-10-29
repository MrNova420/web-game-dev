/**
 * RoguelikeMetaProgressionSystem.js
 * Phase 7 - Roguelike Meta-Progression System
 * Permanent unlocks, meta-currency, and persistent upgrades across runs
 * ~900 lines
 */

export class RoguelikeMetaProgressionSystem {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        
        // Meta-progression currencies
        this.metaCurrency = {
            souls: 0, // Earned from runs
            essence: 0, // Rare currency from bosses
            fragments: 0 // Ultra-rare from completing challenges
        };
        
        // Permanent unlocks
        this.unlockedFeatures = new Set();
        this.unlockedClasses = new Set(['warrior']); // Start with warrior
        this.unlockedBiomes = new Set(['smoke_forest']);
        this.unlockedModes = new Set(['story']);
        
        // Meta upgrades
        this.metaUpgrades = new Map();
        this.upgradeDatabase = this.createUpgradeDatabase();
        
        // Run statistics
        this.runStats = {
            totalRuns: 0,
            successfulRuns: 0,
            totalDeaths: 0,
            deepestFloor: 0,
            totalKills: 0,
            totalBossKills: 0,
            fastestRun: Infinity,
            longestRun: 0,
            totalPlayTime: 0
        };
        
        // Current run data
        this.currentRun = null;
        
        // Achievements for meta-progression
        this.metaAchievements = new Set();
        
        this.loadProgress();
    }
    
    /**
     * Create upgrade database
     */
    createUpgradeDatabase() {
        return {
            // Starting stat upgrades
            base_health: {
                name: 'Fortified Constitution',
                description: 'Start each run with additional max HP',
                maxLevel: 10,
                cost: (level) => 50 * Math.pow(1.5, level),
                currency: 'souls',
                effect: (level) => ({ maxHP: 10 * level })
            },
            base_damage: {
                name: 'Innate Power',
                description: 'Start each run with increased base damage',
                maxLevel: 10,
                cost: (level) => 50 * Math.pow(1.5, level),
                currency: 'souls',
                effect: (level) => ({ baseDamage: 2 * level })
            },
            base_defense: {
                name: 'Hardened Skin',
                description: 'Start each run with increased base defense',
                maxLevel: 10,
                cost: (level) => 50 * Math.pow(1.5, level),
                currency: 'souls',
                effect: (level) => ({ baseDefense: 2 * level })
            },
            base_speed: {
                name: 'Swift Feet',
                description: 'Start each run with increased movement speed',
                maxLevel: 5,
                cost: (level) => 75 * Math.pow(1.5, level),
                currency: 'souls',
                effect: (level) => ({ baseSpeed: 0.05 * level })
            },
            
            // Resource upgrades
            starting_gold: {
                name: 'Starting Capital',
                description: 'Begin runs with bonus gold',
                maxLevel: 20,
                cost: (level) => 30 * level,
                currency: 'souls',
                effect: (level) => ({ startingGold: 50 * level })
            },
            potion_capacity: {
                name: 'Expanded Pouch',
                description: 'Carry more potions',
                maxLevel: 10,
                cost: (level) => 100 * level,
                currency: 'souls',
                effect: (level) => ({ potionSlots: level })
            },
            inventory_size: {
                name: 'Dimensional Storage',
                description: 'Increase inventory capacity',
                maxLevel: 15,
                cost: (level) => 80 * level,
                currency: 'souls',
                effect: (level) => ({ inventorySlots: 5 * level })
            },
            
            // Gameplay upgrades
            bonus_xp: {
                name: 'Quick Learner',
                description: 'Gain bonus experience from all sources',
                maxLevel: 10,
                cost: (level) => 100 * Math.pow(1.3, level),
                currency: 'souls',
                effect: (level) => ({ xpMultiplier: 0.1 * level })
            },
            loot_luck: {
                name: 'Fortune Finder',
                description: 'Increased chance for better loot',
                maxLevel: 10,
                cost: (level) => 150 * Math.pow(1.4, level),
                currency: 'souls',
                effect: (level) => ({ lootBonus: 0.05 * level })
            },
            crit_chance: {
                name: 'Critical Eye',
                description: 'Permanent critical hit chance increase',
                maxLevel: 10,
                cost: (level) => 120 * Math.pow(1.5, level),
                currency: 'souls',
                effect: (level) => ({ critChance: 0.02 * level })
            },
            dodge_chance: {
                name: 'Evasive Maneuvers',
                description: 'Chance to dodge attacks',
                maxLevel: 5,
                cost: (level) => 200 * Math.pow(1.6, level),
                currency: 'essence',
                effect: (level) => ({ dodgeChance: 0.03 * level })
            },
            
            // Advanced upgrades (essence cost)
            revive_token: {
                name: 'Second Chance',
                description: 'Auto-revive once per run',
                maxLevel: 3,
                cost: (level) => 500 * level,
                currency: 'essence',
                effect: (level) => ({ reviveTokens: level })
            },
            starting_level: {
                name: 'Veteran Status',
                description: 'Start runs at a higher level',
                maxLevel: 10,
                cost: (level) => 300 * Math.pow(1.5, level),
                currency: 'essence',
                effect: (level) => ({ startingLevel: level })
            },
            skill_points: {
                name: 'Innate Talent',
                description: 'Start with bonus skill points',
                maxLevel: 20,
                cost: (level) => 250 * level,
                currency: 'essence',
                effect: (level) => ({ bonusSkillPoints: level })
            },
            pet_power: {
                name: 'Companion Bond',
                description: 'Pets start stronger',
                maxLevel: 10,
                cost: (level) => 200 * Math.pow(1.3, level),
                currency: 'essence',
                effect: (level) => ({ petStatsMultiplier: 0.1 * level })
            },
            
            // Ultimate upgrades (fragment cost)
            boss_rewards: {
                name: 'Legendary Fate',
                description: 'Bosses guarantee rare+ items',
                maxLevel: 1,
                cost: (level) => 100,
                currency: 'fragments',
                effect: (level) => ({ bossLootQuality: 'rare_plus' })
            },
            permanent_buffs: {
                name: 'Eternal Blessing',
                description: 'Keep 1 buff permanently through death',
                maxLevel: 3,
                cost: (level) => 150 * level,
                currency: 'fragments',
                effect: (level) => ({ permanentBuffSlots: level })
            },
            checkpoint_system: {
                name: 'Waypoint Master',
                description: 'Unlock checkpoints every 5 floors',
                maxLevel: 1,
                cost: (level) => 200,
                currency: 'fragments',
                effect: (level) => ({ checkpoints: true })
            },
            reroll_abilities: {
                name: 'Fate Weaver',
                description: 'Reroll ability offerings once per floor',
                maxLevel: 5,
                cost: (level) => 100 * level,
                currency: 'fragments',
                effect: (level) => ({ rerollsPerFloor: level })
            }
        };
    }
    
    /**
     * Start a new run
     */
    startRun(config = {}) {
        this.currentRun = {
            id: `run_${Date.now()}`,
            startTime: Date.now(),
            startFloor: config.startFloor || 1,
            startingStats: this.calculateStartingStats(),
            floor: config.startFloor || 1,
            kills: 0,
            bossKills: 0,
            deaths: 0,
            soulsCollected: 0,
            itemsFound: 0,
            checkpointsUsed: 0,
            revivedCount: 0,
            active: true
        };
        
        this.runStats.totalRuns++;
        
        // Apply meta-progression bonuses
        this.applyMetaProgressionBonuses();
        
        return this.currentRun;
    }
    
    /**
     * Calculate starting stats from meta-progression
     */
    calculateStartingStats() {
        const stats = {
            maxHP: 100,
            baseDamage: 10,
            baseDefense: 5,
            baseSpeed: 1.0,
            startingGold: 0,
            potionSlots: 3,
            inventorySlots: 20,
            xpMultiplier: 1.0,
            lootBonus: 0,
            critChance: 0.1,
            dodgeChance: 0,
            reviveTokens: 0,
            startingLevel: 1,
            bonusSkillPoints: 0,
            petStatsMultiplier: 1.0
        };
        
        // Apply all purchased upgrades
        for (const [upgradeId, level] of this.metaUpgrades) {
            const upgrade = this.upgradeDatabase[upgradeId];
            if (upgrade) {
                const effect = upgrade.effect(level);
                Object.assign(stats, effect);
            }
        }
        
        return stats;
    }
    
    /**
     * Apply meta-progression bonuses to player
     */
    applyMetaProgressionBonuses() {
        if (!this.gameEngine.player || !this.currentRun) return;
        
        const stats = this.currentRun.startingStats;
        const player = this.gameEngine.player;
        
        // Apply stat bonuses
        player.maxHP += stats.maxHP - 100;
        player.hp = player.maxHP;
        player.baseDamage += stats.baseDamage - 10;
        player.defense += stats.baseDefense - 5;
        player.moveSpeed *= stats.baseSpeed;
        
        // Apply resource bonuses
        if (this.gameEngine.economySystem) {
            this.gameEngine.economySystem.addGold(stats.startingGold);
        }
        
        // Set level
        if (stats.startingLevel > 1) {
            player.level = stats.startingLevel;
            player.skillPoints += stats.bonusSkillPoints;
        }
        
        // Apply special effects
        if (stats.reviveTokens > 0) {
            player.reviveTokens = stats.reviveTokens;
        }
    }
    
    /**
     * End current run
     */
    endRun(success = false, finalFloor = 0) {
        if (!this.currentRun) return null;
        
        const endTime = Date.now();
        const duration = endTime - this.currentRun.startTime;
        
        this.currentRun.endTime = endTime;
        this.currentRun.duration = duration;
        this.currentRun.finalFloor = finalFloor;
        this.currentRun.success = success;
        this.currentRun.active = false;
        
        // Update global stats
        this.runStats.totalPlayTime += duration;
        if (success) {
            this.runStats.successfulRuns++;
        } else {
            this.runStats.totalDeaths++;
        }
        
        if (finalFloor > this.runStats.deepestFloor) {
            this.runStats.deepestFloor = finalFloor;
        }
        
        this.runStats.totalKills += this.currentRun.kills;
        this.runStats.totalBossKills += this.currentRun.bossKills;
        
        if (duration < this.runStats.fastestRun) {
            this.runStats.fastestRun = duration;
        }
        if (duration > this.runStats.longestRun) {
            this.runStats.longestRun = duration;
        }
        
        // Calculate rewards
        const rewards = this.calculateRunRewards();
        
        // Award meta-currency
        this.metaCurrency.souls += rewards.souls;
        this.metaCurrency.essence += rewards.essence;
        this.metaCurrency.fragments += rewards.fragments;
        
        // Check for unlocks
        this.checkForUnlocks();
        
        // Save progress
        this.saveProgress();
        
        const summary = {
            run: this.currentRun,
            rewards: rewards,
            newUnlocks: []
        };
        
        this.currentRun = null;
        return summary;
    }
    
    /**
     * Calculate rewards for completed run
     */
    calculateRunRewards() {
        if (!this.currentRun) return { souls: 0, essence: 0, fragments: 0 };
        
        let souls = 0;
        let essence = 0;
        let fragments = 0;
        
        // Base rewards
        souls += this.currentRun.floor * 10;
        souls += this.currentRun.kills * 2;
        souls += this.currentRun.bossKills * 50;
        
        // Bonus for success
        if (this.currentRun.success) {
            souls *= 2;
            essence += Math.floor(this.currentRun.floor / 10);
            
            // Fragments for major milestones
            if (this.currentRun.finalFloor >= 100) {
                fragments += 1;
            }
            if (this.currentRun.finalFloor >= 500) {
                fragments += 5;
            }
            if (this.currentRun.finalFloor >= 999) {
                fragments += 10;
            }
        }
        
        // Essence from boss kills
        essence += this.currentRun.bossKills;
        
        // Speed bonus
        const hourlyRate = 3600000; // 1 hour in ms
        if (this.currentRun.duration < hourlyRate) {
            souls = Math.floor(souls * 1.5);
        }
        
        // No death bonus
        if (this.currentRun.deaths === 0) {
            souls = Math.floor(souls * 1.25);
            essence += 5;
        }
        
        return { souls, essence, fragments };
    }
    
    /**
     * Purchase meta upgrade
     */
    purchaseUpgrade(upgradeId) {
        const upgrade = this.upgradeDatabase[upgradeId];
        if (!upgrade) {
            return { success: false, message: 'Upgrade not found' };
        }
        
        const currentLevel = this.metaUpgrades.get(upgradeId) || 0;
        
        // Check max level
        if (currentLevel >= upgrade.maxLevel) {
            return { success: false, message: 'Max level reached' };
        }
        
        // Check cost
        const cost = upgrade.cost(currentLevel);
        const currency = upgrade.currency;
        
        if (this.metaCurrency[currency] < cost) {
            return { success: false, message: `Not enough ${currency}` };
        }
        
        // Purchase
        this.metaCurrency[currency] -= cost;
        this.metaUpgrades.set(upgradeId, currentLevel + 1);
        
        // Save progress
        this.saveProgress();
        
        return {
            success: true,
            newLevel: currentLevel + 1,
            effect: upgrade.effect(currentLevel + 1)
        };
    }
    
    /**
     * Check for feature unlocks based on progress
     */
    checkForUnlocks() {
        const newUnlocks = [];
        
        // Unlock classes
        if (this.runStats.deepestFloor >= 20 && !this.unlockedClasses.has('mage')) {
            this.unlockedClasses.add('mage');
            newUnlocks.push({ type: 'class', id: 'mage' });
        }
        if (this.runStats.deepestFloor >= 30 && !this.unlockedClasses.has('rogue')) {
            this.unlockedClasses.add('rogue');
            newUnlocks.push({ type: 'class', id: 'rogue' });
        }
        if (this.runStats.deepestFloor >= 50 && !this.unlockedClasses.has('ranger')) {
            this.unlockedClasses.add('ranger');
            newUnlocks.push({ type: 'class', id: 'ranger' });
        }
        if (this.runStats.deepestFloor >= 75 && !this.unlockedClasses.has('cleric')) {
            this.unlockedClasses.add('cleric');
            newUnlocks.push({ type: 'class', id: 'cleric' });
        }
        
        // Unlock biomes
        if (this.runStats.deepestFloor >= 21 && !this.unlockedBiomes.has('crystal_caves')) {
            this.unlockedBiomes.add('crystal_caves');
            newUnlocks.push({ type: 'biome', id: 'crystal_caves' });
        }
        if (this.runStats.deepestFloor >= 41 && !this.unlockedBiomes.has('volcanic_wastes')) {
            this.unlockedBiomes.add('volcanic_wastes');
            newUnlocks.push({ type: 'biome', id: 'volcanic_wastes' });
        }
        if (this.runStats.deepestFloor >= 61 && !this.unlockedBiomes.has('frozen_tundra')) {
            this.unlockedBiomes.add('frozen_tundra');
            newUnlocks.push({ type: 'biome', id: 'frozen_tundra' });
        }
        if (this.runStats.deepestFloor >= 81 && !this.unlockedBiomes.has('sky_islands')) {
            this.unlockedBiomes.add('sky_islands');
            newUnlocks.push({ type: 'biome', id: 'sky_islands' });
        }
        
        // Unlock game modes
        if (this.runStats.successfulRuns >= 1 && !this.unlockedModes.has('endless')) {
            this.unlockedModes.add('endless');
            newUnlocks.push({ type: 'mode', id: 'endless' });
        }
        if (this.runStats.successfulRuns >= 5 && !this.unlockedModes.has('challenge')) {
            this.unlockedModes.add('challenge');
            newUnlocks.push({ type: 'mode', id: 'challenge' });
        }
        if (this.runStats.successfulRuns >= 10 && !this.unlockedModes.has('hardcore')) {
            this.unlockedModes.add('hardcore');
            newUnlocks.push({ type: 'mode', id: 'hardcore' });
        }
        
        // Unlock special features
        if (this.runStats.totalBossKills >= 10 && !this.unlockedFeatures.has('boss_rush')) {
            this.unlockedFeatures.add('boss_rush');
            newUnlocks.push({ type: 'feature', id: 'boss_rush' });
        }
        if (this.runStats.deepestFloor >= 100 && !this.unlockedFeatures.has('prestige')) {
            this.unlockedFeatures.add('prestige');
            newUnlocks.push({ type: 'feature', id: 'prestige' });
        }
        
        return newUnlocks;
    }
    
    /**
     * Record kill
     */
    recordKill(isBoss = false) {
        if (!this.currentRun) return;
        
        this.currentRun.kills++;
        if (isBoss) {
            this.currentRun.bossKills++;
        }
    }
    
    /**
     * Record death
     */
    recordDeath() {
        if (!this.currentRun) return;
        this.currentRun.deaths++;
    }
    
    /**
     * Record floor progress
     */
    updateFloor(floor) {
        if (!this.currentRun) return;
        this.currentRun.floor = floor;
    }
    
    /**
     * Add souls to current run
     */
    addRunSouls(amount) {
        if (!this.currentRun) return;
        this.currentRun.soulsCollected += amount;
    }
    
    /**
     * Get current meta stats
     */
    getMetaStats() {
        return {
            currency: { ...this.metaCurrency },
            upgrades: Array.from(this.metaUpgrades.entries()).map(([id, level]) => ({
                id,
                level,
                upgrade: this.upgradeDatabase[id]
            })),
            runStats: { ...this.runStats },
            unlocked: {
                classes: Array.from(this.unlockedClasses),
                biomes: Array.from(this.unlockedBiomes),
                modes: Array.from(this.unlockedModes),
                features: Array.from(this.unlockedFeatures)
            }
        };
    }
    
    /**
     * Get available upgrades
     */
    getAvailableUpgrades() {
        const available = [];
        
        for (const [id, upgrade] of Object.entries(this.upgradeDatabase)) {
            const currentLevel = this.metaUpgrades.get(id) || 0;
            
            if (currentLevel < upgrade.maxLevel) {
                available.push({
                    id,
                    ...upgrade,
                    currentLevel,
                    nextCost: upgrade.cost(currentLevel),
                    canAfford: this.metaCurrency[upgrade.currency] >= upgrade.cost(currentLevel)
                });
            }
        }
        
        return available;
    }
    
    /**
     * Save meta-progression to storage
     */
    saveProgress() {
        const data = {
            metaCurrency: this.metaCurrency,
            metaUpgrades: Array.from(this.metaUpgrades.entries()),
            runStats: this.runStats,
            unlockedClasses: Array.from(this.unlockedClasses),
            unlockedBiomes: Array.from(this.unlockedBiomes),
            unlockedModes: Array.from(this.unlockedModes),
            unlockedFeatures: Array.from(this.unlockedFeatures),
            metaAchievements: Array.from(this.metaAchievements)
        };
        
        localStorage.setItem('roguelike_meta_progress', JSON.stringify(data));
    }
    
    /**
     * Load meta-progression from storage
     */
    loadProgress() {
        const savedData = localStorage.getItem('roguelike_meta_progress');
        if (!savedData) return;
        
        try {
            const data = JSON.parse(savedData);
            
            this.metaCurrency = data.metaCurrency || this.metaCurrency;
            this.metaUpgrades = new Map(data.metaUpgrades || []);
            this.runStats = data.runStats || this.runStats;
            this.unlockedClasses = new Set(data.unlockedClasses || ['warrior']);
            this.unlockedBiomes = new Set(data.unlockedBiomes || ['smoke_forest']);
            this.unlockedModes = new Set(data.unlockedModes || ['story']);
            this.unlockedFeatures = new Set(data.unlockedFeatures || []);
            this.metaAchievements = new Set(data.metaAchievements || []);
        } catch (error) {
            console.error('Failed to load meta-progression:', error);
        }
    }
    
    /**
     * Reset all meta-progression (for testing or prestige)
     */
    reset() {
        this.metaCurrency = { souls: 0, essence: 0, fragments: 0 };
        this.metaUpgrades.clear();
        this.unlockedClasses = new Set(['warrior']);
        this.unlockedBiomes = new Set(['smoke_forest']);
        this.unlockedModes = new Set(['story']);
        this.unlockedFeatures.clear();
        this.runStats = {
            totalRuns: 0,
            successfulRuns: 0,
            totalDeaths: 0,
            deepestFloor: 0,
            totalKills: 0,
            totalBossKills: 0,
            fastestRun: Infinity,
            longestRun: 0,
            totalPlayTime: 0
        };
        this.saveProgress();
    }
}
