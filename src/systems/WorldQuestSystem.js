import { logger } from '../core/Logger.js';
/**
 * WorldQuestSystem.js - Phase 4
 */
export class WorldQuestSystem {
  constructor() {
    this.worldQuests = new Map();
    this.icons = { world_quest: '/assets/icons/quests/world_quest.png' };  // game-icons.net
  }
  spawnWorldQuest(regionId) { logger.info(`World quest in ${regionId}`); }
}
