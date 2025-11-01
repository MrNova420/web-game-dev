import { logger } from '../core/Logger.js';
/**
 * MarketplaceSystem.js - Phase 6
 */
export class MarketplaceSystem {
  constructor() { this.shops = { vendor: { model: '/assets/models/shops/marketplace.glb' } }; this.ui = { shop: '/assets/ui/shop/shop_window.png' }; }  // Quaternius + Kenney
  buyItem(playerId, itemId) { logger.info(`${playerId} bought ${itemId}`); }
}
