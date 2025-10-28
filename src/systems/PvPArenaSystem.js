/**
 * PvPArenaSystem.js
 * Phase 5.2 - PvP Arena and Competitive Combat System
 * Implements ranked matches, matchmaking, spectator mode, rewards
 * ~600 lines combining Arena, Rewards, and Duel systems
 */

export class PvPArenaSystem {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        
        // Arena modes
        this.arenaModes = {
            duel_1v1: {
                name: '1v1 Duel',
                playerCount: 2,
                timeLimit: 180000, // 3 minutes
                winCondition: 'elimination',
                mapSize: 'small'
            },
            team_2v2: {
                name: '2v2 Team Arena',
                playerCount: 4,
                timeLimit: 300000, // 5 minutes
                winCondition: 'team_elimination',
                mapSize: 'medium'
            },
            team_3v3: {
                name: '3v3 Team Arena',
                playerCount: 6,
                timeLimit: 420000, // 7 minutes
                winCondition: 'team_elimination',
                mapSize: 'large'
            },
            free_for_all: {
                name: 'Free For All',
                playerCount: 6,
                timeLimit: 600000, // 10 minutes
                winCondition: 'most_kills',
                mapSize: 'large'
            }
        };
        
        // Ranking system
        this.rankTiers = [
            { name: 'Bronze', minRating: 0, maxRating: 1000, color: 0xcd7f32 },
            { name: 'Silver', minRating: 1000, maxRating: 1500, color: 0xc0c0c0 },
            { name: 'Gold', minRating: 1500, maxRating: 2000, color: 0xffd700 },
            { name: 'Platinum', minRating: 2000, maxRating: 2500, color: 0xe5e4e2 },
            { name: 'Diamond', minRating: 2500, maxRating: 3000, color: 0xb9f2ff },
            { name: 'Master', minRating: 3000, maxRating: 3500, color: 0x9d4edd },
            { name: 'Grandmaster', minRating: 3500, maxRating: 9999, color: 0xff0000 }
        ];
        
        // Player ratings
        this.playerRatings = new Map();
        
        // Active matches
        this.activeMatches = [];
        
        // Matchmaking queue
        this.matchmakingQueue = {
            duel_1v1: [],
            team_2v2: [],
            team_3v3: [],
            free_for_all: []
        };
        
        // Seasons
        this.currentSeason = {
            number: 1,
            startDate: Date.now(),
            endDate: Date.now() + (90 * 24 * 60 * 60 * 1000), // 90 days
            rewards: {
                bronze: ['bronze_mount', '1000_gold'],
                silver: ['silver_mount', '2000_gold', 'silver_title'],
                gold: ['gold_mount', '5000_gold', 'gold_title'],
                platinum: ['platinum_mount', '10000_gold', 'platinum_title'],
                diamond: ['diamond_mount', '20000_gold', 'diamond_title'],
                master: ['master_mount', '50000_gold', 'master_title', 'master_armor'],
                grandmaster: ['grandmaster_mount', '100000_gold', 'grandmaster_title', 'grandmaster_weapon']
            }
        };
        
        // Honor points system
        this.honorPoints = new Map();
        
        // PvP titles
        this.titles = {
            gladiator: { name: 'Gladiator', requirement: { wins: 100 }, bonus: { damage: 1.05 } },
            duelist: { name: 'Duelist', requirement: { duelWins: 50 }, bonus: { critChance: 0.05 } },
            warlord: { name: 'Warlord', requirement: { teamWins: 200 }, bonus: { health: 1.1 } },
            champion: { name: 'Champion', requirement: { rating: 3000 }, bonus: { allStats: 1.1 } },
            legend: { name: 'Legend', requirement: { grandmasterSeasons: 3 }, bonus: { allStats: 1.15 } }
        };
        
        // Player titles earned
        this.playerTitles = new Map();
        
        // Duel system
        this.pendingDuels = [];
        this.activeDuels = [];
        
        // Spectator system
        this.spectators = new Map(); // matchId -> [spectatorIds]
        
        console.log('⚔️ PvPArenaSystem initialized');
    }
    
    /**
     * Queue for matchmaking
     */
    queueForMatch(playerId, mode) {
        if (!this.arenaModes[mode]) {
            return { success: false, reason: 'invalid_mode' };
        }
        
        // Check if already in queue
        if (this.isPlayerInQueue(playerId)) {
            return { success: false, reason: 'already_in_queue' };
        }
        
        // Get player rating
        const rating = this.getPlayerRating(playerId);
        
        // Add to queue
        this.matchmakingQueue[mode].push({
            playerId,
            rating,
            queueTime: Date.now()
        });
        
        console.log(`🎮 Player ${playerId} queued for ${mode} (Rating: ${rating})`);
        
        // Try to find match
        this.tryMatchmaking(mode);
        
        return { success: true, queuePosition: this.matchmakingQueue[mode].length };
    }
    
    /**
     * Try to create matches from queue
     */
    tryMatchmaking(mode) {
        const modeConfig = this.arenaModes[mode];
        const queue = this.matchmakingQueue[mode];
        
        if (queue.length < modeConfig.playerCount) return;
        
        // Sort by rating
        queue.sort((a, b) => a.rating - b.rating);
        
        // Find best match (closest ratings)
        const players = [];
        for (let i = 0; i < modeConfig.playerCount && queue.length > 0; i++) {
            players.push(queue.shift());
        }
        
        // Create match
        this.createMatch(mode, players);
    }
    
    /**
     * Create arena match
     */
    createMatch(mode, players) {
        const modeConfig = this.arenaModes[mode];
        
        const match = {
            id: `match_${Date.now()}`,
            mode,
            config: modeConfig,
            players: players.map(p => ({
                id: p.playerId,
                rating: p.rating,
                kills: 0,
                deaths: 0,
                damage: 0,
                healing: 0,
                team: mode.includes('team') ? (Math.random() > 0.5 ? 'red' : 'blue') : null
            })),
            startTime: Date.now(),
            endTime: null,
            status: 'active',
            winner: null
        };
        
        // Assign teams for team modes
        if (mode.includes('team')) {
            const half = Math.floor(players.length / 2);
            match.players.forEach((player, index) => {
                player.team = index < half ? 'red' : 'blue';
            });
        }
        
        this.activeMatches.push(match);
        
        console.log(`🏟️ Match created: ${modeConfig.name} (${players.length} players)`);
        
        return match;
    }
    
    /**
     * Challenge player to duel
     */
    challengeToDuel(challengerId, targetId, wager = 0) {
        // Check if target is busy
        if (this.isPlayerInMatch(targetId) || this.isPlayerInQueue(targetId)) {
            return { success: false, reason: 'target_busy' };
        }
        
        const duel = {
            id: `duel_${Date.now()}`,
            challenger: challengerId,
            target: targetId,
            wager,
            status: 'pending',
            timestamp: Date.now(),
            expiresAt: Date.now() + 60000 // 1 minute to accept
        };
        
        this.pendingDuels.push(duel);
        
        console.log(`⚔️ Duel challenge sent from ${challengerId} to ${targetId} (Wager: ${wager})`);
        
        return { success: true, duelId: duel.id };
    }
    
    /**
     * Accept duel challenge
     */
    acceptDuel(duelId, targetId) {
        const duel = this.pendingDuels.find(d => d.id === duelId && d.target === targetId);
        
        if (!duel) {
            return { success: false, reason: 'duel_not_found' };
        }
        
        if (Date.now() > duel.expiresAt) {
            return { success: false, reason: 'duel_expired' };
        }
        
        // Remove from pending
        this.pendingDuels = this.pendingDuels.filter(d => d.id !== duelId);
        
        // Create duel match
        const match = this.createMatch('duel_1v1', [
            { playerId: duel.challenger, rating: this.getPlayerRating(duel.challenger) },
            { playerId: duel.target, rating: this.getPlayerRating(duel.target) }
        ]);
        
        match.wager = duel.wager;
        match.isDuel = true;
        
        this.activeDuels.push(match);
        
        console.log(`⚔️ Duel accepted! ${duel.challenger} vs ${duel.target}`);
        
        return { success: true, matchId: match.id };
    }
    
    /**
     * End match and calculate rewards
     */
    endMatch(matchId, winnerId) {
        const match = this.activeMatches.find(m => m.id === matchId);
        if (!match) return;
        
        match.status = 'completed';
        match.endTime = Date.now();
        match.winner = winnerId;
        
        // Calculate rating changes
        match.players.forEach(player => {
            const won = player.id === winnerId || 
                        (match.config.winCondition === 'team_elimination' && 
                         match.players.find(p => p.id === winnerId)?.team === player.team);
            
            this.updateRating(player.id, won, match.players.map(p => p.rating));
        });
        
        // Award honor points
        const honorGained = this.calculateHonorPoints(match, winnerId);
        this.awardHonorPoints(winnerId, honorGained);
        
        // Handle wager for duels
        if (match.isDuel && match.wager > 0) {
            const loserId = match.players.find(p => p.id !== winnerId)?.id;
            console.log(`💰 ${winnerId} wins ${match.wager} gold from ${loserId}`);
        }
        
        // Check for title unlocks
        this.checkTitleUnlocks(winnerId);
        
        console.log(`🏆 Match ended! Winner: ${winnerId}`);
        
        return {
            winner: winnerId,
            honorGained,
            ratingChange: this.getPlayerRating(winnerId)
        };
    }
    
    /**
     * Update player rating (ELO-based)
     */
    updateRating(playerId, won, opponentRatings) {
        const currentRating = this.getPlayerRating(playerId);
        const avgOpponentRating = opponentRatings.reduce((a, b) => a + b, 0) / opponentRatings.length;
        
        const K = 32; // K-factor
        const expectedScore = 1 / (1 + Math.pow(10, (avgOpponentRating - currentRating) / 400));
        const actualScore = won ? 1 : 0;
        
        const ratingChange = Math.floor(K * (actualScore - expectedScore));
        const newRating = Math.max(0, currentRating + ratingChange);
        
        this.playerRatings.set(playerId, newRating);
        
        console.log(`📊 ${playerId} rating: ${currentRating} → ${newRating} (${ratingChange > 0 ? '+' : ''}${ratingChange})`);
    }
    
    /**
     * Get player rating
     */
    getPlayerRating(playerId) {
        return this.playerRatings.get(playerId) || 1000; // Default 1000
    }
    
    /**
     * Get player rank tier
     */
    getPlayerRank(playerId) {
        const rating = this.getPlayerRating(playerId);
        return this.rankTiers.find(tier => rating >= tier.minRating && rating <= tier.maxRating) || this.rankTiers[0];
    }
    
    /**
     * Calculate honor points
     */
    calculateHonorPoints(match, winnerId) {
        const baseHonor = 100;
        const matchTypeMultiplier = match.config.playerCount / 2;
        const winnerRank = this.getPlayerRank(winnerId);
        const rankBonus = this.rankTiers.indexOf(winnerRank) * 10;
        
        return Math.floor(baseHonor * matchTypeMultiplier + rankBonus);
    }
    
    /**
     * Award honor points
     */
    awardHonorPoints(playerId, amount) {
        const current = this.honorPoints.get(playerId) || 0;
        this.honorPoints.set(playerId, current + amount);
        
        console.log(`🏅 ${playerId} earned ${amount} honor points (Total: ${current + amount})`);
    }
    
    /**
     * Check and unlock titles
     */
    checkTitleUnlocks(playerId) {
        const stats = this.getPlayerStats(playerId);
        
        Object.entries(this.titles).forEach(([id, title]) => {
            if (this.meetsRequirement(stats, title.requirement)) {
                if (!this.hasTitle(playerId, id)) {
                    this.unlockTitle(playerId, id);
                }
            }
        });
    }
    
    /**
     * Check if player meets requirement
     */
    meetsRequirement(stats, requirement) {
        return Object.entries(requirement).every(([key, value]) => {
            return stats[key] >= value;
        });
    }
    
    /**
     * Unlock title for player
     */
    unlockTitle(playerId, titleId) {
        if (!this.playerTitles.has(playerId)) {
            this.playerTitles.set(playerId, []);
        }
        
        this.playerTitles.get(playerId).push(titleId);
        
        const title = this.titles[titleId];
        console.log(`🏆 ${playerId} unlocked title: ${title.name}!`);
    }
    
    /**
     * Check if player has title
     */
    hasTitle(playerId, titleId) {
        return this.playerTitles.get(playerId)?.includes(titleId) || false;
    }
    
    /**
     * Join match as spectator
     */
    joinAsSpectator(spectatorId, matchId) {
        const match = this.activeMatches.find(m => m.id === matchId);
        if (!match || match.status !== 'active') {
            return { success: false, reason: 'match_not_available' };
        }
        
        if (!this.spectators.has(matchId)) {
            this.spectators.set(matchId, []);
        }
        
        this.spectators.get(matchId).push(spectatorId);
        
        console.log(`👁️ ${spectatorId} is now spectating match ${matchId}`);
        
        return { success: true, match };
    }
    
    /**
     * Get player stats
     */
    getPlayerStats(playerId) {
        const matches = this.activeMatches.filter(m => 
            m.players.some(p => p.id === playerId)
        );
        
        let wins = 0;
        let duelWins = 0;
        let teamWins = 0;
        
        matches.forEach(match => {
            if (match.winner === playerId) {
                wins++;
                if (match.isDuel) duelWins++;
                if (match.config.winCondition === 'team_elimination') teamWins++;
            }
        });
        
        return {
            wins,
            duelWins,
            teamWins,
            rating: this.getPlayerRating(playerId),
            honor: this.honorPoints.get(playerId) || 0
        };
    }
    
    /**
     * Check if player is in queue
     */
    isPlayerInQueue(playerId) {
        return Object.values(this.matchmakingQueue).some(queue =>
            queue.some(p => p.playerId === playerId)
        );
    }
    
    /**
     * Check if player is in match
     */
    isPlayerInMatch(playerId) {
        return this.activeMatches.some(match =>
            match.status === 'active' && match.players.some(p => p.id === playerId)
        );
    }
    
    /**
     * Get leaderboard
     */
    getLeaderboard(limit = 100) {
        const rankings = Array.from(this.playerRatings.entries())
            .map(([playerId, rating]) => ({
                playerId,
                rating,
                rank: this.getPlayerRank(playerId),
                stats: this.getPlayerStats(playerId)
            }))
            .sort((a, b) => b.rating - a.rating)
            .slice(0, limit);
        
        return rankings;
    }
    
    /**
     * End season and distribute rewards
     */
    endSeason() {
        console.log(`🏆 Season ${this.currentSeason.number} ended!`);
        
        // Distribute rewards based on final rankings
        this.playerRatings.forEach((rating, playerId) => {
            const rank = this.getPlayerRank(playerId);
            const rewards = this.currentSeason.rewards[rank.name.toLowerCase()];
            
            if (rewards) {
                console.log(`🎁 ${playerId} received season rewards: ${rewards.join(', ')}`);
            }
        });
        
        // Start new season
        this.currentSeason = {
            number: this.currentSeason.number + 1,
            startDate: Date.now(),
            endDate: Date.now() + (90 * 24 * 60 * 60 * 1000),
            rewards: this.currentSeason.rewards
        };
        
        // Soft reset ratings (move towards 1000)
        this.playerRatings.forEach((rating, playerId) => {
            const newRating = Math.floor((rating + 1000) / 2);
            this.playerRatings.set(playerId, newRating);
        });
    }
    
    /**
     * Update system
     */
    update(deltaTime) {
        // Clean up expired duel challenges
        this.pendingDuels = this.pendingDuels.filter(d => Date.now() < d.expiresAt);
        
        // Check for season end
        if (Date.now() >= this.currentSeason.endDate) {
            this.endSeason();
        }
    }
    
    /**
     * Get system state
     */
    getState() {
        return {
            activeMatches: this.activeMatches.filter(m => m.status === 'active').length,
            queuedPlayers: Object.values(this.matchmakingQueue).reduce((sum, q) => sum + q.length, 0),
            currentSeason: this.currentSeason.number,
            seasonTimeRemaining: this.currentSeason.endDate - Date.now()
        };
    }
}
