import { logger } from '../core/Logger.js';
/**
 * BattlegroundSystem.js - Phase 5
 */
export class BattlegroundSystem {
  constructor() {
    this.battlegrounds = { warsong: { model: '/assets/models/pvp/warsong_gulch.glb' } };  // Quaternius
  }
  joinBattleground(playerId, bgId) { logger.info(`${playerId} joins ${bgId}`); }
}
