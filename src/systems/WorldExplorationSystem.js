/**
 * WorldExplorationSystem.js - Phase 4
 * Open world exploration with fog of war and discovery.
 * All environments from Quaternius, icons from game-icons.net.
 */

export class WorldExplorationSystem {
  constructor() {
    this.discoveredRegions = new Map();
    this.fogOfWar = new Map();
    this.regions = {
      mystic_forest: { model: '/assets/models/regions/forest.glb', icon: '/assets/icons/regions/forest.png' },   // Quaternius + game-icons.net
      frozen_peaks: { model: '/assets/models/regions/mountains.glb', icon: '/assets/icons/regions/mountains.png' }, // Quaternius + game-icons.net
      desert_wastes: { model: '/assets/models/regions/desert.glb', icon: '/assets/icons/regions/desert.png' }     // Quaternius + game-icons.net
    };
  }

  discoverRegion(playerId, regionId) {
    logger.info(`${playerId} discovered: ${regionId}`);
    logger.info(`  Model: ${this.regions[regionId].model}`);
  }
}
