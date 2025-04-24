/**
 * API client for making requests to the backend
 * Uses the fetch API with consistent error handling and caching
 */

import { processResponse, handleApiError, logApiError, LogLevels, ErrorCodes } from './utils/errorHandler';
import retryRequest, { DEFAULT_RETRY_CONFIG } from './utils/retry';

// Base URL for API requests with trailing slash handling
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const getFullUrl = (endpoint) => {
  const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
  return `${baseUrl}/${cleanEndpoint}`;
};

// Enhanced in-memory cache with query-specific keys
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

// Default client configuration
const DEFAULT_CLIENT_CONFIG = {
  timeout: 30000, // 30 seconds default timeout
  cache: true,    // Enable caching by default
  retry: DEFAULT_RETRY_CONFIG,
  credentials: 'same-origin',
  headers: {
    'Content-Type': 'application/json'
  }
};

/**
 * Checks if a cached response is still valid
 * @param {string} cacheKey - The cache key
 * @returns {boolean} - Whether the cache is valid
 */
const isCacheValid = (cacheKey) => {
  if (!cache.has(cacheKey)) return false;
  
  const { timestamp } = cache.get(cacheKey);
  const now = Date.now();
  
  return now - timestamp < CACHE_DURATION;
};

/**
 * Generates a deterministic cache key from an endpoint and options
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Request options
 * @returns {string} - Cache key
 */
const generateCacheKey = (endpoint, options) => {
  // Create a stable representation of the options object for caching
  const stableOptions = {};
  
  // Only include relevant options in the cache key
  if (options.params) {
    stableOptions.params = { ...options.params };
  }
  
  // Sort keys for deterministic serialization
  const sortedOptions = JSON.stringify(stableOptions, Object.keys(stableOptions).sort());
  
  return `${endpoint}:${sortedOptions}`;
};

/**
 * Process API response with consistent error handling
 * @param {Response} response - Fetch response
 * @param {string} endpoint - API endpoint
 * @param {string} method - HTTP method
 * @returns {Promise<any>} - Processed response data
 */
const processApiResponse = async (response, endpoint, method) => {
  try {
    return await processResponse(response, endpoint);
  } catch (error) {
    return Promise.reject(handleApiError(error, `${method} ${endpoint}`));
  }
};

/**
 * Creates a fetch request with common configuration
 * @param {string} url - Full URL to request
 * @param {string} method - HTTP method
 * @param {Object} options - Request options
 * @param {Object} [data] - Request payload for POST/PUT
 * @returns {Promise<Response>} - Fetch response
 */
const createRequest = async (url, method, options = {}, data = null) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options.timeout || DEFAULT_CLIENT_CONFIG.timeout);
  
  try {
    // Log request in development mode
    if (process.env.NODE_ENV !== 'production') {
      logApiError(
        { message: `${method} ${url}`, data: data ? JSON.stringify(data).substring(0, 500) : null },
        'Request',
        LogLevels.DEBUG
      );
    }
    
    const requestOptions = {
      method,
      headers: {
        ...DEFAULT_CLIENT_CONFIG.headers,
        ...options.headers,
      },
      signal: controller.signal,
      credentials: options.credentials || DEFAULT_CLIENT_CONFIG.credentials,
      ...options,
    };
    
    // Add body for POST and PUT requests
    if (data && (method === 'POST' || method === 'PUT')) {
      requestOptions.body = JSON.stringify(data);
    }
    
    const response = await fetch(url, requestOptions);
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

/**
 * Execute a request with retry logic
 * @param {Function} requestFn - Function that executes the request
 * @param {string} endpoint - API endpoint for context
 * @param {string} method - HTTP method for context
 * @param {Object} options - Request options including retry configuration
 * @returns {Promise<any>} - Response data
 */
const executeWithRetry = async (requestFn, endpoint, method, options = {}) => {
  // Determine if we should use retry logic
  if (options.retry !== false) {
    const retryOptions = {
      ...DEFAULT_RETRY_CONFIG,
      ...(options.retry || {}),
      context: `${method} ${endpoint}`
    };
    
    return retryRequest(requestFn, retryOptions);
  } else {
    // Execute without retry
    return requestFn();
  }
};

/**
 * API client with methods for CRUD operations
 */
const apiClient = {
  /**
   * Check if a request is cached and valid
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options
   * @returns {boolean} - Whether the request is cached
   */
  isCacheValid: function(endpoint, options = {}) {
    const cacheKey = generateCacheKey(endpoint, options);
    return isCacheValid(cacheKey);
  },
  
  /**
   * Make a GET request to the API
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options
   * @returns {Promise<{data: any, cached: boolean}>} - Response data and cache status
   */
  get: async function(endpoint, options = {}) {
    const url = getFullUrl(endpoint);
    // Check if our custom cache flag is set to false
    const useInternalCache = options.cache !== false; 
    const cacheKey = useInternalCache ? generateCacheKey(endpoint, options) : null;
    
    // Prepare options for createRequest, removing our custom cache flag
    const requestOptions = { ...options };
    delete requestOptions.cache; // Remove our custom flag

    // Check internal cache only if useInternalCache is true
    if (useInternalCache && cacheKey && this.isCacheValid(cacheKey)) {
      const cachedResponse = cache.get(cacheKey);
      logApiError(
        { message: `Cache hit for ${endpoint}`, data: { key: cacheKey } },
        'Cache',
        LogLevels.DEBUG
      );
      return { ...cachedResponse.data, cached: true };
    }
    
    try {
      // Define the request function
      const requestFn = async () => {
        // Pass the cleaned requestOptions without the boolean cache flag
        const response = await createRequest(url, 'GET', requestOptions);
        return await processApiResponse(response, endpoint, 'GET');
      };
      
      // Execute with retry logic
      const data = await executeWithRetry(requestFn, endpoint, 'GET', requestOptions);
      
      // Store in internal cache only if useInternalCache is true
      if (useInternalCache && cacheKey) {
        cache.set(cacheKey, {
          data,
          timestamp: Date.now(),
        });
        logApiError(
          { message: `Cache set for ${endpoint}`, data: { key: cacheKey } },
          'Cache',
          LogLevels.DEBUG
        );
      }
      
      return { ...data, cached: false };
    } catch (error) {
      return Promise.reject(error);
    }
  },
  
  /**
   * Make a POST request to the API
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request payload
   * @param {Object} options - Request options
   * @returns {Promise<any>} - Response data
   */
  post: async function(endpoint, data, options = {}) {
    const url = getFullUrl(endpoint);
    
    try {
      // Define the request function
      const requestFn = async () => {
        const response = await createRequest(url, 'POST', options, data);
        return await processApiResponse(response, endpoint, 'POST');
      };
      
      // Execute with retry logic
      const responseData = await executeWithRetry(requestFn, endpoint, 'POST', options);
      
      // Clear cache for this endpoint if needed
      if (options.invalidateCache) {
        this.clearCache(endpoint);
      }
      
      return responseData;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  
  /**
   * Make a PUT request to the API
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request payload
   * @param {Object} options - Request options
   * @returns {Promise<any>} - Response data
   */
  put: async function(endpoint, data, options = {}) {
    const url = getFullUrl(endpoint);
    
    try {
      // Define the request function
      const requestFn = async () => {
        const response = await createRequest(url, 'PUT', options, data);
        return await processApiResponse(response, endpoint, 'PUT');
      };
      
      // Execute with retry logic
      const responseData = await executeWithRetry(requestFn, endpoint, 'PUT', options);
      
      // Clear cache for this endpoint if needed
      if (options.invalidateCache) {
        this.clearCache(endpoint);
      }
      
      return responseData;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  
  /**
   * Make a DELETE request to the API
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options
   * @returns {Promise<any>} - Response data
   */
  delete: async function(endpoint, options = {}) {
    const url = getFullUrl(endpoint);
    
    try {
      // Define the request function
      const requestFn = async () => {
        const response = await createRequest(url, 'DELETE', options);
        return await processApiResponse(response, endpoint, 'DELETE');
      };
      
      // Execute with retry logic
      const responseData = await executeWithRetry(requestFn, endpoint, 'DELETE', options);
      
      // Clear cache for this endpoint if needed
      if (options.invalidateCache) {
        this.clearCache(endpoint);
      }
      
      return responseData;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  
  /**
   * Clear the entire cache or specific endpoints
   * @param {string} [endpoint] - Optional specific endpoint to clear
   */
  clearCache: function(endpoint) {
    if (endpoint) {
      // Clear specific endpoint(s)
      for (const key of cache.keys()) {
        if (key.startsWith(endpoint)) {
          cache.delete(key);
        }
      }
    } else {
      // Clear entire cache
      cache.clear();
    }
  }
};

export default apiClient;
