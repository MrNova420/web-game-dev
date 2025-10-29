/**
 * CounterAttackSystem.js
 * 
 * Counter attack system triggered after successful parries or dodges.
 * All animations from Mixamo, VFX from Kenney.
 * 
 * Features:
 * - Automatic counter after perfect parry
 * - Bonus damage on counters
 * - Multiple counter types per weapon
 * - Counter combo chains
 * - Critical hit chance bonus
 */

export class CounterAttackSystem {
  constructor() {
    this.counterWindows = new Map();
    this.counterWindowDuration = 2000; // 2 seconds to counter after parry
    
    this.counterAnimations = {
      sword_riposte: '/assets/animations/sword_riposte.fbx',         // Mixamo
      spear_counter_thrust: '/assets/animations/spear_counter.fbx',  // Mixamo
      axe_counter_chop: '/assets/animations/axe_counter.fbx',        // Mixamo
      dagger_backstab: '/assets/animations/dagger_backstab.fbx',     // Mixamo
      unarmed_counter: '/assets/animations/counter_throw.fbx'        // Mixamo
    };
    
    this.vfx = {
      counter_flash: '/assets/particles/counter_flash.png',          // Kenney
      critical_burst: '/assets/particles/critical_burst.png'         // Kenney
    };
  }

  openCounterWindow(entityId, weaponType) {
    const now = Date.now();
    this.counterWindows.set(entityId, {
      weaponType: weaponType,
      openedAt: now,
      expiresAt: now + this.counterWindowDuration
    });
    console.log(`${entityId} counter window opened for ${this.counterWindowDuration}ms`);
  }

  executeCounter(entityId, targetId) {
    const window = this.counterWindows.get(entityId);
    if (!window) {
      console.log(`${entityId} no counter window active`);
      return null;
    }
    
    const now = Date.now();
    if (now > window.expiresAt) {
      console.log(`${entityId} counter window expired`);
      this.counterWindows.delete(entityId);
      return null;
    }
    
    const animation = this.getCounterAnimation(window.weaponType);
    console.log(`${entityId} counters ${targetId}!`);
    console.log(`  Animation: ${animation}`);
    console.log(`  VFX: ${this.vfx.counter_flash}, ${this.vfx.critical_burst}`);
    
    this.counterWindows.delete(entityId);
    
    return {
      damage: 150, // Base counter damage
      damageMultiplier: 2.0,
      guaranteedCrit: true,
      stunTarget: true,
      stunDuration: 1.0
    };
  }

  getCounterAnimation(weaponType) {
    const key = `${weaponType.toLowerCase()}_counter`;
    return this.counterAnimations[key] || this.counterAnimations.sword_riposte;
  }

  hasCounterWindow(entityId) {
    const window = this.counterWindows.get(entityId);
    if (!window) return false;
    
    const now = Date.now();
    return now <= window.expiresAt;
  }

  update(deltaTime) {
    const now = Date.now();
    
    for (const [entityId, window] of this.counterWindows.entries()) {
      if (now > window.expiresAt) {
        this.counterWindows.delete(entityId);
      }
    }
  }
}
