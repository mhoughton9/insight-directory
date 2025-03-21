const { User, Resource, Teacher, Tradition } = require('../models');

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
      const { clerkId } = req.query;
      
      if (!clerkId) {
        return res.status(400).json({
          success: false,
          message: 'Clerk ID is required'
        });
      }
      
      // Find user by Clerk ID
      const user = await User.findOne({ clerkId })
        .populate('favoriteResources', 'title type slug imageUrl')
        .populate('favoriteTeachers', 'name slug imageUrl')
        .populate('favoriteTraditions', 'name slug');
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      res.status(200).json({
        success: true,
        user
      });
    } catch (error) {
      console.error('Error getting user profile:', error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving user profile',
        error: error.message
      });
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
        return res.status(400).json({
          success: false,
          message: 'Clerk ID is required'
        });
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
        
        return res.status(200).json({
          success: true,
          message: 'User profile updated successfully',
          user
        });
      } else {
        // Create new user
        user = await User.create(userData);
        
        return res.status(201).json({
          success: true,
          message: 'User profile created successfully',
          user
        });
      }
    } catch (error) {
      console.error('Error creating/updating user profile:', error);
      res.status(400).json({
        success: false,
        message: 'Error creating/updating user profile',
        error: error.message
      });
    }
  },

  /**
   * Sync user from Clerk
   * @route POST /api/users/sync
   */
  syncUser: async (req, res) => {
    try {
      const userData = req.body;
      
      if (!userData.clerkId || !userData.email) {
        return res.status(400).json({
          success: false,
          message: 'Clerk ID and email are required'
        });
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
        
        return res.status(200).json({
          success: true,
          message: 'User synced successfully',
          user
        });
      } else {
        // Create new user
        user = await User.create(userData);
        
        return res.status(201).json({
          success: true,
          message: 'User created successfully',
          user
        });
      }
    } catch (error) {
      console.error('Error syncing user:', error);
      res.status(400).json({
        success: false,
        message: 'Error syncing user',
        error: error.message
      });
    }
  },
  
  /**
   * Get user favorites
   * @route GET /api/users/favorites
   */
  getUserFavorites: async (req, res) => {
    try {
      const { clerkId } = req.query;
      
      if (!clerkId) {
        return res.status(400).json({
          success: false,
          message: 'Clerk ID is required'
        });
      }
      
      // Find user by Clerk ID
      const user = await User.findOne({ clerkId });
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      // Return favorites
      res.status(200).json({
        success: true,
        favorites: {
          resources: user.favoriteResources || [],
          teachers: user.favoriteTeachers || [],
          traditions: user.favoriteTraditions || []
        }
      });
    } catch (error) {
      console.error('Error getting user favorites:', error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving user favorites',
        error: error.message
      });
    }
  },
  
  /**
   * Toggle favorite status for a resource, teacher, or tradition
   * @route POST /api/users/favorites
   */
  toggleFavorite: async (req, res) => {
    try {
      const { clerkId, type, id, action } = req.body;
      
      if (!clerkId || !type || !id || !action) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: clerkId, type, id, or action'
        });
      }
      
      if (!['add', 'remove'].includes(action)) {
        return res.status(400).json({
          success: false,
          message: 'Action must be either "add" or "remove"'
        });
      }
      
      // Validate type
      if (!['resource', 'teacher', 'tradition'].includes(type)) {
        return res.status(400).json({
          success: false,
          message: 'Type must be one of: resource, teacher, tradition'
        });
      }
      
      // Determine which field to update based on type
      let fieldToUpdate;
      let modelToCheck;
      
      switch (type) {
        case 'resource':
          fieldToUpdate = 'favoriteResources';
          modelToCheck = Resource;
          break;
        case 'teacher':
          fieldToUpdate = 'favoriteTeachers';
          modelToCheck = Teacher;
          break;
        case 'tradition':
          fieldToUpdate = 'favoriteTraditions';
          modelToCheck = Tradition;
          break;
      }
      
      // Check if the item exists
      const itemExists = await modelToCheck.exists({ _id: id });
      
      if (!itemExists) {
        return res.status(404).json({
          success: false,
          message: `${type.charAt(0).toUpperCase() + type.slice(1)} not found`
        });
      }
      
      // Find user by Clerk ID
      let user = await User.findOne({ clerkId });
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      // Update operation based on action
      const updateOperation = action === 'add' ? { $addToSet: { [fieldToUpdate]: id } } : { $pull: { [fieldToUpdate]: id } };
      
      // Update user favorites
      user = await User.findOneAndUpdate(
        { clerkId },
        updateOperation,
        { new: true }
      );
      
      // Return updated favorites
      res.status(200).json({
        success: true,
        message: `${type} ${action === 'add' ? 'added to' : 'removed from'} favorites`,
        favorites: {
          resources: user.favoriteResources || [],
          teachers: user.favoriteTeachers || [],
          traditions: user.favoriteTraditions || []
        }
      });
    } catch (error) {
      console.error('Error toggling favorite:', error);
      res.status(500).json({
        success: false,
        message: 'Error toggling favorite',
        error: error.message
      });
    }
  }
};

module.exports = userController;
