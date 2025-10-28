/**
 * InfiniteDungeonSystem.js
 * Handles infinite dungeon with scaling difficulty, modifiers, and checkpoints
 * Part of Phase 7: Advanced Progression
 * True endgame content with floors 1-999+
 */

export class InfiniteDungeonSystem {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        
        // Current state
        this.currentFloor = 1;
        this.highestFloor = 1;
        this.checkpoints = new Set([1]); // Floors where player can resume
        
        // Floor modifiers
        this.activeModifiers = [];
        this.modifierPool = this.initializeModifiers();
        
        // Milestone floors
        this.milestoneFloors = [10, 25, 50, 75, 100, 150, 200, 250, 500, 750, 999];
        
        // Floor events
        this.floorEvents = this.initializeFloorEvents();
        
        // Boss floors (every 5 floors)
        this.isBossFloor = (floor) => floor % 5 === 0;
        this.isSuperBossFloor = (floor) => floor % 25 === 0;
        
        // Difficulty scaling
        this.difficultyScaling = {
            baseMultiplier: 1.0,
            perFloorIncrease: 0.03, // 3% per floor
            perMilestoneBonus: 0.25 // 25% at milestones
        };
        
        // Loot scaling
        this.lootScaling = {
            baseQuality: 1.0,
            perFloorIncrease: 0.02,
            rarityThresholds: {
                rare: 20,
                epic: 50,
                legendary: 100
            }
        };
        
        // Leaderboard
        this.depthLeaderboard = [];
    }
    
    /**
     * Initialize floor modifiers
     */
    initializeModifiers() {
        return {
            // Positive modifiers (buffs)
            double_xp: {
                name: 'Essence Overflow',
                description: 'Double XP gains',
                type: 'buff',
                xpMultiplier: 2.0,
                icon: '✨'
            },
            triple_gold: {
                name: 'Gold Rush',
                description: 'Triple gold drops',
                type: 'buff',
                goldMultiplier: 3.0,
                icon: '💰'
            },
            super_loot: {
                name: 'Treasure Trove',
                description: 'Guaranteed rare+ drops',
                type: 'buff',
                minRarity: 'rare',
                icon: '🎁'
            },
            speed_boost: {
                name: 'Hyperspace',
                description: 'Increased movement speed',
                type: 'buff',
                speedMultiplier: 1.5,
                icon: '⚡'
            },
            
            // Negative modifiers (challenges)
            foggy: {
                name: 'Dense Fog',
                description: 'Reduced visibility',
                type: 'challenge',
                visibilityReduction: 0.5,
                icon: '🌫️'
            },
            burning: {
                name: 'Burning Floor',
                description: 'Constant fire damage',
                type: 'challenge',
                damagePerSecond: 5,
                icon: '🔥'
            },
            frozen: {
                name: 'Frozen Wasteland',
                description: 'Reduced movement speed',
                type: 'challenge',
                speedMultiplier: 0.7,
                icon: '❄️'
            },
            swarming: {
                name: 'Swarm',
                description: '2x enemy count',
                type: 'challenge',
                enemyMultiplier: 2,
                icon: '🐝'
            },
            elite: {
                name: 'Elite Forces',
                description: 'All enemies are elites',
                type: 'challenge',
                enemyQuality: 'elite',
                icon: '👑'
            },
            cursed: {
                name: 'Cursed Ground',
                description: 'No health regeneration',
                type: 'challenge',
                disableRegen: true,
                icon: '💀'
            },
            chaotic: {
                name: 'Chaos Realm',
                description: 'Random enemy abilities',
                type: 'challenge',
                randomizeEnemies: true,
                icon: '🌀'
            },
            
            // Neutral modifiers (mixed)
            volatile: {
                name: 'Volatile Energy',
                description: 'Double damage dealt and received',
                type: 'neutral',
                damageMultiplier: 2.0,
                icon: '⚠️'
            },
            mysterious: {
                name: 'Mystery Box',
                description: 'Random positive or negative effect',
                type: 'neutral',
                randomEffect: true,
                icon: '❓'
            }
        };
    }
    
    /**
     * Initialize floor events
     */
    initializeFloorEvents() {
        return {
            treasure_room: {
                name: 'Treasure Room',
                description: 'A room filled with loot',
                chance: 0.05, // 5% chance
                rewards: {
                    gold: 1000,
                    items: 3,
                    minRarity: 'rare'
                }
            },
            merchant_floor: {
                name: 'Traveling Merchant',
                description: 'A merchant offers rare wares',
                chance: 0.08,
                merchant: 'traveling'
            },
            puzzle_room: {
                name: 'Puzzle Chamber',
                description: 'Solve puzzles for rewards',
                chance: 0.03,
                puzzleType: 'match3',
                rewards: {
                    astralEssence: 10,
                    materials: 50
                }
            },
            rest_area: {
                name: 'Safe Haven',
                description: 'Restore HP and save progress',
                chance: 0.04,
                heals: 'full',
                checkpoint: true
            },
            champion_challenge: {
                name: 'Champion Challenge',
                description: 'Fight a mini-boss for big rewards',
                chance: 0.06,
                bossType: 'champion',
                rewards: {
                    gold: 2000,
                    xp: 1000,
                    item: { rarity: 'epic' }
                }
            },
            shrine: {
                name: 'Ancient Shrine',
                description: 'Receive a permanent buff',
                chance: 0.02,
                buffOptions: ['attack', 'defense', 'hp', 'speed']
            },
            cursed_altar: {
                name: 'Cursed Altar',
                description: 'Risk for reward',
                chance: 0.03,
                risk: 'hp',
                reward: 'legendary_item'
            },
            dimensional_rift: {
                name: 'Dimensional Rift',
                description: 'Skip 5-10 floors',
                chance: 0.01,
                skipFloors: [5, 10]
            }
        };
    }
    
    /**
     * Advance to next floor
     */
    advanceFloor() {
        this.currentFloor++;
        
        if (this.currentFloor > this.highestFloor) {
            this.highestFloor = this.currentFloor;
            
            // Update leaderboard
            this.updateLeaderboard();
        }
        
        // Check for checkpoint
        if (this.isCheckpointFloor(this.currentFloor)) {
            this.checkpoints.add(this.currentFloor);
            console.log(`📍 Checkpoint reached: Floor ${this.currentFloor}`);
        }
        
        // Apply floor modifiers
        this.applyFloorModifiers();
        
        // Check for floor events
        this.checkFloorEvents();
        
        // Check for milestone
        if (this.milestoneFloors.includes(this.currentFloor)) {
            this.handleMilestone();
        }
        
        console.log(`🏢 Entered Floor ${this.currentFloor}`);
        
        return {
            floor: this.currentFloor,
            isBoss: this.isBossFloor(this.currentFloor),
            isSuperBoss: this.isSuperBossFloor(this.currentFloor),
            modifiers: this.activeModifiers,
            difficulty: this.calculateDifficulty()
        };
    }
    
    /**
     * Check if floor is a checkpoint
     */
    isCheckpointFloor(floor) {
        // Checkpoints every 10 floors
        return floor % 10 === 0;
    }
    
    /**
     * Resume from checkpoint
     */
    resumeFromCheckpoint(floor) {
        if (!this.checkpoints.has(floor)) {
            return { success: false, reason: 'Checkpoint not unlocked' };
        }
        
        this.currentFloor = floor;
        this.applyFloorModifiers();
        
        console.log(`📍 Resumed from Floor ${floor}`);
        
        return { success: true, floor };
    }
    
    /**
     * Apply floor modifiers
     */
    applyFloorModifiers() {
        this.activeModifiers = [];
        
        // Every 10 floors, add a modifier
        const modifierCount = Math.floor(this.currentFloor / 10);
        
        // Get random modifiers from pool
        const availableModifiers = Object.entries(this.modifierPool);
        
        for (let i = 0; i < Math.min(modifierCount, 5); i++) { // Max 5 modifiers
            const randomIndex = Math.floor(Math.random() * availableModifiers.length);
            const [modId, modifier] = availableModifiers[randomIndex];
            
            if (!this.activeModifiers.find(m => m.id === modId)) {
                this.activeModifiers.push({
                    id: modId,
                    ...modifier
                });
            }
        }
        
        if (this.activeModifiers.length > 0) {
            console.log(`⚡ Active modifiers: ${this.activeModifiers.map(m => m.name).join(', ')}`);
        }
    }
    
    /**
     * Check for floor events
     */
    checkFloorEvents() {
        // Don't spawn events on boss floors
        if (this.isBossFloor(this.currentFloor)) return;
        
        // Roll for events
        for (const [eventId, event] of Object.entries(this.floorEvents)) {
            if (Math.random() < event.chance) {
                this.triggerFloorEvent(eventId, event);
                break; // Only one event per floor
            }
        }
    }
    
    /**
     * Trigger floor event
     */
    triggerFloorEvent(eventId, event) {
        console.log(`🎲 Floor Event: ${event.name}!`);
        
        // Handle different event types
        switch (eventId) {
            case 'treasure_room':
                this.handleTreasureRoom(event);
                break;
            case 'merchant_floor':
                this.handleMerchantFloor(event);
                break;
            case 'rest_area':
                this.handleRestArea(event);
                break;
            case 'champion_challenge':
                this.handleChampionChallenge(event);
                break;
            case 'dimensional_rift':
                this.handleDimensionalRift(event);
                break;
            default:
                console.log(`Event ${eventId} triggered!`);
        }
    }
    
    /**
     * Handle treasure room event
     */
    handleTreasureRoom(event) {
        if (this.gameEngine.economySystem) {
            this.gameEngine.economySystem.addCurrency('gold', event.rewards.gold);
        }
        
        console.log(`💰 Found ${event.rewards.gold} gold and ${event.rewards.items} rare items!`);
    }
    
    /**
     * Handle merchant floor event
     */
    handleMerchantFloor(event) {
        if (this.gameEngine.tradingSystem) {
            this.gameEngine.tradingSystem.spawnTrader('wandering');
        }
        
        console.log(`🛒 A traveling merchant appears!`);
    }
    
    /**
     * Handle rest area event
     */
    handleRestArea(event) {
        const player = this.gameEngine.player;
        
        if (player && event.heals === 'full') {
            player.stats.hp = player.stats.maxHp;
            console.log(`💚 HP restored to full!`);
        }
        
        if (event.checkpoint) {
            this.checkpoints.add(this.currentFloor);
            console.log(`📍 Safe checkpoint created!`);
        }
    }
    
    /**
     * Handle champion challenge event
     */
    handleChampionChallenge(event) {
        // Would spawn special boss
        console.log(`⚔️ Champion challenge initiated!`);
    }
    
    /**
     * Handle dimensional rift event
     */
    handleDimensionalRift(event) {
        const skipAmount = event.skipFloors[0] + Math.floor(Math.random() * (event.skipFloors[1] - event.skipFloors[0]));
        
        this.currentFloor += skipAmount;
        this.highestFloor = Math.max(this.highestFloor, this.currentFloor);
        
        console.log(`🌀 Dimensional rift! Skipped ${skipAmount} floors!`);
    }
    
    /**
     * Handle milestone floor
     */
    handleMilestone() {
        console.log(`🏆 Milestone Floor ${this.currentFloor} reached!`);
        
        // Grant bonus rewards
        if (this.gameEngine.economySystem) {
            const goldBonus = this.currentFloor * 100;
            const gemsBonus = Math.floor(this.currentFloor / 10);
            
            this.gameEngine.economySystem.addCurrency('gold', goldBonus);
            this.gameEngine.economySystem.addCurrency('gems', gemsBonus);
            
            console.log(`💎 Milestone rewards: ${goldBonus} gold, ${gemsBonus} gems!`);
        }
        
        // Achievement unlock
        if (this.gameEngine.achievementSystem) {
            this.gameEngine.achievementSystem.checkAchievement('depth_master', {
                floor: this.currentFloor
            });
        }
    }
    
    /**
     * Calculate difficulty multiplier for current floor
     */
    calculateDifficulty() {
        let multiplier = this.difficultyScaling.baseMultiplier;
        
        // Per floor scaling
        multiplier += this.currentFloor * this.difficultyScaling.perFloorIncrease;
        
        // Milestone bonuses
        const milestonePassed = this.milestoneFloors.filter(f => f <= this.currentFloor).length;
        multiplier += milestonePassed * this.difficultyScaling.perMilestoneBonus;
        
        // Modifier difficulty
        for (const modifier of this.activeModifiers) {
            if (modifier.type === 'challenge') {
                multiplier *= 1.2; // 20% per challenge modifier
            }
        }
        
        return multiplier;
    }
    
    /**
     * Calculate loot quality for current floor
     */
    calculateLootQuality() {
        let quality = this.lootScaling.baseQuality;
        quality += this.currentFloor * this.lootScaling.perFloorIncrease;
        
        // Determine guaranteed rarity
        let guaranteedRarity = 'common';
        
        if (this.currentFloor >= this.lootScaling.rarityThresholds.legendary) {
            guaranteedRarity = 'legendary';
        } else if (this.currentFloor >= this.lootScaling.rarityThresholds.epic) {
            guaranteedRarity = 'epic';
        } else if (this.currentFloor >= this.lootScaling.rarityThresholds.rare) {
            guaranteedRarity = 'rare';
        }
        
        return {
            quality,
            guaranteedRarity
        };
    }
    
    /**
     * Get enemy stats for current floor
     */
    getEnemyStats(baseStats) {
        const difficulty = this.calculateDifficulty();
        
        return {
            hp: Math.floor(baseStats.hp * difficulty),
            attack: Math.floor(baseStats.attack * difficulty),
            defense: Math.floor(baseStats.defense * difficulty),
            exp: Math.floor(baseStats.exp * difficulty),
            gold: Math.floor(baseStats.gold * difficulty)
        };
    }
    
    /**
     * Update leaderboard
     */
    updateLeaderboard() {
        // Would integrate with leaderboard system
        if (this.gameEngine.leaderboardSystem) {
            this.gameEngine.leaderboardSystem.submitScore('floor_progression', this.highestFloor);
        }
    }
    
    /**
     * Get floor info
     */
    getFloorInfo() {
        return {
            current: this.currentFloor,
            highest: this.highestFloor,
            isBoss: this.isBossFloor(this.currentFloor),
            isSuperBoss: this.isSuperBossFloor(this.currentFloor),
            modifiers: this.activeModifiers,
            difficulty: this.calculateDifficulty(),
            lootQuality: this.calculateLootQuality(),
            checkpoints: Array.from(this.checkpoints).sort((a, b) => b - a).slice(0, 10) // Last 10 checkpoints
        };
    }
    
    /**
     * Get modifier effects for gameplay
     */
    getModifierEffects() {
        const effects = {
            xpMultiplier: 1.0,
            goldMultiplier: 1.0,
            speedMultiplier: 1.0,
            damageMultiplier: 1.0,
            enemyMultiplier: 1.0,
            disableRegen: false,
            minRarity: null
        };
        
        for (const modifier of this.activeModifiers) {
            if (modifier.xpMultiplier) effects.xpMultiplier *= modifier.xpMultiplier;
            if (modifier.goldMultiplier) effects.goldMultiplier *= modifier.goldMultiplier;
            if (modifier.speedMultiplier) effects.speedMultiplier *= modifier.speedMultiplier;
            if (modifier.damageMultiplier) effects.damageMultiplier *= modifier.damageMultiplier;
            if (modifier.enemyMultiplier) effects.enemyMultiplier *= modifier.enemyMultiplier;
            if (modifier.disableRegen) effects.disableRegen = true;
            if (modifier.minRarity) effects.minRarity = modifier.minRarity;
        }
        
        return effects;
    }
    
    /**
     * Reset to floor 1 (on death or prestige)
     */
    reset() {
        this.currentFloor = 1;
        this.activeModifiers = [];
        console.log('🔄 Reset to Floor 1');
    }
    
    /**
     * Save system state
     */
    save() {
        return {
            currentFloor: this.currentFloor,
            highestFloor: this.highestFloor,
            checkpoints: Array.from(this.checkpoints)
        };
    }
    
    /**
     * Load system state
     */
    load(data) {
        if (!data) return;
        
        if (data.currentFloor !== undefined) {
            this.currentFloor = data.currentFloor;
        }
        
        if (data.highestFloor !== undefined) {
            this.highestFloor = data.highestFloor;
        }
        
        if (data.checkpoints) {
            this.checkpoints = new Set(data.checkpoints);
        }
        
        // Reapply modifiers for current floor
        this.applyFloorModifiers();
    }
    
    /**
     * Update system (called each frame)
     */
    update(deltaTime) {
        // Apply modifier effects (like burning floor damage)
        for (const modifier of this.activeModifiers) {
            if (modifier.damagePerSecond) {
                const player = this.gameEngine.player;
                if (player && player.isAlive) {
                    const damage = (modifier.damagePerSecond * deltaTime) / 1000;
                    player.takeDamage(damage);
                }
            }
        }
    }
}
