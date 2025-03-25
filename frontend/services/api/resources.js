/**
 * Resources API service
 * Handles all API requests related to resources
 */

import apiClient from './client';

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
    
    // Use apiClient with standard options
    return apiClient.get(endpoint, options);
  },
  
  /**
   * Get a single resource by ID
   * @param {string} id - Resource ID
   * @param {Object} options - Additional request options
   * @returns {Promise<Object>} - Resource object
   */
  getById: async function(id, options = {}) {
    return apiClient.get(`resources/${id}`, options);
  },
  
  /**
   * Create a new resource
   * @param {Object} resourceData - Resource data
   * @param {Object} options - Additional request options
   * @returns {Promise<Object>} - Created resource
   */
  create: async function(resourceData, options = {}) {
    return apiClient.post('resources', resourceData, { 
      invalidateCache: true,
      ...options
    });
  },
  
  /**
   * Update an existing resource
   * @param {string} id - Resource ID
   * @param {Object} resourceData - Updated resource data
   * @param {Object} options - Additional request options
   * @returns {Promise<Object>} - Updated resource
   */
  update: async function(id, resourceData, options = {}) {
    return apiClient.put(`resources/${id}`, resourceData, { 
      invalidateCache: true,
      ...options
    });
  },
  
  /**
   * Delete a resource
   * @param {string} id - Resource ID
   * @param {Object} options - Additional request options
   * @returns {Promise<Object>} - Deletion confirmation
   */
  delete: async function(id, options = {}) {
    return apiClient.delete(`resources/${id}`, { 
      invalidateCache: true,
      ...options
    });
  },
  
  /**
   * Search resources by query
   * @param {string} query - Search query
   * @param {Object} options - Additional request options
   * @returns {Promise<Array>} - Array of matching resources
   */
  search: async function(query, options = {}) {
    return apiClient.get(`resources/search?q=${encodeURIComponent(query)}`, options);
  },
  
  /**
   * Get all available resource types
   * @param {Object} options - Additional request options
   * @returns {Promise<Array>} - Array of resource types
   */
  getResourceTypes: async function(options = {}) {
    return apiClient.get('resources/types', options);
  },
  
  /**
   * Get all available tags used in resources
   * @param {Object} options - Additional request options
   * @returns {Promise<Array>} - Array of tags
   */
  getTags: async function(options = {}) {
    return apiClient.get('resources/tags', options);
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
