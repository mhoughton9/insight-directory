/**
 * Favorites service
 * Handles business logic for favorite operations
 */

const { User } = require('../models');
const apiResponse = require('../utils/api-response');
const { 
  isValidType, 
  isValidAction, 
  getArrayField,
  FAVORITE_ACTIONS 
} = require('../constants/favorites');

const favoritesService = {
  /**
   * Get user favorites
   * @param {string} clerkId - Clerk user ID
   * @returns {Object} User favorites or error
   */
  getUserFavorites: async (clerkId) => {
    try {
      if (!clerkId) {
        return {
          success: false,
          statusCode: 400,
          message: 'User ID is required'
        };
      }

      // Find user by clerkId
      const user = await User.findOne({ clerkId });

      if (!user) {
        return {
          success: false,
          statusCode: 404,
          message: 'User not found'
        };
      }

      // Return user favorites
      return {
        success: true,
        statusCode: 200,
        favorites: {
          resources: user.favoriteResources || [],
          teachers: user.favoriteTeachers || [],
          traditions: user.favoriteTraditions || []
        }
      };
    } catch (error) {
      console.error('Error getting user favorites:', error);
      return {
        success: false,
        statusCode: 500,
        message: 'Failed to get user favorites',
        error: error.message
      };
    }
  },

  /**
   * Toggle favorite status for a resource, teacher, or tradition
   * @param {Object} params - Toggle parameters
   * @param {string} params.clerkId - Clerk user ID
   * @param {string} params.type - Type of item (resource, teacher, tradition)
   * @param {string} params.id - ID of the item
   * @param {string} [params.action] - Action to perform (add, remove)
   * @returns {Object} Updated favorites or error
   */
  toggleFavorite: async ({ clerkId, type, id, action }) => {
    try {
      // Validate required fields
      if (!clerkId) {
        return {
          success: false,
          statusCode: 400,
          message: 'User ID is required'
        };
      }

      if (!type || !id) {
        return {
          success: false,
          statusCode: 400,
          message: 'Type and ID are required'
        };
      }

      // Validate type
      if (!isValidType(type)) {
        return {
          success: false,
          statusCode: 400,
          message: 'Invalid type'
        };
      }

      // Find user by clerkId
      let user = await User.findOne({ clerkId });

      // If user doesn't exist, create a new one
      if (!user) {
        user = new User({
          clerkId,
          favoriteResources: [],
          favoriteTeachers: [],
          favoriteTraditions: []
        });
      }

      // Determine which array to update based on type
      const arrayField = getArrayField(type);
      if (!arrayField) {
        return {
          success: false,
          statusCode: 400,
          message: 'Invalid type'
        };
      }

      // If action is not specified, determine it based on current state
      if (!action) {
        action = user[arrayField].includes(id) ? FAVORITE_ACTIONS.REMOVE : FAVORITE_ACTIONS.ADD;
      }

      // Validate action
      if (!isValidAction(action)) {
        return {
          success: false,
          statusCode: 400,
          message: 'Invalid action'
        };
      }

      // Update the array based on action
      if (action === FAVORITE_ACTIONS.ADD) {
        // Add to favorites if not already there
        if (!user[arrayField].includes(id)) {
          user[arrayField].push(id);
        }
      } else {
        // Remove from favorites
        user[arrayField] = user[arrayField].filter(itemId => String(itemId) !== String(id));
      }

      // Save the updated user
      await user.save();

      // Return updated favorites
      return {
        success: true,
        statusCode: 200,
        message: `Favorite ${action === FAVORITE_ACTIONS.ADD ? 'added' : 'removed'} successfully`,
        favorites: {
          resources: user.favoriteResources || [],
          teachers: user.favoriteTeachers || [],
          traditions: user.favoriteTraditions || []
        }
      };
    } catch (error) {
      console.error('Error toggling favorite:', error);
      return {
        success: false,
        statusCode: 500,
        message: 'Failed to update favorite',
        error: error.message
      };
    }
  }
};

module.exports = favoritesService;
