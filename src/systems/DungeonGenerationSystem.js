/**
 * DungeonGenerationSystem.js - Phase 4
 * Procedural dungeon generation.
 */

export class DungeonGenerationSystem {
  constructor() {
    this.dungeonTilesets = {
      crypt: '/assets/models/dungeons/crypt_tileset.glb',           // Quaternius
      cave: '/assets/models/dungeons/cave_tileset.glb'              // Quaternius
    };
  }

  generateDungeon(type, difficulty) {
    console.log(`Generating ${type} dungeon (difficulty: ${difficulty})`);
    console.log(`  Tileset: ${this.dungeonTilesets[type]}`);
  }
}
