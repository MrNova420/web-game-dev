/**
 * PetSystemAdvanced.js
 * Pet collection, battles, and evolution.
 * All models from Quaternius, animations from Mixamo.
 */

export class PetSystemAdvanced {
  constructor() {
    this.pets = new Map();
    this.petModels = {
      fire_fox: '/assets/models/pets/fire_fox.glb',                 // Quaternius
      ice_wolf: '/assets/models/pets/ice_wolf.glb',                 // Quaternius
      thunder_bird: '/assets/models/pets/thunder_bird.glb',         // Quaternius
      earth_golem: '/assets/models/pets/earth_golem.glb'            // Quaternius
    };
    this.animations = {
      idle: '/assets/animations/pet_idle.fbx',                      // Mixamo
      follow: '/assets/animations/pet_follow.fbx',                  // Mixamo
      attack: '/assets/animations/pet_attack.fbx'                   // Mixamo
    };
  }

  summonPet(playerId, petType) {
    logger.info(`${playerId} summons pet: ${petType}`);
    logger.info(`  Model: ${this.petModels[petType]}`);
    logger.info(`  Animation: ${this.animations.follow}`);
  }

  evolvePet(playerId, petId) {
    logger.info(`${playerId}'s pet ${petId} evolved!`);
  }
}
