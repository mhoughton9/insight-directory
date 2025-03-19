/**
 * Traditions API service
 * Handles all API requests related to spiritual traditions
 */

import apiClient from './client';

const traditionsService = {
  /**
   * Get all traditions
   * @returns {Promise<Array>} - Array of traditions
   */
  getAll: async function() {
    return apiClient.get('traditions');
  },

  /**
   * Get a single tradition by ID
   * @param {string} id - Tradition ID
   * @returns {Promise<Object>} - Tradition object
   */
  getById: async function(id) {
    return apiClient.get(`traditions/${id}`);
  },

  /**
   * Create a new tradition
   * @param {Object} traditionData - Tradition data
   * @returns {Promise<Object>} - Created tradition
   */
  create: async function(traditionData) {
    return apiClient.post('traditions', traditionData, { invalidateCache: true });
  },

  /**
   * Update an existing tradition
   * @param {string} id - Tradition ID
   * @param {Object} traditionData - Updated tradition data
   * @returns {Promise<Object>} - Updated tradition
   */
  update: async function(id, traditionData) {
    return apiClient.put(`traditions/${id}`, traditionData, { invalidateCache: true });
  },

  /**
   * Delete a tradition
   * @param {string} id - Tradition ID
   * @returns {Promise<Object>} - Deletion confirmation
   */
  delete: async function(id) {
    return apiClient.delete(`traditions/${id}`, { invalidateCache: true });
  },

  /**
   * Get teachers associated with a tradition
   * @param {string} id - Tradition ID
   * @returns {Promise<Array>} - Array of teachers in this tradition
   */
  getTeachers: async function(id) {
    return apiClient.get(`traditions/${id}/teachers`);
  },

  /**
   * Get resources associated with a tradition
   * @param {string} id - Tradition ID
   * @returns {Promise<Array>} - Array of resources in this tradition
   */
  getResources: async function(id) {
    return apiClient.get(`traditions/${id}/resources`);
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
