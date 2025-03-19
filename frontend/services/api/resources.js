/**
 * Resources API service
 * Handles all API requests related to resources
 */

import apiClient from './client';

// Maximum number of retry attempts for failed requests
const MAX_RETRIES = 3;

/**
 * Retry a failed API request with exponential backoff
 * @param {Function} requestFn - The request function to retry
 * @param {number} retries - Number of retries remaining
 * @returns {Promise<any>} - Response data
 */
const retryRequest = async (requestFn, retries = MAX_RETRIES) => {
  try {
    return await requestFn();
  } catch (error) {
    // Don't retry if we're out of retries or if it's a 4xx error (client error)
    if (retries <= 0 || (error.status && error.status >= 400 && error.status < 500)) {
      throw error;
    }
    
    // Calculate delay with exponential backoff (2^retry * 300ms)
    const delay = Math.pow(2, MAX_RETRIES - retries) * 300;
    
    // Wait for the calculated delay
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Retry the request with one fewer retry remaining
    return retryRequest(requestFn, retries - 1);
  }
};

const resourcesService = {
  /**
   * Get all resources with optional filtering
   * @param {Object} filters - Query parameters for filtering
   * @param {Object} options - Additional request options
   * @returns {Promise<{resources: Array, total: number, cached: boolean}>} - Resources data with cache status
   */
  getAll: async function(filters = {}, options = {}) {
    // Convert filters object to query string
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) queryParams.append(key, value);
    });
    
    const queryString = queryParams.toString();
    const endpoint = `resources${queryString ? `?${queryString}` : ''}`;
    
    return retryRequest(() => apiClient.get(endpoint, options));
  },
  
  /**
   * Get a single resource by ID
   * @param {string} id - Resource ID
   * @param {Object} options - Additional request options
   * @returns {Promise<Object>} - Resource object
   */
  getById: async function(id, options = {}) {
    return retryRequest(() => apiClient.get(`resources/${id}`, options));
  },
  
  /**
   * Create a new resource
   * @param {Object} resourceData - Resource data
   * @returns {Promise<Object>} - Created resource
   */
  create: async function(resourceData) {
    return apiClient.post('resources', resourceData, { invalidateCache: true });
  },
  
  /**
   * Update an existing resource
   * @param {string} id - Resource ID
   * @param {Object} resourceData - Updated resource data
   * @returns {Promise<Object>} - Updated resource
   */
  update: async function(id, resourceData) {
    return apiClient.put(`resources/${id}`, resourceData, { invalidateCache: true });
  },
  
  /**
   * Delete a resource
   * @param {string} id - Resource ID
   * @returns {Promise<Object>} - Deletion confirmation
   */
  delete: async function(id) {
    return apiClient.delete(`resources/${id}`, { invalidateCache: true });
  },
  
  /**
   * Search resources by query
   * @param {string} query - Search query
   * @returns {Promise<Array>} - Array of matching resources
   */
  search: async function(query) {
    return apiClient.get(`resources/search?q=${encodeURIComponent(query)}`);
  },
  
  /**
   * Get all available resource types
   * @returns {Promise<Array>} - Array of resource types
   */
  getResourceTypes: async function() {
    return apiClient.get('resources/types');
  },
  
  /**
   * Get all available tags used in resources
   * @returns {Promise<Array>} - Array of tags
   */
  getTags: async function() {
    return apiClient.get('resources/tags');
  },
  
  /**
   * Clear resources cache
   * @param {string} [specificEndpoint] - Optional specific endpoint to clear
   */
  clearCache: function(specificEndpoint) {
    apiClient.clearCache(specificEndpoint ? `resources/${specificEndpoint}` : 'resources');
  }
};

export default resourcesService;
