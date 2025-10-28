/**
 * LeaderboardSystem.js
 * Handles global and local leaderboards for various game metrics
 * Part of Phase 6: Social & Leaderboards
 */

export class LeaderboardSystem {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        
        // Leaderboard categories
        this.leaderboards = new Map();
        
        // Ranking cache
        this.rankings = new Map();
        
        // Reset timers
        this.resetSchedule = {
            daily: { interval: 86400000, lastReset: Date.now() },    // 24 hours
            weekly: { interval: 604800000, lastReset: Date.now() },   // 7 days
            monthly: { interval: 2592000000, lastReset: Date.now() }  // 30 days
        };
        
        this.initializeLeaderboards();
    }
    
    /**
     * Initialize leaderboard categories
     */
    initializeLeaderboards() {
        // Floor Progression
        this.addLeaderboard({
            id: 'floor_progression',
            name: 'Floor Progression',
            description: 'Highest floor reached',
            type: 'highest',
            resetPeriod: 'never',
            rewards: {
                rank1: { gold: 10000, gems: 100, title: 'Floor Master' },
                rank2: { gold: 7500, gems: 75, title: 'Floor Champion' },
                rank3: { gold: 5000, gems: 50, title: 'Floor Hero' },
                top10: { gold: 2000, gems: 20 },
                top100: { gold: 500, gems: 5 }
            }
        });
        
        // Fastest Clear Time
        this.addLeaderboard({
            id: 'fastest_clear',
            name: 'Speedrun Records',
            description: 'Fastest floor 1-50 clear time',
            type: 'lowest',
            resetPeriod: 'never',
            rewards: {
                rank1: { gold: 15000, gems: 150, cosmetic: 'speedster_aura' },
                rank2: { gold: 10000, gems: 100 },
                rank3: { gold: 7500, gems: 75 },
                top10: { gold: 3000, gems: 30 }
            }
        });
        
        // Highest Damage Dealt
        this.addLeaderboard({
            id: 'highest_damage',
            name: 'Maximum Damage',
            description: 'Highest single hit damage',
            type: 'highest',
            resetPeriod: 'weekly',
            rewards: {
                rank1: { gold: 5000, gems: 50 },
                rank2: { gold: 3000, gems: 30 },
                rank3: { gold: 2000, gems: 20 },
                top10: { gold: 1000, gems: 10 }
            }
        });
        
        // Longest Survival
        this.addLeaderboard({
            id: 'longest_survival',
            name: 'Survival Time',
            description: 'Longest single run duration',
            type: 'highest',
            resetPeriod: 'monthly',
            rewards: {
                rank1: { gold: 8000, gems: 80, title: 'Survivor' },
                rank2: { gold: 5000, gems: 50 },
                rank3: { gold: 3000, gems: 30 },
                top10: { gold: 1500, gems: 15 }
            }
        });
        
        // Total Enemies Defeated
        this.addLeaderboard({
            id: 'enemies_defeated',
            name: 'Exterminator',
            description: 'Total enemies defeated',
            type: 'highest',
            resetPeriod: 'weekly',
            rewards: {
                rank1: { gold: 6000, gems: 60 },
                rank2: { gold: 4000, gems: 40 },
                rank3: { gold: 2500, gems: 25 },
                top10: { gold: 1000, gems: 10 }
            }
        });
        
        // Achievement Score
        this.addLeaderboard({
            id: 'achievement_score',
            name: 'Achievement Masters',
            description: 'Total achievement points',
            type: 'highest',
            resetPeriod: 'never',
            rewards: {
                rank1: { gold: 20000, gems: 200, title: 'Perfectionist' },
                rank2: { gold: 15000, gems: 150 },
                rank3: { gold: 10000, gems: 100 },
                top10: { gold: 5000, gems: 50 }
            }
        });
        
        // Boss Kill Speed
        this.addLeaderboard({
            id: 'boss_kill_speed',
            name: 'Boss Slayer',
            description: 'Fastest boss kill time',
            type: 'lowest',
            resetPeriod: 'weekly',
            rewards: {
                rank1: { gold: 7000, gems: 70, cosmetic: 'boss_slayer_badge' },
                rank2: { gold: 5000, gems: 50 },
                rank3: { gold: 3000, gems: 30 },
                top10: { gold: 1500, gems: 15 }
            }
        });
        
        // Combo Master
        this.addLeaderboard({
            id: 'highest_combo',
            name: 'Combo Master',
            description: 'Highest combo multiplier achieved',
            type: 'highest',
            resetPeriod: 'daily',
            rewards: {
                rank1: { gold: 3000, gems: 30 },
                rank2: { gold: 2000, gems: 20 },
                rank3: { gold: 1000, gems: 10 },
                top10: { gold: 500, gems: 5 }
            }
        });
        
        // Gold Earned
        this.addLeaderboard({
            id: 'gold_earned',
            name: 'Treasure Hunter',
            description: 'Total gold earned',
            type: 'highest',
            resetPeriod: 'monthly',
            rewards: {
                rank1: { gems: 100, cosmetic: 'golden_aura' },
                rank2: { gems: 75 },
                rank3: { gems: 50 },
                top10: { gems: 25 }
            }
        });
        
        // Pet Collector
        this.addLeaderboard({
            id: 'pet_collection',
            name: 'Pet Collector',
            description: 'Unique pets collected',
            type: 'highest',
            resetPeriod: 'never',
            rewards: {
                rank1: { gold: 10000, gems: 100, title: 'Pet Master' },
                rank2: { gold: 7500, gems: 75 },
                rank3: { gold: 5000, gems: 50 },
                top10: { gold: 2000, gems: 20 }
            }
        });
    }
    
    /**
     * Add leaderboard category
     */
    addLeaderboard(leaderboard) {
        this.leaderboards.set(leaderboard.id, {
            ...leaderboard,
            entries: []
        });
    }
    
    /**
     * Submit score to leaderboard
     */
    submitScore(leaderboardId, playerId, score, metadata = {}) {
        const leaderboard = this.leaderboards.get(leaderboardId);
        if (!leaderboard) {
            return { success: false, reason: 'Leaderboard not found' };
        }
        
        // Create entry
        const entry = {
            playerId,
            playerName: metadata.playerName || 'Player',
            score,
            metadata,
            timestamp: Date.now()
        };
        
        // Check if this is a better score
        const existingEntry = leaderboard.entries.find(e => e.playerId === playerId);
        
        if (existingEntry) {
            const isBetter = leaderboard.type === 'highest' ?
                            score > existingEntry.score :
                            score < existingEntry.score;
            
            if (isBetter) {
                existingEntry.score = score;
                existingEntry.metadata = metadata;
                existingEntry.timestamp = Date.now();
                this.sortLeaderboard(leaderboardId);
                
                return {
                    success: true,
                    newRecord: true,
                    rank: this.getPlayerRank(leaderboardId, playerId)
                };
            } else {
                return {
                    success: true,
                    newRecord: false,
                    message: 'Score not better than existing record'
                };
            }
        } else {
            // New entry
            leaderboard.entries.push(entry);
            this.sortLeaderboard(leaderboardId);
            
            return {
                success: true,
                newEntry: true,
                rank: this.getPlayerRank(leaderboardId, playerId)
            };
        }
    }
    
    /**
     * Sort leaderboard entries
     */
    sortLeaderboard(leaderboardId) {
        const leaderboard = this.leaderboards.get(leaderboardId);
        if (!leaderboard) return;
        
        if (leaderboard.type === 'highest') {
            leaderboard.entries.sort((a, b) => b.score - a.score);
        } else {
            leaderboard.entries.sort((a, b) => a.score - b.score);
        }
        
        // Update rankings cache
        this.updateRankingsCache(leaderboardId);
    }
    
    /**
     * Update rankings cache
     */
    updateRankingsCache(leaderboardId) {
        const leaderboard = this.leaderboards.get(leaderboardId);
        if (!leaderboard) return;
        
        const rankings = new Map();
        leaderboard.entries.forEach((entry, index) => {
            rankings.set(entry.playerId, index + 1);
        });
        
        this.rankings.set(leaderboardId, rankings);
    }
    
    /**
     * Get leaderboard entries
     */
    getLeaderboard(leaderboardId, start = 0, count = 100) {
        const leaderboard = this.leaderboards.get(leaderboardId);
        if (!leaderboard) return null;
        
        return {
            id: leaderboard.id,
            name: leaderboard.name,
            description: leaderboard.description,
            type: leaderboard.type,
            resetPeriod: leaderboard.resetPeriod,
            entries: leaderboard.entries.slice(start, start + count).map((entry, index) => ({
                ...entry,
                rank: start + index + 1
            }))
        };
    }
    
    /**
     * Get player rank in leaderboard
     */
    getPlayerRank(leaderboardId, playerId) {
        const rankings = this.rankings.get(leaderboardId);
        return rankings ? rankings.get(playerId) || null : null;
    }
    
    /**
     * Get player's surrounding entries
     */
    getPlayerSurrounding(leaderboardId, playerId, range = 5) {
        const rank = this.getPlayerRank(leaderboardId, playerId);
        if (!rank) return null;
        
        const start = Math.max(0, rank - range - 1);
        const count = range * 2 + 1;
        
        return this.getLeaderboard(leaderboardId, start, count);
    }
    
    /**
     * Get top players
     */
    getTopPlayers(leaderboardId, count = 10) {
        return this.getLeaderboard(leaderboardId, 0, count);
    }
    
    /**
     * Calculate and distribute rewards
     */
    distributeRewards(leaderboardId) {
        const leaderboard = this.leaderboards.get(leaderboardId);
        if (!leaderboard || !leaderboard.rewards) return;
        
        const rewards = [];
        
        leaderboard.entries.forEach((entry, index) => {
            const rank = index + 1;
            let reward = null;
            
            if (rank === 1 && leaderboard.rewards.rank1) {
                reward = leaderboard.rewards.rank1;
            } else if (rank === 2 && leaderboard.rewards.rank2) {
                reward = leaderboard.rewards.rank2;
            } else if (rank === 3 && leaderboard.rewards.rank3) {
                reward = leaderboard.rewards.rank3;
            } else if (rank <= 10 && leaderboard.rewards.top10) {
                reward = leaderboard.rewards.top10;
            } else if (rank <= 100 && leaderboard.rewards.top100) {
                reward = leaderboard.rewards.top100;
            }
            
            if (reward) {
                rewards.push({
                    playerId: entry.playerId,
                    rank,
                    reward
                });
                
                // Grant rewards to player if they're active
                if (entry.playerId === 'current_player') {
                    this.grantReward(reward);
                }
            }
        });
        
        return rewards;
    }
    
    /**
     * Grant reward to player
     */
    grantReward(reward) {
        if (reward.gold && this.gameEngine.economySystem) {
            this.gameEngine.economySystem.addCurrency('gold', reward.gold);
        }
        
        if (reward.gems && this.gameEngine.economySystem) {
            this.gameEngine.economySystem.addCurrency('gems', reward.gems);
        }
        
        if (reward.title) {
            console.log(`🏆 Earned title: ${reward.title}!`);
            // Would integrate with title system
        }
        
        if (reward.cosmetic) {
            console.log(`✨ Unlocked cosmetic: ${reward.cosmetic}!`);
            // Would integrate with cosmetic system
        }
    }
    
    /**
     * Reset leaderboard
     */
    resetLeaderboard(leaderboardId) {
        const leaderboard = this.leaderboards.get(leaderboardId);
        if (!leaderboard) return false;
        
        // Distribute rewards before reset
        this.distributeRewards(leaderboardId);
        
        // Clear entries
        leaderboard.entries = [];
        this.rankings.set(leaderboardId, new Map());
        
        console.log(`🔄 Leaderboard reset: ${leaderboard.name}`);
        
        return true;
    }
    
    /**
     * Check and perform scheduled resets
     */
    checkResets() {
        const now = Date.now();
        
        for (const [period, schedule] of Object.entries(this.resetSchedule)) {
            const elapsed = now - schedule.lastReset;
            
            if (elapsed >= schedule.interval) {
                // Reset all leaderboards of this period
                for (const [id, leaderboard] of this.leaderboards.entries()) {
                    if (leaderboard.resetPeriod === period) {
                        this.resetLeaderboard(id);
                    }
                }
                
                schedule.lastReset = now;
                console.log(`🔄 ${period} leaderboard reset complete`);
            }
        }
    }
    
    /**
     * Get all leaderboards
     */
    getAllLeaderboards() {
        return Array.from(this.leaderboards.values()).map(lb => ({
            id: lb.id,
            name: lb.name,
            description: lb.description,
            type: lb.type,
            resetPeriod: lb.resetPeriod,
            entryCount: lb.entries.length
        }));
    }
    
    /**
     * Get player's statistics across all leaderboards
     */
    getPlayerStats(playerId) {
        const stats = {};
        
        for (const [id, leaderboard] of this.leaderboards.entries()) {
            const rank = this.getPlayerRank(id, playerId);
            const entry = leaderboard.entries.find(e => e.playerId === playerId);
            
            if (rank && entry) {
                stats[id] = {
                    rank,
                    score: entry.score,
                    leaderboardName: leaderboard.name
                };
            }
        }
        
        return stats;
    }
    
    /**
     * Track player achievement for leaderboards
     */
    trackAchievement(category, value, metadata = {}) {
        const playerId = 'current_player'; // Would get actual player ID
        
        switch (category) {
            case 'floor_reached':
                this.submitScore('floor_progression', playerId, value, metadata);
                break;
            case 'clear_time':
                this.submitScore('fastest_clear', playerId, value, metadata);
                break;
            case 'damage_dealt':
                this.submitScore('highest_damage', playerId, value, metadata);
                break;
            case 'survival_time':
                this.submitScore('longest_survival', playerId, value, metadata);
                break;
            case 'enemies_defeated':
                this.submitScore('enemies_defeated', playerId, value, metadata);
                break;
            case 'boss_kill_time':
                this.submitScore('boss_kill_speed', playerId, value, metadata);
                break;
            case 'combo':
                this.submitScore('highest_combo', playerId, value, metadata);
                break;
            case 'gold_earned':
                this.submitScore('gold_earned', playerId, value, metadata);
                break;
            case 'pets_collected':
                this.submitScore('pet_collection', playerId, value, metadata);
                break;
        }
    }
    
    /**
     * Generate fake leaderboard data for testing
     */
    generateMockData(leaderboardId, count = 50) {
        const leaderboard = this.leaderboards.get(leaderboardId);
        if (!leaderboard) return;
        
        const names = [
            'DragonSlayer', 'ShadowNinja', 'MysticMage', 'IronWarrior', 'SwiftRogue',
            'HolyKnight', 'DarkSorcerer', 'BladeDancer', 'StormCaller', 'FireMage',
            'IceQueen', 'ThunderGod', 'PhoenixRider', 'VoidWalker', 'StarGazer'
        ];
        
        for (let i = 0; i < count; i++) {
            const name = names[Math.floor(Math.random() * names.length)] + Math.floor(Math.random() * 1000);
            const score = leaderboard.type === 'highest' ?
                         Math.floor(Math.random() * 1000) + 100 :
                         Math.floor(Math.random() * 10000) + 1000;
            
            this.submitScore(leaderboardId, `mock_${i}`, score, { playerName: name });
        }
    }
    
    /**
     * Save system state
     */
    save() {
        const leaderboardData = {};
        
        for (const [id, leaderboard] of this.leaderboards.entries()) {
            leaderboardData[id] = {
                entries: leaderboard.entries
            };
        }
        
        return {
            leaderboards: leaderboardData,
            resetSchedule: this.resetSchedule
        };
    }
    
    /**
     * Load system state
     */
    load(data) {
        if (!data) return;
        
        if (data.leaderboards) {
            for (const [id, data] of Object.entries(data.leaderboards)) {
                const leaderboard = this.leaderboards.get(id);
                if (leaderboard && data.entries) {
                    leaderboard.entries = data.entries;
                    this.sortLeaderboard(id);
                }
            }
        }
        
        if (data.resetSchedule) {
            this.resetSchedule = data.resetSchedule;
        }
    }
    
    /**
     * Update system (called each frame)
     */
    update(deltaTime) {
        // Check for scheduled resets (check every 60 seconds)
        if (!this.lastResetCheck || Date.now() - this.lastResetCheck > 60000) {
            this.checkResets();
            this.lastResetCheck = Date.now();
        }
    }
}
