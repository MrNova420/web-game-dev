import { logger } from '../core/Logger.js';
/**
 * CharacterProgressionAdvanced.js
 * Advanced character progression with multiple leveling paths.
 * All UI from Kenney + game-icons.net.
 */

export class CharacterProgressionAdvanced {
  constructor() {
    this.progressionPaths = ['COMBAT', 'CRAFTING', 'GATHERING', 'SOCIAL'];
    this.maxLevel = 100;
    this.icons = {
      level_up: '/assets/icons/progression/level_up.png',           // game-icons.net
      exp_bar: '/assets/ui/progression/exp_bar.png',                // Kenney UI Pack
      prestige: '/assets/icons/progression/prestige.png'            // game-icons.net
    };
  }

  gainExperience(playerId, path, amount) {
    logger.info(`${playerId} gains ${amount} ${path} XP`);
    logger.info(`  Icon: ${this.icons.exp_bar}`);
  }

  levelUp(playerId, path) {
    logger.info(`${playerId} leveled up in ${path}!`);
    logger.info(`  Icon: ${this.icons.level_up}`);
  }
}
