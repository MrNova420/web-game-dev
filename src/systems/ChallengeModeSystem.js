/**
 * ChallengeModeSystem.js
 * Phase 6 - Challenge Mode System
 * Daily/weekly challenges, challenge towers, and competitive modes
 * ~600 lines
 */

export class ChallengeModeSystem {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        
        // Active challenges
        this.dailyChallenges = [];
        this.weeklyChallenges = [];
        this.specialChallenges = [];
        this.completedChallenges = new Set();
        
        // Challenge tower
        this.towerProgress = {
            currentFloor: 1,
            highestFloor: 1,
            attempts: 0,
            completions: 0
        };
        
        // Challenge types database
        this.challengeTypes = this.createChallengeTypes();
        
        // Rewards
        this.challengePoints = 0;
        this.challengeRank = 1;
        
        // Last reset times
        this.lastDailyReset = Date.now();
        this.lastWeeklyReset = Date.now();
        
        // Initialize challenges
        this.generateDailyChallenges();
        this.generateWeeklyChallenges();
    }
    
    /**
     * Create challenge types
     */
    createChallengeTypes() {
        return {
            // Combat challenges
            kill_enemies: {
                name: 'Enemy Slayer',
                type: 'combat',
                description: 'Defeat {count} enemies',
                difficulty: 'easy',
                rewards: { gold: 500, xp: 100, points: 10 }
            },
            kill_bosses: {
                name: 'Boss Hunter',
                type: 'combat',
                description: 'Defeat {count} bosses',
                difficulty: 'hard',
                rewards: { gold: 2000, xp: 500, points: 50 }
            },
            perfect_combat: {
                name: 'Flawless Victory',
                type: 'combat',
                description: 'Complete a floor without taking damage',
                difficulty: 'hard',
                rewards: { gold: 1500, xp: 300, points: 40 }
            },
            combo_master: {
                name: 'Combo Master',
                type: 'combat',
                description: 'Achieve a {count}-hit combo',
                difficulty: 'medium',
                rewards: { gold: 1000, xp: 200, points: 25 }
            },
            
            // Collection challenges
            collect_items: {
                name: 'Collector',
                type: 'collection',
                description: 'Collect {count} items',
                difficulty: 'easy',
                rewards: { gold: 400, xp: 80, points: 8 }
            },
            rare_find: {
                name: 'Treasure Hunter',
                type: 'collection',
                description: 'Find a rare or better item',
                difficulty: 'medium',
                rewards: { gold: 1200, xp: 250, points: 30 }
            },
            
            // Crafting challenges
            craft_items: {
                name: 'Master Crafter',
                type: 'crafting',
                description: 'Craft {count} items',
                difficulty: 'medium',
                rewards: { gold: 800, xp: 150, points: 20 }
            },
            brew_potions: {
                name: 'Alchemist',
                type: 'crafting',
                description: 'Brew {count} potions',
                difficulty: 'easy',
                rewards: { gold: 600, xp: 120, points: 15 }
            },
            
            // Speed challenges
            speed_run: {
                name: 'Speed Runner',
                type: 'speed',
                description: 'Complete 5 floors in under {time} minutes',
                difficulty: 'hard',
                rewards: { gold: 3000, xp: 600, points: 60 }
            },
            boss_rush: {
                name: 'Boss Rush',
                type: 'speed',
                description: 'Defeat {count} bosses in under {time} minutes',
                difficulty: 'expert',
                rewards: { gold: 5000, xp: 1000, points: 100 }
            },
            
            // Survival challenges
            survive_waves: {
                name: 'Survivor',
                type: 'survival',
                description: 'Survive {count} waves without healing',
                difficulty: 'hard',
                rewards: { gold: 2500, xp: 500, points: 50 }
            },
            low_hp: {
                name: 'Edge of Death',
                type: 'survival',
                description: 'Complete a floor with less than 10% HP',
                difficulty: 'expert',
                rewards: { gold: 4000, xp: 800, points: 80 }
            },
            
            // Special challenges
            no_damage: {
                name: 'Untouchable',
                type: 'special',
                description: 'Complete {count} floors without taking damage',
                difficulty: 'expert',
                rewards: { gold: 10000, xp: 2000, points: 200 }
            },
            pacifist: {
                name: 'Pacifist',
                type: 'special',
                description: 'Complete a floor without killing enemies',
                difficulty: 'expert',
                rewards: { gold: 5000, xp: 1000, points: 100 }
            }
        };
    }
    
    /**
     * Generate daily challenges
     */
    generateDailyChallenges() {
        this.dailyChallenges = [];
        
        // Select 3 random easy-medium challenges
        const availableTypes = Object.entries(this.challengeTypes)
            .filter(([id, data]) => data.difficulty === 'easy' || data.difficulty === 'medium');
        
        for (let i = 0; i < 3; i++) {
            const [typeId, typeData] = availableTypes[Math.floor(Math.random() * availableTypes.length)];
            const challenge = this.createChallenge(typeId, typeData, 'daily');
            this.dailyChallenges.push(challenge);
        }
    }
    
    /**
     * Generate weekly challenges
     */
    generateWeeklyChallenges() {
        this.weeklyChallenges = [];
        
        // Select 3 random medium-hard challenges
        const availableTypes = Object.entries(this.challengeTypes)
            .filter(([id, data]) => data.difficulty === 'medium' || data.difficulty === 'hard');
        
        for (let i = 0; i < 3; i++) {
            const [typeId, typeData] = availableTypes[Math.floor(Math.random() * availableTypes.length)];
            const challenge = this.createChallenge(typeId, typeData, 'weekly');
            this.weeklyChallenges.push(challenge);
        }
    }
    
    /**
     * Create challenge instance
     */
    createChallenge(typeId, typeData, period) {
        const countMap = {
            kill_enemies: 50,
            kill_bosses: 5,
            collect_items: 30,
            craft_items: 10,
            brew_potions: 15,
            combo_master: 50,
            survive_waves: 10,
            speed_run: 15,
            boss_rush: 3
        };
        
        const timeMap = {
            speed_run: 15,
            boss_rush: 10
        };
        
        const challenge = {
            id: `challenge_${period}_${typeId}_${Date.now()}`,
            typeId: typeId,
            name: typeData.name,
            description: typeData.description
                .replace('{count}', countMap[typeId] || 10)
                .replace('{time}', timeMap[typeId] || 10),
            type: typeData.type,
            difficulty: typeData.difficulty,
            period: period,
            progress: 0,
            target: countMap[typeId] || 1,
            timeLimit: timeMap[typeId] ? timeMap[typeId] * 60 : null,
            rewards: typeData.rewards,
            completed: false,
            startTime: Date.now()
        };
        
        return challenge;
    }
    
    /**
     * Update challenge progress
     */
    updateProgress(challengeType, amount = 1, metadata = {}) {
        // Update daily challenges
        for (const challenge of this.dailyChallenges) {
            if (challenge.typeId === challengeType && !challenge.completed) {
                challenge.progress += amount;
                
                if (challenge.progress >= challenge.target) {
                    this.completeChallenge(challenge);
                }
            }
        }
        
        // Update weekly challenges
        for (const challenge of this.weeklyChallenges) {
            if (challenge.typeId === challengeType && !challenge.completed) {
                challenge.progress += amount;
                
                if (challenge.progress >= challenge.target) {
                    this.completeChallenge(challenge);
                }
            }
        }
        
        // Update special challenges
        for (const challenge of this.specialChallenges) {
            if (challenge.typeId === challengeType && !challenge.completed) {
                challenge.progress += amount;
                
                if (challenge.progress >= challenge.target) {
                    this.completeChallenge(challenge);
                }
            }
        }
    }
    
    /**
     * Complete challenge
     */
    completeChallenge(challenge) {
        if (challenge.completed) return;
        
        challenge.completed = true;
        challenge.completedTime = Date.now();
        this.completedChallenges.add(challenge.id);
        
        // Award rewards
        if (challenge.rewards.gold && this.gameEngine.economySystem) {
            this.gameEngine.economySystem.addGold(challenge.rewards.gold);
        }
        
        if (challenge.rewards.xp && this.gameEngine.player) {
            this.gameEngine.player.addXP(challenge.rewards.xp);
        }
        
        if (challenge.rewards.points) {
            this.challengePoints += challenge.rewards.points;
            this.updateRank();
        }
        
        console.log(`🏆 Challenge Complete: ${challenge.name}`);
        console.log(`Rewards: ${challenge.rewards.gold} gold, ${challenge.rewards.xp} XP, ${challenge.rewards.points} points`);
    }
    
    /**
     * Start challenge tower floor
     */
    startTowerFloor(floor) {
        if (floor > this.towerProgress.highestFloor + 1) {
            return { success: false, message: 'Must complete previous floors first' };
        }
        
        this.towerProgress.currentFloor = floor;
        this.towerProgress.attempts++;
        
        // Generate floor challenge
        const challenge = this.generateTowerChallenge(floor);
        
        return { success: true, challenge: challenge };
    }
    
    /**
     * Generate challenge tower floor
     */
    generateTowerChallenge(floor) {
        const difficulty = Math.floor(floor / 10);
        const enemyCount = 10 + floor * 2;
        const bossEvery = 10;
        
        const challenge = {
            floor: floor,
            type: floor % bossEvery === 0 ? 'boss' : 'combat',
            enemyCount: enemyCount,
            enemyLevel: floor,
            timeLimit: 300 + floor * 10,
            rewards: {
                gold: 100 * floor,
                xp: 50 * floor,
                points: floor
            },
            modifiers: this.getTowerModifiers(difficulty)
        };
        
        return challenge;
    }
    
    /**
     * Get tower modifiers based on difficulty
     */
    getTowerModifiers(difficulty) {
        const modifiers = [];
        
        if (difficulty >= 1) modifiers.push({ type: 'enemy_health', value: 1.5 });
        if (difficulty >= 2) modifiers.push({ type: 'enemy_damage', value: 1.5 });
        if (difficulty >= 3) modifiers.push({ type: 'enemy_speed', value: 1.3 });
        if (difficulty >= 4) modifiers.push({ type: 'no_healing', value: true });
        if (difficulty >= 5) modifiers.push({ type: 'time_pressure', value: true });
        
        return modifiers;
    }
    
    /**
     * Complete tower floor
     */
    completeTowerFloor(floor, success) {
        if (!success) {
            return { success: false, message: 'Floor failed' };
        }
        
        if (floor > this.towerProgress.highestFloor) {
            this.towerProgress.highestFloor = floor;
        }
        
        this.towerProgress.completions++;
        
        // Award floor rewards
        const challenge = this.generateTowerChallenge(floor);
        
        if (challenge.rewards.gold && this.gameEngine.economySystem) {
            this.gameEngine.economySystem.addGold(challenge.rewards.gold);
        }
        
        if (challenge.rewards.xp && this.gameEngine.player) {
            this.gameEngine.player.addXP(challenge.rewards.xp);
        }
        
        if (challenge.rewards.points) {
            this.challengePoints += challenge.rewards.points;
            this.updateRank();
        }
        
        console.log(`🗼 Tower Floor ${floor} Complete!`);
        
        return { success: true, rewards: challenge.rewards };
    }
    
    /**
     * Update challenge rank
     */
    updateRank() {
        const rankThresholds = [0, 100, 300, 600, 1000, 1500, 2500, 5000, 10000, 20000];
        
        for (let i = rankThresholds.length - 1; i >= 0; i--) {
            if (this.challengePoints >= rankThresholds[i]) {
                this.challengeRank = i + 1;
                break;
            }
        }
    }
    
    /**
     * Check for daily reset
     */
    checkDailyReset() {
        const now = Date.now();
        const dayInMs = 24 * 60 * 60 * 1000;
        
        if (now - this.lastDailyReset >= dayInMs) {
            this.generateDailyChallenges();
            this.lastDailyReset = now;
        }
    }
    
    /**
     * Check for weekly reset
     */
    checkWeeklyReset() {
        const now = Date.now();
        const weekInMs = 7 * 24 * 60 * 60 * 1000;
        
        if (now - this.lastWeeklyReset >= weekInMs) {
            this.generateWeeklyChallenges();
            this.lastWeeklyReset = now;
        }
    }
    
    /**
     * Get active challenges
     */
    getActiveChallenges() {
        this.checkDailyReset();
        this.checkWeeklyReset();
        
        return {
            daily: this.dailyChallenges.filter(c => !c.completed),
            weekly: this.weeklyChallenges.filter(c => !c.completed),
            special: this.specialChallenges.filter(c => !c.completed)
        };
    }
    
    /**
     * Get challenge stats
     */
    getStats() {
        return {
            points: this.challengePoints,
            rank: this.challengeRank,
            completedCount: this.completedChallenges.size,
            towerProgress: this.towerProgress,
            dailyProgress: this.dailyChallenges.filter(c => c.completed).length,
            weeklyProgress: this.weeklyChallenges.filter(c => c.completed).length
        };
    }
    
    /**
     * Save challenge data
     */
    save() {
        const data = {
            dailyChallenges: this.dailyChallenges,
            weeklyChallenges: this.weeklyChallenges,
            specialChallenges: this.specialChallenges,
            completedChallenges: Array.from(this.completedChallenges),
            towerProgress: this.towerProgress,
            challengePoints: this.challengePoints,
            challengeRank: this.challengeRank,
            lastDailyReset: this.lastDailyReset,
            lastWeeklyReset: this.lastWeeklyReset
        };
        
        localStorage.setItem('challenge_data', JSON.stringify(data));
    }
    
    /**
     * Load challenge data
     */
    load() {
        const saved = localStorage.getItem('challenge_data');
        if (!saved) return;
        
        try {
            const data = JSON.parse(saved);
            this.dailyChallenges = data.dailyChallenges || [];
            this.weeklyChallenges = data.weeklyChallenges || [];
            this.specialChallenges = data.specialChallenges || [];
            this.completedChallenges = new Set(data.completedChallenges || []);
            this.towerProgress = data.towerProgress || this.towerProgress;
            this.challengePoints = data.challengePoints || 0;
            this.challengeRank = data.challengeRank || 1;
            this.lastDailyReset = data.lastDailyReset || Date.now();
            this.lastWeeklyReset = data.lastWeeklyReset || Date.now();
        } catch (error) {
            console.error('Failed to load challenge data:', error);
        }
    }
}
