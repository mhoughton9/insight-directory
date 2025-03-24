const { Tradition, Teacher, Resource } = require('../models');

/**
 * Tradition controller for handling tradition-related operations
 */
const traditionController = {
  /**
   * Get all traditions with optional filtering and pagination
   * @route GET /api/traditions
   * @access Public
   */
  getAllTraditions: async (req, res) => {
    try {
      const { page = 1, limit = 20, featured, ids } = req.query;
      const skip = (page - 1) * limit;
      
      // Build filter object based on query parameters
      const filter = {};
      
      // Handle multiple IDs for fetching favorites
      if (ids) {
        try {
          const idArray = ids.split(',').map(id => id.trim());
          console.log('Fetching traditions with IDs:', idArray);
          filter._id = { $in: idArray };
          // When fetching by IDs, ignore pagination limits
        } catch (error) {
          console.error('Error processing IDs parameter:', error);
        }
      }
      
      if (featured === 'true') filter.featured = true;
      
      // Define projection to select only needed fields
      const projection = {
        name: 1,
        description: 1,
        imageUrl: 1,
        slug: 1,
        featured: 1,
        createdAt: 1
      };
      
      // If we're fetching by IDs, use a different query flow without pagination
      let traditions;
      if (ids) {
        traditions = await Tradition.find(filter, projection)
          .sort({ name: 1 })
          .lean(); // Use lean for better performance
      } else {
        // Execute query with pagination and optimization
        traditions = await Tradition.find(filter, projection)
          .sort({ name: 1 })
          .skip(skip)
          .limit(parseInt(limit))
          .lean(); // Use lean for better performance
      }
      
      // Get total count for pagination
      const total = await Tradition.countDocuments(filter);
      
      res.status(200).json({
        success: true,
        count: traditions.length,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        traditions
      });
    } catch (error) {
      console.error('Error getting traditions:', error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving traditions',
        error: error.message
      });
    }
  },
  
  /**
   * Get a single tradition by ID or slug
   * @route GET /api/traditions/:idOrSlug
   */
  getTraditionById: async (req, res) => {
    try {
      const { idOrSlug } = req.params;
      
      // Determine if parameter is ID or slug
      const isObjectId = idOrSlug.match(/^[0-9a-fA-F]{24}$/);
      
      // Build query based on parameter type
      const query = isObjectId ? { _id: idOrSlug } : { slug: idOrSlug };
      
      // Find tradition and populate related data
      const tradition = await Tradition.findOne(query)
        .populate('relatedTraditions', 'name slug description');
      
      if (!tradition) {
        return res.status(404).json({
          success: false,
          message: 'Tradition not found'
        });
      }
      
      // Get teachers associated with this tradition
      const teachers = await Teacher.find({ traditions: tradition._id })
        .select('name slug imageUrl')
        .sort({ name: 1 });
      
      // Get resources associated with this tradition
      const resources = await Resource.find({ traditions: tradition._id })
        .populate('teachers', 'name slug')
        .sort({ createdAt: -1 })
        .limit(10);
      
      res.status(200).json({
        success: true,
        tradition,
        teachers,
        resources
      });
    } catch (error) {
      console.error('Error getting tradition:', error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving tradition',
        error: error.message
      });
    }
  },
  
  /**
   * Create a new tradition
   * @route POST /api/traditions
   */
  createTradition: async (req, res) => {
    try {
      const traditionData = req.body;
      
      // Create slug if not provided
      if (!traditionData.slug) {
        traditionData.slug = traditionData.name
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '');
      }
      
      // Create new tradition
      const newTradition = await Tradition.create(traditionData);
      
      res.status(201).json({
        success: true,
        message: 'Tradition created successfully',
        tradition: newTradition
      });
    } catch (error) {
      console.error('Error creating tradition:', error);
      res.status(400).json({
        success: false,
        message: 'Error creating tradition',
        error: error.message
      });
    }
  },
  
  /**
   * Update a tradition
   * @route PUT /api/traditions/:id
   */
  updateTradition: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      // Find and update tradition
      const updatedTradition = await Tradition.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );
      
      if (!updatedTradition) {
        return res.status(404).json({
          success: false,
          message: 'Tradition not found'
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'Tradition updated successfully',
        tradition: updatedTradition
      });
    } catch (error) {
      console.error('Error updating tradition:', error);
      res.status(400).json({
        success: false,
        message: 'Error updating tradition',
        error: error.message
      });
    }
  },
  
  /**
   * Delete a tradition
   * @route DELETE /api/traditions/:id
   */
  deleteTradition: async (req, res) => {
    try {
      const { id } = req.params;
      
      // Find and delete tradition
      const deletedTradition = await Tradition.findByIdAndDelete(id);
      
      if (!deletedTradition) {
        return res.status(404).json({
          success: false,
          message: 'Tradition not found'
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'Tradition deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting tradition:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting tradition',
        error: error.message
      });
    }
  },
  
  /**
   * Search traditions
   * @route GET /api/traditions/search
   */
  searchTraditions: async (req, res) => {
    try {
      const { q, limit = 20, page = 1 } = req.query;
      const skip = (page - 1) * limit;
      
      // Build search query
      const searchQuery = {};
      
      // Add text search if query provided
      if (q) {
        searchQuery.name = { $regex: q, $options: 'i' };
      }
      
      // Execute search with pagination
      const traditions = await Tradition.find(searchQuery)
        .sort({ name: 1 })
        .skip(skip)
        .limit(parseInt(limit));
      
      // Get total count for pagination
      const total = await Tradition.countDocuments(searchQuery);
      
      res.status(200).json({
        success: true,
        count: traditions.length,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        traditions
      });
    } catch (error) {
      console.error('Error searching traditions:', error);
      res.status(500).json({
        success: false,
        message: 'Error searching traditions',
        error: error.message
      });
    }
  }
};

module.exports = traditionController;
