/**
 * Teachers API service
 * Handles all API requests related to teachers
 */

import apiClient from './client';

const teachersService = {
  /**
   * Get all teachers with optional filtering
   * @param {Object} filters - Query parameters for filtering
   * @param {Object} options - Additional request options
   * @returns {Promise<Array>} - Array of teachers
   */
  getAll: async function(filters = {}, options = {}) {
    // Convert filters object to query string
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) queryParams.append(key, value);
    });
    
    const queryString = queryParams.toString();
    const endpoint = `teachers${queryString ? `?${queryString}` : ''}`;
    
    return apiClient.get(endpoint, options);
  },

  /**
   * Get a single teacher by ID
   * @param {string} id - Teacher ID
   * @param {Object} options - Additional request options
   * @returns {Promise<Object>} - Teacher object
   */
  getById: async function(id, options = {}) {
    return apiClient.get(`teachers/${id}`, options);
  },

  /**
   * Create a new teacher
   * @param {Object} teacherData - Teacher data
   * @param {Object} options - Additional request options
   * @returns {Promise<Object>} - Created teacher
   */
  create: async function(teacherData, options = {}) {
    return apiClient.post('teachers', teacherData, { 
      invalidateCache: true,
      ...options
    });
  },

  /**
   * Update an existing teacher
   * @param {string} id - Teacher ID
   * @param {Object} teacherData - Updated teacher data
   * @param {Object} options - Additional request options
   * @returns {Promise<Object>} - Updated teacher
   */
  update: async function(id, teacherData, options = {}) {
    return apiClient.put(`teachers/${id}`, teacherData, { 
      invalidateCache: true,
      ...options
    });
  },

  /**
   * Delete a teacher
   * @param {string} id - Teacher ID
   * @param {Object} options - Additional request options
   * @returns {Promise<Object>} - Deletion confirmation
   */
  delete: async function(id, options = {}) {
    return apiClient.delete(`teachers/${id}`, { 
      invalidateCache: true,
      ...options
    });
  },

  /**
   * Get resources by teacher ID
   * @param {string} id - Teacher ID
   * @param {Object} options - Additional request options
   * @returns {Promise<Array>} - Array of resources by this teacher
   */
  getResources: async function(id, options = {}) {
    return apiClient.get(`teachers/${id}/resources`, options);
  },
  
  /**
   * Clear teachers cache
   * @param {string} [specificEndpoint] - Optional specific endpoint to clear
   */
  clearCache: function(specificEndpoint) {
    apiClient.clearCache(specificEndpoint ? `teachers/${specificEndpoint}` : 'teachers');
  }
};

export default teachersService;
