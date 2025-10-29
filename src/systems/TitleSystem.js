/**
 * TitleSystem.js
 * Earned titles displayed above character names.
 * All icons from game-icons.net.
 */

export class TitleSystem {
  constructor() {
    this.titles = new Map();
    this.icons = {
      title_badge: '/assets/icons/titles/title_badge.png'           // game-icons.net
    };
  }

  unlockTitle(playerId, titleId) {
    console.log(`${playerId} unlocked title: ${titleId}`);
    console.log(`  Icon: ${this.icons.title_badge}`);
  }

  equipTitle(playerId, titleId) {
    console.log(`${playerId} equipped title: ${titleId}`);
  }
}
