require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user');

async function updateUserRole() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const result = await User.findOneAndUpdate(
      { clerkId: 'user_2udVqD2UHTR7pqFQgAF7A2RT3PG' },
      { role: 'admin' },
      { new: true }
    );
    
    console.log('User updated:', result);
  } catch (error) {
    console.error('Error updating user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

updateUserRole();
