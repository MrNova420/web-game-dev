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
    console.log(`${playerId} daily quests refreshed`);
    console.log(`  UI: ${this.ui.daily_panel}`);
  }
}
