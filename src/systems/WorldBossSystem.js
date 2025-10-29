/**
 * WorldBossSystem.js - Phase 4
 */
export class WorldBossSystem {
  constructor() {
    this.worldBosses = {
      dragon_king: { model: '/assets/models/bosses/dragon_king.glb', animations: '/assets/animations/dragon_*.fbx' },  // Sketchfab + Mixamo
      titan_golem: { model: '/assets/models/bosses/titan.glb', animations: '/assets/animations/golem_*.fbx' }  // Sketchfab + Mixamo
    };
  }
  spawnWorldBoss(bossId) { console.log(`World boss spawned: ${bossId}`); }
}
