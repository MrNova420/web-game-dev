/**
 * LoanSystem.js - Phase 6
 */
export class LoanSystem {
  constructor() { this.loans = new Map(); }
  takeLoan(playerId, amount) { logger.info(`${playerId} took loan: ${amount}`); }
}
