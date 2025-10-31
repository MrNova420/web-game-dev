/**
 * TreasureHuntingSystem.js - Phase 4
 */
export class TreasureHuntingSystem {
  constructor() {
    this.treasures = {
      chest: { model: '/assets/models/treasures/chest.glb', icon: '/assets/icons/treasure.png' },  // Quaternius + game-icons.net
      buried: { model: '/assets/models/treasures/buried.glb', vfx: '/assets/particles/dig.png' }  // Quaternius + Kenney
    };
  }
  findTreasure(playerId) { logger.info(`${playerId} found treasure!`); }
}
