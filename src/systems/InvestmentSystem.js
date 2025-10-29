/**
 * InvestmentSystem.js - Phase 6
 */
export class InvestmentSystem {
  constructor() { this.investments = new Map(); }
  invest(playerId, target, amount) { console.log(`${playerId} invested ${amount} in ${target}`); }
}
