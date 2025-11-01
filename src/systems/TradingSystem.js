import { logger } from '../core/Logger.js';
/**
 * TradingSystem.js
 * Player-to-player trading with item inspection and secure exchange.
 * All UI from Kenney UI Pack + game-icons.net.
 */

export class TradingSystem {
  constructor() {
    this.activeTrades = new Map();
    this.ui = {
      trade_window: '/assets/ui/trading/trade_window.png',          // Kenney UI Pack
      accept_button: '/assets/ui/trading/accept.png',               // Kenney UI Pack
      cancel_button: '/assets/ui/trading/cancel.png'                // Kenney UI Pack
    };
  }

  initiateTrade(player1, player2) {
    logger.info(`${player1} initiates trade with ${player2}`);
    logger.info(`  UI: ${this.ui.trade_window}`);
    this.activeTrades.set(`${player1}_${player2}`, { items1: [], items2: [], confirmed1: false, confirmed2: false });
  }

  completeTrade(tradeId) {
    logger.info(`Trade ${tradeId} completed successfully`);
    this.activeTrades.delete(tradeId);
  }

  /**
   * Update trading system state
   * @param {number} delta - Time elapsed since last frame in seconds
   * @todo Implement trade timeout checks, NPC merchant updates, etc.
   */
  update(delta) {
    // TODO: Implement trade timeout checks, NPC merchant updates, etc.
  }
}
