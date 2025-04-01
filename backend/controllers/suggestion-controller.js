const { Suggestion } = require('../models');

/**
 * Suggestion Controller
 * Handles API endpoints for resource suggestions
 */
const suggestionController = {
  /**
   * Create a new resource suggestion
   * @route POST /api/suggestions
   * @access Private (authenticated users only)
   */
  createSuggestion: async (req, res) => {
    try {
      const { title, type, description, link, creator, additionalInfo } = req.body;
      
      // Basic validation
      if (!title || !type || !description) {
        return res.status(400).json({
          success: false,
          message: 'Please provide title, type, and description'
        });
      }
      
      // Get user info from Clerk authentication
      const { userId } = req.auth;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }
      
      // Create the suggestion
      const suggestion = new Suggestion({
        title,
        type,
        description,
        link,
        creator,
        additionalInfo,
        submitterId: userId,
        submitterName: req.body.submitterName || '',
        submitterEmail: req.body.submitterEmail || ''
      });
      
      await suggestion.save();
      
      res.status(201).json({
        success: true,
        message: 'Suggestion submitted successfully',
        data: {
          id: suggestion._id,
          title: suggestion.title,
          type: suggestion.type,
          createdAt: suggestion.createdAt
        }
      });
    } catch (error) {
      console.error('Error creating suggestion:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to submit suggestion',
        error: error.message
      });
    }
  },
  
  /**
   * Get all suggestions (for admin)
   * @route GET /api/admin/suggestions
   * @access Private (admin only)
   */
  getAllSuggestions: async (req, res) => {
    try {
      const { status, type, sort = 'createdAt', order = 'desc' } = req.query;
      
      // Build query
      const query = {};
      if (status) query.status = status;
      if (type) query.type = type;
      
      // Build sort options
      const sortOptions = {};
      sortOptions[sort] = order === 'asc' ? 1 : -1;
      
      // Get suggestions with pagination
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      
      const suggestions = await Suggestion.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .lean();
      
      const total = await Suggestion.countDocuments(query);
      
      res.json({
        success: true,
        data: suggestions,
        meta: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch suggestions',
        error: error.message
      });
    }
  },
  
  /**
   * Get suggestion by ID (for admin)
   * @route GET /api/admin/suggestions/:id
   * @access Private (admin only)
   */
  getSuggestionById: async (req, res) => {
    try {
      const suggestion = await Suggestion.findById(req.params.id).lean();
      
      if (!suggestion) {
        return res.status(404).json({
          success: false,
          message: 'Suggestion not found'
        });
      }
      
      res.json({
        success: true,
        data: suggestion
      });
    } catch (error) {
      console.error('Error fetching suggestion:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch suggestion',
        error: error.message
      });
    }
  },
  
  /**
   * Update suggestion status (for admin)
   * @route PUT /api/admin/suggestions/:id
   * @access Private (admin only)
   */
  updateSuggestion: async (req, res) => {
    try {
      const { status, adminNotes } = req.body;
      const { userId } = req.auth;
      
      // Validate status
      if (status && !['new', 'reviewed', 'approved', 'rejected'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status value'
        });
      }
      
      // Find the suggestion
      const suggestion = await Suggestion.findById(req.params.id);
      
      if (!suggestion) {
        return res.status(404).json({
          success: false,
          message: 'Suggestion not found'
        });
      }
      
      // Update fields
      if (status) {
        suggestion.status = status;
        suggestion.reviewedAt = new Date();
        suggestion.reviewedBy = userId;
      }
      
      if (adminNotes !== undefined) {
        suggestion.adminNotes = adminNotes;
      }
      
      await suggestion.save();
      
      res.json({
        success: true,
        message: 'Suggestion updated successfully',
        data: {
          id: suggestion._id,
          title: suggestion.title,
          status: suggestion.status,
          updatedAt: suggestion.updatedAt
        }
      });
    } catch (error) {
      console.error('Error updating suggestion:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update suggestion',
        error: error.message
      });
    }
  },
  
  /**
   * Delete suggestion (for admin)
   * @route DELETE /api/admin/suggestions/:id
   * @access Private (admin only)
   */
  deleteSuggestion: async (req, res) => {
    try {
      const result = await Suggestion.findByIdAndDelete(req.params.id);
      
      if (!result) {
        return res.status(404).json({
          success: false,
          message: 'Suggestion not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Suggestion deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting suggestion:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete suggestion',
        error: error.message
      });
    }
  },
  
  /**
   * Get suggestion statistics (for admin dashboard)
   * @route GET /api/admin/suggestions/stats
   * @access Private (admin only)
   */
  getSuggestionStats: async (req, res) => {
    try {
      // Get total counts
      const total = await Suggestion.countDocuments();
      const newCount = await Suggestion.countDocuments({ status: 'new' });
      const reviewedCount = await Suggestion.countDocuments({ status: 'reviewed' });
      const approvedCount = await Suggestion.countDocuments({ status: 'approved' });
      const rejectedCount = await Suggestion.countDocuments({ status: 'rejected' });
      
      // Get counts by type
      const byType = await Suggestion.aggregate([
        { $match: { status: 'new' } },
        { $group: { _id: '$type', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);
      
      res.json({
        success: true,
        data: {
          total,
          new: newCount,
          reviewed: reviewedCount,
          approved: approvedCount,
          rejected: rejectedCount,
          byType
        }
      });
    } catch (error) {
      console.error('Error fetching suggestion stats:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch suggestion statistics',
        error: error.message
      });
    }
  }
};

module.exports = suggestionController;
