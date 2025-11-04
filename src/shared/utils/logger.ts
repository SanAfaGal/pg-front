/**
 * Logger utility that only logs in development mode
 * Prevents console logs from appearing in production builds
 * 
 * @module shared/utils/logger
 */

/**
 * Log levels available in the logger
 */
type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug';

/**
 * Logger interface with different log level methods
 */
interface Logger {
  /** Log general information (only in dev) */
  log: (...args: unknown[]) => void;
  /** Log informational messages (only in dev) */
  info: (...args: unknown[]) => void;
  /** Log warning messages (only in dev) */
  warn: (...args: unknown[]) => void;
  /** Log error messages (always logged, even in production) */
  error: (...args: unknown[]) => void;
  /** Log debug messages (only in dev) */
  debug: (...args: unknown[]) => void;
}

/**
 * Creates a logger instance that only outputs in development mode
 * 
 * @returns Logger instance with conditional logging methods
 */
const createLogger = (): Logger => {
  const isDev = import.meta.env.DEV;

  return {
    log: (...args: unknown[]) => {
      if (isDev) {
        console.log(...args);
      }
    },
    info: (...args: unknown[]) => {
      if (isDev) {
        console.info(...args);
      }
    },
    warn: (...args: unknown[]) => {
      if (isDev) {
        console.warn(...args);
      }
    },
    error: (...args: unknown[]) => {
      // Errors should always be logged, even in production
      // but we can add additional context in dev mode
      if (isDev) {
        console.error(...args);
      } else {
        // In production, only log critical errors
        // You might want to send these to an error tracking service
        console.error(...args);
      }
    },
    debug: (...args: unknown[]) => {
      if (isDev) {
        console.debug(...args);
      }
    },
  };
};

/**
 * Global logger instance
 * Use this throughout the application instead of console.*
 */
export const logger = createLogger();

/**
 * Helper function to log API calls (only in dev mode)
 * 
 * @param method - HTTP method (GET, POST, etc.)
 * @param url - Full URL of the API endpoint
 * @param data - Optional request data payload
 */
export const logApiCall = (method: string, url: string, data?: unknown): void => {
  if (import.meta.env.DEV) {
    logger.debug(`API ${method.toUpperCase()}:`, url, data ? { data } : '');
  }
};

/**
 * Helper function to log API responses (only in dev mode)
 * 
 * @param method - HTTP method used for the request
 * @param response - Response data from the API
 */
export const logApiResponse = (method: string, response: unknown): void => {
  if (import.meta.env.DEV) {
    logger.debug(`API ${method.toUpperCase()} Response:`, response);
  }
};

