/**
 * MountainClimbingSystem.js - Phase 4
 */
export class MountainClimbingSystem {
  constructor() {
    this.animations = { climb: '/assets/animations/climbing.fbx', jump: '/assets/animations/climb_jump.fbx' };  // Mixamo
  }
  climb(playerId) { logger.info(`${playerId} climbing`); }
}
