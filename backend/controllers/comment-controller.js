const { Comment, Resource } = require('../models');

/**
 * Comment controller for handling comment-related operations
 */
const commentController = {
  /**
   * Get comments for a resource
   * @route GET /api/comments/resource/:resourceId
   */
  getResourceComments: async (req, res) => {
    try {
      const { resourceId } = req.params;
      const { limit = 20, page = 1 } = req.query;
      const skip = (page - 1) * limit;
      
      // Find comments for the resource
      const comments = await Comment.find({ resource: resourceId })
        .populate('user', 'name imageUrl')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));
      
      // Get total count for pagination
      const total = await Comment.countDocuments({ resource: resourceId });
      
      res.status(200).json({
        success: true,
        count: comments.length,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        comments
      });
    } catch (error) {
      console.error('Error getting resource comments:', error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving resource comments',
        error: error.message
      });
    }
  },
  
  /**
   * Create a new comment
   * @route POST /api/comments
   */
  createComment: async (req, res) => {
    try {
      const commentData = req.body;
      
      // Create new comment
      const newComment = await Comment.create(commentData);
      
      // Populate user data
      await newComment.populate('user', 'name imageUrl');
      
      // Update resource rating if comment includes a rating
      if (commentData.rating) {
        // Get all ratings for this resource
        const resourceComments = await Comment.find({ 
          resource: commentData.resource,
          rating: { $exists: true, $ne: null }
        });
        
        // Calculate average rating
        const totalRatings = resourceComments.length;
        const sumRatings = resourceComments.reduce((sum, comment) => sum + comment.rating, 0);
        const averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0;
        
        // Update resource with new average rating
        await Resource.findByIdAndUpdate(
          commentData.resource,
          { averageRating: parseFloat(averageRating.toFixed(1)) }
        );
      }
      
      res.status(201).json({
        success: true,
        message: 'Comment created successfully',
        comment: newComment
      });
    } catch (error) {
      console.error('Error creating comment:', error);
      res.status(400).json({
        success: false,
        message: 'Error creating comment',
        error: error.message
      });
    }
  },
  
  /**
   * Update a comment
   * @route PUT /api/comments/:id
   */
  updateComment: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      // Find and update comment
      const updatedComment = await Comment.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      ).populate('user', 'name imageUrl');
      
      if (!updatedComment) {
        return res.status(404).json({
          success: false,
          message: 'Comment not found'
        });
      }
      
      // Update resource rating if comment includes a rating
      if (updateData.rating) {
        // Get all ratings for this resource
        const resourceComments = await Comment.find({ 
          resource: updatedComment.resource,
          rating: { $exists: true, $ne: null }
        });
        
        // Calculate average rating
        const totalRatings = resourceComments.length;
        const sumRatings = resourceComments.reduce((sum, comment) => sum + comment.rating, 0);
        const averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0;
        
        // Update resource with new average rating
        await Resource.findByIdAndUpdate(
          updatedComment.resource,
          { averageRating: parseFloat(averageRating.toFixed(1)) }
        );
      }
      
      res.status(200).json({
        success: true,
        message: 'Comment updated successfully',
        comment: updatedComment
      });
    } catch (error) {
      console.error('Error updating comment:', error);
      res.status(400).json({
        success: false,
        message: 'Error updating comment',
        error: error.message
      });
    }
  },
  
  /**
   * Delete a comment
   * @route DELETE /api/comments/:id
   */
  deleteComment: async (req, res) => {
    try {
      const { id } = req.params;
      
      // Find comment before deleting to get resource ID
      const comment = await Comment.findById(id);
      
      if (!comment) {
        return res.status(404).json({
          success: false,
          message: 'Comment not found'
        });
      }
      
      // Store resource ID and whether this comment had a rating
      const resourceId = comment.resource;
      const hadRating = comment.rating != null;
      
      // Delete the comment
      await Comment.findByIdAndDelete(id);
      
      // Update resource rating if the deleted comment had a rating
      if (hadRating) {
        // Get all remaining ratings for this resource
        const resourceComments = await Comment.find({ 
          resource: resourceId,
          rating: { $exists: true, $ne: null }
        });
        
        // Calculate average rating
        const totalRatings = resourceComments.length;
        const sumRatings = resourceComments.reduce((sum, comment) => sum + comment.rating, 0);
        const averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0;
        
        // Update resource with new average rating
        await Resource.findByIdAndUpdate(
          resourceId,
          { averageRating: parseFloat(averageRating.toFixed(1)) }
        );
      }
      
      res.status(200).json({
        success: true,
        message: 'Comment deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting comment:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting comment',
        error: error.message
      });
    }
  },
  
  /**
   * Like a comment
   * @route POST /api/comments/:id/like
   */
  likeComment: async (req, res) => {
    try {
      const { id } = req.params;
      
      // Increment like count
      const updatedComment = await Comment.findByIdAndUpdate(
        id,
        { $inc: { likes: 1 } },
        { new: true }
      );
      
      if (!updatedComment) {
        return res.status(404).json({
          success: false,
          message: 'Comment not found'
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'Comment liked successfully',
        likes: updatedComment.likes
      });
    } catch (error) {
      console.error('Error liking comment:', error);
      res.status(500).json({
        success: false,
        message: 'Error liking comment',
        error: error.message
      });
    }
  }
};

module.exports = commentController;
