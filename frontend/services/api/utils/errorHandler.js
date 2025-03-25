/**
 * Centralized error handling utilities for API requests
 */

/**
 * Error codes for standardized error handling
 */
export const ErrorCodes = {
  // Network errors
  NETWORK_ERROR: 'network_error',
  TIMEOUT_ERROR: 'timeout_error',
  
  // Server errors
  SERVER_ERROR: 'server_error',
  VALIDATION_ERROR: 'validation_error',
  NOT_FOUND: 'not_found',
  UNAUTHORIZED: 'unauthorized',
  FORBIDDEN: 'forbidden',
  
  // Client errors
  BAD_REQUEST: 'bad_request',
  INVALID_PARAMS: 'invalid_params',
  
  // Unknown/other errors
  UNKNOWN_ERROR: 'unknown_error'
};

/**
 * Standard error structure for API errors
 */
export class ApiError extends Error {
  constructor(message, status, data = null, endpoint = null, code = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
    this.endpoint = endpoint;
    this.timestamp = new Date().toISOString();
    
    // Determine error code based on status if not provided
    this.code = code || this.determineErrorCode(status);
  }

  /**
   * Determines the error code based on HTTP status
   * @param {number} status - HTTP status code
   * @returns {string} - Error code
   */
  determineErrorCode(status) {
    if (!status) return ErrorCodes.UNKNOWN_ERROR;
    
    if (status >= 500) return ErrorCodes.SERVER_ERROR;
    if (status === 404) return ErrorCodes.NOT_FOUND;
    if (status === 401) return ErrorCodes.UNAUTHORIZED;
    if (status === 403) return ErrorCodes.FORBIDDEN;
    if (status === 422) return ErrorCodes.VALIDATION_ERROR;
    if (status === 400) return ErrorCodes.BAD_REQUEST;
    
    return ErrorCodes.UNKNOWN_ERROR;
  }

  /**
   * Returns a user-friendly error message
   * @returns {string} - Formatted error message
   */
  getUserMessage() {
    // Provide user-friendly messages based on status code
    if (this.status >= 500) {
      return 'The server encountered an error. Please try again later.';
    } else if (this.status === 404) {
      return 'The requested resource could not be found.';
    } else if (this.status === 401) {
      return 'You need to be logged in to perform this action.';
    } else if (this.status === 403) {
      return 'You do not have permission to perform this action.';
    } else if (this.status === 400) {
      return this.message || 'The request was invalid. Please check your input.';
    } else {
      return this.message || 'An unexpected error occurred.';
    }
  }

  /**
   * Returns a detailed error object for logging
   * @returns {Object} - Detailed error information
   */
  getLogDetails() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      code: this.code,
      endpoint: this.endpoint,
      timestamp: this.timestamp,
      data: this.data
    };
  }
}

/**
 * Process API response and handle errors consistently
 * @param {Response} response - The fetch Response object
 * @param {string} endpoint - The API endpoint that was called
 * @returns {Promise<any>} - Parsed response data
 * @throws {ApiError} - Throws ApiError with standardized structure
 */
export const processResponse = async (response, endpoint) => {
  const isJson = response.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    // Extract error details from response data if available
    const errorMessage = (data && data.message) || response.statusText;
    const errorCode = (data && data.code) || null;
    
    throw new ApiError(errorMessage, response.status, data, endpoint, errorCode);
  }

  return data;
};

/**
 * Log levels for different severity of logs
 */
export const LogLevels = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug'
};

/**
 * Log API errors with consistent format
 * @param {Error|ApiError} error - The error to log
 * @param {string} context - Additional context about where the error occurred
 * @param {string} level - Log level (error, warn, info, debug)
 */
export const logApiError = (error, context = '', level = LogLevels.ERROR) => {
  // Skip logging in production unless it's an error
  if (process.env.NODE_ENV === 'production' && level !== LogLevels.ERROR) {
    return;
  }
  
  const logData = error instanceof ApiError 
    ? error.getLogDetails()
    : {
        name: error.name,
        message: error.message,
        stack: error.stack
      };
  
  // Add request context
  const logEntry = {
    ...logData,
    context,
    level,
    environment: process.env.NODE_ENV || 'development'
  };
  
  // Only log in development environment or if it's an actual error in production
  if (process.env.NODE_ENV !== 'production' || level === LogLevels.ERROR) {
    // Log based on severity level
    switch (level) {
      case LogLevels.ERROR:
        console.error(`API Error [${context}]:`, logEntry.message);
        break;
      case LogLevels.WARN:
        console.warn(`API Warning [${context}]:`, logEntry.message);
        break;
      case LogLevels.INFO:
        console.info(`API Info [${context}]:`, logEntry.message);
        break;
      case LogLevels.DEBUG:
        // Only log debug in development
        if (process.env.NODE_ENV !== 'production') {
          console.debug(`API Debug [${context}]:`, logEntry.message);
        }
        break;
      default:
        console.error(`API Error [${context}]:`, logEntry.message);
    }
  }
  
  // Here you could add more sophisticated logging
  // For example, sending to a monitoring service like Sentry
  // if (process.env.NODE_ENV === 'production') {
  //   captureException(error, { extra: logEntry });
  // }
};

/**
 * Handle API errors with consistent behavior
 * @param {Error|ApiError} error - The error to handle
 * @param {string} context - Additional context about where the error occurred
 * @returns {Object} - Standardized error object for UI consumption
 */
export const handleApiError = (error, context = '') => {
  // Determine error type and create standardized structure
  let standardError;
  
  if (error.name === 'AbortError') {
    // Handle timeout errors
    standardError = new ApiError(
      'The request timed out. Please try again.',
      0,
      null,
      context,
      ErrorCodes.TIMEOUT_ERROR
    );
  } else if (error.name === 'TypeError' && error.message.includes('Network')) {
    // Handle network errors
    standardError = new ApiError(
      'A network error occurred. Please check your connection and try again.',
      0,
      null,
      context,
      ErrorCodes.NETWORK_ERROR
    );
  } else if (!(error instanceof ApiError)) {
    // Handle other non-API errors
    standardError = new ApiError(
      error.message || 'An unexpected error occurred.',
      0,
      null,
      context,
      ErrorCodes.UNKNOWN_ERROR
    );
  } else {
    // Use the existing ApiError
    standardError = error;
  }
  
  // Log the error
  logApiError(standardError, context);
  
  // Return a standardized error object for UI consumption
  return {
    message: standardError.getUserMessage(),
    code: standardError.code,
    status: standardError.status,
    isApiError: true,
    timestamp: standardError.timestamp,
    // Include original error details for debugging in development
    ...(process.env.NODE_ENV !== 'production' && { details: standardError.data })
  };
};

export default {
  ApiError,
  ErrorCodes,
  LogLevels,
  processResponse,
  logApiError,
  handleApiError
};
