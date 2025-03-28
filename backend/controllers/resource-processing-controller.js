const Resource = require('../models/resource');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const resourceProcessingController = {
  /**
   * Get the next unprocessed resource of a specific type
   * @route GET /api/admin/process/next-unprocessed
   * @access Private (admin only)
   */
  getNextUnprocessedResource: async (req, res) => {
    try {
      // Get type filter and include skipped flag from query params
      const { type, includeSkipped = 'true' } = req.query;
      
      // Build query object - match resources where processed is either false or undefined
      const query = {
        $or: [
          { processed: false },
          { processed: { $exists: false } }
        ]
      };
      
      // Only exclude skipped resources if explicitly requested
      if (includeSkipped !== 'true') {
        query.skipped = { $ne: true };
      }
      
      // Add type filter if provided
      if (type) {
        query.type = type;
      }
      
      // Find the next unprocessed resource
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
          processingNotes: 1,
          skipped: 1
        }
      )
      .sort({ title: 1 })
      .lean();
      
      // Get counts for progress tracking
      let totalCount, unprocessedCount, skippedCount;
      
      // Query for unprocessed resources (processed=false OR processed doesn't exist)
      const unprocessedQuery = {
        $or: [
          { processed: false },
          { processed: { $exists: false } }
        ]
      };
      
      if (type) {
        // Count for specific type
        totalCount = await Resource.countDocuments({ type });
        unprocessedCount = await Resource.countDocuments({ 
          ...unprocessedQuery,
          type
        });
        skippedCount = await Resource.countDocuments({
          type,
          skipped: true
        });
      } else {
        // Count for all types
        totalCount = await Resource.countDocuments({});
        unprocessedCount = await Resource.countDocuments(unprocessedQuery);
        skippedCount = await Resource.countDocuments({ skipped: true });
      }
      
      const processedCount = await Resource.countDocuments({
        ...(type ? { type } : {}),
        processed: true
      });
      
      // Get counts by type for the frontend - include both unprocessed and total counts
      // First, get counts of unprocessed resources by type
      const unprocessedTypeCounts = await Resource.aggregate([
        { 
          $match: { 
            $or: [
              { processed: false },
              { processed: { $exists: false } }
            ],
            skipped: { $ne: true } 
          } 
        },
        { $group: { _id: '$type', count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]);
      
      // Get total counts by type (including processed and skipped)
      const totalTypeCounts = await Resource.aggregate([
        { $group: { _id: '$type', total: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]);
      
      // Get skipped counts by type
      const skippedTypeCounts = await Resource.aggregate([
        { $match: { skipped: true } },
        { $group: { _id: '$type', skipped: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]);
      
      // Merge the counts into a single array with comprehensive information
      const mergedTypeCounts = totalTypeCounts.map(typeTotal => {
        const unprocessedInfo = unprocessedTypeCounts.find(item => item._id === typeTotal._id) || { count: 0 };
        const skippedInfo = skippedTypeCounts.find(item => item._id === typeTotal._id) || { skipped: 0 };
        
        return {
          _id: typeTotal._id,
          count: unprocessedInfo.count, // Unprocessed count (for backward compatibility)
          unprocessed: unprocessedInfo.count,
          skipped: skippedInfo.skipped,
          total: typeTotal.total,
          processed: typeTotal.total - unprocessedInfo.count - skippedInfo.skipped
        };
      });
      
      // Add any types that might only have unprocessed resources but no processed ones
      unprocessedTypeCounts.forEach(unprocessedType => {
        if (!mergedTypeCounts.some(item => item._id === unprocessedType._id)) {
          const skippedInfo = skippedTypeCounts.find(item => item._id === unprocessedType._id) || { skipped: 0 };
          
          mergedTypeCounts.push({
            _id: unprocessedType._id,
            count: unprocessedType.count, // Unprocessed count (for backward compatibility)
            unprocessed: unprocessedType.count,
            skipped: skippedInfo.skipped,
            total: unprocessedType.count + skippedInfo.skipped,
            processed: 0
          });
        }
      });
      
      // If no resource found, return success with allProcessed flag
      if (!resource) {
        return res.status(200).json({
          success: true,
          resource: null,
          allProcessed: unprocessedCount === 0 && skippedCount === 0,
          progress: {
            processed: processedCount,
            total: totalCount,
            remaining: unprocessedCount,
            skipped: skippedCount
          },
          typeCounts: mergedTypeCounts,
          message: type 
            ? `All ${type} resources have been processed!` 
            : 'All resources have been processed!'
        });
      }
      
      // Return the resource and progress stats
      res.status(200).json({
        success: true,
        resource,
        allProcessed: false,
        progress: {
          processed: processedCount,
          total: totalCount,
          remaining: unprocessedCount,
          skipped: skippedCount
        },
        typeCounts: mergedTypeCounts
      });
    } catch (error) {
      console.error('Error in getNextUnprocessedResource:', error);
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message
      });
    }
  },

  /**
   * Process a resource (update with processed data)
   * @route PUT /api/admin/process/:id
   * @access Private (admin only)
   */
  processResource: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      // Find the resource
      const resource = await Resource.findById(id);
      
      if (!resource) {
        return res.status(404).json({
          success: false,
          message: 'Resource not found'
        });
      }
      
      // Always mark as processed
      updateData.processed = true;
      
      // Handle image upload if provided
      if (updateData.imageUrl && updateData.imageUrl.trim() !== '') {
        try {
          // Upload image to Cloudinary with transformation
          const uploadResult = await cloudinary.uploader.upload(updateData.imageUrl, {
            folder: 'insight-directory',
            transformation: [
              { width: 500, height: 750, crop: 'fill', quality: 'auto' }
            ]
          });
          
          // Update the imageUrl with the Cloudinary URL
          updateData.imageUrl = uploadResult.secure_url;
        } catch (uploadError) {
          console.error('Error uploading image to Cloudinary:', uploadError);
          // Continue with the update even if image upload fails
        }
      }
      
      // Update the resource
      const updatedResource = await Resource.findByIdAndUpdate(
        id, 
        updateData, 
        { new: true }
      );
      
      res.status(200).json({
        success: true,
        message: 'Resource processed successfully',
        resource: updatedResource
      });
    } catch (error) {
      console.error('Error in processResource:', error);
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message
      });
    }
  },

  /**
   * Skip a resource in the processing queue
   * @route PUT /api/admin/process/:id/skip
   * @access Private (admin only)
   */
  skipResource: async (req, res) => {
    try {
      const { id } = req.params;
      const { processingNotes } = req.body;
      
      // Find the resource
      const resource = await Resource.findById(id);
      
      if (!resource) {
        return res.status(404).json({
          success: false,
          message: 'Resource not found'
        });
      }
      
      // Update the resource to mark as skipped
      const updateData = { skipped: true };
      
      // Add processing notes if provided
      if (processingNotes) {
        updateData.processingNotes = processingNotes;
      }
      
      const updatedResource = await Resource.findByIdAndUpdate(
        id, 
        updateData, 
        { new: true }
      );
      
      // Get the next resource type for progress info
      const type = resource.type;
      
      // Get updated progress information
      const typeQuery = type ? { type } : {};
      
      // Get counts by type for reporting - include both unprocessed and total counts
      // First, get counts of unprocessed resources by type
      const unprocessedTypeCounts = await Resource.aggregate([
        { 
          $match: { 
            $or: [
              { processed: false },
              { processed: { $exists: false } }
            ],
            skipped: { $ne: true } 
          } 
        },
        { $group: { _id: '$type', count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]);
      
      // Get total counts by type (including processed and skipped)
      const totalTypeCounts = await Resource.aggregate([
        { $group: { _id: '$type', total: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]);
      
      // Get skipped counts by type
      const skippedTypeCounts = await Resource.aggregate([
        { $match: { skipped: true } },
        { $group: { _id: '$type', skipped: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]);
      
      // Merge the counts into a single array with comprehensive information
      const mergedTypeCounts = totalTypeCounts.map(typeTotal => {
        const unprocessedInfo = unprocessedTypeCounts.find(item => item._id === typeTotal._id) || { count: 0 };
        const skippedInfo = skippedTypeCounts.find(item => item._id === typeTotal._id) || { skipped: 0 };
        
        return {
          _id: typeTotal._id,
          count: unprocessedInfo.count, // Unprocessed count (for backward compatibility)
          unprocessed: unprocessedInfo.count,
          skipped: skippedInfo.skipped,
          total: typeTotal.total,
          processed: typeTotal.total - unprocessedInfo.count - skippedInfo.skipped
        };
      });
      
      // Add any types that might only have unprocessed resources but no processed ones
      unprocessedTypeCounts.forEach(unprocessedType => {
        if (!mergedTypeCounts.some(item => item._id === unprocessedType._id)) {
          const skippedInfo = skippedTypeCounts.find(item => item._id === unprocessedType._id) || { skipped: 0 };
          
          mergedTypeCounts.push({
            _id: unprocessedType._id,
            count: unprocessedType.count, // Unprocessed count (for backward compatibility)
            unprocessed: unprocessedType.count,
            skipped: skippedInfo.skipped,
            total: unprocessedType.count + skippedInfo.skipped,
            processed: 0
          });
        }
      });
      
      // Get total count
      const totalCount = await Resource.countDocuments(typeQuery);
      
      // Get processed count
      const processedCount = await Resource.countDocuments({
        ...typeQuery,
        processed: true
      });
      
      // Get skipped count
      const skippedCount = await Resource.countDocuments({
        ...typeQuery,
        skipped: true
      });
      
      // Get remaining count (not processed and not skipped)
      // This includes resources where processed is false OR processed doesn't exist
      const remainingQuery = {
        ...typeQuery,
        $or: [
          { processed: false },
          { processed: { $exists: false } }
        ],
        skipped: { $ne: true }
      };
      
      const remainingCount = await Resource.countDocuments(remainingQuery);
      
      res.status(200).json({
        success: true,
        message: 'Resource skipped successfully',
        resource: updatedResource,
        progress: {
          total: totalCount,
          processed: processedCount,
          skipped: skippedCount,
          remaining: remainingCount
        },
        typeCounts: mergedTypeCounts
      });
    } catch (error) {
      console.error('Error in skipResource:', error);
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message
      });
    }
  },

  /**
   * Get processing progress statistics
   * @route GET /api/admin/process/progress
   * @access Private (admin only)
   */
  getProgress: async (req, res) => {
    try {
      // Get type filter from query params
      const { type } = req.query;
      
      // Build query object for type filtering
      const typeQuery = type ? { type } : {};
      
      // Get total count
      const totalCount = await Resource.countDocuments(typeQuery);
      
      // Get processed count
      const processedCount = await Resource.countDocuments({
        ...typeQuery,
        processed: true
      });
      
      // Get skipped count
      const skippedCount = await Resource.countDocuments({
        ...typeQuery,
        skipped: true
      });
      
      // Get remaining count (not processed and not skipped)
      // This includes resources where processed is false OR processed doesn't exist
      const remainingQuery = {
        ...typeQuery,
        $or: [
          { processed: false },
          { processed: { $exists: false } }
        ],
        skipped: { $ne: true }
      };
      
      const remainingCount = await Resource.countDocuments(remainingQuery);
      
      // Get counts by type for reporting - include both unprocessed and total counts
      // First, get counts of unprocessed resources by type
      const unprocessedTypeCounts = await Resource.aggregate([
        { 
          $match: { 
            $or: [
              { processed: false },
              { processed: { $exists: false } }
            ],
            skipped: { $ne: true } 
          } 
        },
        { $group: { _id: '$type', count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]);
      
      // Get total counts by type (including processed and skipped)
      const totalTypeCounts = await Resource.aggregate([
        { $group: { _id: '$type', total: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]);
      
      // Get skipped counts by type
      const skippedTypeCounts = await Resource.aggregate([
        { $match: { skipped: true } },
        { $group: { _id: '$type', skipped: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]);
      
      // Merge the counts into a single array with comprehensive information
      const mergedTypeCounts = totalTypeCounts.map(typeTotal => {
        const unprocessedInfo = unprocessedTypeCounts.find(item => item._id === typeTotal._id) || { count: 0 };
        const skippedInfo = skippedTypeCounts.find(item => item._id === typeTotal._id) || { skipped: 0 };
        
        return {
          _id: typeTotal._id,
          count: unprocessedInfo.count, // Unprocessed count (for backward compatibility)
          unprocessed: unprocessedInfo.count,
          skipped: skippedInfo.skipped,
          total: typeTotal.total,
          processed: typeTotal.total - unprocessedInfo.count - skippedInfo.skipped
        };
      });
      
      // Add any types that might only have unprocessed resources but no processed ones
      unprocessedTypeCounts.forEach(unprocessedType => {
        if (!mergedTypeCounts.some(item => item._id === unprocessedType._id)) {
          const skippedInfo = skippedTypeCounts.find(item => item._id === unprocessedType._id) || { skipped: 0 };
          
          mergedTypeCounts.push({
            _id: unprocessedType._id,
            count: unprocessedType.count, // Unprocessed count (for backward compatibility)
            unprocessed: unprocessedType.count,
            skipped: skippedInfo.skipped,
            total: unprocessedType.count + skippedInfo.skipped,
            processed: 0
          });
        }
      });
      
      res.status(200).json({
        success: true,
        progress: {
          total: totalCount,
          processed: processedCount,
          skipped: skippedCount,
          remaining: remainingCount
        },
        typeCounts: mergedTypeCounts
      });
    } catch (error) {
      console.error('Error in getProgress:', error);
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message
      });
    }
  }
};

module.exports = resourceProcessingController;
