/**
 * API client for making requests to the backend
 * Uses the fetch API with consistent error handling and caching
 */

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

/**
 * Handles API responses and errors consistently
 * @param {Response} response - The fetch Response object
 * @returns {Promise<any>} - Parsed response data
 * @throws {Error} - Throws error with message from API or status text
 */
const handleResponse = async (response) => {
  const isJson = response.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const error = new Error((data && data.message) || response.statusText);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
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
 * Creates a fetch request with common configuration
 * @param {string} url - Full URL to request
 * @param {string} method - HTTP method
 * @param {Object} options - Request options
 * @param {Object} [data] - Request payload for POST/PUT
 * @returns {Promise<Response>} - Fetch response
 */
const createRequest = async (url, method, options = {}, data = null) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options.timeout || 30000);
  
  try {
    const requestOptions = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      signal: controller.signal,
      credentials: 'same-origin',
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
    const cacheKey = generateCacheKey(endpoint, options);
    
    // Return cached response if available and valid
    if (options.cache !== false && isCacheValid(cacheKey)) {
      const cachedResponse = cache.get(cacheKey);
      return { ...cachedResponse.data, cached: true };
    }
    
    try {
      const response = await createRequest(url, 'GET', options);
      const data = await handleResponse(response);
      
      // Cache the successful response
      if (options.cache !== false) {
        cache.set(cacheKey, {
          data,
          timestamp: Date.now(),
        });
      }
      
      return { ...data, cached: false };
    } catch (error) {
      console.error(`API Error (GET ${endpoint}):`, error);
      throw error;
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
      const response = await createRequest(url, 'POST', options, data);
      const responseData = await handleResponse(response);
      
      // Clear cache for this endpoint if needed
      if (options.invalidateCache) {
        this.clearCache(endpoint);
      }
      
      return responseData;
    } catch (error) {
      console.error(`API Error (POST ${endpoint}):`, error);
      throw error;
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
      const response = await createRequest(url, 'PUT', options, data);
      const responseData = await handleResponse(response);
      
      // Clear cache for this endpoint if needed
      if (options.invalidateCache) {
        this.clearCache(endpoint);
      }
      
      return responseData;
    } catch (error) {
      console.error(`API Error (PUT ${endpoint}):`, error);
      throw error;
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
      const response = await createRequest(url, 'DELETE', options);
      const responseData = await handleResponse(response);
      
      // Clear cache for this endpoint if needed
      if (options.invalidateCache) {
        this.clearCache(endpoint);
      }
      
      return responseData;
    } catch (error) {
      console.error(`API Error (DELETE ${endpoint}):`, error);
      throw error;
    }
  },
  
  /**
   * Clear the entire cache or specific endpoints
   * @param {string} [endpoint] - Optional specific endpoint to clear
   */
  clearCache: function(endpoint) {
    if (endpoint) {
      // Clear cache for a specific endpoint
      const endpointPrefix = endpoint.toLowerCase();
      
      // Iterate through all cache keys and remove matching ones
      for (const key of cache.keys()) {
        if (key.toLowerCase().startsWith(endpointPrefix)) {
          cache.delete(key);
        }
      }
      
      console.log(`Cache cleared for endpoint: ${endpoint}`);
    } else {
      // Clear the entire cache
      cache.clear();
      console.log('Entire cache cleared');
    }
  }
};

export default apiClient;
