/**
 * ArchaeologySystem.js - Phase 4
 */
export class ArchaeologySystem {
  constructor() {
    this.artifacts = {
      ancient_relic: { model: '/assets/models/artifacts/relic.glb' },  // Sketchfab Free
      fossil: { model: '/assets/models/artifacts/fossil.glb' }  // Sketchfab Free
    };
  }
  excavate(siteId) { console.log(`Excavating site: ${siteId}`); }
}
