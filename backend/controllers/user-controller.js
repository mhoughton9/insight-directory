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
      const { clerkId } = req;
      
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
      const { clerkId } = req;
      
      if (!clerkId) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
      }

      // Find user by clerkId
      const user = await User.findOne({ clerkId });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Return user favorites
      return res.status(200).json({
        success: true,
        favorites: {
          resources: user.favoriteResources || [],
          teachers: user.favoriteTeachers || [],
          traditions: user.favoriteTraditions || []
        }
      });
    } catch (error) {
      console.error('Error getting user favorites:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to get user favorites'
      });
    }
  },
  
  /**
   * Toggle favorite status for a resource, teacher, or tradition
   * @route POST /api/users/favorites
   */
  toggleFavorite: async (req, res) => {
    try {
      const { clerkId, type, id } = req.body;
      let { action } = req.body;

      console.log('Toggle favorite request:', { clerkId, type, id, action });

      // Validate required fields
      if (!clerkId) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
      }

      if (!type || !id) {
        return res.status(400).json({
          success: false,
          message: 'Type and ID are required'
        });
      }

      // Validate type
      const validTypes = ['resource', 'teacher', 'tradition'];
      if (!validTypes.includes(type)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid type'
        });
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
      let arrayField;
      switch (type) {
        case 'resource':
          arrayField = 'favoriteResources';
          break;
        case 'teacher':
          arrayField = 'favoriteTeachers';
          break;
        case 'tradition':
          arrayField = 'favoriteTraditions';
          break;
      }

      // If action is not specified, determine it based on current state
      if (!action) {
        action = user[arrayField].includes(id) ? 'remove' : 'add';
      }

      // Validate action
      if (action !== 'add' && action !== 'remove') {
        return res.status(400).json({
          success: false,
          message: 'Invalid action'
        });
      }

      // Update the array based on action
      if (action === 'add') {
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

      console.log('Updated user favorites:', {
        resources: user.favoriteResources,
        teachers: user.favoriteTeachers,
        traditions: user.favoriteTraditions
      });

      // Return updated favorites
      return res.status(200).json({
        success: true,
        message: `Favorite ${action === 'add' ? 'added' : 'removed'} successfully`,
        favorites: {
          resources: user.favoriteResources || [],
          teachers: user.favoriteTeachers || [],
          traditions: user.favoriteTraditions || []
        }
      });
    } catch (error) {
      console.error('Error toggling favorite:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update favorite',
        error: error.message
      });
    }
  }
};

module.exports = userController;
