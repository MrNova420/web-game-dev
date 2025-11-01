import { logger } from '../core/Logger.js';
/**
 * InsuranceSystem.js - Phase 6
 */
export class InsuranceSystem {
  constructor() { this.policies = new Map(); }
  buyInsurance(playerId, type) { logger.info(`${playerId} bought ${type} insurance`); }
}
