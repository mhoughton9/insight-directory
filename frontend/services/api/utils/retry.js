/**
 * Utility for retrying failed API requests with exponential backoff
 */
import { logApiError, LogLevels } from './errorHandler';

/**
 * Default retry configuration
 */
export const DEFAULT_RETRY_CONFIG = {
  maxRetries: 3,
  baseDelay: 300,
  maxDelay: 10000, // 10 seconds maximum delay
  jitter: true, // Add randomness to avoid thundering herd
  retryableStatuses: [408, 429, 500, 502, 503, 504], // Common retryable status codes
  shouldRetry: (error) => {
    // Don't retry 4xx errors (client errors) except specific ones
    if (error.status) {
      return DEFAULT_RETRY_CONFIG.retryableStatuses.includes(error.status) || 
             error.status >= 500;
    }
    // Retry network errors
    return error.name === 'TypeError' || error.name === 'AbortError';
  }
};

/**
 * Calculate delay with exponential backoff and optional jitter
 * @param {number} retryCount - Current retry attempt
 * @param {Object} options - Retry configuration
 * @returns {number} - Delay in milliseconds
 */
const calculateBackoff = (retryCount, options) => {
  // Calculate exponential backoff: 2^retry * baseDelay
  let delay = Math.pow(2, retryCount) * options.baseDelay;
  
  // Apply maximum delay cap
  delay = Math.min(delay, options.maxDelay || 30000);
  
  // Add jitter if enabled (±25% randomness)
  if (options.jitter) {
    const jitterFactor = 0.25; // 25% jitter
    const randomFactor = 1 - jitterFactor + (Math.random() * jitterFactor * 2);
    delay = Math.floor(delay * randomFactor);
  }
  
  return delay;
};

/**
 * Retry a failed API request with exponential backoff
 * @param {Function} requestFn - The request function to retry
 * @param {Object} options - Retry configuration options
 * @param {number} options.maxRetries - Maximum number of retry attempts
 * @param {number} options.baseDelay - Base delay in milliseconds
 * @param {number} options.maxDelay - Maximum delay in milliseconds
 * @param {boolean} options.jitter - Whether to add randomness to delay
 * @param {Array<number>} options.retryableStatuses - HTTP status codes that should be retried
 * @param {Function} options.shouldRetry - Function to determine if retry should be attempted
 * @param {string} options.context - Context for logging
 * @returns {Promise<any>} - Response data
 */
export const retryRequest = async (requestFn, options = {}) => {
  // Merge provided options with defaults
  const config = {
    ...DEFAULT_RETRY_CONFIG,
    ...options
  };
  
  let retries = 0;
  const context = options.context || 'API Request';
  
  const executeWithRetry = async () => {
    try {
      return await requestFn();
    } catch (error) {
      // Don't retry if we're out of retries or if shouldRetry returns false
      if (retries >= config.maxRetries || !config.shouldRetry(error)) {
        throw error;
      }
      
      // Calculate delay with exponential backoff
      const delay = calculateBackoff(retries, config);
      
      // Log retry attempt
      logApiError(
        { 
          message: `Retry attempt ${retries + 1}/${config.maxRetries}`,
          status: error.status,
          delay,
          originalError: error.message
        },
        context,
        LogLevels.WARN
      );
      
      // Wait for the calculated delay
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Increment retry counter
      retries++;
      
      // Retry the request
      return executeWithRetry();
    }
  };
  
  return executeWithRetry();
};

export default retryRequest;
