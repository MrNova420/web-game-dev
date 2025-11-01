import { logger } from '../core/Logger.js';
/**
 * UnderwaterExplorationSystem.js - Phase 4
 */
export class UnderwaterExplorationSystem {
  constructor() {
    this.animations = { swim: '/assets/animations/swimming.fbx', dive: '/assets/animations/diving.fbx' };  // Mixamo
    this.creatures = { shark: '/assets/models/underwater/shark.glb', whale: '/assets/models/underwater/whale.glb' };  // Quaternius
  }
  dive(playerId) { logger.info(`${playerId} diving`); }
}
