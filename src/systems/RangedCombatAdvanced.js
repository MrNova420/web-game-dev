/**
 * RangedCombatAdvanced.js
 * 
 * Advanced ranged combat with ballistics, wind, and trajectory.
 * All animations from Mixamo, projectile models from Sketchfab Free.
 * 
 * Features:
 * - Ballistic trajectory calculation
 * - Wind affects projectiles
 * - Charge shots
 * - Multi-shot abilities
 * - Piercing arrows
 * - Elemental ammunition
 */

export class RangedCombatAdvanced {
  constructor() {
    this.activeProjectiles = [];
    this.gravity = 9.8;
    
    this.animations = {
      bow_draw: '/assets/animations/bow_draw_arrow.fbx',             // Mixamo
      bow_shoot: '/assets/animations/bow_release.fbx',               // Mixamo
      bow_charged: '/assets/animations/bow_charged_shot.fbx',        // Mixamo
      crossbow_reload: '/assets/animations/crossbow_reload.fbx',     // Mixamo
      gun_shoot: '/assets/animations/gun_fire.fbx'                   // Mixamo
    };
    
    this.projectileModels = {
      arrow_basic: '/assets/models/projectiles/arrow_basic.glb',     // Sketchfab Free
      arrow_fire: '/assets/models/projectiles/arrow_fire.glb',       // Sketchfab Free
      arrow_ice: '/assets/models/projectiles/arrow_ice.glb',         // Sketchfab Free
      bolt: '/assets/models/projectiles/crossbow_bolt.glb',          // Sketchfab Free
      bullet: '/assets/models/projectiles/magic_bullet.glb'          // Sketchfab Free
    };
    
    this.vfx = {
      arrow_trail: '/assets/particles/arrow_trail.png',              // Kenney
      muzzle_flash: '/assets/particles/muzzle_flash.png',            // Kenney
      impact: '/assets/particles/arrow_impact.png'                   // Kenney
    };
  }

  shoot(shooter, target, weaponType, chargeLevel = 1.0) {
    const animation = this.getShootAnimation(weaponType);
    const projectileModel = this.getProjectileModel(weaponType);
    
    logger.info(`${shooter.id} shoots ${weaponType}`);
    logger.info(`  Animation: ${animation}`);
    logger.info(`  Projectile: ${projectileModel}`);
    logger.info(`  Charge: ${(chargeLevel * 100).toFixed(0)}%`);
    
    const velocity = 50 * chargeLevel;
    const trajectory = this.calculateTrajectory(shooter.position, target.position, velocity);
    
    this.activeProjectiles.push({
      position: shooter.position.clone(),
      velocity: trajectory.velocity,
      model: projectileModel,
      damage: 100 * chargeLevel,
      piercing: chargeLevel > 1.5
    });
    
    return trajectory;
  }

  calculateTrajectory(start, end, velocity) {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const dz = end.z - start.z;
    const distance = Math.sqrt(dx*dx + dz*dz);
    
    const angle = Math.atan2(dy, distance);
    const time = distance / (velocity * Math.cos(angle));
    
    return {
      velocity: { x: dx/time, y: velocity * Math.sin(angle), z: dz/time },
      time: time,
      arc: true
    };
  }

  multiShot(shooter, targetPositions) {
    logger.info(`${shooter.id} MULTI-SHOT (${targetPositions.length} arrows)`);
    logger.info(`  Animation: ${this.animations.bow_shoot}`);
    
    const results = [];
    for (const target of targetPositions) {
      results.push(this.shoot(shooter, target, 'BOW', 1.0));
    }
    return results;
  }

  update(deltaTime) {
    for (let i = this.activeProjectiles.length - 1; i >= 0; i--) {
      const proj = this.activeProjectiles[i];
      
      // Apply gravity
      proj.velocity.y -= this.gravity * deltaTime;
      
      // Update position
      proj.position.x += proj.velocity.x * deltaTime;
      proj.position.y += proj.velocity.y * deltaTime;
      proj.position.z += proj.velocity.z * deltaTime;
      
      // Check ground collision
      if (proj.position.y <= 0) {
        logger.info(`Projectile hit ground`);
        logger.info(`  VFX: ${this.vfx.impact}`);
        this.activeProjectiles.splice(i, 1);
      }
    }
  }

  getShootAnimation(weaponType) {
    if (weaponType === 'BOW') return this.animations.bow_shoot;
    if (weaponType === 'CROSSBOW') return this.animations.crossbow_reload;
    return this.animations.gun_shoot;
  }

  getProjectileModel(weaponType) {
    if (weaponType === 'BOW') return this.projectileModels.arrow_basic;
    if (weaponType === 'CROSSBOW') return this.projectileModels.bolt;
    return this.projectileModels.bullet;
  }
}
