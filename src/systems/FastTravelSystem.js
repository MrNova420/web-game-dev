/**
 * FastTravelSystem.js - Phase 4
 * Fast travel waypoints and teleportation.
 */

export class FastTravelSystem {
  constructor() {
    this.waypoints = new Map();
    this.ui = { map: '/assets/ui/travel/world_map.png' };           // Kenney UI Pack
    this.vfx = { teleport: '/assets/particles/teleport.png' };      // Kenney
  }

  teleport(playerId, waypointId) {
    console.log(`${playerId} teleporting to ${waypointId}`);
    console.log(`  VFX: ${this.vfx.teleport}`);
  }
}
