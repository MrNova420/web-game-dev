import { logger } from '../core/Logger.js';
/**
 * CaveExplorationSystem.js - Phase 4
 */
export class CaveExplorationSystem {
  constructor() {
    this.caves = { crystal_cave: { model: '/assets/models/caves/crystal_cave.glb', tileset: '/assets/models/caves/cave_tileset.glb' } };  // Quaternius
  }
  exploreCave(caveId) { logger.info(`Exploring: ${caveId}`); }
}
