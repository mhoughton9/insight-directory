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
          ]
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
        ]
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
          ]
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
        return res.status(404).json({
          success: false,
          message: 'No unprocessed books found'
        });
      }
      
      // Get counts for progress tracking
      const totalBooks = await Resource.countDocuments({ type: 'book' });
      const unprocessedCount = await Resource.countDocuments({ 
        type: 'book',
        $or: [
          { imageProcessed: false },
          { imageProcessed: { $exists: false } }
        ]
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
      const { isbn, amazonUrl, imageUrl } = req.body;
      
      // Validate required fields
      if (!isbn || !amazonUrl) {
        return res.status(400).json({
          success: false,
          message: 'ISBN and Amazon URL are required'
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
        isbn,
        url: amazonUrl
      };
      
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
        } catch (imageError) {
          console.error('Error processing image:', imageError);
          return res.status(400).json({
            success: false,
            message: 'Error processing image',
            error: imageError.message
          });
        }
      } else {
        // If no image URL is provided, still mark as processed
        updateData.imageProcessed = true;
      }
      
      // Update the book
      const updatedBook = await Resource.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );
      
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
   * Get progress statistics
   * @route GET /api/admin/books/progress
   * @access Public (dev environment only)
   */
  getProgress: async (req, res) => {
    try {
      // Get total books count
      const totalBooks = await Resource.countDocuments({ type: 'book' });
      
      // Get processed books count
      const processedBooks = await Resource.countDocuments({ 
        type: 'book', 
        imageProcessed: true 
      });
      
      // Get unprocessed books count
      const unprocessedBooks = await Resource.countDocuments({ 
        type: 'book',
        $or: [
          { imageProcessed: false },
          { imageProcessed: { $exists: false } }
        ]
      });
      
      res.status(200).json({
        success: true,
        progress: {
          total: totalBooks,
          processed: processedBooks,
          unprocessed: unprocessedBooks,
          percentComplete: totalBooks > 0 ? Math.round((processedBooks / totalBooks) * 100) : 0
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
    
    // Generate signature for authentication
    const signature = crypto
      .createHash('sha1')
      .update(`public_id=${publicId}&timestamp=${timestamp}${API_SECRET}`)
      .digest('hex');
    
    // Create form data for upload
    const formData = new FormData();
    formData.append('file', imageBuffer, { filename: `${fileName}.jpg` });
    formData.append('timestamp', timestamp.toString());
    formData.append('api_key', API_KEY);
    formData.append('signature', signature);
    formData.append('public_id', publicId);
    
    // Add transformation parameters for consistent book covers
    // c_fill: crop and fill to maintain aspect ratio
    // w_500,h_750: standard book cover dimensions (2:3 ratio)
    // q_auto: automatic quality optimization
    formData.append('transformation', 'c_fill,w_500,h_750,q_auto');
    
    // Upload to Cloudinary
    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    
    if (data.secure_url) {
      return data.secure_url;
    } else {
      throw new Error(data.error ? data.error.message : 'Unknown error');
    }
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error.message);
    throw error;
  }
}

module.exports = adminController;
