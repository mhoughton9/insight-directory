const mongoose = require('mongoose');
require('dotenv').config();

/**
 * Establishes connection to MongoDB database with optimized settings
 * Using MongoDB driver 4.x+ compatible options
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Connection pool is now managed via maxPoolSize instead of poolSize
      maxPoolSize: 10,
      // Add write concern for better performance/reliability balance
      writeConcern: {
        w: 'majority',
        j: true,
        wtimeout: 1000
      },
      // Add read preference for better read performance
      readPreference: 'secondaryPreferred',
      // Add connection timeout settings
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000
      // Removed deprecated keepAlive options
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
