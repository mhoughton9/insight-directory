/**
 * Utility for standardized API responses
 */

const apiResponse = {
  /**
   * Create a success response
   * @param {Object} options - Response options
   * @param {number} [options.statusCode=200] - HTTP status code
   * @param {string} [options.message='Success'] - Success message
   * @param {Object} [options.data={}] - Response data
   * @returns {Object} Formatted success response
   */
  success: ({ statusCode = 200, message = 'Success', data = {} }) => ({
    success: true,
    message,
    ...data
  }),

  /**
   * Create an error response
   * @param {Object} options - Response options
   * @param {number} [options.statusCode=500] - HTTP status code
   * @param {string} [options.message='An error occurred'] - Error message
   * @param {Object} [options.error={}] - Error details
   * @returns {Object} Formatted error response
   */
  error: ({ statusCode = 500, message = 'An error occurred', error = {} }) => ({
    success: false,
    message,
    error: typeof error === 'string' ? { message: error } : error
  })
};

module.exports = apiResponse;
