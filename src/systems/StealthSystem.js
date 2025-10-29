/**
 * StealthSystem.js
 * Stealth mechanics with detection radius and backstab bonuses.
 * Mixamo stealth animations + Kenney VFX.
 */

export class StealthSystem {
  constructor() {
    this.stealthedEntities = new Map();
    this.animations = {
      enter_stealth: '/assets/animations/stealth_enter.fbx',        // Mixamo
      stealth_idle: '/assets/animations/crouch_idle.fbx',           // Mixamo
      stealth_walk: '/assets/animations/crouch_walk.fbx',           // Mixamo
      backstab: '/assets/animations/backstab.fbx'                   // Mixamo
    };
    this.vfx = {
      vanish: '/assets/particles/smoke_puff.png',                   // Kenney
      detected: '/assets/particles/exclamation.png'                 // Kenney
    };
  }

  enterStealth(entityId) {
    console.log(`${entityId} enters stealth`);
    console.log(`  Animation: ${this.animations.enter_stealth}`);
    console.log(`  VFX: ${this.vfx.vanish}`);
    this.stealthedEntities.set(entityId, { detectionRadius: 5, backstabReady: true });
  }

  exitStealth(entityId) {
    console.log(`${entityId} exits stealth`);
    this.stealthedEntities.delete(entityId);
  }

  isStealthed(entityId) {
    return this.stealthedEntities.has(entityId);
  }
}
