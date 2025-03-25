/**
 * Comment Seeding Script
 * 
 * This script populates the database with sample comments for testing.
 * It creates comments for existing resources, teachers, and traditions.
 */

const mongoose = require('mongoose');
const { User, Resource, Teacher, Tradition, Comment } = require('../models');
require('dotenv').config();

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/awakening-resources';

// Sample comments content
const sampleComments = [
  'This has been incredibly helpful in my journey. Thank you for sharing!',
  'I found this perspective very enlightening. It shifted my understanding in a profound way.',
  'While I appreciate the insights here, I have a different experience with this approach.',
  "This resonated deeply with me. It articulates exactly what I've been experiencing.",
  "I've been recommending this to everyone I know. Life-changing!",
  'The clarity and depth here is remarkable. I keep coming back to this.',
  'I have some questions about how this relates to traditional practices. Can anyone clarify?',
  "This helped me break through a plateau I'd been stuck on for months.",
  "I'm grateful this exists. It came to me at exactly the right time.",
  'The authenticity here is refreshing in a field often filled with jargon.'
];

/**
 * Find or create a test user for comments
 */
async function ensureTestUser() {
  console.log('Checking for existing users...');
  
  // First try to find any existing user we can use
  let testUser = await User.findOne({});
  
  if (testUser) {
    console.log('Using existing user with ID:', testUser._id);
    return testUser;
  }
  
  // If no users exist, create a test user
  console.log('No users found. Creating test user...');
  const timestamp = Date.now();
  
  testUser = new User({
    name: 'Test User',
    username: `testuser_${timestamp}`,
    email: `test_${timestamp}@example.com`,
    clerkId: `test_clerk_id_${timestamp}`,
    imageUrl: 'https://via.placeholder.com/150',
    bio: 'This is a test user for development purposes.',
    role: 'user'
  });
  
  await testUser.save();
  console.log('Test user created with ID:', testUser._id);
  
  return testUser;
}

/**
 * Get random items from an array
 */
function getRandomItems(array, count) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

/**
 * Create comments for a specific entity type
 */
async function createCommentsForEntity(entityType, entities, userId) {
  console.log(`Creating comments for ${entityType}s...`);
  
  let createdCount = 0;
  
  for (const entity of entities) {
    // Determine how many comments to create (1-3 per entity)
    const commentCount = Math.floor(Math.random() * 3) + 1;
    
    // Get random comments from our sample set
    const selectedComments = getRandomItems(sampleComments, commentCount);
    
    for (const content of selectedComments) {
      try {
        const commentData = {
          content,
          user: userId,
          entityType,
          [entityType]: entity._id
        };
        
        const comment = new Comment(commentData);
        await comment.save();
        createdCount++;
      } catch (error) {
        console.error(`Error creating comment for ${entityType} ${entity._id}:`, error.message);
      }
    }
  }
  
  console.log(`Created ${createdCount} comments for ${entityType}s`);
}

/**
 * Main seeding function
 */
async function seedComments() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Ensure we have a test user
    const testUser = await ensureTestUser();
    
    // Get existing entities from the database
    const resources = await Resource.find().limit(10);
    const teachers = await Teacher.find().limit(10);
    const traditions = await Tradition.find().limit(10);
    
    console.log(`Found ${resources.length} resources, ${teachers.length} teachers, and ${traditions.length} traditions`);
    
    // Check if we have entities to comment on
    if (resources.length === 0 && teachers.length === 0 && traditions.length === 0) {
      console.error('No entities found to create comments for. Please ensure your database has resources, teachers, or traditions.');
      process.exit(1);
    }
    
    // Create comments for each entity type
    if (resources.length > 0) {
      await createCommentsForEntity('resource', resources, testUser._id);
    }
    
    if (teachers.length > 0) {
      await createCommentsForEntity('teacher', teachers, testUser._id);
    }
    
    if (traditions.length > 0) {
      await createCommentsForEntity('tradition', traditions, testUser._id);
    }
    
    console.log('Comment seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding comments:', error);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the seeding function
seedComments();
