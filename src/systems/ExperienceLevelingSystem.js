/**
 * ExperienceLevelingSystem - Phase 3: Progression & RPG Mechanics
 * 
 * Complete experience and leveling system for player progression
 * - XP gain from various sources (combat, quests, exploration, crafting)
 * - Level-based XP requirements with exponential scaling
 * - Level-up rewards (stat points, skill points, unlocks)
 * - XP multipliers and bonuses
 * - Rested XP system
 * - Level cap and prestige system integration
 * - XP sharing in parties
 * - XP boost items and effects
 * - Level milestones and achievements
 */

export class ExperienceLevelingSystem {
    constructor(uiSystem, audioSystem) {
        this.ui = uiSystem;
        this.audio = audioSystem;
        
        // Player data
        this.players = new Map();
        
        // XP configuration
        this.config = {
            maxLevel: 100,
            baseXPRequired: 100,
            xpScaling: 1.15, // Exponential scaling per level
            statPointsPerLevel: 5,
            skillPointsPerLevel: 1,
            
            // XP sources
            xpSources: {
                killEnemy: 1.0,
                killBoss: 5.0,
                completeQuest: 2.0,
                completeDaily: 1.5,
                exploration: 0.5,
                crafting: 0.3,
                gathering: 0.2,
                fishing: 0.3,
                cooking: 0.3,
                achievement: 1.0,
                dungeon: 3.0
            },
            
            // Level milestones
            milestones: {
                10: { reward: 'basic_mount', title: 'Adventurer' },
                20: { reward: 'advanced_skills', title: 'Veteran' },
                30: { reward: 'epic_gear', title: 'Hero' },
                40: { reward: 'legendary_weapon', title: 'Champion' },
                50: { reward: 'flying_mount', title: 'Master' },
                60: { reward: 'artifact', title: 'Legend' },
                70: { reward: 'mythic_ability', title: 'Mythic' },
                80: { reward: 'divine_blessing', title: 'Divine' },
                90: { reward: 'cosmic_power', title: 'Cosmic' },
                100: { reward: 'ultimate_form', title: 'Transcendent' }
            }
        };
        
        // Rested XP system
        this.restedXP = new Map();
        this.maxRestedXP = 150; // 1.5 levels worth
        this.restedXPRate = 5; // Per minute offline
        
        // XP multipliers
        this.xpMultipliers = new Map();
        
        // Party system
        this.parties = new Map();
        
        // Statistics
        this.stats = new Map();
    }
    
    /**
     * Register a player for leveling
     */
    registerPlayer(playerId, options = {}) {
        const playerData = {
            id: playerId,
            level: options.level || 1,
            xp: options.xp || 0,
            totalXP: options.totalXP || 0,
            statPoints: options.statPoints || 0,
            skillPoints: options.skillPoints || 0,
            restedXP: options.restedXP || 0,
            lastLogout: options.lastLogout || Date.now(),
            milestones: options.milestones || []
        };
        
        this.players.set(playerId, playerData);
        this.stats.set(playerId, {
            totalXPGained: 0,
            levelsGained: 0,
            xpBySource: {},
            fastestLevelUp: Infinity,
            slowestLevelUp: 0,
            averageLevelUpTime: 0
        });
        
        // Calculate rested XP for returning players
        if (options.lastLogout) {
            this.updateRestedXP(playerId);
        }
        
        return playerData;
    }
    
    /**
     * Calculate XP required for a level
     */
    getXPRequired(level) {
        if (level >= this.config.maxLevel) return Infinity;
        return Math.floor(this.config.baseXPRequired * Math.pow(this.config.xpScaling, level - 1));
    }
    
    /**
     * Get total XP required to reach a level
     */
    getTotalXPToLevel(level) {
        let total = 0;
        for (let i = 1; i < level; i++) {
            total += this.getXPRequired(i);
        }
        return total;
    }
    
    /**
     * Award XP to a player
     */
    awardXP(playerId, amount, source = 'unknown', options = {}) {
        const player = this.players.get(playerId);
        if (!player) return { success: false, reason: 'Player not found' };
        
        if (player.level >= this.config.maxLevel) {
            return { success: false, reason: 'Max level reached' };
        }
        
        // Apply source multiplier
        const sourceMultiplier = this.config.xpSources[source] || 1.0;
        let finalXP = amount * sourceMultiplier;
        
        // Apply global XP multipliers
        const multiplier = this.xpMultipliers.get(playerId) || 1.0;
        finalXP *= multiplier;
        
        // Apply rested XP bonus (50% extra)
        let restedBonus = 0;
        if (player.restedXP > 0) {
            const restedAmount = Math.min(finalXP * 0.5, player.restedXP);
            restedBonus = restedAmount;
            player.restedXP -= restedAmount;
            finalXP += restedBonus;
        }
        
        // Award XP
        player.xp += finalXP;
        player.totalXP += finalXP;
        
        // Update statistics
        const stats = this.stats.get(playerId);
        stats.totalXPGained += finalXP;
        stats.xpBySource[source] = (stats.xpBySource[source] || 0) + finalXP;
        
        // Check for level up
        const levelUps = this.checkLevelUp(playerId);
        
        // UI feedback
        if (this.ui) {
            this.ui.showXPGain(playerId, Math.floor(finalXP), restedBonus > 0);
        }
        
        return {
            success: true,
            xpGained: finalXP,
            restedBonus: restedBonus,
            currentXP: player.xp,
            currentLevel: player.level,
            leveledUp: levelUps.length > 0,
            newLevels: levelUps
        };
    }
    
    /**
     * Check and process level ups
     */
    checkLevelUp(playerId) {
        const player = this.players.get(playerId);
        if (!player) return [];
        
        const levelUps = [];
        const levelUpTime = Date.now();
        
        while (player.level < this.config.maxLevel) {
            const xpRequired = this.getXPRequired(player.level);
            
            if (player.xp >= xpRequired) {
                player.xp -= xpRequired;
                player.level++;
                
                // Award stat and skill points
                player.statPoints += this.config.statPointsPerLevel;
                player.skillPoints += this.config.skillPointsPerLevel;
                
                // Check for milestones
                const milestone = this.config.milestones[player.level];
                if (milestone && !player.milestones.includes(player.level)) {
                    player.milestones.push(player.level);
                    levelUps.push({
                        level: player.level,
                        milestone: milestone,
                        hasMilestone: true
                    });
                } else {
                    levelUps.push({
                        level: player.level,
                        hasMilestone: false
                    });
                }
                
                // Update statistics
                const stats = this.stats.get(playerId);
                stats.levelsGained++;
                
                // Level up effects
                this.onLevelUp(playerId, player.level, milestone);
            } else {
                break;
            }
        }
        
        return levelUps;
    }
    
    /**
     * Handle level up event
     */
    onLevelUp(playerId, newLevel, milestone) {
        // Visual effects
        if (this.ui) {
            this.ui.showLevelUpEffect(playerId, newLevel, milestone);
        }
        
        // Audio
        if (this.audio) {
            if (milestone) {
                this.audio.playSFX('level_up_milestone');
            } else {
                this.audio.playSFX('level_up');
            }
        }
        
        // Broadcast event
        this.emit('levelUp', {
            playerId,
            level: newLevel,
            milestone: milestone || null
        });
    }
    
    /**
     * Set XP multiplier for a player
     */
    setXPMultiplier(playerId, multiplier, duration = null) {
        this.xpMultipliers.set(playerId, multiplier);
        
        if (duration) {
            setTimeout(() => {
                this.xpMultipliers.delete(playerId);
            }, duration);
        }
    }
    
    /**
     * Update rested XP for returning player
     */
    updateRestedXP(playerId) {
        const player = this.players.get(playerId);
        if (!player) return;
        
        const offlineTime = Date.now() - player.lastLogout;
        const minutesOffline = offlineTime / 60000;
        
        const restedGained = Math.min(
            minutesOffline * this.restedXPRate,
            this.maxRestedXP - player.restedXP
        );
        
        player.restedXP += restedGained;
        
        return {
            restedXP: player.restedXP,
            restedGained: restedGained,
            minutesOffline: Math.floor(minutesOffline)
        };
    }
    
    /**
     * Create or join a party for XP sharing
     */
    createParty(leaderId, members = []) {
        const partyId = `party_${Date.now()}_${leaderId}`;
        this.parties.set(partyId, {
            id: partyId,
            leader: leaderId,
            members: [leaderId, ...members],
            xpShareMode: 'equal', // equal, contribution, level-based
            xpBonus: 1.0 + (members.length * 0.05) // 5% bonus per member
        });
        return partyId;
    }
    
    /**
     * Award XP to party with sharing
     */
    awardPartyXP(partyId, amount, source = 'combat') {
        const party = this.parties.get(partyId);
        if (!party) return;
        
        const totalXP = amount * party.xpBonus;
        const xpPerMember = totalXP / party.members.length;
        
        const results = [];
        for (const memberId of party.members) {
            const result = this.awardXP(memberId, xpPerMember, source);
            results.push({ memberId, ...result });
        }
        
        return results;
    }
    
    /**
     * Get player level info
     */
    getLevelInfo(playerId) {
        const player = this.players.get(playerId);
        if (!player) return null;
        
        const xpRequired = this.getXPRequired(player.level);
        const xpProgress = player.xp / xpRequired;
        const nextMilestone = Object.keys(this.config.milestones)
            .map(Number)
            .find(level => level > player.level);
        
        return {
            level: player.level,
            xp: player.xp,
            totalXP: player.totalXP,
            xpRequired: xpRequired,
            xpProgress: xpProgress,
            percentComplete: Math.floor(xpProgress * 100),
            statPoints: player.statPoints,
            skillPoints: player.skillPoints,
            restedXP: player.restedXP,
            nextMilestone: nextMilestone,
            milestoneReward: nextMilestone ? this.config.milestones[nextMilestone] : null,
            isMaxLevel: player.level >= this.config.maxLevel
        };
    }
    
    /**
     * Get player statistics
     */
    getStatistics(playerId) {
        return this.stats.get(playerId);
    }
    
    /**
     * Save player data
     */
    savePlayerData(playerId) {
        const player = this.players.get(playerId);
        if (!player) return null;
        
        player.lastLogout = Date.now();
        
        return {
            level: player.level,
            xp: player.xp,
            totalXP: player.totalXP,
            statPoints: player.statPoints,
            skillPoints: player.skillPoints,
            restedXP: player.restedXP,
            lastLogout: player.lastLogout,
            milestones: player.milestones
        };
    }
    
    /**
     * Event emitter
     */
    emit(event, data) {
        // Integration point for other systems
        if (typeof this.onEvent === 'function') {
            this.onEvent(event, data);
        }
    }
}
