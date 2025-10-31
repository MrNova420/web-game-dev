/**
 * Logger - Production-safe logging system
 * Wraps console methods and can be disabled for production
 */

export class Logger {
    constructor() {
        this.enabled = true;
        this.logLevel = 'info'; // 'debug', 'info', 'warn', 'error'
        this.isProduction = process.env.NODE_ENV === 'production';
        
        // Disable console logs in production by default
        if (this.isProduction) {
            this.enabled = false;
        }
    }
    
    setEnabled(enabled) {
        this.enabled = enabled;
    }
    
    setLogLevel(level) {
        this.logLevel = level;
    }
    
    log(...args) {
        if (this.enabled && this._shouldLog('info')) {
            logger.info(...args);
        }
    }
    
    debug(...args) {
        if (this.enabled && this._shouldLog('debug')) {
            logger.debug(...args);
        }
    }
    
    info(...args) {
        if (this.enabled && this._shouldLog('info')) {
            console.info(...args);
        }
    }
    
    warn(...args) {
        if (this.enabled && this._shouldLog('warn')) {
            logger.warn(...args);
        }
    }
    
    error(...args) {
        if (this.enabled && this._shouldLog('error')) {
            logger.error(...args);
        }
    }
    
    _shouldLog(level) {
        const levels = ['debug', 'info', 'warn', 'error'];
        const currentLevelIndex = levels.indexOf(this.logLevel);
        const messageLevelIndex = levels.indexOf(level);
        return messageLevelIndex >= currentLevelIndex;
    }
}

// Global logger instance
export const logger = new Logger();

// Convenience exports
export const log = (...args) => logger.log(...args);
export const debug = (...args) => logger.debug(...args);
export const info = (...args) => logger.info(...args);
export const warn = (...args) => logger.warn(...args);
export const error = (...args) => logger.error(...args);
