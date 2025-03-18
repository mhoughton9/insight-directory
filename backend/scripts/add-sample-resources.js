/**
 * Script to add sample resources of different types to the database
 * Run with: node scripts/add-sample-resources.js
 */

const mongoose = require('mongoose');
const Resource = require('../models/resource');
const Teacher = require('../models/teacher');
const Tradition = require('../models/tradition');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  });

// Sample resources data
const sampleResources = [
  // Book sample
  {
    title: 'The Power of Now',
    description: 'A guide to spiritual enlightenment that emphasizes the importance of living in the present moment and transcending thoughts of the past or future.',
    type: 'book',
    url: 'https://example.com/power-of-now',
    imageUrl: 'https://example.com/power-of-now.jpg',
    publishedDate: new Date('1997-01-01'),
    tags: ['spirituality', 'mindfulness', 'presence', 'consciousness'],
    slug: 'power-of-now',
    bookDetails: {
      publisher: 'New World Library',
      pages: 236,
      language: 'English'
    },
    featured: true,
    viewCount: 1250
  },
  // Video sample
  {
    title: 'The Nature of Consciousness',
    description: 'An in-depth exploration of consciousness, its nature, and how to recognize it as our fundamental reality.',
    type: 'video',
    url: 'https://example.com/nature-of-consciousness',
    imageUrl: 'https://example.com/nature-of-consciousness.jpg',
    publishedDate: new Date('2020-05-15'),
    tags: ['consciousness', 'awareness', 'non-duality', 'spirituality'],
    slug: 'nature-of-consciousness',
    videoDetails: {
      duration: '1:28:45',
      platform: 'YouTube'
    },
    featured: false,
    viewCount: 876
  },
  // Article sample
  {
    title: 'Understanding Non-Duality',
    description: 'A comprehensive article explaining the concept of non-duality and its significance in various spiritual traditions.',
    type: 'article',
    url: 'https://example.com/understanding-non-duality',
    imageUrl: 'https://example.com/understanding-non-duality.jpg',
    publishedDate: new Date('2022-03-10'),
    tags: ['non-duality', 'advaita', 'spirituality', 'consciousness'],
    slug: 'understanding-non-duality',
    wordCount: 2500,
    featured: false,
    viewCount: 543
  }
];

// Function to add sample resources
async function addSampleResources() {
  try {
    // Get teachers and traditions for references
    const teachers = await Teacher.find().lean();
    const traditions = await Tradition.find().lean();
    
    if (teachers.length === 0 || traditions.length === 0) {
      console.warn('Warning: No teachers or traditions found. Resources will be created without references.');
    }
    
    // Assign teachers and traditions to resources
    const resourcesWithRefs = sampleResources.map(resource => {
      // Randomly assign 1-2 teachers
      if (teachers.length > 0) {
        const teacherCount = Math.floor(Math.random() * 2) + 1;
        const shuffledTeachers = [...teachers].sort(() => 0.5 - Math.random());
        resource.teachers = shuffledTeachers.slice(0, teacherCount).map(t => t._id);
      }
      
      // Randomly assign 1-2 traditions
      if (traditions.length > 0) {
        const traditionCount = Math.floor(Math.random() * 2) + 1;
        const shuffledTraditions = [...traditions].sort(() => 0.5 - Math.random());
        resource.traditions = shuffledTraditions.slice(0, traditionCount).map(t => t._id);
      }
      
      return resource;
    });
    
    // Check if resources already exist by slug
    for (const resource of resourcesWithRefs) {
      const exists = await Resource.findOne({ slug: resource.slug });
      
      if (exists) {
        console.log(`Resource '${resource.title}' already exists. Skipping...`);
      } else {
        const newResource = await Resource.create(resource);
        console.log(`Added new ${resource.type}: ${resource.title}`);
      }
    }
    
    console.log('Sample resources added successfully!');
  } catch (error) {
    console.error('Error adding sample resources:', error);
  } finally {
    mongoose.disconnect();
  }
}

// Run the function
addSampleResources();
