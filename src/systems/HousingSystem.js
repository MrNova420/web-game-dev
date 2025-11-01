import { logger } from '../core/Logger.js';
/**
 * HousingSystem.js - Phase 4
 * Player housing with furniture and decorations.
 */

export class HousingSystem {
  constructor() {
    this.houses = new Map();
    this.houseModels = {
      cottage: '/assets/models/houses/cottage.glb',                 // Quaternius
      mansion: '/assets/models/houses/mansion.glb',                 // Quaternius
      castle: '/assets/models/houses/castle.glb'                    // Quaternius
    };
    this.furniture = {
      table: '/assets/models/furniture/table.glb',                  // Quaternius
      chair: '/assets/models/furniture/chair.glb',                  // Quaternius
      bed: '/assets/models/furniture/bed.glb'                       // Quaternius
    };
  }

  purchaseHouse(playerId, houseType) {
    logger.info(`${playerId} purchased ${houseType}`);
    logger.info(`  Model: ${this.houseModels[houseType]}`);
  }

  placeFurniture(houseId, furnitureType, position) {
    logger.info(`Placing ${furnitureType} in house ${houseId}`);
    logger.info(`  Model: ${this.furniture[furnitureType]}`);
  }
}
