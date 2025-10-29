/**
 * ChallengeModeTiers.js - Phase 7
 * Tiered challenge system.
 */

export class ChallengeModeTiers {
  constructor() {
    this.tiers = { BRONZE: 1, SILVER: 2, GOLD: 3, PLATINUM: 4, DIAMOND: 5 };
    this.icons = { tier_badge: '/assets/icons/challenges/tier_badge.png' };  // game-icons.net
  }
  completeTier(playerId, tier) { console.log(`${playerId} completed ${tier} tier`); }
}
