import { logger } from '../core/Logger.js';
/**
 * CurrencyExchangeSystem.js - Phase 6
 */
export class CurrencyExchangeSystem {
  constructor() { this.rates = { gold_to_gems: 100, gems_to_premium: 10 }; }
  exchange(playerId, from, to, amount) { logger.info(`${playerId} exchanged ${from} to ${to}`); }
}
