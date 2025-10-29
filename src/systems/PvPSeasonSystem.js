/**
 * PvPSeasonSystem.js - Phase 7
 * Competitive PvP seasons with rewards.
 */

export class PvPSeasonSystem {
  constructor() {
    this.seasons = new Map();
    this.rewardModels = {
      gladiator_mount: '/assets/models/mounts/gladiator_mount.glb',     // Quaternius
      seasonal_armor: '/assets/models/armor/season_1_pvp.glb'           // Sketchfab Free
    };
  }
  startSeason(seasonId) { console.log(`PvP Season ${seasonId} started`); }
}
