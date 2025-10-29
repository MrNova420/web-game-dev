/**
 * TaxationSystem.js - Phase 6
 */
export class TaxationSystem {
  constructor() { this.taxRates = { sales: 0.05, income: 0.1 }; }
  collectTax(playerId, amount) { console.log(`${playerId} paid tax: ${amount}`); }
}
