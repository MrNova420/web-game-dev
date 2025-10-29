/**
 * PhotoModeSystem.js - Phase 5
 */
export class PhotoModeSystem {
  constructor() { this.filters = ['SEPIA', 'NOIR', 'VINTAGE']; this.ui = { camera: '/assets/ui/photo/camera.png' }; }  // Kenney
  takePhoto(playerId) { console.log(`${playerId} took photo`); }
}
