import { logger } from '../core/Logger.js';
/**
 * ResourceGatheringSystem.js - Phase 4
 * Mining, herbalism, fishing, and logging.
 */

export class ResourceGatheringSystem {
  constructor() {
    this.resources = {
      iron_ore: { model: '/assets/models/resources/iron_ore.glb', icon: '/assets/icons/resources/iron.png' },     // Quaternius + game-icons.net
      herb: { model: '/assets/models/resources/herb.glb', icon: '/assets/icons/resources/herb.png' },             // Quaternius + game-icons.net
      tree: { model: '/assets/models/resources/tree.glb', icon: '/assets/icons/resources/wood.png' }              // Quaternius + game-icons.net
    };
    this.animations = {
      mining: '/assets/animations/mining.fbx',                      // Mixamo
      herb_gathering: '/assets/animations/gather.fbx',              // Mixamo
      chopping: '/assets/animations/axe_chop.fbx'                   // Mixamo
    };
  }

  gatherResource(playerId, resourceType) {
    logger.info(`${playerId} gathering ${resourceType}`);
    logger.info(`  Animation: ${this.animations.mining}`);
  }
}
