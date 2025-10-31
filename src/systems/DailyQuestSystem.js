/**
 * DailyQuestSystem.js
 * Daily and weekly quests with reset timers.
 * All UI from Kenney + game-icons.net.
 */

export class DailyQuestSystem {
  constructor() {
    this.dailyQuests = new Map();
    this.weeklyQuests = new Map();
    this.ui = {
      daily_panel: '/assets/ui/daily/daily_quests.png',             // Kenney UI Pack
      calendar: '/assets/ui/daily/calendar_icon.png'                // Kenney UI Pack
    };
  }

  refreshDailies(playerId) {
    logger.info(`${playerId} daily quests refreshed`);
    logger.info(`  UI: ${this.ui.daily_panel}`);
  }
}
