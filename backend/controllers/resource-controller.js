const Resource = require('../models/resource');

/**
 * Resource controller for handling resource-related operations
 * Optimized for performance with lean queries and selective field projection
 */
const resourceController = {
  /**
   * Get all resources with optional filtering and pagination
   * @route GET /api/resources
   * @access Public
   */
  getAllResources: async (req, res) => {
    try {
      const { page = 1, limit = 10, type, tradition, teacher, tag, featured, ids } = req.query;
      const skip = (page - 1) * limit;
      
      // Build filter object based on query parameters
      const filter = {};
      
      // Handle multiple IDs for fetching favorites
      if (ids) {
        try {
          const idArray = ids.split(',').map(id => id.trim());
          console.log('Fetching resources with IDs:', idArray);
          filter._id = { $in: idArray };
          // When fetching by IDs, ignore pagination limits
        } catch (error) {
          console.error('Error processing IDs parameter:', error);
        }
      }
      
      if (type) {
        // Don't convert to lowercase, as some types use camelCase in the database
        filter.type = type;
      }
      if (tradition) filter.traditions = tradition;
      if (teacher) filter.teachers = teacher;
      if (tag) filter.tags = { $in: [tag.toLowerCase()] };
      if (featured === 'true') filter.featured = true;
      
      // Define projection to select only needed fields
      const projection = {
        title: 1,
        description: 1,
        type: 1,
        imageUrl: 1,
        slug: 1,
        teachers: 1,
        traditions: 1,
        tags: 1,
        featured: 1,
        viewCount: 1,
        averageRating: 1,
        createdAt: 1,
        // Include type-specific details
        bookDetails: 1,
        podcastDetails: 1,
        videoChannelDetails: 1,
        websiteDetails: 1,
        blogDetails: 1,
        practiceDetails: 1,
        retreatCenterDetails: 1,
        appDetails: 1
      };
      
      // If we're fetching by IDs, use a different query flow without pagination
      let resources;
      if (ids) {
        resources = await Resource.find(filter, projection)
          .populate('teachers', 'name slug imageUrl')
          .populate('traditions', 'name slug')
          .sort({ createdAt: -1 })
          .lean(); // Use lean for better performance
      } else {
        // Execute query with pagination and optimization
        resources = await Resource.find(filter, projection)
          .populate('teachers', 'name slug imageUrl')
          .populate('traditions', 'name slug')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit))
          .lean(); // Use lean for better performance
      }
      
      // Get total count for pagination - use countDocuments instead of count
      const total = await Resource.countDocuments(filter);
      
      res.status(200).json({
        success: true,
        count: resources.length,
        total,
        totalPages: ids ? 1 : Math.ceil(total / limit),
        currentPage: parseInt(page),
        resources
      });
    } catch (error) {
      console.error('Error in getAllResources:', error);
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message
      });
    }
  },
  
  /**
   * Get a single resource by ID or slug
   * @route GET /api/resources/:id
   * @access Public
   */
  getResourceById: async (req, res) => {
    try {
      const { idOrSlug } = req.params;
      
      if (!idOrSlug) {
        return res.status(400).json({
          success: false,
          message: 'Resource ID or slug is required'
        });
      }
      
      // Check if ID is a MongoDB ObjectId or a slug
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);
      
      // Find resource by ID or slug
      let resource;
      if (isObjectId) {
        resource = await Resource.findById(idOrSlug)
          .populate('teachers', 'name slug imageUrl bio')
          .populate('traditions', 'name slug description');
      } else {
        resource = await Resource.findOne({ slug: idOrSlug })
          .populate('teachers', 'name slug imageUrl bio')
          .populate('traditions', 'name slug description');
      }
      
      if (!resource) {
        return res.status(404).json({
          success: false,
          message: 'Resource not found'
        });
      }
      
      // Increment view count - use findOneAndUpdate for atomic operation
      await Resource.findOneAndUpdate(
        { _id: resource._id },
        { $inc: { viewCount: 1 } },
        { new: true }
      );
      
      // Increment the view count in the returned object
      resource.viewCount += 1;
      
      res.status(200).json({
        success: true,
        resource
      });
    } catch (error) {
      console.error('Error in getResourceById:', error);
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message
      });
    }
  },
  
  /**
   * Create a new resource
   * @route POST /api/resources
   * @access Private
   */
  createResource: async (req, res) => {
    try {
      const resourceData = req.body;
      
      // Create new resource
      const resource = await Resource.create(resourceData);
      
      res.status(201).json({
        success: true,
        resource
      });
    } catch (error) {
      console.error('Error in createResource:', error);
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message
      });
    }
  },
  
  /**
   * Update a resource
   * @route PUT /api/resources/:id
   * @access Private
   */
  updateResource: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      // Find and update resource - use findOneAndUpdate for atomic operation
      const updatedResource = await Resource.findOneAndUpdate(
        { _id: id },
        updateData,
        { new: true, runValidators: true }
      );
      
      if (!updatedResource) {
        return res.status(404).json({
          success: false,
          message: 'Resource not found'
        });
      }
      
      res.status(200).json({
        success: true,
        resource: updatedResource
      });
    } catch (error) {
      console.error('Error in updateResource:', error);
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message
      });
    }
  },
  
  /**
   * Delete a resource
   * @route DELETE /api/resources/:id
   * @access Private
   */
  deleteResource: async (req, res) => {
    try {
      const { id } = req.params;
      
      // Find and delete resource - use findOneAndDelete for atomic operation
      const deletedResource = await Resource.findOneAndDelete({ _id: id });
      
      if (!deletedResource) {
        return res.status(404).json({
          success: false,
          message: 'Resource not found'
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'Resource deleted successfully'
      });
    } catch (error) {
      console.error('Error in deleteResource:', error);
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message
      });
    }
  },
  
  /**
   * Search resources with full-text search
   * @route GET /api/resources/search
   * @access Public
   */
  searchResources: async (req, res) => {
    try {
      const { q, page = 1, limit = 10, type, tradition, teacher } = req.query;
      const skip = (page - 1) * limit;
      
      if (!q) {
        return res.status(400).json({
          success: false,
          message: 'Search query is required'
        });
      }
      
      // Build search query with text search and optional filters
      const searchQuery = { $text: { $search: q } };
      if (type) {
        // Don't convert to lowercase, as some types use camelCase in the database
        searchQuery.type = type;
      }
      if (tradition) searchQuery.traditions = tradition;
      if (teacher) searchQuery.teachers = teacher;
      
      // Define projection to select only needed fields
      const projection = {
        title: 1,
        description: 1,
        type: 1,
        imageUrl: 1,
        slug: 1,
        teachers: 1,
        traditions: 1,
        tags: 1,
        score: { $meta: 'textScore' }
      };
      
      // Execute search with pagination and optimization
      const resources = await Resource.find(searchQuery, projection)
        .populate('teachers', 'name slug imageUrl')
        .populate('traditions', 'name slug')
        .sort({ score: { $meta: 'textScore' } })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(); // Use lean for better performance
      
      // Get total count for pagination
      const total = await Resource.countDocuments(searchQuery);
      
      res.status(200).json({
        success: true,
        count: resources.length,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        resources
      });
    } catch (error) {
      console.error('Error in searchResources:', error);
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message
      });
    }
  },
  
  /**
   * Get resources by type
   * @route GET /api/resources/type/:type
   * @access Public
   */
  getResourcesByType: async (req, res) => {
    try {
      const { type } = req.params;
      const { limit = 20, page = 1 } = req.query;
      const skip = (page - 1) * limit;
      
      // Define projection to select only needed fields
      const projection = {
        title: 1,
        description: 1,
        type: 1,
        imageUrl: 1,
        slug: 1,
        teachers: 1,
        traditions: 1,
        tags: 1,
        createdAt: 1
      };
      
      // Find resources by type with optimization
      const resources = await Resource.find({ type: type }, projection)
        .populate('teachers', 'name slug imageUrl')
        .populate('traditions', 'name slug')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(); // Use lean for better performance
      
      // Get total count for pagination
      const total = await Resource.countDocuments({ type: type });
      
      res.status(200).json({
        success: true,
        count: resources.length,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        resources
      });
    } catch (error) {
      console.error('Error in getResourcesByType:', error);
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message
      });
    }
  },
  
  /**
   * Get featured resources
   * @route GET /api/resources/featured
   * @access Public
   */
  getFeaturedResources: async (req, res) => {
    try {
      const { limit = 6 } = req.query;
      
      // Define projection to select only needed fields
      const projection = {
        title: 1,
        description: 1,
        type: 1,
        imageUrl: 1,
        slug: 1,
        teachers: 1,
        traditions: 1,
        tags: 1,
        featured: 1,
        createdAt: 1
      };
      
      // Find featured resources with optimization
      const featuredResources = await Resource.find({ featured: true }, projection)
        .populate('teachers', 'name slug')
        .populate('traditions', 'name slug')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .lean(); // Use lean for better performance
      
      res.status(200).json({
        success: true,
        count: featuredResources.length,
        resources: featuredResources
      });
    } catch (error) {
      console.error('Error in getFeaturedResources:', error);
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message
      });
    }
  },
  
  /**
   * Get all resource types
   * @route GET /api/resources/types
   * @access Public
   */
  getResourceTypes: async (req, res) => {
    try {
      // Define the available resource types
      // Based on the resource schema enum values
      const types = [
        'Book',
        'Blog',
        'Video Channel',
        'Podcast',
        'Practice', 
        'Retreat Center',
        'Website',
        'App'
      ];
      
      // Map for internal type values (used in database)
      const typeMapping = {
        'Book': 'book',
        'Blog': 'blog',
        'Video Channel': 'videoChannel',
        'Podcast': 'podcast',
        'Practice': 'practice',
        'Retreat Center': 'retreatCenter',
        'Website': 'website',
        'App': 'app'
      };
      
      res.status(200).json({
        success: true,
        types,
        typeMapping
      });
    } catch (error) {
      console.error('Error in getResourceTypes:', error);
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message
      });
    }
  },
  
  /**
   * Get all tags used in resources
   * @route GET /api/resources/tags
   * @access Public
   */
  getResourceTags: async (req, res) => {
    try {
      // Find all unique tags across all resources
      const tagResults = await Resource.aggregate([
        { $unwind: '$tags' },
        { $group: { _id: '$tags' } },
        { $sort: { _id: 1 } }
      ]);
      
      // Extract tag names from results
      const tags = tagResults.map(tag => tag._id);
      
      res.status(200).json({
        success: true,
        tags
      });
    } catch (error) {
      console.error('Error in getResourceTags:', error);
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message
      });
    }
  }
};

module.exports = resourceController;
