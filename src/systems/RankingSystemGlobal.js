import { logger } from '../core/Logger.js';
/**
 * RankingSystemGlobal.js - Phase 5
 */
export class RankingSystemGlobal {
  constructor() { this.rankings = new Map(); this.ui = { leaderboard: '/assets/ui/ranking/leaderboard.png' }; }  // Kenney
  updateRank(playerId, score) { logger.info(`${playerId} rank updated: ${score}`); }
}
