/**
 * BountyHunterSystem.js - Phase 6
 */
export class BountyHunterSystem {
  constructor() { this.bounties = new Map(); this.ui = { board: '/assets/ui/bounty/bounty_board.png' }; }  // Kenney
  postBounty(targetId, reward) { console.log(`Bounty posted: ${targetId} - ${reward} gold`); }
}
