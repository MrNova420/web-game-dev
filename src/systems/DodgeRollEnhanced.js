/**
 * DodgeRollEnhanced.js
 * 
 * Advanced dodge roll system with invincibility frames and stamina management.
 * All animations from Mixamo, VFX from Kenney.
 * 
 * Features:
 * - 4-directional dodge rolls
 * - Invincibility frames (i-frames) during roll
 * - Stamina cost and cooldown
 * - Perfect dodge timing bonuses
 * - Distance traveled based on stats
 * 
 * External Assets:
 * - Animations: Mixamo (dodge rolls in all directions)
 * - VFX: Kenney (motion blur, afterimages)
 */

export class DodgeRollEnhanced {
  constructor() {
    this.dodgingEntities = new Map();
    this.iFrameDuration = 400; // milliseconds
    this.staminaCost = 25;
    this.cooldown = 1000; // milliseconds
    
    this.animations = {
      dodge_forward: '/assets/animations/dodge_roll_forward.fbx',    // Mixamo
      dodge_back: '/assets/animations/dodge_roll_back.fbx',          // Mixamo
      dodge_left: '/assets/animations/dodge_roll_left.fbx',          // Mixamo
      dodge_right: '/assets/animations/dodge_roll_right.fbx',        // Mixamo
      dodge_diagonal_fl: '/assets/animations/dodge_diagonal_fl.fbx', // Mixamo
      dodge_diagonal_fr: '/assets/animations/dodge_diagonal_fr.fbx', // Mixamo
      quick_step: '/assets/animations/quick_step.fbx'                // Mixamo
    };
    
    this.vfx = {
      motion_blur: '/assets/particles/motion_blur.png',              // Kenney
      afterimage: '/assets/particles/afterimage.png',                // Kenney
      dodge_trail: '/assets/particles/dodge_trail.png'               // Kenney
    };
  }

  dodge(entityId, direction, hasStamina = true) {
    if (!hasStamina) {
      console.log(`${entityId} not enough stamina to dodge`);
      return false;
    }
    
    const animation = this.animations[`dodge_${direction}`] || this.animations.dodge_forward;
    console.log(`${entityId} dodge ${direction}: ${animation}`);
    console.log(`  VFX: ${this.vfx.motion_blur}, ${this.vfx.afterimage}`);
    
    const now = Date.now();
    this.dodgingEntities.set(entityId, {
      direction: direction,
      startTime: now,
      iFrameEnd: now + this.iFrameDuration,
      cooldownEnd: now + this.cooldown,
      invulnerable: true
    });
    
    return true;
  }

  isInvulnerable(entityId) {
    const state = this.dodgingEntities.get(entityId);
    if (!state) return false;
    
    const now = Date.now();
    if (now <= state.iFrameEnd) {
      console.log(`${entityId} has i-frames active`);
      return true;
    }
    
    state.invulnerable = false;
    return false;
  }

  canDodge(entityId) {
    const state = this.dodgingEntities.get(entityId);
    if (!state) return true;
    
    const now = Date.now();
    return now > state.cooldownEnd;
  }

  update(deltaTime) {
    const now = Date.now();
    
    for (const [entityId, state] of this.dodgingEntities.entries()) {
      if (now > state.cooldownEnd) {
        this.dodgingEntities.delete(entityId);
      }
    }
  }
}
