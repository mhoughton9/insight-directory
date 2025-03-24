const { User, Resource, Teacher, Tradition } = require('../models');
const apiResponse = require('../utils/api-response');
const favoritesService = require('../services/favorites-service');

/**
 * User controller for handling user-related operations
 */
const userController = {
  /**
   * Get user profile
   * @route GET /api/users/profile
   */
  getUserProfile: async (req, res) => {
    try {
      // The user ID would come from the authenticated user via Clerk
      const { clerkId } = req;
      
      if (!clerkId) {
        return res.status(400).json(
          apiResponse.error({
            statusCode: 400,
            message: 'Clerk ID is required'
          })
        );
      }
      
      // Find user by Clerk ID
      const user = await User.findOne({ clerkId })
        .populate('favoriteResources', 'title type slug imageUrl')
        .populate('favoriteTeachers', 'name slug imageUrl')
        .populate('favoriteTraditions', 'name slug');
      
      if (!user) {
        return res.status(404).json(
          apiResponse.error({
            statusCode: 404,
            message: 'User not found'
          })
        );
      }
      
      res.status(200).json(
        apiResponse.success({
          message: 'User profile retrieved successfully',
          data: { user }
        })
      );
    } catch (error) {
      console.error('Error getting user profile:', error);
      res.status(500).json(
        apiResponse.error({
          message: 'Error retrieving user profile',
          error: error.message
        })
      );
    }
  },
  
  /**
   * Create or update user profile
   * @route POST /api/users/profile
   */
  createOrUpdateUser: async (req, res) => {
    try {
      const userData = req.body;
      
      if (!userData.clerkId) {
        return res.status(400).json(
          apiResponse.error({
            statusCode: 400,
            message: 'Clerk ID is required'
          })
        );
      }
      
      // Check if user exists
      let user = await User.findOne({ clerkId: userData.clerkId });
      
      if (user) {
        // Update existing user
        user = await User.findOneAndUpdate(
          { clerkId: userData.clerkId },
          userData,
          { new: true, runValidators: true }
        );
        
        return res.status(200).json(
          apiResponse.success({
            message: 'User profile updated successfully',
            data: { user }
          })
        );
      } else {
        // Create new user
        user = await User.create(userData);
        
        return res.status(201).json(
          apiResponse.success({
            statusCode: 201,
            message: 'User profile created successfully',
            data: { user }
          })
        );
      }
    } catch (error) {
      console.error('Error creating/updating user profile:', error);
      res.status(400).json(
        apiResponse.error({
          statusCode: 400,
          message: 'Error creating/updating user profile',
          error: error.message
        })
      );
    }
  },

  /**
   * Sync user from Clerk
   * @route POST /api/users/sync
   */
  syncUser: async (req, res) => {
    try {
      const userData = req.body;
      
      if (!userData.clerkId) {
        return res.status(400).json(
          apiResponse.error({
            statusCode: 400,
            message: 'Clerk ID is required'
          })
        );
      }
      
      // Check if user exists
      let user = await User.findOne({ clerkId: userData.clerkId });
      
      if (user) {
        // Update existing user with any new data
        user = await User.findOneAndUpdate(
          { clerkId: userData.clerkId },
          userData,
          { new: true, runValidators: true }
        );
        
        return res.status(200).json(
          apiResponse.success({
            message: 'User synced successfully',
            data: { user }
          })
        );
      } else {
        // Create new user
        user = await User.create(userData);
        
        return res.status(201).json(
          apiResponse.success({
            statusCode: 201,
            message: 'User created successfully',
            data: { user }
          })
        );
      }
    } catch (error) {
      console.error('Error syncing user:', error);
      res.status(400).json(
        apiResponse.error({
          statusCode: 400,
          message: 'Error syncing user',
          error: error.message
        })
      );
    }
  },
  
  /**
   * Get user favorites
   * @route GET /api/users/favorites
   */
  getUserFavorites: async (req, res) => {
    const { clerkId } = req;
    const result = await favoritesService.getUserFavorites(clerkId);
    
    return res.status(result.statusCode || (result.success ? 200 : 500)).json(
      result.success 
        ? {
            success: true,
            message: 'Favorites retrieved successfully',
            favorites: result.favorites
          }
        : apiResponse.error({
            statusCode: result.statusCode,
            message: result.message,
            error: result.error
          })
    );
  },
  
  /**
   * Toggle favorite status for a resource, teacher, or tradition
   * @route POST /api/users/favorites
   */
  toggleFavorite: async (req, res) => {
    const { clerkId, type, id, action } = req.body;
    
    console.log('Toggle favorite request:', { clerkId, type, id, action });
    
    const result = await favoritesService.toggleFavorite({ clerkId, type, id, action });
    
    return res.status(result.statusCode || (result.success ? 200 : 500)).json(
      result.success 
        ? {
            success: true,
            message: result.message,
            favorites: result.favorites
          }
        : apiResponse.error({
            statusCode: result.statusCode,
            message: result.message,
            error: result.error
          })
    );
  }
};

module.exports = userController;
