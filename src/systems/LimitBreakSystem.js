/**
 * LimitBreakSystem.js
 * Ultimate abilities charged by dealing/taking damage.
 * All animations from Mixamo, VFX from Kenney.
 */

export class LimitBreakSystem {
  constructor() {
    this.limitGauges = new Map();
    this.maxLimit = 100;
    
    this.limitBreaks = {
      OMNISLASH: {
        name: 'Omnislash',
        animation: '/assets/animations/omnislash.fbx',              // Mixamo
        vfx: '/assets/particles/omnislash_effect.png',              // Kenney
        hits: 15,
        damagePerHit: 200
      },
      METEOR: {
        name: 'Meteor',
        animation: '/assets/animations/meteor_cast.fbx',            // Mixamo
        vfx: '/assets/particles/meteor_rain.png',                   // Kenney
        aoe: true,
        radius: 20,
        damage: 5000
      },
      FINAL_HEAVEN: {
        name: 'Final Heaven',
        animation: '/assets/animations/final_heaven.fbx',           // Mixamo
        vfx: '/assets/particles/divine_impact.png',                 // Kenney
        damage: 9999,
        ignoreDefense: true
      }
    };
  }

  gainLimitCharge(entityId, amount) {
    const current = this.limitGauges.get(entityId) || 0;
    const newValue = Math.min(current + amount, this.maxLimit);
    this.limitGauges.set(entityId, newValue);
    
    if (newValue >= this.maxLimit) {
      console.log(`${entityId} LIMIT BREAK READY!`);
    }
  }

  executeLimitBreak(entityId, limitBreakName) {
    const gauge = this.limitGauges.get(entityId) || 0;
    if (gauge < this.maxLimit) {
      console.log(`${entityId} limit gauge not full (${gauge}/${this.maxLimit})`);
      return null;
    }
    
    const lb = this.limitBreaks[limitBreakName];
    console.log(`${entityId} executes ${lb.name}!`);
    console.log(`  Animation: ${lb.animation}`);
    console.log(`  VFX: ${lb.vfx}`);
    
    this.limitGauges.set(entityId, 0);
    return lb;
  }
}
