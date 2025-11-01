import { logger } from '../core/Logger.js';
/**
 * InvestmentSystem.js - Phase 6
 */
export class InvestmentSystem {
  constructor() { this.investments = new Map(); }
  invest(playerId, target, amount) { logger.info(`${playerId} invested ${amount} in ${target}`); }
}
