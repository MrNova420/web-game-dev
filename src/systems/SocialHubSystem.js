/**
 * SocialHubSystem.js - Phase 5
 */
export class SocialHubSystem {
  constructor() { this.hub = { model: '/assets/models/social/hub.glb' }; }  // Quaternius
  enterHub(playerId) { logger.info(`${playerId} enters social hub`); }
}
