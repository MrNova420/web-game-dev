/**
 * StatisticsTracker.js
 * Comprehensive player statistics tracking.
 * All UI from Kenney + game-icons.net.
 */

export class StatisticsTracker {
  constructor() {
    this.stats = new Map();
    this.trackedStats = [
      'total_damage_dealt', 'total_healing_done', 'enemies_defeated',
      'bosses_killed', 'quests_completed', 'items_crafted', 'gold_earned',
      'deaths', 'playtime_hours', 'distance_traveled'
    ];
    this.ui = {
      stats_panel: '/assets/ui/stats/statistics_panel.png'          // Kenney UI Pack
    };
  }

  incrementStat(playerId, statName, amount = 1) {
    const key = `${playerId}_${statName}`;
    const current = this.stats.get(key) || 0;
    this.stats.set(key, current + amount);
  }
}
