const Resource = require('../models/resource');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Resource Processing Controller
 * Handles logic for the admin resource processing tool
 */
const resourceProcessingController = {
  /**
   * Get the next unprocessed resource, optionally after a specific resource ID.
   * @route GET /api/admin/process/next-unprocessed
   * @access Private (admin only)
   */
  getNextUnprocessedResource: async (req, res) => {
    try {
      // Get type filter and currentResourceId from query params
      const { type, currentResourceId } = req.query;
      
      // Base query: Find resources not yet processed
      const query = {
        $or: [
          { processed: false },
          { processed: { $exists: false } }
        ]
      };
      
      // Add type filter if provided
      if (type) {
        query.type = type;
      }
      
      // If currentResourceId is provided, find the next resource *after* it
      if (currentResourceId) {
        // We need a field to sort by consistently. Let's use _id.
        // Find the document with currentResourceId to get its _id
        // Note: This adds an extra query, could be optimized if needed
        // For simplicity now, we assume sorting by _id works
        query._id = { $gt: currentResourceId }; 
      }
      
      // Find the next unprocessed resource, sorted by _id to ensure consistency
      const resource = await Resource.findOne(
        query,
        { 
          _id: 1,
          title: 1, 
          description: 1,
          type: 1,
          slug: 1,
          url: 1,
          imageUrl: 1,
          bookDetails: 1,
          videoChannelDetails: 1,
          websiteDetails: 1,
          blogDetails: 1,
          podcastDetails: 1,
          practiceDetails: 1,
          retreatCenterDetails: 1,
          appDetails: 1,
          tags: 1,
          isbn: 1,
          processingNotes: 1
          // Removed skipped field
        }
      )
      .sort({ _id: 1 }) // Sort by _id for consistent ordering
      .lean();
      
      // --- Recalculate Progress --- 
      let totalCount, unprocessedCount;
      const baseUnprocessedQuery = {
        $or: [
          { processed: false },
          { processed: { $exists: false } }
        ]
      };

      if (type) {
        totalCount = await Resource.countDocuments({ type });
        unprocessedCount = await Resource.countDocuments({ ...baseUnprocessedQuery, type });
      } else {
        totalCount = await Resource.countDocuments({});
        unprocessedCount = await Resource.countDocuments(baseUnprocessedQuery);
      }
      
      const processedCount = totalCount - unprocessedCount;
      
      // Get counts by type (only unprocessed)
      const typeCounts = await Resource.aggregate([
        { $match: baseUnprocessedQuery },
        { $group: { _id: '$type', count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]);
      
      // If no resource found (either initially or after the last one)
      if (!resource) {
        return res.status(200).json({
          success: true,
          resource: null,
          allProcessed: unprocessedCount === 0,
          progress: {
            processed: processedCount,
            total: totalCount,
            remaining: unprocessedCount
          },
          typeCounts,
          message: type 
            ? `All ${type} resources processed or none found after the current one!` 
            : 'All resources processed or none found after the current one!'
        });
      }
      
      // Return the resource and progress stats
      res.status(200).json({
        success: true,
        resource,
        allProcessed: false, // Since we found one
        progress: {
          processed: processedCount,
          total: totalCount,
          remaining: unprocessedCount
        },
        typeCounts
      });

    } catch (error) {
      console.error('Error in getNextUnprocessedResource:', error);
      res.status(500).json({ success: false, message: 'Server error fetching next resource.', error: error.message });
    }
  },

  /**
   * Process a resource: Update its details and mark it as processed.
   * @route PUT /api/admin/process/resource/:id
   * @access Private (admin only)
   */
  processResource: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      // Ensure the resource is marked as processed
      updateData.processed = true;
      // Remove skipped field if present in body (shouldn't be)
      delete updateData.skipped;
      updateData.updatedAt = Date.now();

      const updatedResource = await Resource.findByIdAndUpdate(id, updateData, { new: true });

      if (!updatedResource) {
        return res.status(404).json({ success: false, message: 'Resource not found' });
      }

      // --- Recalculate Progress after processing ---
      const type = updatedResource.type; // Get type for accurate progress update
      let totalCount, unprocessedCount;
      const baseUnprocessedQuery = {
        $or: [
          { processed: false },
          { processed: { $exists: false } }
        ]
      };
      
      if (type) {
        totalCount = await Resource.countDocuments({ type });
        unprocessedCount = await Resource.countDocuments({ ...baseUnprocessedQuery, type });
      } else {
        // Fallback if type wasn't updated? Should always have a type.
        totalCount = await Resource.countDocuments({}); 
        unprocessedCount = await Resource.countDocuments(baseUnprocessedQuery);
      }

      const processedCount = totalCount - unprocessedCount;

      const typeCounts = await Resource.aggregate([
        { $match: baseUnprocessedQuery },
        { $group: { _id: '$type', count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]);

      res.status(200).json({
        success: true,
        resource: updatedResource,
        progress: {
          processed: processedCount,
          total: totalCount,
          remaining: unprocessedCount
        },
        typeCounts
      });
    } catch (error) {
      console.error('Error processing resource:', error);
      res.status(500).json({ success: false, message: 'Server error processing resource.', error: error.message });
    }
  },

  /**
   * Get processing progress statistics.
   * @route GET /api/admin/process/progress
   * @access Private (admin only)
   */
  getProgress: async (req, res) => {
    try {
      const { type } = req.query;
      const typeQuery = type ? { type } : {};

      // Base query for unprocessed resources
      const baseUnprocessedQuery = {
        $or: [
          { processed: false },
          { processed: { $exists: false } }
        ]
      };
      const unprocessedQuery = { ...baseUnprocessedQuery, ...typeQuery };

      const totalCount = await Resource.countDocuments(typeQuery);
      const unprocessedCount = await Resource.countDocuments(unprocessedQuery);
      const processedCount = totalCount - unprocessedCount;

      // Get counts by type (only unprocessed)
      const typeCounts = await Resource.aggregate([
        { $match: baseUnprocessedQuery }, // Match all unprocessed regardless of query type
        { $group: { _id: '$type', count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]);

      res.status(200).json({
        success: true,
        progress: {
          processed: processedCount,
          total: totalCount,
          remaining: unprocessedCount
        },
        typeCounts // Now only contains unprocessed counts per type
      });
    } catch (error) {
      console.error('Error getting progress:', error);
      res.status(500).json({ success: false, message: 'Server error getting progress.', error: error.message });
    }
  }
};

module.exports = resourceProcessingController;
