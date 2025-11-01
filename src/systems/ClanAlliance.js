import { logger } from '../core/Logger.js';
/**
 * ClanAlliance.js - Phase 5
 */
export class ClanAlliance {
  constructor() { this.alliances = new Map(); }
  formAlliance(clan1, clan2) { logger.info(`Alliance: ${clan1} + ${clan2}`); }
}
