const mongoose = require('mongoose');
const Resource = require('../models/Resource');
require('dotenv').config();

const updateBookResource = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('MongoDB Connected');
    
    // Find the book resource by slug
    const book = await Resource.findOne({ slug: 'power-of-now' });
    
    if (!book) {
      console.log('Book not found');
      return;
    }
    
    // Update book details
    book.bookDetails = {
      author: ['Eckhart Tolle'],
      yearPublished: 1997,
      pages: 236,
      publisher: 'Namaste Publishing',
      links: [
        'https://www.amazon.com/Power-Now-Guide-Spiritual-Enlightenment/dp/1577314808',
        'https://eckharttolle.com/books/the-power-of-now/'
      ]
    };
    
    // Update tags
    book.tags = ['Presence', 'Mindfulness', 'Ego', 'Consciousness', 'Spirituality'];
    
    // Save the updated book
    await book.save();
    
    console.log('Book resource updated successfully');
    
    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
    
  } catch (error) {
    console.error('Error updating book resource:', error);
  }
};

// Run the function
updateBookResource();
