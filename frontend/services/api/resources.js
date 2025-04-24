/**
 * Resources API service
 * Handles all API requests related to resources
 */

import apiClient from './client';

const resourcesService = {
  /**
   * Get all resources, optionally filtered and sorted.
   * Handles routing to the correct backend endpoint based on filters.
   * @param {object} filters - Filtering options (e.g., { type: 'book', featured: true })
   * @param {object} options - API client options (e.g., { cache: false, sort: 'title_asc' })
   * @returns {Promise<object>} API response
   */
  getAll: async function(filters = {}, options = {}) {
    let endpoint;
    const queryParams = new URLSearchParams();

    // Special handling: If 'type' is the main filter, use the dedicated endpoint
    // This allows us to hit the controller that doesn't paginate by default for simple type listings.
    if (filters.type && Object.keys(filters).length === 1) {
      endpoint = `resources/types/${encodeURIComponent(filters.type)}`;
      // Type is now part of the path, remove it from potential query params
      // (We'll add other potential options like 'sort' back below)
    } else {
      // For general filtering (or no filters), use the base endpoint
      endpoint = 'resources';
      // Add all filters to the query params
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });
    }

    // Add other options (like sort) to the query parameters
    if (options.sort) {
      queryParams.append('sort', options.sort);
    }

    const queryString = queryParams.toString();
    endpoint += queryString ? `?${queryString}` : '';

    // Prepare options for apiClient, removing 'sort' as it's now in the query string
    const clientOptions = { ...options };
    delete clientOptions.sort; 

    // Use apiClient with the constructed endpoint and remaining options
    return apiClient.get(endpoint, clientOptions);
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
