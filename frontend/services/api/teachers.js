/**
 * Teachers API service
 * Handles all API requests related to teachers
 */

import apiClient from './client';

const teachersService = {
  /**
   * Get all teachers with optional filtering
   * @param {Object} filters - Query parameters for filtering
   * @returns {Promise<Array>} - Array of teachers
   */
  getAll: async function(filters = {}) {
    // Convert filters object to query string
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) queryParams.append(key, value);
    });
    
    const queryString = queryParams.toString();
    const endpoint = `teachers${queryString ? `?${queryString}` : ''}`;
    
    return apiClient.get(endpoint);
  },

  /**
   * Get a single teacher by ID
   * @param {string} id - Teacher ID
   * @returns {Promise<Object>} - Teacher object
   */
  getById: async function(id) {
    return apiClient.get(`teachers/${id}`);
  },

  /**
   * Create a new teacher
   * @param {Object} teacherData - Teacher data
   * @returns {Promise<Object>} - Created teacher
   */
  create: async function(teacherData) {
    return apiClient.post('teachers', teacherData, { invalidateCache: true });
  },

  /**
   * Update an existing teacher
   * @param {string} id - Teacher ID
   * @param {Object} teacherData - Updated teacher data
   * @returns {Promise<Object>} - Updated teacher
   */
  update: async function(id, teacherData) {
    return apiClient.put(`teachers/${id}`, teacherData, { invalidateCache: true });
  },

  /**
   * Delete a teacher
   * @param {string} id - Teacher ID
   * @returns {Promise<Object>} - Deletion confirmation
   */
  delete: async function(id) {
    return apiClient.delete(`teachers/${id}`, { invalidateCache: true });
  },

  /**
   * Get resources by teacher ID
   * @param {string} id - Teacher ID
   * @returns {Promise<Array>} - Array of resources by this teacher
   */
  getResources: async function(id) {
    return apiClient.get(`teachers/${id}/resources`);
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
