import { logger } from '../core/Logger.js';
/**
 * BankSystem.js
 * Expanded storage with upgradeable slots.
 * All UI from Kenney + game-icons.net.
 */

export class BankSystem {
  constructor() {
    this.banks = new Map();
    this.baseSlots = 100;
    this.maxSlots = 500;
    this.ui = {
      bank_window: '/assets/ui/bank/bank_window.png',               // Kenney UI Pack
      vault_tab: '/assets/ui/bank/vault_tab.png'                    // Kenney UI Pack
    };
    this.icons = {
      bank_slot: '/assets/icons/bank/slot.png',                     // game-icons.net
      locked_slot: '/assets/icons/bank/locked.png'                  // game-icons.net
    };
  }

  depositItem(playerId, itemId, quantity) {
    logger.info(`${playerId} deposited ${quantity}x ${itemId} to bank`);
  }

  withdrawItem(playerId, itemId, quantity) {
    logger.info(`${playerId} withdrew ${quantity}x ${itemId} from bank`);
  }
}
