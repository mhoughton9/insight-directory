const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = require('../config/db');
const { Tradition, Teacher, Resource, User } = require('../models');

/**
 * Seed data utility for populating the database with initial data
 */

// Sample traditions data
const traditions = [
  {
    name: 'Advaita Vedanta',
    description: 'A school of Hindu philosophy and religious practice that emphasizes the oneness of Atman (soul) and Brahman (ultimate reality).',
    origin: 'India',
    foundingPeriod: '8th century CE',
    keyTexts: ['Upanishads', 'Bhagavad Gita', 'Brahma Sutras'],
    slug: 'advaita-vedanta'
  },
  {
    name: 'Zen Buddhism',
    description: 'A school of Mahayana Buddhism that emphasizes meditation and direct insight into Buddha-nature.',
    origin: 'China/Japan',
    foundingPeriod: '6th century CE',
    keyTexts: ['Heart Sutra', 'Diamond Sutra', 'Blue Cliff Record'],
    slug: 'zen-buddhism'
  },
  {
    name: 'Direct Path',
    description: 'A modern approach to non-dual spirituality that emphasizes direct investigation of experience.',
    origin: 'Global',
    foundingPeriod: '20th century',
    keyTexts: [],
    slug: 'direct-path'
  }
];

// Sample teachers data
const teachers = [
  {
    name: 'Ramana Maharshi',
    biography: 'Renowned Indian sage who taught self-inquiry as the path to self-realization.',
    birthDate: '1879-12-30',
    deathDate: '1950-04-14',
    imageUrl: 'https://example.com/ramana.jpg',
    websiteUrl: 'https://ramana-maharshi.org',
    slug: 'ramana-maharshi'
  },
  {
    name: 'Eckhart Tolle',
    biography: 'Contemporary spiritual teacher known for his teachings on presence and the power of now.',
    birthDate: '1948-02-16',
    imageUrl: 'https://example.com/eckhart.jpg',
    websiteUrl: 'https://eckharttolle.com',
    slug: 'eckhart-tolle'
  },
  {
    name: 'Rupert Spira',
    biography: 'Contemporary non-duality teacher who explores the nature of experience through direct investigation.',
    birthDate: '1960-03-13',
    imageUrl: 'https://example.com/rupert.jpg',
    websiteUrl: 'https://rupertspira.com',
    slug: 'rupert-spira'
  }
];

// Sample resources data
const resources = [
  {
    title: 'Be As You Are: The Teachings of Sri Ramana Maharshi',
    description: 'A comprehensive collection of Ramana Maharshi\'s teachings on self-inquiry and self-realization.',
    type: 'book',
    url: 'https://example.com/be-as-you-are',
    imageUrl: 'https://example.com/be-as-you-are.jpg',
    publishedDate: '1985-01-01',
    author: 'Edited by David Godman',
    featured: true,
    slug: 'be-as-you-are'
  },
  {
    title: 'The Power of Now',
    description: 'A guide to spiritual enlightenment through living in the present moment.',
    type: 'book',
    url: 'https://example.com/power-of-now',
    imageUrl: 'https://example.com/power-of-now.jpg',
    publishedDate: '1997-01-01',
    author: 'Eckhart Tolle',
    featured: true,
    slug: 'power-of-now'
  },
  {
    title: 'The Transparency of Things',
    description: 'An exploration of the nature of experience and consciousness.',
    type: 'book',
    url: 'https://example.com/transparency-of-things',
    imageUrl: 'https://example.com/transparency-of-things.jpg',
    publishedDate: '2016-01-01',
    author: 'Rupert Spira',
    featured: false,
    slug: 'transparency-of-things'
  },
  {
    title: 'Who Am I?',
    description: 'A video exploration of self-inquiry with guided meditations.',
    type: 'video',
    url: 'https://example.com/who-am-i-video',
    imageUrl: 'https://example.com/who-am-i.jpg',
    duration: '45 minutes',
    featured: false,
    slug: 'who-am-i-video'
  },
  {
    title: 'Awareness Podcast',
    description: 'Weekly discussions on non-duality and awakening.',
    type: 'podcast',
    url: 'https://example.com/awareness-podcast',
    imageUrl: 'https://example.com/awareness-podcast.jpg',
    frequency: 'Weekly',
    featured: true,
    slug: 'awareness-podcast'
  }
];

// Sample user data
const users = [
  {
    name: 'Test User',
    email: 'test@example.com',
    clerkId: 'user_123456789',
    bio: 'A seeker on the spiritual path',
    imageUrl: 'https://example.com/test-user.jpg'
  }
];

/**
 * Seed the database with initial data
 */
const seedDatabase = async () => {
  try {
    // Connect to the database
    await connectDB();
    
    // Clear existing data
    await Tradition.deleteMany({});
    await Teacher.deleteMany({});
    await Resource.deleteMany({});
    await User.deleteMany({});
    
    console.log('Database cleared');
    
    // Insert traditions
    const createdTraditions = await Tradition.insertMany(traditions);
    console.log(`${createdTraditions.length} traditions inserted`);
    
    // Insert teachers with tradition references
    const teachersWithTraditions = teachers.map((teacher, index) => {
      // Assign traditions to teachers (for demo purposes)
      if (index === 0) { // Ramana Maharshi -> Advaita Vedanta
        return { ...teacher, traditions: [createdTraditions[0]._id] };
      } else if (index === 1) { // Eckhart Tolle -> Direct Path
        return { ...teacher, traditions: [createdTraditions[2]._id] };
      } else if (index === 2) { // Rupert Spira -> Direct Path & Advaita Vedanta
        return { ...teacher, traditions: [createdTraditions[0]._id, createdTraditions[2]._id] };
      }
      return teacher;
    });
    
    const createdTeachers = await Teacher.insertMany(teachersWithTraditions);
    console.log(`${createdTeachers.length} teachers inserted`);
    
    // Insert resources with teacher and tradition references
    const resourcesWithReferences = resources.map((resource, index) => {
      // Assign teachers and traditions to resources (for demo purposes)
      if (index === 0) { // Be As You Are -> Ramana & Advaita Vedanta
        return { 
          ...resource, 
          teachers: [createdTeachers[0]._id],
          traditions: [createdTraditions[0]._id]
        };
      } else if (index === 1) { // Power of Now -> Eckhart & Direct Path
        return { 
          ...resource, 
          teachers: [createdTeachers[1]._id],
          traditions: [createdTraditions[2]._id]
        };
      } else if (index === 2) { // Transparency of Things -> Rupert, Direct Path & Advaita
        return { 
          ...resource, 
          teachers: [createdTeachers[2]._id],
          traditions: [createdTraditions[0]._id, createdTraditions[2]._id]
        };
      } else if (index === 3) { // Who Am I? -> Ramana & Advaita
        return { 
          ...resource, 
          teachers: [createdTeachers[0]._id],
          traditions: [createdTraditions[0]._id]
        };
      } else { // Awareness Podcast -> All teachers, all traditions
        return { 
          ...resource, 
          teachers: createdTeachers.map(t => t._id),
          traditions: createdTraditions.map(t => t._id)
        };
      }
    });
    
    const createdResources = await Resource.insertMany(resourcesWithReferences);
    console.log(`${createdResources.length} resources inserted`);
    
    // Insert users with favorite resources, teachers, and traditions
    const usersWithFavorites = users.map(user => {
      return {
        ...user,
        favoriteResources: [createdResources[0]._id, createdResources[1]._id],
        favoriteTeachers: [createdTeachers[0]._id],
        favoriteTraditions: [createdTraditions[0]._id]
      };
    });
    
    const createdUsers = await User.insertMany(usersWithFavorites);
    console.log(`${createdUsers.length} users inserted`);
    
    console.log('Database seeded successfully!');
    
    // Disconnect from the database
    await mongoose.disconnect();
    console.log('Database connection closed');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();
