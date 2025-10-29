/**
 * CaveExplorationSystem.js - Phase 4
 */
export class CaveExplorationSystem {
  constructor() {
    this.caves = { crystal_cave: { model: '/assets/models/caves/crystal_cave.glb', tileset: '/assets/models/caves/cave_tileset.glb' } };  // Quaternius
  }
  exploreCave(caveId) { console.log(`Exploring: ${caveId}`); }
}
