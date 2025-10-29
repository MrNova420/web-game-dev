/**
 * CurrencyExchangeSystem.js - Phase 6
 */
export class CurrencyExchangeSystem {
  constructor() { this.rates = { gold_to_gems: 100, gems_to_premium: 10 }; }
  exchange(playerId, from, to, amount) { console.log(`${playerId} exchanged ${from} to ${to}`); }
}
