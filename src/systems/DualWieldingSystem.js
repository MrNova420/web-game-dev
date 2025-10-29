/**
 * DualWieldingSystem.js
 * 
 * Dual wielding combat system with synchronized attacks.
 * All animations from Mixamo, VFX from Kenney.
 * 
 * Features:
 * - Independent left/right hand attacks
 * - Synchronized dual strikes
 * - Cross slash finishers
 * - Alternating attack patterns
 * - Dual weapon combos
 */

export class DualWieldingSystem {
  constructor() {
    this.dualWielders = new Map();
    
    this.animations = {
      left_slash: '/assets/animations/dual_left_slash.fbx',          // Mixamo
      right_slash: '/assets/animations/dual_right_slash.fbx',        // Mixamo
      synchronized_strike: '/assets/animations/dual_sync_strike.fbx', // Mixamo
      cross_slash: '/assets/animations/dual_cross_slash.fbx',        // Mixamo
      spinning_blades: '/assets/animations/dual_spin_360.fbx',       // Mixamo
      blade_dance: '/assets/animations/dual_blade_dance.fbx'         // Mixamo
    };
    
    this.vfx = {
      left_trail: '/assets/particles/left_weapon_trail.png',         // Kenney
      right_trail: '/assets/particles/right_weapon_trail.png',       // Kenney
      cross_impact: '/assets/particles/cross_slash_x.png',           // Kenney
      blade_storm: '/assets/particles/blade_storm.png'               // Kenney
    };
  }

  attackLeft(entityId) {
    console.log(`${entityId} left hand attack`);
    console.log(`  Animation: ${this.animations.left_slash}`);
    console.log(`  VFX: ${this.vfx.left_trail}`);
    return { damage: 75, hand: 'left' };
  }

  attackRight(entityId) {
    console.log(`${entityId} right hand attack`);
    console.log(`  Animation: ${this.animations.right_slash}`);
    console.log(`  VFX: ${this.vfx.right_trail}`);
    return { damage: 75, hand: 'right' };
  }

  synchronizedStrike(entityId) {
    console.log(`${entityId} SYNCHRONIZED STRIKE`);
    console.log(`  Animation: ${this.animations.synchronized_strike}`);
    console.log(`  VFX: ${this.vfx.left_trail}, ${this.vfx.right_trail}`);
    return { damage: 180, bonus: 'Both weapons strike simultaneously' };
  }

  crossSlash(entityId) {
    console.log(`${entityId} CROSS SLASH`);
    console.log(`  Animation: ${this.animations.cross_slash}`);
    console.log(`  VFX: ${this.vfx.cross_impact}`);
    return { damage: 250, aoe: true, radius: 3 };
  }

  bladeDance(entityId) {
    console.log(`${entityId} BLADE DANCE`);
    console.log(`  Animation: ${this.animations.blade_dance}`);
    console.log(`  VFX: ${this.vfx.blade_storm}`);
    return { damage: 400, hits: 8, duration: 3.0 };
  }
}
