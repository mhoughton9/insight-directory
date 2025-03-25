/**
 * Traditions API service
 * Handles all API requests related to spiritual traditions
 */

import apiClient from './client';

const traditionsService = {
  /**
   * Get all traditions
   * @param {Object} filters - Optional query parameters for filtering
   * @param {Object} options - Additional request options
   * @returns {Promise<Array>} - Array of traditions
   */
  getAll: async function(filters = {}, options = {}) {
    // Convert filters object to query string
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) queryParams.append(key, value);
    });
    
    const queryString = queryParams.toString();
    const endpoint = `traditions${queryString ? `?${queryString}` : ''}`;
    
    return apiClient.get(endpoint, options);
  },

  /**
   * Get a single tradition by ID
   * @param {string} id - Tradition ID
   * @param {Object} options - Additional request options
   * @returns {Promise<Object>} - Tradition object
   */
  getById: async function(id, options = {}) {
    return apiClient.get(`traditions/${id}`, options);
  },

  /**
   * Create a new tradition
   * @param {Object} traditionData - Tradition data
   * @param {Object} options - Additional request options
   * @returns {Promise<Object>} - Created tradition
   */
  create: async function(traditionData, options = {}) {
    return apiClient.post('traditions', traditionData, { 
      invalidateCache: true,
      ...options
    });
  },

  /**
   * Update an existing tradition
   * @param {string} id - Tradition ID
   * @param {Object} traditionData - Updated tradition data
   * @param {Object} options - Additional request options
   * @returns {Promise<Object>} - Updated tradition
   */
  update: async function(id, traditionData, options = {}) {
    return apiClient.put(`traditions/${id}`, traditionData, { 
      invalidateCache: true,
      ...options
    });
  },

  /**
   * Delete a tradition
   * @param {string} id - Tradition ID
   * @param {Object} options - Additional request options
   * @returns {Promise<Object>} - Deletion confirmation
   */
  delete: async function(id, options = {}) {
    return apiClient.delete(`traditions/${id}`, { 
      invalidateCache: true,
      ...options
    });
  },

  /**
   * Get teachers associated with a tradition
   * @param {string} id - Tradition ID
   * @param {Object} options - Additional request options
   * @returns {Promise<Array>} - Array of teachers in this tradition
   */
  getTeachers: async function(id, options = {}) {
    return apiClient.get(`traditions/${id}/teachers`, options);
  },

  /**
   * Get resources associated with a tradition
   * @param {string} id - Tradition ID
   * @param {Object} options - Additional request options
   * @returns {Promise<Array>} - Array of resources in this tradition
   */
  getResources: async function(id, options = {}) {
    return apiClient.get(`traditions/${id}/resources`, options);
  },
  
  /**
   * Clear traditions cache
   * @param {string} [specificEndpoint] - Optional specific endpoint to clear
   */
  clearCache: function(specificEndpoint) {
    apiClient.clearCache(specificEndpoint ? `traditions/${specificEndpoint}` : 'traditions');
  }
};

export default traditionsService;
