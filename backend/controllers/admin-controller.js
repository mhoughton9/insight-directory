const Resource = require('../models/resource');
const fetch = require('node-fetch');
const FormData = require('form-data');
const crypto = require('crypto');

// Cloudinary configuration
const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

/**
 * Admin controller for book data management
 */
const adminController = {
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
          // Generate a safe filename from the book slug
          const fileName = book.slug.replace(/[^a-z0-9]/gi, '_').toLowerCase();
          
          // Download and upload the image
          const imageResponse = await fetch(imageUrl);
          if (!imageResponse.ok) {
            throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
          }
          
          const imageBuffer = await imageResponse.buffer();
          const cloudinaryUrl = await uploadToCloudinary(imageBuffer, fileName);
          
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
      // Get type filter from query params
      const { type } = req.query;
      
      // Build query object
      const query = {};
      if (type) {
        query.type = type;
      } else {
        // Exclude 'video' type resources when not filtering by type
        query.type = { $ne: 'video' };
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
  }
};

/**
 * Upload image to Cloudinary
 * @param {Buffer} imageBuffer - Image buffer
 * @param {string} fileName - File name
 * @returns {Promise<string>} - Cloudinary URL
 */
async function uploadToCloudinary(imageBuffer, fileName) {
  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const publicId = `books/${fileName}`; // Store in 'books' folder
    const transformation = 'c_fill,w_500,h_750,q_auto';
    
    // Create an object with all parameters to be signed
    const paramsToSign = {
      public_id: publicId,
      timestamp: timestamp.toString(),
      transformation: transformation
    };
    
    // Sort parameters alphabetically and create the string to sign
    const paramsSorted = Object.keys(paramsToSign)
      .sort()
      .map(key => `${key}=${paramsToSign[key]}`)
      .join('&');
    
    // Generate signature by appending API secret
    const signatureString = paramsSorted + API_SECRET;
    const signature = crypto.createHash('sha1').update(signatureString).digest('hex');
    
    // Create form data for upload
    const formData = new FormData();
    formData.append('file', imageBuffer, { filename: `${fileName}.jpg` });
    formData.append('api_key', API_KEY);
    formData.append('timestamp', timestamp.toString());
    formData.append('signature', signature);
    formData.append('public_id', publicId);
    formData.append('transformation', transformation);
    
    // Upload to Cloudinary
    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('Cloudinary error response:', data);
      throw new Error(data.error?.message || 'Failed to upload image to Cloudinary');
    }
    
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error.message);
    throw error;
  }
}

module.exports = adminController;
