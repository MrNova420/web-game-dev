/**
 * ChallengeMode.js
 * Handles daily, weekly, and special challenge modes with modifiers
 * Part of Phase 6: Social & Leaderboards
 * Cannabis themed challenges: "Toke Challenges"
 */

export class ChallengeMode {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        
        // Active challenges
        this.activeChallenges = [];
        this.completedChallenges = [];
        
        // Challenge tokens (currency for challenge shop)
        this.challengeTokens = 0;
        
        // Challenge modifiers
        this.modifiers = this.initializeModifiers();
        
        // Challenge templates
        this.challengeTemplates = this.initializeChallengeTemplates();
        
        // Reset timers
        this.dailyResetTime = Date.now();
        this.weeklyResetTime = Date.now();
        this.monthlyResetTime = Date.now();
        
        // Challenge shop
        this.shopItems = this.initializeShopItems();
    }
    
    /**
     * Initialize challenge modifiers
     */
    initializeModifiers() {
        return {
            // Visual/Atmospheric
            purple_haze: {
                name: 'Purple Haze',
                description: 'Vision distortion and purple tint',
                effect: 'visual',
                difficulty: 1.2
            },
            green_crack: {
                name: 'Green Crack',
                description: 'Everything moves 50% faster',
                effect: 'speed',
                speedMultiplier: 1.5,
                difficulty: 1.3
            },
            white_widow: {
                name: 'White Widow',
                description: 'Enemies appear frozen but deal double damage',
                effect: 'illusion',
                damageMultiplier: 2.0,
                difficulty: 1.5
            },
            
            // Combat modifiers
            glass_cannon: {
                name: 'Glass Cannon',
                description: 'Double damage dealt and received',
                effect: 'combat',
                damageDealt: 2.0,
                damageReceived: 2.0,
                difficulty: 1.4
            },
            one_hit: {
                name: 'One Hit Wonder',
                description: 'You have 1 HP but deal massive damage',
                effect: 'combat',
                hp: 1,
                damageBonus: 5.0,
                difficulty: 2.0
            },
            no_abilities: {
                name: 'Pure Melee',
                description: 'All abilities disabled, basic attacks only',
                effect: 'restriction',
                disableAbilities: true,
                difficulty: 1.6
            },
            
            // Enemy modifiers
            swarm: {
                name: 'Infestation',
                description: '3x enemy count, 50% health each',
                effect: 'enemies',
                enemyMultiplier: 3,
                enemyHealth: 0.5,
                difficulty: 1.7
            },
            champions: {
                name: 'Champion Horde',
                description: 'All enemies are mini-bosses',
                effect: 'enemies',
                enemyBoost: 2.5,
                difficulty: 1.8
            },
            
            // Resource modifiers
            no_healing: {
                name: 'Hardcore',
                description: 'No health regeneration or potions',
                effect: 'restriction',
                disableHealing: true,
                difficulty: 1.5
            },
            infinite_mana: {
                name: 'Mana Overload',
                description: 'Unlimited mana but reduced defense',
                effect: 'buff',
                infiniteMana: true,
                defenseMultiplier: 0.7,
                difficulty: 1.1
            }
        };
    }
    
    /**
     * Initialize challenge templates
     */
    initializeChallengeTemplates() {
        return {
            // Daily challenges
            daily: [
                {
                    id: 'daily_quick_toke',
                    name: 'Quick Toke',
                    description: 'Complete 5 floors in under 10 minutes',
                    type: 'speed_run',
                    goal: { floors: 5, timeLimit: 600000 }, // 10 minutes
                    modifiers: ['green_crack'],
                    rewards: {
                        tokens: 10,
                        gold: 1000,
                        exp: 500
                    }
                },
                {
                    id: 'daily_no_damage',
                    name: 'Smooth Session',
                    description: 'Complete 3 floors without taking damage',
                    type: 'no_damage',
                    goal: { floors: 3, maxDamage: 0 },
                    modifiers: ['glass_cannon'],
                    rewards: {
                        tokens: 15,
                        gold: 1500,
                        exp: 750
                    }
                },
                {
                    id: 'daily_boss_rush',
                    name: 'Blunt Force',
                    description: 'Defeat 5 bosses',
                    type: 'boss_kills',
                    goal: { bosses: 5 },
                    modifiers: ['champions'],
                    rewards: {
                        tokens: 12,
                        gold: 1200,
                        item: { rarity: 'rare' }
                    }
                }
            ],
            
            // Weekly challenges
            weekly: [
                {
                    id: 'weekly_harvest',
                    name: 'Weekly Harvest',
                    description: 'Reach floor 50 with Purple Haze active',
                    type: 'floor_reach',
                    goal: { floor: 50 },
                    modifiers: ['purple_haze', 'swarm'],
                    rewards: {
                        tokens: 50,
                        gold: 10000,
                        gems: 25,
                        item: { rarity: 'epic' }
                    }
                },
                {
                    id: 'weekly_collector',
                    name: 'Material Collector',
                    description: 'Gather 1000 materials in one week',
                    type: 'collection',
                    goal: { materials: 1000 },
                    modifiers: [],
                    rewards: {
                        tokens: 40,
                        gold: 8000,
                        materials: {
                            'primordial_dust': 10
                        }
                    }
                },
                {
                    id: 'weekly_ironman',
                    name: 'Ironman Run',
                    description: 'Complete 30 floors with no healing',
                    type: 'survival',
                    goal: { floors: 30 },
                    modifiers: ['no_healing', 'champions'],
                    rewards: {
                        tokens: 75,
                        gold: 15000,
                        gems: 50,
                        cosmetic: 'ironman_badge'
                    }
                }
            ],
            
            // Monthly challenges  
            monthly: [
                {
                    id: 'monthly_blunt_run',
                    name: 'Monthly Blunt Run',
                    description: 'Reach floor 100 with multiple modifiers',
                    type: 'floor_reach',
                    goal: { floor: 100 },
                    modifiers: ['purple_haze', 'green_crack', 'swarm', 'no_healing'],
                    rewards: {
                        tokens: 200,
                        gold: 50000,
                        gems: 150,
                        item: { rarity: 'legendary', guaranteed: true },
                        title: 'Blunt Master'
                    }
                },
                {
                    id: 'monthly_champion',
                    name: 'Champion of the Month',
                    description: 'Top 10% in all weekly challenges',
                    type: 'ranking',
                    goal: { weeklyRank: 0.1 }, // Top 10%
                    modifiers: [],
                    rewards: {
                        tokens: 300,
                        gold: 100000,
                        gems: 250,
                        cosmetic: 'champion_crown',
                        title: 'Monthly Champion'
                    }
                }
            ],
            
            // Special event challenges
            special: [
                {
                    id: 'special_420_fest',
                    name: '4/20 Festival Challenge',
                    description: 'Special celebration challenge',
                    type: 'special_event',
                    goal: { floors: 42, time: 4200000 }, // 42 floors in 70 minutes
                    modifiers: ['green_crack', 'infinite_mana'],
                    rewards: {
                        tokens: 420,
                        gold: 42000,
                        gems: 420,
                        item: { rarity: 'legendary' },
                        cosmetic: '420_badge',
                        title: '420 Blazer'
                    }
                }
            ]
        };
    }
    
    /**
     * Initialize challenge shop items
     */
    initializeShopItems() {
        return [
            {
                id: 'token_weapon',
                name: 'Challenge Weapon',
                rarity: 'epic',
                cost: 100,
                type: 'weapon',
                stats: { attack: 50, critChance: 0.15 }
            },
            {
                id: 'token_armor',
                name: 'Challenge Armor',
                rarity: 'epic',
                cost: 100,
                type: 'armor',
                stats: { defense: 50, hp: 100 }
            },
            {
                id: 'token_pet',
                name: 'Challenge Companion',
                rarity: 'rare',
                cost: 150,
                type: 'pet',
                petId: 'challenge_pet'
            },
            {
                id: 'token_mount',
                name: 'Speed Demon Mount',
                rarity: 'epic',
                cost: 200,
                type: 'mount',
                mountId: 'speed_demon'
            },
            {
                id: 'token_boost_xp',
                name: 'XP Boost (7 days)',
                cost: 50,
                type: 'boost',
                effect: 'xp',
                multiplier: 1.5,
                duration: 604800000
            },
            {
                id: 'token_boost_loot',
                name: 'Loot Boost (7 days)',
                cost: 50,
                type: 'boost',
                effect: 'loot',
                multiplier: 1.5,
                duration: 604800000
            },
            {
                id: 'token_cosmetic_aura',
                name: 'Challenge Aura',
                cost: 75,
                type: 'cosmetic',
                cosmetic: 'challenge_aura'
            }
        ];
    }
    
    /**
     * Generate daily challenge
     */
    generateDailyChallenge() {
        const templates = this.challengeTemplates.daily;
        const template = templates[Math.floor(Math.random() * templates.length)];
        
        return this.createChallenge(template, 'daily');
    }
    
    /**
     * Generate weekly challenge
     */
    generateWeeklyChallenge() {
        const templates = this.challengeTemplates.weekly;
        const template = templates[Math.floor(Math.random() * templates.length)];
        
        return this.createChallenge(template, 'weekly');
    }
    
    /**
     * Generate monthly challenge
     */
    generateMonthlyChallenge() {
        const templates = this.challengeTemplates.monthly;
        const template = templates[Math.floor(Math.random() * templates.length)];
        
        return this.createChallenge(template, 'monthly');
    }
    
    /**
     * Create challenge instance from template
     */
    createChallenge(template, period) {
        const durations = {
            daily: 86400000,    // 24 hours
            weekly: 604800000,  // 7 days
            monthly: 2592000000 // 30 days
        };
        
        return {
            id: `${template.id}_${Date.now()}`,
            templateId: template.id,
            name: template.name,
            description: template.description,
            type: template.type,
            period: period,
            goal: { ...template.goal },
            modifiers: [...template.modifiers],
            rewards: { ...template.rewards },
            progress: {},
            startedAt: Date.now(),
            expiresAt: Date.now() + durations[period],
            completed: false,
            active: false
        };
    }
    
    /**
     * Start challenge
     */
    startChallenge(challengeId) {
        const challenge = this.activeChallenges.find(c => c.id === challengeId);
        
        if (!challenge) {
            return { success: false, reason: 'Challenge not found' };
        }
        
        if (challenge.active) {
            return { success: false, reason: 'Challenge already active' };
        }
        
        if (Date.now() > challenge.expiresAt) {
            return { success: false, reason: 'Challenge expired' };
        }
        
        challenge.active = true;
        challenge.attemptStartedAt = Date.now();
        
        // Apply modifiers
        this.applyModifiers(challenge.modifiers);
        
        console.log(`🎯 Started challenge: ${challenge.name}`);
        
        return { success: true, challenge };
    }
    
    /**
     * Apply challenge modifiers
     */
    applyModifiers(modifierIds) {
        for (const modifierId of modifierIds) {
            const modifier = this.modifiers[modifierId];
            if (!modifier) continue;
            
            // Apply effects (simplified - would integrate with game systems)
            console.log(`⚡ Applied modifier: ${modifier.name}`);
            
            // Store active modifiers for game to read
            if (!this.activeModifiers) {
                this.activeModifiers = [];
            }
            this.activeModifiers.push(modifier);
        }
    }
    
    /**
     * Remove challenge modifiers
     */
    removeModifiers() {
        this.activeModifiers = [];
        console.log('⚡ Removed all challenge modifiers');
    }
    
    /**
     * Update challenge progress
     */
    updateProgress(challengeId, progressData) {
        const challenge = this.activeChallenges.find(c => c.id === challengeId && c.active);
        
        if (!challenge) return;
        
        // Update based on challenge type
        switch (challenge.type) {
            case 'speed_run':
                if (progressData.floorsCompleted) {
                    challenge.progress.floors = progressData.floorsCompleted;
                    challenge.progress.timeElapsed = Date.now() - challenge.attemptStartedAt;
                }
                break;
                
            case 'no_damage':
                if (progressData.floorsCompleted) {
                    challenge.progress.floors = progressData.floorsCompleted;
                }
                if (progressData.damageTaken !== undefined) {
                    challenge.progress.damageTaken = (challenge.progress.damageTaken || 0) + progressData.damageTaken;
                }
                break;
                
            case 'boss_kills':
                if (progressData.bossKilled) {
                    challenge.progress.bosses = (challenge.progress.bosses || 0) + 1;
                }
                break;
                
            case 'floor_reach':
                if (progressData.floorReached) {
                    challenge.progress.floor = Math.max(challenge.progress.floor || 0, progressData.floorReached);
                }
                break;
                
            case 'collection':
                if (progressData.materialGathered) {
                    challenge.progress.materials = (challenge.progress.materials || 0) + 1;
                }
                break;
                
            case 'survival':
                if (progressData.floorsCompleted) {
                    challenge.progress.floors = progressData.floorsCompleted;
                }
                break;
        }
        
        // Check completion
        this.checkChallengeCompletion(challenge);
    }
    
    /**
     * Check if challenge is complete
     */
    checkChallengeCompletion(challenge) {
        let isComplete = false;
        
        switch (challenge.type) {
            case 'speed_run':
                isComplete = challenge.progress.floors >= challenge.goal.floors &&
                           challenge.progress.timeElapsed <= challenge.goal.timeLimit;
                break;
                
            case 'no_damage':
                isComplete = challenge.progress.floors >= challenge.goal.floors &&
                           (challenge.progress.damageTaken || 0) <= challenge.goal.maxDamage;
                break;
                
            case 'boss_kills':
                isComplete = (challenge.progress.bosses || 0) >= challenge.goal.bosses;
                break;
                
            case 'floor_reach':
                isComplete = (challenge.progress.floor || 0) >= challenge.goal.floor;
                break;
                
            case 'collection':
                isComplete = (challenge.progress.materials || 0) >= challenge.goal.materials;
                break;
                
            case 'survival':
                isComplete = (challenge.progress.floors || 0) >= challenge.goal.floors;
                break;
        }
        
        if (isComplete) {
            this.completeChallenge(challenge);
        }
    }
    
    /**
     * Complete challenge
     */
    completeChallenge(challenge) {
        challenge.completed = true;
        challenge.active = false;
        challenge.completedAt = Date.now();
        
        // Remove modifiers
        this.removeModifiers();
        
        // Grant rewards
        this.grantRewards(challenge.rewards);
        
        // Move to completed
        const index = this.activeChallenges.indexOf(challenge);
        if (index > -1) {
            this.activeChallenges.splice(index, 1);
        }
        this.completedChallenges.push(challenge);
        
        console.log(`🏆 Completed challenge: ${challenge.name}!`);
        
        // Submit to leaderboard if applicable
        if (this.gameEngine.leaderboardSystem) {
            this.submitChallengeScore(challenge);
        }
    }
    
    /**
     * Grant challenge rewards
     */
    grantRewards(rewards) {
        if (rewards.tokens) {
            this.challengeTokens += rewards.tokens;
        }
        
        if (rewards.gold && this.gameEngine.economySystem) {
            this.gameEngine.economySystem.addCurrency('gold', rewards.gold);
        }
        
        if (rewards.gems && this.gameEngine.economySystem) {
            this.gameEngine.economySystem.addCurrency('gems', rewards.gems);
        }
        
        if (rewards.exp && this.gameEngine.player) {
            this.gameEngine.player.gainExp(rewards.exp);
        }
        
        if (rewards.item) {
            // Generate reward item
            console.log(`📦 Received ${rewards.item.rarity} item!`);
        }
        
        if (rewards.materials) {
            for (const [matId, amount] of Object.entries(rewards.materials)) {
                if (this.gameEngine.craftingSystem) {
                    this.gameEngine.craftingSystem.addMaterial(matId, amount);
                }
            }
        }
        
        if (rewards.title) {
            console.log(`👑 Earned title: ${rewards.title}!`);
        }
        
        if (rewards.cosmetic) {
            console.log(`✨ Unlocked cosmetic: ${rewards.cosmetic}!`);
        }
    }
    
    /**
     * Submit challenge score to leaderboard
     */
    submitChallengeScore(challenge) {
        // Would integrate with leaderboard system
        const score = this.calculateChallengeScore(challenge);
        console.log(`📊 Challenge score: ${score}`);
    }
    
    /**
     * Calculate challenge score
     */
    calculateChallengeScore(challenge) {
        let score = 1000; // Base score
        
        // Time bonus for speed runs
        if (challenge.type === 'speed_run' && challenge.progress.timeElapsed) {
            const timeBonus = Math.max(0, challenge.goal.timeLimit - challenge.progress.timeElapsed);
            score += Math.floor(timeBonus / 1000); // 1 point per second under limit
        }
        
        // Modifier difficulty multiplier
        let difficultyMultiplier = 1.0;
        for (const modId of challenge.modifiers) {
            const modifier = this.modifiers[modId];
            if (modifier) {
                difficultyMultiplier *= modifier.difficulty;
            }
        }
        
        score = Math.floor(score * difficultyMultiplier);
        
        return score;
    }
    
    /**
     * Purchase from challenge shop
     */
    purchaseShopItem(itemId) {
        const item = this.shopItems.find(i => i.id === itemId);
        
        if (!item) {
            return { success: false, reason: 'Item not found' };
        }
        
        if (this.challengeTokens < item.cost) {
            return { success: false, reason: 'Not enough challenge tokens' };
        }
        
        this.challengeTokens -= item.cost;
        
        // Grant item (simplified)
        console.log(`🛒 Purchased: ${item.name}`);
        
        return { success: true, item };
    }
    
    /**
     * Check and perform resets
     */
    checkResets() {
        const now = Date.now();
        
        // Daily reset
        if (now - this.dailyResetTime >= 86400000) {
            this.resetDaily();
            this.dailyResetTime = now;
        }
        
        // Weekly reset
        if (now - this.weeklyResetTime >= 604800000) {
            this.resetWeekly();
            this.weeklyResetTime = now;
        }
        
        // Monthly reset
        if (now - this.monthlyResetTime >= 2592000000) {
            this.resetMonthly();
            this.monthlyResetTime = now;
        }
    }
    
    /**
     * Reset daily challenges
     */
    resetDaily() {
        // Remove old daily challenges
        this.activeChallenges = this.activeChallenges.filter(c => c.period !== 'daily');
        
        // Generate new daily challenge
        const newChallenge = this.generateDailyChallenge();
        this.activeChallenges.push(newChallenge);
        
        console.log('🔄 Daily challenge reset');
    }
    
    /**
     * Reset weekly challenges
     */
    resetWeekly() {
        this.activeChallenges = this.activeChallenges.filter(c => c.period !== 'weekly');
        
        const newChallenge = this.generateWeeklyChallenge();
        this.activeChallenges.push(newChallenge);
        
        console.log('🔄 Weekly challenge reset');
    }
    
    /**
     * Reset monthly challenges
     */
    resetMonthly() {
        this.activeChallenges = this.activeChallenges.filter(c => c.period !== 'monthly');
        
        const newChallenge = this.generateMonthlyChallenge();
        this.activeChallenges.push(newChallenge);
        
        console.log('🔄 Monthly challenge reset');
    }
    
    /**
     * Get active modifiers for game systems to read
     */
    getActiveModifiers() {
        return this.activeModifiers || [];
    }
    
    /**
     * Save system state
     */
    save() {
        return {
            activeChallenges: this.activeChallenges,
            completedChallenges: this.completedChallenges.slice(-50), // Last 50
            challengeTokens: this.challengeTokens,
            dailyResetTime: this.dailyResetTime,
            weeklyResetTime: this.weeklyResetTime,
            monthlyResetTime: this.monthlyResetTime
        };
    }
    
    /**
     * Load system state
     */
    load(data) {
        if (!data) return;
        
        if (data.activeChallenges) {
            this.activeChallenges = data.activeChallenges;
        }
        
        if (data.completedChallenges) {
            this.completedChallenges = data.completedChallenges;
        }
        
        if (data.challengeTokens !== undefined) {
            this.challengeTokens = data.challengeTokens;
        }
        
        if (data.dailyResetTime) {
            this.dailyResetTime = data.dailyResetTime;
        }
        
        if (data.weeklyResetTime) {
            this.weeklyResetTime = data.weeklyResetTime;
        }
        
        if (data.monthlyResetTime) {
            this.monthlyResetTime = data.monthlyResetTime;
        }
    }
    
    /**
     * Update system (called each frame)
     */
    update(deltaTime) {
        // Check for resets
        this.checkResets();
        
        // Update active challenge progress (if any active)
        for (const challenge of this.activeChallenges) {
            if (challenge.active && Date.now() > challenge.expiresAt) {
                // Challenge failed due to timeout
                challenge.active = false;
                this.removeModifiers();
                console.log(`⏰ Challenge expired: ${challenge.name}`);
            }
        }
    }
}
