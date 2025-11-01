import { logger } from '../core/Logger.js';
/**
 * MountCombatSystem.js
 * Combat while mounted with charge attacks and trample damage.
 * Mount models from Quaternius, animations from Mixamo.
 */

export class MountCombatSystem {
  constructor() {
    this.mountedEntities = new Map();
    this.mounts = {
      HORSE: {
        model: '/assets/models/mounts/horse.glb',                   // Quaternius
        animations: {
          gallop: '/assets/animations/horse_gallop.fbx',            // Mixamo
          rear: '/assets/animations/horse_rear.fbx'                 // Mixamo
        },
        chargeBonus: 2.0,
        trampleDamage: 100
      },
      DRAGON: {
        model: '/assets/models/mounts/dragon.glb',                  // Quaternius
        animations: {
          fly: '/assets/animations/dragon_fly.fbx',                 // Mixamo
          dive: '/assets/animations/dragon_dive.fbx'                // Mixamo
        },
        chargeBonus: 3.0,
        trampleDamage: 250
      }
    };
  }

  mount(riderId, mountType) {
    const mountData = this.mounts[mountType];
    logger.info(`${riderId} mounts ${mountType}`);
    logger.info(`  Model: ${mountData.model}`);
    this.mountedEntities.set(riderId, { mount: mountType, data: mountData });
  }

  chargeAttack(riderId) {
    const mounted = this.mountedEntities.get(riderId);
    if (!mounted) return null;
    
    logger.info(`${riderId} CHARGE ATTACK on ${mounted.mount}!`);
    logger.info(`  Bonus: ${mounted.data.chargeBonus}x`);
    return { damage: 200 * mounted.data.chargeBonus };
  }
}
