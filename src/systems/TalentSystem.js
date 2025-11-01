import { logger } from '../core/Logger.js';
/**
 * TalentSystem.js
 * Passive talent bonuses and specializations.
 * All icons from game-icons.net.
 */

export class TalentSystem {
  constructor() {
    this.talents = new Map();
    this.maxTalentPoints = 50;
    this.icons = {
      talent_point: '/assets/icons/talents/talent_point.png',       // game-icons.net
      reset_talents: '/assets/icons/talents/reset.png'              // game-icons.net
    };
  }

  allocateTalent(playerId, talentId) {
    logger.info(`${playerId} allocated talent: ${talentId}`);
    logger.info(`  Icon: ${this.icons.talent_point}`);
  }

  update(delta) {
    // Modernized for v3.0.0
  }
}
