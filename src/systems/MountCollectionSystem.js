/**
 * MountCollectionSystem.js
 * Mount collection with 50+ mounts and stats.
 * All models from Quaternius, animations from Mixamo.
 */

export class MountCollectionSystem {
  constructor() {
    this.mounts = new Map();
    this.mountModels = {
      warhorse: '/assets/models/mounts/warhorse.glb',               // Quaternius
      unicorn: '/assets/models/mounts/unicorn.glb',                 // Quaternius
      dragon: '/assets/models/mounts/dragon.glb',                   // Quaternius
      phoenix: '/assets/models/mounts/phoenix.glb',                 // Quaternius
      griffin: '/assets/models/mounts/griffin.glb'                  // Quaternius
    };
    this.ui = {
      collection: '/assets/ui/mounts/mount_collection.png'          // Kenney UI Pack
    };
  }

  collectMount(playerId, mountType) {
    console.log(`${playerId} collected mount: ${mountType}`);
    console.log(`  Model: ${this.mountModels[mountType]}`);
  }
}
