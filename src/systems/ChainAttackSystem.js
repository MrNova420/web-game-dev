/**
 * ChainAttackSystem.js
 * Chain attacks that hit multiple enemies in sequence.
 * All animations from Mixamo, VFX from Kenney.
 */

export class ChainAttackSystem {
  constructor() {
    this.animations = {
      chain_slash: '/assets/animations/chain_slash.fbx',            // Mixamo
      chain_lightning: '/assets/animations/chain_lightning.fbx'     // Mixamo
    };
    this.vfx = {
      chain_effect: '/assets/particles/chain_lightning.png',        // Kenney
      arc_trail: '/assets/particles/electric_arc.png'               // Kenney
    };
  }

  chainAttack(attackerId, targets) {
    console.log(`${attackerId} CHAIN ATTACK (${targets.length} targets)`);
    console.log(`  Animation: ${this.animations.chain_slash}`);
    console.log(`  VFX: ${this.vfx.chain_effect}`);
    
    let damage = 100;
    const results = [];
    
    for (let i = 0; i < targets.length; i++) {
      const reducedDamage = damage * Math.pow(0.8, i); // 20% reduction per chain
      results.push({ target: targets[i], damage: Math.floor(reducedDamage) });
      console.log(`  Chain ${i+1}: ${targets[i]} takes ${Math.floor(reducedDamage)} damage`);
    }
    
    return results;
  }
}
