/**
 * TransformationSystem.js
 * Character transformations with stat boosts and new abilities.
 * Transformation models from Sketchfab Free, animations from Mixamo.
 */

export class TransformationSystem {
  constructor() {
    this.transformedEntities = new Map();
    this.transformations = {
      WEREWOLF: {
        model: '/assets/models/transformations/werewolf.glb',       // Sketchfab Free
        animations: {
          transform: '/assets/animations/werewolf_transform.fbx',   // Mixamo
          howl: '/assets/animations/werewolf_howl.fbx'              // Mixamo
        },
        damageBonus: 1.5,
        speedBonus: 1.3,
        duration: 30
      },
      DEMON_FORM: {
        model: '/assets/models/transformations/demon.glb',          // Sketchfab Free
        animations: {
          transform: '/assets/animations/demon_transform.fbx',      // Mixamo
          rampage: '/assets/animations/demon_rampage.fbx'           // Mixamo
        },
        damageBonus: 2.0,
        defenseBonus: 1.5,
        duration: 45
      }
    };
    this.vfx = {
      transform_burst: '/assets/particles/transform_burst.png',     // Kenney
      aura: '/assets/particles/power_aura.png'                      // Kenney
    };
  }

  transform(entityId, transformationType) {
    const transformData = this.transformations[transformationType];
    console.log(`${entityId} transforms into ${transformationType}!`);
    console.log(`  Model: ${transformData.model}`);
    console.log(`  Animation: ${transformData.animations.transform}`);
    console.log(`  VFX: ${this.vfx.transform_burst}, ${this.vfx.aura}`);
    
    this.transformedEntities.set(entityId, {
      type: transformationType,
      data: transformData,
      transformedAt: Date.now(),
      expiresAt: Date.now() + (transformData.duration * 1000)
    });
  }

  revertTransformation(entityId) {
    console.log(`${entityId} reverts to normal form`);
    this.transformedEntities.delete(entityId);
  }

  update(deltaTime) {
    const now = Date.now();
    for (const [entityId, state] of this.transformedEntities.entries()) {
      if (now >= state.expiresAt) {
        this.revertTransformation(entityId);
      }
    }
  }
}
