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
   * Add a resource to user favorites
   * @route POST /api/users/favorites/resources/:resourceId
   */
  addResourceToFavorites: async (req, res) => {
    try {
      const { resourceId } = req.params;
      const { clerkId } = req.body;
      
      if (!clerkId) {
        return res.status(400).json({
          success: false,
          message: 'Clerk ID is required'
        });
      }
      
      // Check if resource exists
      const resourceExists = await Resource.exists({ _id: resourceId });
      
      if (!resourceExists) {
        return res.status(404).json({
          success: false,
          message: 'Resource not found'
        });
      }
      
      // Add resource to user favorites
      const user = await User.findOneAndUpdate(
        { clerkId },
        { $addToSet: { favoriteResources: resourceId } },
        { new: true }
      );
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'Resource added to favorites',
        favoriteResources: user.favoriteResources
      });
    } catch (error) {
      console.error('Error adding resource to favorites:', error);
      res.status(500).json({
        success: false,
        message: 'Error adding resource to favorites',
        error: error.message
      });
    }
  },
  
  /**
   * Remove a resource from user favorites
   * @route DELETE /api/users/favorites/resources/:resourceId
   */
  removeResourceFromFavorites: async (req, res) => {
    try {
      const { resourceId } = req.params;
      const { clerkId } = req.body;
      
      if (!clerkId) {
        return res.status(400).json({
          success: false,
          message: 'Clerk ID is required'
        });
      }
      
      // Remove resource from user favorites
      const user = await User.findOneAndUpdate(
        { clerkId },
        { $pull: { favoriteResources: resourceId } },
        { new: true }
      );
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'Resource removed from favorites',
        favoriteResources: user.favoriteResources
      });
    } catch (error) {
      console.error('Error removing resource from favorites:', error);
      res.status(500).json({
        success: false,
        message: 'Error removing resource from favorites',
        error: error.message
      });
    }
  },
  
  /**
   * Add a teacher to user favorites
   * @route POST /api/users/favorites/teachers/:teacherId
   */
  addTeacherToFavorites: async (req, res) => {
    try {
      const { teacherId } = req.params;
      const { clerkId } = req.body;
      
      if (!clerkId) {
        return res.status(400).json({
          success: false,
          message: 'Clerk ID is required'
        });
      }
      
      // Check if teacher exists
      const teacherExists = await Teacher.exists({ _id: teacherId });
      
      if (!teacherExists) {
        return res.status(404).json({
          success: false,
          message: 'Teacher not found'
        });
      }
      
      // Add teacher to user favorites
      const user = await User.findOneAndUpdate(
        { clerkId },
        { $addToSet: { favoriteTeachers: teacherId } },
        { new: true }
      );
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'Teacher added to favorites',
        favoriteTeachers: user.favoriteTeachers
      });
    } catch (error) {
      console.error('Error adding teacher to favorites:', error);
      res.status(500).json({
        success: false,
        message: 'Error adding teacher to favorites',
        error: error.message
      });
    }
  },
  
  /**
   * Remove a teacher from user favorites
   * @route DELETE /api/users/favorites/teachers/:teacherId
   */
  removeTeacherFromFavorites: async (req, res) => {
    try {
      const { teacherId } = req.params;
      const { clerkId } = req.body;
      
      if (!clerkId) {
        return res.status(400).json({
          success: false,
          message: 'Clerk ID is required'
        });
      }
      
      // Remove teacher from user favorites
      const user = await User.findOneAndUpdate(
        { clerkId },
        { $pull: { favoriteTeachers: teacherId } },
        { new: true }
      );
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'Teacher removed from favorites',
        favoriteTeachers: user.favoriteTeachers
      });
    } catch (error) {
      console.error('Error removing teacher from favorites:', error);
      res.status(500).json({
        success: false,
        message: 'Error removing teacher from favorites',
        error: error.message
      });
    }
  },
  
  /**
   * Add a tradition to user favorites
   * @route POST /api/users/favorites/traditions/:traditionId
   */
  addTraditionToFavorites: async (req, res) => {
    try {
      const { traditionId } = req.params;
      const { clerkId } = req.body;
      
      if (!clerkId) {
        return res.status(400).json({
          success: false,
          message: 'Clerk ID is required'
        });
      }
      
      // Check if tradition exists
      const traditionExists = await Tradition.exists({ _id: traditionId });
      
      if (!traditionExists) {
        return res.status(404).json({
          success: false,
          message: 'Tradition not found'
        });
      }
      
      // Add tradition to user favorites
      const user = await User.findOneAndUpdate(
        { clerkId },
        { $addToSet: { favoriteTraditions: traditionId } },
        { new: true }
      );
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'Tradition added to favorites',
        favoriteTraditions: user.favoriteTraditions
      });
    } catch (error) {
      console.error('Error adding tradition to favorites:', error);
      res.status(500).json({
        success: false,
        message: 'Error adding tradition to favorites',
        error: error.message
      });
    }
  },
  
  /**
   * Remove a tradition from user favorites
   * @route DELETE /api/users/favorites/traditions/:traditionId
   */
  removeTraditionFromFavorites: async (req, res) => {
    try {
      const { traditionId } = req.params;
      const { clerkId } = req.body;
      
      if (!clerkId) {
        return res.status(400).json({
          success: false,
          message: 'Clerk ID is required'
        });
      }
      
      // Remove tradition from user favorites
      const user = await User.findOneAndUpdate(
        { clerkId },
        { $pull: { favoriteTraditions: traditionId } },
        { new: true }
      );
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'Tradition removed from favorites',
        favoriteTraditions: user.favoriteTraditions
      });
    } catch (error) {
      console.error('Error removing tradition from favorites:', error);
      res.status(500).json({
        success: false,
        message: 'Error removing tradition from favorites',
        error: error.message
      });
    }
  }
};

module.exports = userController;
