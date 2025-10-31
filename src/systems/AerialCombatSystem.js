import { logger } from '../core/Logger.js';
/**
 * AerialCombatSystem.js
 * Combat in the air with aerial combos and juggling.
 * All animations from Mixamo, VFX from Kenney.
 */

export class AerialCombatSystem {
  constructor() {
    this.airborneEntities = new Map();
    this.animations = {
      air_slash: '/assets/animations/air_slash.fbx',                // Mixamo
      air_combo: '/assets/animations/air_combo.fbx',                // Mixamo
      ground_slam: '/assets/animations/ground_slam.fbx'             // Mixamo
    };
    this.vfx = {
      air_trail: '/assets/particles/air_slash_trail.png',          // Kenney
      impact_crater: '/assets/particles/ground_crater.png'          // Kenney
    };
  }

  launch(entityId, targetId) {
    logger.info(`${entityId} launches ${targetId} into air!`);
    this.airborneEntities.set(targetId, { launchedBy: entityId, juggleCount: 0 });
  }

  airCombo(attackerId, targetId) {
    const airborne = this.airborneEntities.get(targetId);
    if (!airborne) return null;
    
    airborne.juggleCount++;
    logger.info(`${attackerId} AIR COMBO (${airborne.juggleCount} hits)`);
    logger.info(`  Animation: ${this.animations.air_combo}`);
    logger.info(`  VFX: ${this.vfx.air_trail}`);
    return { damage: 100 * airborne.juggleCount };
  }

  groundSlam(attackerId, targetId) {
    logger.info(`${attackerId} GROUND SLAM!`);
    logger.info(`  Animation: ${this.animations.ground_slam}`);
    logger.info(`  VFX: ${this.vfx.impact_crater}`);
    this.airborneEntities.delete(targetId);
    return { damage: 300, aoe: true, radius: 5 };
  }
}
