/**
 * LoanSystem.js - Phase 6
 */
export class LoanSystem {
  constructor() { this.loans = new Map(); }
  takeLoan(playerId, amount) { console.log(`${playerId} took loan: ${amount}`); }
}
