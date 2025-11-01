import { logger } from '../core/Logger.js';
/**
 * ErrorReportingSystem.js - Phase 8+ Polish
 * Automated error reporting and crash handling.
 */

export class ErrorReportingSystem {
  constructor() { this.errorLog = []; }
  logError(error) { logger.info(`Error logged: ${error.message}`); this.errorLog.push(error); }
}
