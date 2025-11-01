import { logger } from '../core/Logger.js';
/**
 * TaxationSystem.js - Phase 6
 */
export class TaxationSystem {
  constructor() { this.taxRates = { sales: 0.05, income: 0.1 }; }
  collectTax(playerId, amount) { logger.info(`${playerId} paid tax: ${amount}`); }
}
