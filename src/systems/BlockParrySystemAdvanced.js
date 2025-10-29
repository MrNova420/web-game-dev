/**
 * BlockParrySystemAdvanced.js
 * 
 * Advanced blocking and parrying system with perfect timing mechanics.
 * All animations from Mixamo, VFX from Kenney Particle Pack.
 * 
 * Features:
 * - Directional blocking (front, left, right, back)
 * - Perfect parry timing (200ms window)
 * - Counter opportunities after successful parry
 * - Stamina management for blocking
 * - Shield bash mechanics
 * - Guard break system
 * 
 * External Assets:
 * - Animations: Mixamo (block, parry, guard break, shield bash)
 * - VFX: Kenney Particle Pack (sparks, impact effects)
 * - Icons: game-icons.net (shield icons, parry indicators)
 */

export class BlockParrySystemAdvanced {
  constructor() {
    this.blockingEntities = new Map();
    this.parryWindows = new Map();
    this.perfectParryWindow = 200; // milliseconds
    this.blockStaminaCost = 10;
    this.parryStaminaCost = 15;
    
    this.animations = {
      block_front: '/assets/animations/shield_block_front.fbx',      // Mixamo
      block_left: '/assets/animations/shield_block_left.fbx',        // Mixamo
      block_right: '/assets/animations/shield_block_right.fbx',      // Mixamo
      parry_perfect: '/assets/animations/parry_perfect.fbx',         // Mixamo
      guard_break: '/assets/animations/guard_break.fbx',             // Mixamo
      shield_bash: '/assets/animations/shield_bash.fbx',             // Mixamo
      counter_slash: '/assets/animations/counter_attack.fbx'         // Mixamo
    };
    
    this.vfx = {
      block_sparks: '/assets/particles/block_sparks.png',            // Kenney
      parry_flash: '/assets/particles/parry_flash.png',              // Kenney
      perfect_parry: '/assets/particles/perfect_parry_burst.png',    // Kenney
      guard_shatter: '/assets/particles/guard_break_effect.png',     // Kenney
      shield_impact: '/assets/particles/shield_bash_impact.png'      // Kenney
    };
    
    this.icons = {
      blocking: '/assets/icons/combat/blocking.png',                 // game-icons.net
      parry_ready: '/assets/icons/combat/parry_ready.png',           // game-icons.net
      guard_broken: '/assets/icons/combat/guard_broken.png'          // game-icons.net
    };
  }

  startBlocking(entityId, direction = 'front') {
    const animation = this.animations[`block_${direction}`];
    console.log(`${entityId} starts blocking ${direction}: ${animation}`);
    
    this.blockingEntities.set(entityId, {
      direction: direction,
      startTime: Date.now(),
      stamina: 100,
      canParry: true
    });
  }

  attemptParry(entityId) {
    const now = Date.now();
    this.parryWindows.set(entityId, {
      startTime: now,
      endTime: now + this.perfectParryWindow
    });
    
    console.log(`${entityId} attempts parry (${this.perfectParryWindow}ms window)`);
    console.log(`  Animation: ${this.animations.parry_perfect}`);
  }

  checkParry(entityId, incomingAttackTime) {
    const parryWindow = this.parryWindows.get(entityId);
    if (!parryWindow) return { success: false };
    
    const timingDiff = Math.abs(incomingAttackTime - parryWindow.startTime);
    
    if (timingDiff <= this.perfectParryWindow) {
      console.log(`${entityId} PERFECT PARRY! (${timingDiff}ms)`);
      console.log(`  VFX: ${this.vfx.perfect_parry}`);
      this.parryWindows.delete(entityId);
      return {
        success: true,
        perfect: true,
        counterWindowOpen: true,
        damageReflected: 0.5
      };
    }
    
    return { success: false };
  }

  shieldBash(entityId, targetId) {
    console.log(`${entityId} shield bash -> ${targetId}`);
    console.log(`  Animation: ${this.animations.shield_bash}`);
    console.log(`  VFX: ${this.vfx.shield_impact}`);
    return { damage: 50, stunDuration: 1.5 };
  }

  guardBreak(attackerId, defenderId) {
    const blocking = this.blockingEntities.get(defenderId);
    if (!blocking) return false;
    
    if (blocking.stamina <= 0) {
      console.log(`${defenderId} guard broken!`);
      console.log(`  Animation: ${this.animations.guard_break}`);
      console.log(`  VFX: ${this.vfx.guard_shatter}`);
      this.blockingEntities.delete(defenderId);
      return true;
    }
    
    return false;
  }

  stopBlocking(entityId) {
    this.blockingEntities.delete(entityId);
    console.log(`${entityId} stops blocking`);
  }

  update(deltaTime) {
    const now = Date.now();
    
    // Clean up expired parry windows
    for (const [entityId, window] of this.parryWindows.entries()) {
      if (now > window.endTime) {
        this.parryWindows.delete(entityId);
      }
    }
    
    // Drain stamina for blocking entities
    for (const [entityId, state] of this.blockingEntities.entries()) {
      state.stamina -= this.blockStaminaCost * deltaTime;
      if (state.stamina <= 0) {
        this.guardBreak(null, entityId);
      }
    }
  }
}
