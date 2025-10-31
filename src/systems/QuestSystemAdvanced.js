/**
 * QuestSystemAdvanced.js
 * Advanced quest system with branching paths and dynamic objectives.
 * All UI from Kenney + game-icons.net.
 */

export class QuestSystemAdvanced {
  constructor() {
    this.activeQuests = new Map();
    this.icons = {
      quest_available: '/assets/icons/quests/available.png',        // game-icons.net
      quest_complete: '/assets/icons/quests/complete.png',          // game-icons.net
      main_quest: '/assets/icons/quests/main.png',                  // game-icons.net
      side_quest: '/assets/icons/quests/side.png'                   // game-icons.net
    };
  }

  acceptQuest(playerId, questId) {
    logger.info(`${playerId} accepted quest: ${questId}`);
    this.activeQuests.set(questId, { progress: 0, objectives: [] });
  }
}
