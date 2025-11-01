import { logger } from '../core/Logger.js';
/**
 * PropertyTradingSystem.js - Phase 6
 */
export class PropertyTradingSystem {
  constructor() { this.properties = new Map(); }
  buyProperty(playerId, propertyId) { logger.info(`${playerId} bought property ${propertyId}`); }
}
