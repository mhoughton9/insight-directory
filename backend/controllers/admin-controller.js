const Resource = require('../models/resource');
const Teacher = require('../models/teacher');
const Tradition = require('../models/tradition'); // Add this line
const fetch = require('node-fetch');
const FormData = require('form-data');
const crypto = require('crypto');
const { uploadImageToCloudinary } = require('../utils/image-utils');

// Cloudinary configuration
const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

/**
 * Admin controller for book data management
 */
const adminController = {
  /**
   * Get resource statistics
   * @route GET /api/admin/resources/stats
   * @access Private (admin only)
   */
  getResourceStats: async (req, res) => {
    try {
      // Get total count of resources
      const total = await Resource.countDocuments();
      
      // Get count of published resources
      const published = await Resource.countDocuments({ processed: true });
      
      // Get count of pending resources
      const pending = await Resource.countDocuments({ processed: false });
      
      // Get counts by resource type
      const typeAggregation = await Resource.aggregate([
        { $group: { _id: '$type', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);
      
      const byType = typeAggregation.map(item => ({
        type: item._id,
        count: item.count
      }));
      
      // Return statistics
      return res.status(200).json({
        success: true,
        stats: {
          total,
          published,
          pending,
          typeCount: byType.length,
          byType
        }
      });
    } catch (error) {
      console.error('Error getting resource statistics:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to get resource statistics',
        error: error.message
      });
    }
  },

  /**
   * Get teacher statistics
   * @route GET /api/admin/teachers/stats
   * @access Private (admin only)
   */
  getTeacherStats: async (req, res) => {
    try {
      console.log('Fetching teacher statistics...');
      
      // Get total count of teachers
      const total = await Teacher.countDocuments() || 0;
      console.log('Total teachers:', total);
      
      // Get count of published teachers
      const published = await Teacher.countDocuments({ processed: true }) || 0;
      console.log('Published teachers:', published);
      
      // Get count of pending teachers
      const pending = await Teacher.countDocuments({ processed: false }) || 0;
      console.log('Pending teachers:', pending);
      
      // Return statistics
      const stats = { total, published, pending };
      console.log('Returning teacher stats:', stats);
      
      return res.status(200).json({
        success: true,
        stats
      });
    } catch (error) {
      console.error('Error getting teacher statistics:', error);
      // Return default values on error
      return res.status(200).json({
        success: true,
        stats: {
          total: 0,
          published: 0,
          pending: 0
        }
      });
    }
  },

  /**
   * Get tradition statistics
   * @route GET /api/admin/traditions/stats
   * @access Private (admin only)
   */
  getTraditionStats: async (req, res) => {
    try {
      console.log('Fetching tradition statistics...');
      
      // Get total count of traditions
      const total = await Tradition.countDocuments() || 0;
      console.log('Total traditions:', total);
      
      // Get count of published traditions
      const published = await Tradition.countDocuments({ processed: true }) || 0;
      console.log('Published traditions:', published);
      
      // Get count of pending traditions
      const pending = await Tradition.countDocuments({ processed: false }) || 0;
      console.log('Pending traditions:', pending);
      
      // Return statistics
      const stats = { total, published, pending };
      console.log('Returning tradition stats:', stats);
      
      return res.status(200).json({
        success: true,
        stats
      });
    } catch (error) {
      console.error('Error getting tradition statistics:', error);
      // Return default values on error
      return res.status(200).json({
        success: true,
        stats: {
          total: 0,
          published: 0,
          pending: 0
        }
      });
    }
  },

  /**
   * Create a new resource
   * @route POST /api/admin/resources
   * @access Private (admin only)
   */
  createResource: async (req, res) => {
    try {
      // Log the request body for debugging
      console.log('Creating resource with data:', JSON.stringify(req.body, null, 2));
      
      // Create a new resource with the request body
      const resourceData = req.body;
      
      // Generate a slug from the title if not provided
      if (!resourceData.slug && resourceData.title) {
        // Create base slug from title
        const baseSlug = resourceData.title
          .toLowerCase()
          .replace(/[^\w\s-]/g, '') // Remove special characters
          .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
          .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
        
        // Check if the slug already exists
        let slug = baseSlug;
        let counter = 1;
        let slugExists = true;
        
        // Keep checking until we find a unique slug
        while (slugExists) {
          // Check if this slug exists in the database
          const existingResource = await Resource.findOne({ slug });
          
          if (!existingResource) {
            // If no resource with this slug exists, we can use it
            slugExists = false;
          } else {
            // If the slug exists, append a number and try again
            slug = `${baseSlug}-${counter}`;
            counter++;
          }
        }
        
        // Set the unique slug
        resourceData.slug = slug;
      }
      
      // Process image if URL is provided
      if (resourceData.imageUrl && !resourceData.imageUrl.includes('res.cloudinary.com')) {
        try {
          // Upload image to Cloudinary
          const cloudinaryUrl = await uploadImageToCloudinary(
            resourceData.imageUrl, 
            resourceData.type, 
            resourceData.slug
          );
          
          if (cloudinaryUrl) {
            resourceData.imageUrl = cloudinaryUrl;
          }
        } catch (err) {
          console.error('Error processing image:', err);
          // Continue with creation even if image processing fails
        }
      }
      
      const newResource = new Resource(resourceData);
      
      // Save the resource to the database
      await newResource.save();
      
      // Return the created resource
      return res.status(201).json({
        success: true,
        message: 'Resource created successfully',
        resource: newResource
      });
    } catch (error) {
      console.error('Error creating resource:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create resource',
        error: error.message
      });
    }
  },

  /**
   * Get books that need Amazon data processing
   * @route GET /api/admin/books/unprocessed
   * @access Public (dev environment only)
   */
  getUnprocessedBooks: async (req, res) => {
    try {
      // Get pagination parameters
      const { page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * limit;
      
      // Find books that need processing (imageProcessed = false or null)
      const books = await Resource.find(
        { 
          type: 'book',
          $or: [
            { imageProcessed: false },
            { imageProcessed: { $exists: false } }
          ],
          skipped: { $ne: true } // Don't include skipped books
        },
        { 
          _id: 1,
          title: 1, 
          description: 1,
          slug: 1,
          bookDetails: 1,
          imageUrl: 1,
          isbn: 1,
          imageProcessed: 1
        }
      )
      .sort({ title: 1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
      
      // Get total count for pagination
      const total = await Resource.countDocuments({ 
        type: 'book',
        $or: [
          { imageProcessed: false },
          { imageProcessed: { $exists: false } }
        ],
        skipped: { $ne: true } // Don't include skipped books
      });
      
      // Get count of processed books
      const processedCount = await Resource.countDocuments({ 
        type: 'book',
        imageProcessed: true
      });
      
      res.status(200).json({
        success: true,
        count: books.length,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        processedCount,
        books
      });
    } catch (error) {
      console.error('Error in getUnprocessedBooks:', error);
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message
      });
    }
  },

  /**
   * Get the next unprocessed book
   * @route GET /api/admin/books/next-unprocessed
   * @access Public (dev environment only)
   */
  getNextUnprocessedBook: async (req, res) => {
    try {
      // Find the first unprocessed book
      const book = await Resource.findOne(
        { 
          type: 'book',
          $or: [
            { imageProcessed: false },
            { imageProcessed: { $exists: false } }
          ],
          skipped: { $ne: true } // Don't include skipped books
        },
        { 
          _id: 1,
          title: 1, 
          description: 1,
          slug: 1,
          bookDetails: 1,
          imageUrl: 1,
          isbn: 1,
          imageProcessed: 1
        }
      )
      .sort({ title: 1 })
      .lean();
      
      if (!book) {
        // Get counts for progress tracking
        const totalBooks = await Resource.countDocuments({ type: 'book' });
        const unprocessedCount = await Resource.countDocuments({ 
          type: 'book',
          $or: [
            { imageProcessed: false },
            { imageProcessed: { $exists: false } }
          ],
          skipped: { $ne: true } // Don't include skipped books
        });
        const processedCount = totalBooks - unprocessedCount;
        
        return res.status(200).json({
          success: true,
          book: null,
          allProcessed: true,
          progress: {
            processed: processedCount,
            total: totalBooks,
            remaining: unprocessedCount
          },
          message: 'All books have been processed!'
        });
      }
      
      // Get counts for progress tracking
      const totalBooks = await Resource.countDocuments({ type: 'book' });
      const unprocessedCount = await Resource.countDocuments({ 
        type: 'book',
        $or: [
          { imageProcessed: false },
          { imageProcessed: { $exists: false } }
        ],
        skipped: { $ne: true } // Don't include skipped books
      });
      const processedCount = totalBooks - unprocessedCount;
      
      res.status(200).json({
        success: true,
        book,
        progress: {
          processed: processedCount,
          total: totalBooks,
          remaining: unprocessedCount
        }
      });
    } catch (error) {
      console.error('Error in getNextUnprocessedBook:', error);
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message
      });
    }
  },

  /**
   * Update a book with Amazon data
   * @route PUT /api/admin/books/:id
   * @access Public (dev environment only)
   */
  updateBookData: async (req, res) => {
    try {
      const { id } = req.params;
      const { isbn, amazonUrl, imageUrl, pageCount } = req.body;
      
      // Validate required fields
      if (!amazonUrl) {
        return res.status(400).json({
          success: false,
          message: 'Amazon URL is required'
        });
      }
      
      // Find the book
      const book = await Resource.findById(id);
      
      if (!book) {
        return res.status(404).json({
          success: false,
          message: 'Book not found'
        });
      }
      
      // Update data
      const updateData = {
        url: amazonUrl
      };
      
      // Only add ISBN if it's provided
      if (isbn) {
        updateData.isbn = isbn;
      }

      // Update page count if provided
      if (pageCount) {
        // Update the bookDetails.pages field
        updateData['bookDetails.pages'] = parseInt(pageCount, 10);
      }
      
      // Process image if URL is provided
      if (imageUrl) {
        try {
          // Upload image to Cloudinary
          const cloudinaryUrl = await uploadImageToCloudinary(imageUrl, 'book', book.slug);
          
          if (cloudinaryUrl) {
            updateData.imageUrl = cloudinaryUrl;
            updateData.imageProcessed = true;
          }
        } catch (err) {
          console.error('Error processing image:', err);
          return res.status(400).json({
            success: false,
            message: `Image processing failed: ${err.message}`
          });
        }
      } else {
        // If no image URL is provided, still mark as processed
        updateData.imageProcessed = true;
      }
      
      // Update the book in the database
      const updatedBook = await Resource.findByIdAndUpdate(id, updateData, { new: true });
      
      res.status(200).json({
        success: true,
        message: 'Book updated successfully',
        book: updatedBook
      });
    } catch (error) {
      console.error('Error in updateBookData:', error);
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message
      });
    }
  },

  /**
   * Skip a book in the processing queue
   * @route PUT /api/admin/books/:id/skip
   * @access Public (dev environment only)
   */
  skipBook: async (req, res) => {
    try {
      const { id } = req.params;
      
      // Find the book
      const book = await Resource.findById(id);
      
      if (!book) {
        return res.status(404).json({
          success: false,
          message: 'Book not found'
        });
      }
      
      // Mark as skipped
      const updatedBook = await Resource.findByIdAndUpdate(
        id, 
        { skipped: true },
        { new: true }
      );
      
      res.status(200).json({
        success: true,
        message: 'Book skipped successfully',
        book: updatedBook
      });
    } catch (error) {
      console.error('Error in skipBook:', error);
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message
      });
    }
  },

  /**
   * Delete a book from the database
   * @route DELETE /api/admin/books/:id
   * @access Public (dev environment only)
   */
  deleteBook: async (req, res) => {
    try {
      const { id } = req.params;
      
      // Find the book
      const book = await Resource.findById(id);
      
      if (!book) {
        return res.status(404).json({
          success: false,
          message: 'Book not found'
        });
      }
      
      // Delete the book
      await Resource.findByIdAndDelete(id);
      
      res.status(200).json({
        success: true,
        message: 'Book deleted successfully'
      });
    } catch (error) {
      console.error('Error in deleteBook:', error);
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message
      });
    }
  },

  /**
   * Get progress statistics
   * @route GET /api/admin/books/progress
   * @access Public (dev environment only)
   */
  getProgress: async (req, res) => {
    try {
      // Get total count of books
      const totalBooks = await Resource.countDocuments({ type: 'book' });
      
      // Get count of unprocessed books
      const unprocessedBooks = await Resource.countDocuments({ 
        type: 'book',
        $or: [
          { imageProcessed: false },
          { imageProcessed: { $exists: false } }
        ],
        skipped: { $ne: true } // Don't include skipped books
      });
      
      // Calculate processed books
      const processedBooks = totalBooks - unprocessedBooks;
      
      // Calculate percentage complete
      const percentComplete = totalBooks > 0 
        ? Math.round((processedBooks / totalBooks) * 100) 
        : 0;
      
      res.status(200).json({
        success: true,
        progress: {
          total: totalBooks,
          processed: processedBooks,
          unprocessed: unprocessedBooks,
          percentComplete
        }
      });
    } catch (error) {
      console.error('Error in getProgress:', error);
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message
      });
    }
  },

  /**
   * Get all resources with optional type filtering
   * @route GET /api/admin/resources
   * @access Public (dev environment only)
   */
  getAllResources: async (req, res) => {
    try {
      // Get filters from query params
      const { type, processed, search } = req.query;
      
      // Build query object
      const query = {};
      
      // Add type filter if provided
      if (type) {
        query.type = type;
      } else {
        // Exclude 'video' type resources when not filtering by type
        query.type = { $ne: 'video' };
      }
      
      // Add processed status filter if provided
      if (processed !== undefined) {
        // Convert string 'true'/'false' to boolean
        query.processed = processed === 'true';
      }
      
      // Add search functionality if search term is provided
      if (search && search.trim() !== '') {
        const searchRegex = new RegExp(search.trim(), 'i');
        query.$or = [
          { title: searchRegex },
          { description: searchRegex },
          { tags: searchRegex }
        ];
      }
      
      // Find resources matching query
      const resources = await Resource.find(
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
          publishedDate: 1,
          processed: 1,
          createdAt: 1,
          tags: 1
        }
      )
      .sort({ title: 1 })
      .lean();
      
      // Get counts by type for filtering UI, excluding 'video' type
      const typeCounts = await Resource.aggregate([
        { $match: { type: { $ne: 'video' } } },
        { $group: { _id: '$type', count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]);
      
      res.status(200).json({
        success: true,
        count: resources.length,
        resources,
        typeCounts
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
   * Get a specific resource by ID
   * @route GET /api/admin/resources/:id
   * @access Public (dev environment only)
   */
  getResourceById: async (req, res) => {
    try {
      const { id } = req.params;
      
      // Find the resource
      const resource = await Resource.findById(id).lean();
      
      if (!resource) {
        return res.status(404).json({
          success: false,
          message: 'Resource not found'
        });
      }
      
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
   * Update a resource
   * @route PUT /api/admin/resources/:id
   * @access Public (dev environment only)
   */
  updateResource: async (req, res) => {
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
      
      // Process image if URL is provided and it's not already a Cloudinary URL
      if (updateData.imageUrl && !updateData.imageUrl.includes('res.cloudinary.com')) {
        try {
          // Upload image to Cloudinary
          const cloudinaryUrl = await uploadImageToCloudinary(
            updateData.imageUrl, 
            updateData.type || resource.type, 
            updateData.slug || resource.slug
          );
          
          if (cloudinaryUrl) {
            updateData.imageUrl = cloudinaryUrl;
          }
        } catch (err) {
          console.error('Error processing image:', err);
          // Continue with update even if image processing fails
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
        message: 'Resource updated successfully',
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
   * @route DELETE /api/admin/resources/:id
   * @access Public (dev environment only)
   */
  deleteResource: async (req, res) => {
    try {
      const { id } = req.params;
      
      // Find the resource
      const resource = await Resource.findById(id);
      
      if (!resource) {
        return res.status(404).json({
          success: false,
          message: 'Resource not found'
        });
      }
      
      // Delete the resource
      await Resource.findByIdAndDelete(id);
      
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
   * Bulk import entities (resources, teachers, or traditions)
   * @route POST /api/admin/bulk-import
   * @access Private (admin only)
   */
  bulkImport: async (req, res) => {
    try {
      console.log('Bulk import request received');
      console.log('Request body:', req.body);
      console.log('Request query:', req.query);
      
      const { entities } = req.body;
      const { entityType } = req.query;
      
      if (!entities || !Array.isArray(entities) || entities.length === 0) {
        return res.status(400).json({
          success: false,
          message: `Invalid request: ${entityType}s must be a non-empty array`
        });
      }
      
      if (!['resource', 'teacher', 'tradition'].includes(entityType)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid entity type. Must be one of: resource, teacher, tradition'
        });
      }
      
      // Track results
      const results = {
        success: 0,
        errors: []
      };
      
      // Select the appropriate model based on entity type
      let Model;
      let nameField = 'title'; // Default for resources
      
      switch (entityType) {
        case 'teacher':
          Model = Teacher;
          nameField = 'name';
          break;
        case 'tradition':
          Model = Tradition;
          nameField = 'name';
          break;
        default: // resource
          Model = Resource;
          nameField = 'title';
      }
      
      // Process each entity
      for (const entityData of entities) {
        try {
          // Check for required fields based on entity type
          let missingFields = false;
          
          if (entityType === 'resource') {
            if (!entityData.title || !entityData.description || !entityData.type) {
              results.errors.push(`Resource with title "${entityData.title || 'Unknown'}" is missing required fields`);
              missingFields = true;
            }
          } else if (entityType === 'teacher') {
            if (!entityData.name || !entityData.biography) {
              results.errors.push(`Teacher with name "${entityData.name || 'Unknown'}" is missing required fields`);
              missingFields = true;
            }
          } else if (entityType === 'tradition') {
            if (!entityData.name || !entityData.description) {
              results.errors.push(`Tradition with name "${entityData.name || 'Unknown'}" is missing required fields`);
              missingFields = true;
            }
          }
          
          if (missingFields) continue;
          
          // Generate slug if not provided
          if (!entityData.slug) {
            const slugBase = entityData[nameField]
              .toLowerCase()
              .replace(/[^\w\s-]/g, '') // Remove special characters
              .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
              .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
            
            // Check if slug exists and append random string if needed
            let slug = slugBase;
            let slugExists = await Model.findOne({ slug });
            let counter = 0;
            
            while (slugExists && counter < 10) {
              counter++;
              slug = `${slugBase}-${counter}`;
              slugExists = await Model.findOne({ slug });
            }
            
            entityData.slug = slug;
          }
          
          // Create a new entity
          const entity = new Model(entityData);
          
          // Save the entity
          await entity.save();
          
          // Increment success counter
          results.success++;
        } catch (error) {
          // Add error to results
          const entityName = entityData[nameField] || 'Unknown';
          results.errors.push(`Error importing ${entityType} "${entityName}": ${error.message}`);
        }
      }
      
      // Return results
      res.status(200).json({
        success: true,
        message: `Successfully imported ${results.success} ${entityType}s with ${results.errors.length} errors`,
        ...results
      });
    } catch (error) {
      console.error(`Error in bulkImport for ${req.query.entityType || 'unknown entity type'}:`, error);
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message
      });
    }
  },

  /**
   * Bulk import resources (legacy method for backward compatibility)
   * @route POST /api/admin/bulk-import
   * @access Private (admin only)
   */
  bulkImportResources: async (req, res) => {
    try {
      const { resources } = req.body;
      
      // If entityType is specified, use the new unified method
      if (req.query.entityType) {
        req.body.entities = resources;
        return adminController.bulkImport(req, res);
      }
      
      if (!resources || !Array.isArray(resources) || resources.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid request: resources must be a non-empty array'
        });
      }
      
      // Track results
      const results = {
        success: 0,
        errors: []
      };
      
      // Process each resource
      for (const resourceData of resources) {
        try {
          // Ensure required fields
          if (!resourceData.title || !resourceData.description || !resourceData.type) {
            results.errors.push(`Resource with title "${resourceData.title || 'Unknown'}" is missing required fields`);
            continue;
          }
          
          // Generate slug if not provided
          if (!resourceData.slug) {
            const slugBase = resourceData.title
              .toLowerCase()
              .replace(/[^\w\s-]/g, '') // Remove special characters
              .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
              .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
            
            // Check if slug exists and append random string if needed
            let slug = slugBase;
            let slugExists = await Resource.findOne({ slug });
            let counter = 0;
            
            while (slugExists && counter < 10) {
              counter++;
              slug = `${slugBase}-${counter}`;
              slugExists = await Resource.findOne({ slug });
            }
            
            resourceData.slug = slug;
          }
          
          // Create a new resource
          const resource = new Resource(resourceData);
          
          // Save the resource
          await resource.save();
          
          // Increment success counter
          results.success++;
        } catch (error) {
          // Add error to results
          results.errors.push(`Error importing resource "${resourceData.title || 'Unknown'}": ${error.message}`);
        }
      }
      
      // Return results
      res.status(200).json({
        success: true,
        message: `Successfully imported ${results.success} resources with ${results.errors.length} errors`,
        ...results
      });
    } catch (error) {
      console.error('Error in bulkImportResources:', error);
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message
      });
    }
  },

  /**
   * Get all teachers with optional filtering
   * @route GET /api/admin/teachers
   * @access Private (admin only)
   */
  getAllTeachers: async (req, res) => {
    try {
      // Get query parameters
      const { clerkId } = req.query;
      
      // Verify clerk ID is provided
      if (!clerkId) {
        return res.status(400).json({
          success: false,
          message: 'Clerk ID is required'
        });
      }
      
      // Build query
      const query = {};
      
      // Fetch teachers
      const teachers = await Teacher.find(query).sort({ name: 1 });
      
      // Return teachers
      return res.status(200).json({
        success: true,
        teachers
      });
    } catch (error) {
      console.error('Error fetching teachers:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch teachers',
        error: error.message
      });
    }
  },

  /**
   * Get a specific teacher by ID
   * @route GET /api/admin/teachers/:id
   * @access Private (admin only)
   */
  getTeacherById: async (req, res) => {
    try {
      const { id } = req.params;
      const { clerkId } = req.query;
      
      // Verify clerk ID is provided
      if (!clerkId) {
        return res.status(400).json({
          success: false,
          message: 'Clerk ID is required'
        });
      }
      
      // Find the teacher
      const teacher = await Teacher.findById(id).populate('traditions');
      
      if (!teacher) {
        return res.status(404).json({
          success: false,
          message: 'Teacher not found'
        });
      }
      
      // Return the teacher
      return res.status(200).json({
        success: true,
        teacher
      });
    } catch (error) {
      console.error('Error fetching teacher:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch teacher',
        error: error.message
      });
    }
  },

  /**
   * Create a new teacher
   * @route POST /api/admin/teachers
   * @access Private (admin only)
   */
  createTeacher: async (req, res) => {
    try {
      const { clerkId } = req.query;
      
      // Verify clerk ID is provided
      if (!clerkId) {
        return res.status(400).json({
          success: false,
          message: 'Clerk ID is required'
        });
      }
      
      // Get teacher data from request body
      const teacherData = req.body;
      
      // Generate slug if not provided
      if (!teacherData.slug) {
        teacherData.slug = teacherData.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
      }
      
      // Process image if URL is provided and it's not already a Cloudinary URL
      if (teacherData.imageUrl && !teacherData.imageUrl.includes('res.cloudinary.com')) {
        try {
          console.log('Attempting to upload image to Cloudinary:', {
            imageUrl: teacherData.imageUrl,
            entityType: 'teacher',
            slug: teacherData.slug
          });
          
          // Upload image to Cloudinary
          const cloudinaryUrl = await uploadImageToCloudinary(
            teacherData.imageUrl, 
            'teacher', 
            teacherData.slug
          );
          
          if (cloudinaryUrl) {
            console.log('Successfully uploaded image to Cloudinary:', cloudinaryUrl);
            teacherData.imageUrl = cloudinaryUrl;
          } else {
            console.error('Failed to upload image to Cloudinary: No URL returned');
          }
        } catch (err) {
          console.error('Error processing image:', err);
          // Continue with creation even if image processing fails
        }
      } else {
        console.log('No image upload needed:', 
          teacherData.imageUrl ? 'URL is already a Cloudinary URL' : 'No image URL provided');
      }
      
      // Create the teacher
      const teacher = await Teacher.create(teacherData);
      
      // Return the created teacher
      return res.status(201).json({
        success: true,
        message: 'Teacher created successfully',
        teacher
      });
    } catch (error) {
      console.error('Error creating teacher:', error);
      
      // Handle duplicate key error
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: 'A teacher with this name or slug already exists',
          error: error.message
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Failed to create teacher',
        error: error.message
      });
    }
  },

  /**
   * Update a teacher
   * @route PUT /api/admin/teachers/:id
   * @access Private (admin only)
   */
  updateTeacher: async (req, res) => {
    try {
      // Log the request body
      console.log('UPDATE TEACHER REQUEST BODY:', req.body);
      
      // Test Cloudinary configuration
      console.log('Cloudinary Configuration Test:', {
        CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ? 'Set' : 'Missing',
        API_KEY: process.env.CLOUDINARY_API_KEY ? 'Set' : 'Missing',
        API_SECRET: process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Missing'
      });
      
      const { id } = req.params;
      const { clerkId } = req.query;
      
      // Verify clerk ID is provided
      if (!clerkId) {
        return res.status(400).json({
          success: false,
          message: 'Clerk ID is required'
        });
      }
      
      // Get update data from request body
      const updateData = req.body;
      
      // Find the teacher
      const teacher = await Teacher.findById(id);
      
      if (!teacher) {
        return res.status(404).json({
          success: false,
          message: 'Teacher not found'
        });
      }
      
      // Process image if URL is provided
      if (updateData.imageUrl) {
        console.log('IMAGE URL DETECTED:', updateData.imageUrl);
        
        // Check if it's already a Cloudinary URL
        const isCloudinaryUrl = updateData.imageUrl.includes('res.cloudinary.com');
        console.log('IS CLOUDINARY URL:', isCloudinaryUrl);
        
        if (!isCloudinaryUrl) {
          console.log('ATTEMPTING CLOUDINARY UPLOAD');
          try {
            // Upload image to Cloudinary
            const cloudinaryUrl = await uploadImageToCloudinary(
              updateData.imageUrl, 
              'teacher', 
              updateData.slug || teacher.slug
            );
            
            if (cloudinaryUrl) {
              console.log('CLOUDINARY UPLOAD SUCCESS:', cloudinaryUrl);
              updateData.imageUrl = cloudinaryUrl;
            } else {
              console.error('CLOUDINARY UPLOAD FAILED: No URL returned');
            }
          } catch (err) {
            console.error('CLOUDINARY UPLOAD ERROR:', err.message);
            // Continue with update even if image processing fails
          }
        } else {
          console.log('SKIPPING CLOUDINARY UPLOAD: Already a Cloudinary URL');
        }
      } else {
        console.log('NO IMAGE URL PROVIDED');
      }
      
      // Update the teacher
      const updatedTeacher = await Teacher.findByIdAndUpdate(
        id, 
        updateData, 
        { new: true }
      );
      
      return res.status(200).json({
        success: true,
        message: 'Teacher updated successfully',
        teacher: updatedTeacher
      });
    } catch (error) {
      console.error('Error updating teacher:', error);
      
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: 'A teacher with this name or slug already exists',
          error: error.message
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Failed to update teacher',
        error: error.message
      });
    }
  },

  /**
   * Delete a teacher
   * @route DELETE /api/admin/teachers/:id
   * @access Private (admin only)
   */
  deleteTeacher: async (req, res) => {
    try {
      const { id } = req.params;
      const { clerkId } = req.query;
      
      // Verify clerk ID is provided
      if (!clerkId) {
        return res.status(400).json({
          success: false,
          message: 'Clerk ID is required'
        });
      }
      
      // Find and delete the teacher
      const teacher = await Teacher.findByIdAndDelete(id);
      
      if (!teacher) {
        return res.status(404).json({
          success: false,
          message: 'Teacher not found'
        });
      }
      
      // Return success message
      return res.status(200).json({
        success: true,
        message: 'Teacher deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting teacher:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete teacher',
        error: error.message
      });
    }
  },

  /**
   * Get all traditions with optional filtering
   * @route GET /api/admin/traditions
   * @access Private (admin only)
   */
  getAllTraditions: async (req, res) => {
    try {
      // Get query parameters
      const { clerkId } = req.query;
      
      // Verify clerk ID is provided
      if (!clerkId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }
      
      // Get all traditions
      const traditions = await Tradition.find()
        .sort({ name: 1 });
      
      res.status(200).json({
        success: true,
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
   * Get a specific tradition by ID
   * @route GET /api/admin/traditions/:id
   * @access Private (admin only)
   */
  getTraditionById: async (req, res) => {
    try {
      const { id } = req.params;
      const { clerkId } = req.query;
      
      // Verify clerk ID is provided
      if (!clerkId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }
      
      // Find tradition by ID
      const tradition = await Tradition.findById(id)
        .populate('relatedTraditions', 'name slug');
      
      if (!tradition) {
        return res.status(404).json({
          success: false,
          message: 'Tradition not found'
        });
      }
      
      res.status(200).json({
        success: true,
        tradition
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
   * @route POST /api/admin/traditions
   * @access Private (admin only)
   */
  createTradition: async (req, res) => {
    try {
      const traditionData = req.body;
      const { clerkId } = req.query;
      
      // Verify clerk ID is provided
      if (!clerkId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }
      
      // Process image if provided
      if (traditionData.imageUrl && !traditionData.imageUrl.includes('res.cloudinary.com')) {
        // Upload image to Cloudinary
        const cloudinaryUrl = await uploadImageToCloudinary(
          traditionData.imageUrl, 
          'tradition', 
          traditionData.slug
        );
        
        if (cloudinaryUrl) {
          traditionData.imageUrl = cloudinaryUrl;
        }
      }
      
      // Create new tradition
      const tradition = new Tradition(traditionData);
      await tradition.save();
      
      res.status(201).json({
        success: true,
        message: 'Tradition created successfully',
        tradition
      });
    } catch (error) {
      console.error('Error creating tradition:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating tradition',
        error: error.message
      });
    }
  },
  
  /**
   * Update a tradition
   * @route PUT /api/admin/traditions/:id
   * @access Private (admin only)
   */
  updateTradition: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const { clerkId } = req.query;
      
      // Verify clerk ID is provided
      if (!clerkId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }
      
      // Find tradition by ID
      const tradition = await Tradition.findById(id);
      
      if (!tradition) {
        return res.status(404).json({
          success: false,
          message: 'Tradition not found'
        });
      }
      
      // Process image if provided and not already a Cloudinary URL
      if (updateData.imageUrl && !updateData.imageUrl.includes('res.cloudinary.com')) {
        // Upload image to Cloudinary
        const cloudinaryUrl = await uploadImageToCloudinary(
          updateData.imageUrl, 
          'tradition', 
          updateData.slug || tradition.slug
        );
        
        if (cloudinaryUrl) {
          updateData.imageUrl = cloudinaryUrl;
        }
      }
      
      // Update tradition
      const updatedTradition = await Tradition.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );
      
      res.status(200).json({
        success: true,
        message: 'Tradition updated successfully',
        tradition: updatedTradition
      });
    } catch (error) {
      console.error('Error updating tradition:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating tradition',
        error: error.message
      });
    }
  },
  
  /**
   * Delete a tradition
   * @route DELETE /api/admin/traditions/:id
   * @access Private (admin only)
   */
  deleteTradition: async (req, res) => {
    try {
      const { id } = req.params;
      const { clerkId } = req.query;
      
      // Verify clerk ID is provided
      if (!clerkId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }
      
      // Find and delete tradition
      const tradition = await Tradition.findByIdAndDelete(id);
      
      if (!tradition) {
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
  }
};

/**
 * Upload image to Cloudinary (Legacy wrapper for backward compatibility)
 * @param {Buffer} imageBuffer - Image buffer
 * @param {string} fileName - File name
 * @returns {Promise<string>} - Cloudinary URL
 */
async function uploadToCloudinary(imageBuffer, fileName) {
  try {
    // Create a temporary local file URL (in-memory)
    const tempUrl = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;
    
    // Use the new utility function
    return await uploadImageToCloudinary(tempUrl, 'book', fileName);
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error.message);
    throw error;
  }
}

module.exports = adminController;
