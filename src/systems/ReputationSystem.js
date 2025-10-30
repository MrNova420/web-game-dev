/**
 * ReputationSystem.js
 * Faction reputation with rewards and ranks.
 * All icons from game-icons.net, UI from Kenney.
 */

export class ReputationSystem {
  constructor() {
    this.reputations = new Map();
    this.factions = ['ALLIANCE', 'HORDE', 'MERCHANTS_GUILD', 'MAGES_CIRCLE', 'THIEVES_DEN'];
    this.ranks = ['HATED', 'HOSTILE', 'UNFRIENDLY', 'NEUTRAL', 'FRIENDLY', 'HONORED', 'REVERED', 'EXALTED'];
    this.ui = {
      reputation_panel: '/assets/ui/reputation/faction_panel.png'   // Kenney UI Pack
    };
  }

  gainReputation(playerId, faction, amount) {
    console.log(`${playerId} gained ${amount} reputation with ${faction}`);
  }

  update(delta) {
    // Modernized for v3.0.0
  }
}
