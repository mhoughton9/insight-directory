/**
 * Script to update resources with type-specific details and add sample data
 * Run with: node update-resources-with-types.js
 */

const mongoose = require('mongoose');
const Resource = require('../models/resource');
require('dotenv').config();

// MongoDB connection string from .env file
const MONGODB_URI = 'mongodb+srv://poseidonwoodworks:kDUeq7x0OyfRWDut@cluster0.cysh0.mongodb.net/awakening-directory?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB with increased timeout
mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 60000, // Increase timeout to 60 seconds
  connectTimeoutMS: 60000,
  socketTimeoutMS: 60000,
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log(`MongoDB Connected: ${mongoose.connection.host}`))
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  });

// Sample data for each resource type
const sampleResources = [
  // Book sample
  {
    title: 'The Power of Now',
    description: 'A guide to spiritual enlightenment that emphasizes living in the present moment. The book draws from various spiritual traditions and has been widely influential in contemporary spirituality.',
    type: 'book',
    url: 'https://example.com/power-of-now',
    publishedDate: new Date('1997-01-01'),
    imageUrl: 'https://example.com/power-of-now.jpg',
    tags: ['presence', 'mindfulness', 'enlightenment', 'spirituality'],
    slug: 'power-of-now',
    featured: true,
    bookDetails: {
      author: ['Eckhart Tolle'],
      yearPublished: 1997,
      pages: 236,
      publisher: 'New World Library',
      links: [
        'https://www.amazon.com/Power-Now-Guide-Spiritual-Enlightenment/dp/1577314808',
        'https://eckharttolle.com/books/the-power-of-now/'
      ]
    }
  },
  
  // VideoChannel sample
  {
    title: 'Buddha at the Gas Pump',
    description: 'Interviews with "ordinary" spiritually awakened people. The show features conversations with individuals who have experienced spiritual awakenings or shifts in consciousness.',
    type: 'videoChannel',
    url: 'https://www.youtube.com/c/BuddhaAtTheGasPump',
    imageUrl: 'https://example.com/batgap.jpg',
    tags: ['interviews', 'awakening', 'consciousness', 'spirituality'],
    slug: 'buddha-at-the-gas-pump',
    videoChannelDetails: {
      channelName: 'Buddha at the Gas Pump',
      creator: 'Rick Archer',
      keyTopics: ['Spiritual Awakening', 'Non-duality', 'Consciousness', 'Meditation'],
      links: ['https://www.youtube.com/c/BuddhaAtTheGasPump', 'https://batgap.com']
    }
  },
  
  // Website sample
  {
    title: 'Liberation Unleashed',
    description: 'A global movement of people helping others to see through the illusion of a separate self. The website offers free guidance through a direct pointing process to see through the illusion of the self.',
    type: 'website',
    url: 'https://www.liberationunleashed.com',
    imageUrl: 'https://example.com/liberation-unleashed.jpg',
    tags: ['direct pointing', 'no-self', 'awakening', 'guidance'],
    slug: 'liberation-unleashed',
    websiteDetails: {
      websiteName: 'Liberation Unleashed',
      creator: 'Ilona Ciunaite and Elena Nezhinsky',
      primaryContentTypes: ['Forum', 'Guides', 'Books', 'Community'],
      link: 'https://www.liberationunleashed.com'
    }
  },
  
  // Blog sample
  {
    title: 'Awake Blog',
    description: 'A blog exploring non-dual awareness and the direct path to self-realization. Features articles on meditation, self-inquiry, and practical approaches to spiritual awakening.',
    type: 'blog',
    url: 'https://example.com/awake-blog',
    imageUrl: 'https://example.com/awake-blog.jpg',
    tags: ['non-duality', 'self-inquiry', 'direct path', 'awareness'],
    slug: 'awake-blog',
    blogDetails: {
      name: 'Awake Blog',
      author: 'John Smith',
      frequency: 'Weekly',
      link: 'https://example.com/awake-blog'
    }
  },
  
  // Podcast sample
  {
    title: 'Deconstructing Yourself',
    description: 'A podcast about meditation, consciousness, and awakening in the modern world. Features interviews with meditation teachers, neuroscientists, and philosophers.',
    type: 'podcast',
    url: 'https://deconstructingyourself.com',
    imageUrl: 'https://example.com/deconstructing-yourself.jpg',
    tags: ['meditation', 'mindfulness', 'buddhism', 'neuroscience'],
    slug: 'deconstructing-yourself',
    podcastDetails: {
      podcastName: 'Deconstructing Yourself',
      hosts: ['Michael Taft'],
      datesActive: '2016–Present',
      episodeCount: 87,
      notableGuests: ['John Yates (Culadasa)', 'Daniel Ingram', 'Shinzen Young', 'Loch Kelly'],
      links: [
        'https://open.spotify.com/show/2LluIUn8LyYisCJ8ScmJzz',
        'https://podcasts.apple.com/us/podcast/deconstructing-yourself/id1240056193',
        'https://deconstructingyourself.com'
      ]
    }
  },
  
  // RetreatCenter sample
  {
    title: 'Spirit Rock Meditation Center',
    description: 'A meditation and retreat center in the San Francisco Bay Area. Offers a variety of programs including residential retreats, drop-in meditation, and classes on mindfulness and Buddhist practice.',
    type: 'retreatCenter',
    url: 'https://www.spiritrock.org',
    imageUrl: 'https://example.com/spirit-rock.jpg',
    tags: ['meditation', 'retreat', 'mindfulness', 'buddhism'],
    slug: 'spirit-rock',
    retreatCenterDetails: {
      name: 'Spirit Rock Meditation Center',
      location: 'Woodacre, California, USA',
      retreatTypes: ['Residential Retreats', 'Day Retreats', 'Online Programs', 'Classes'],
      links: ['https://www.spiritrock.org'],
      upcomingDates: ['June 15-21, 2025', 'July 10-17, 2025', 'August 5-12, 2025']
    }
  },
  
  // Practice sample
  {
    title: 'Self-Inquiry: Who Am I?',
    description: 'A fundamental practice of self-inquiry as taught by Ramana Maharshi. This direct approach helps reveal one\'s true nature beyond identification with thoughts and the body.',
    type: 'practice',
    tags: ['self-inquiry', 'advaita', 'direct path', 'ramana maharshi'],
    slug: 'self-inquiry-who-am-i',
    practiceDetails: {
      name: 'Self-Inquiry: Who Am I?',
      instructions: 'Sit quietly and ask yourself "Who am I?" whenever a thought arises. Don\'t answer intellectually, but trace each thought back to its source. Ask "To whom does this thought arise?" The answer will be "To me." Then ask "Who am I?" and remain alert but relaxed, watching for the source of the "I" thought. Continue this process, always returning to the question "Who am I?" whenever the mind wanders. With practice, thoughts will subside, and the sense of a separate self may dissolve, revealing your true nature.',
      source: 'Ramana Maharshi',
      duration: '20-30 minutes',
      difficulty: 'Intermediate',
      technique: 'Self-Inquiry',
      benefits: ['Dissolving identification with thoughts', 'Recognizing true nature', 'Direct realization']
    }
  },
  
  // App sample
  {
    title: 'Waking Up',
    description: 'A meditation app focused on both mindfulness and the nature of consciousness. Includes guided meditations, lessons on theory, and conversations with spiritual teachers and scientists.',
    type: 'app',
    url: 'https://www.wakingup.com',
    imageUrl: 'https://example.com/waking-up.jpg',
    tags: ['meditation', 'mindfulness', 'consciousness', 'non-duality'],
    slug: 'waking-up',
    appDetails: {
      appName: 'Waking Up',
      creator: 'Sam Harris',
      platforms: ['iOS', 'Android', 'Web'],
      price: '$99.99/year (with free option available)',
      teachers: ['Sam Harris', 'Joseph Goldstein', 'Loch Kelly', 'Richard Lang'],
      features: ['Daily Meditations', 'Theory Lessons', 'Conversations', 'Timer', 'Progress Tracking'],
      links: [
        'https://apps.apple.com/us/app/waking-up-guided-meditation/id1307736395',
        'https://play.google.com/store/apps/details?id=org.wakingup.android',
        'https://www.wakingup.com'
      ]
    }
  }
];

// Function to update existing resources and add new ones
async function updateResources() {
  try {
    console.log('Starting resource update process...');
    
    // Get all resources
    const existingResources = await Resource.find({});
    console.log(`Found ${existingResources.length} existing resources`);
    
    // Update existing resources with type-specific details
    let updatedCount = 0;
    for (const resource of existingResources) {
      console.log(`Processing existing resource: ${resource.title} (${resource.type})`);
      
      let updateData = {};
      
      // Create type-specific details based on resource type
      switch(resource.type.toLowerCase()) {
        case 'book':
          if (!resource.bookDetails || Object.keys(resource.bookDetails).length === 0) {
            updateData.bookDetails = {
              author: ['Unknown Author'],
              yearPublished: new Date().getFullYear() - Math.floor(Math.random() * 20),
              links: [`https://example.com/books/${resource.slug}`]
            };
          }
          break;
          
        case 'videochannel':
          if (!resource.videoChannelDetails || Object.keys(resource.videoChannelDetails).length === 0) {
            updateData.videoChannelDetails = {
              channelName: resource.title,
              creator: 'Unknown Creator',
              keyTopics: ['Spirituality', 'Non-duality', 'Awakening'],
              links: [`https://example.com/videos/${resource.slug}`]
            };
          }
          break;
          
        case 'website':
          if (!resource.websiteDetails || Object.keys(resource.websiteDetails).length === 0) {
            updateData.websiteDetails = {
              websiteName: resource.title,
              creator: 'Unknown Creator',
              primaryContentTypes: ['Articles', 'Resources', 'Information'],
              link: resource.url || `https://example.com/${resource.slug}`
            };
          }
          break;
          
        case 'blog':
          if (!resource.blogDetails || Object.keys(resource.blogDetails).length === 0) {
            updateData.blogDetails = {
              name: resource.title,
              author: 'Unknown Author',
              frequency: 'Monthly',
              link: resource.url || `https://example.com/blogs/${resource.slug}`
            };
          }
          break;
          
        case 'podcast':
          if (!resource.podcastDetails || Object.keys(resource.podcastDetails).length === 0) {
            updateData.podcastDetails = {
              podcastName: resource.title,
              hosts: ['Unknown Host'],
              datesActive: `${new Date().getFullYear() - Math.floor(Math.random() * 5)}–Present`,
              episodeCount: Math.floor(Math.random() * 100) + 1,
              notableGuests: ['Guest 1', 'Guest 2', 'Guest 3'],
              links: [`https://example.com/podcasts/${resource.slug}`]
            };
          }
          break;
          
        case 'retreatcenter':
          if (!resource.retreatCenterDetails || Object.keys(resource.retreatCenterDetails).length === 0) {
            updateData.retreatCenterDetails = {
              name: resource.title,
              location: 'Unknown Location',
              retreatTypes: ['Meditation Retreats', 'Workshops', 'Classes'],
              links: [resource.url || `https://example.com/retreats/${resource.slug}`],
              upcomingDates: [
                `June ${Math.floor(Math.random() * 28) + 1}, ${new Date().getFullYear()}`,
                `August ${Math.floor(Math.random() * 28) + 1}, ${new Date().getFullYear()}`
              ]
            };
          }
          break;
          
        case 'practice':
          if (!resource.practiceDetails || Object.keys(resource.practiceDetails).length === 0) {
            updateData.practiceDetails = {
              name: resource.title,
              instructions: 'Detailed instructions for this practice will be added soon.',
              source: 'Traditional',
              duration: '15-20 minutes',
              difficulty: 'Beginner',
              technique: 'Meditation',
              benefits: ['Increased awareness', 'Reduced stress', 'Greater clarity']
            };
          }
          break;
          
        case 'app':
          if (!resource.appDetails || Object.keys(resource.appDetails).length === 0) {
            updateData.appDetails = {
              appName: resource.title,
              creator: 'Unknown Developer',
              platforms: ['iOS', 'Android'],
              price: 'Free',
              teachers: ['Various Teachers'],
              features: ['Meditation', 'Tracking', 'Community'],
              links: [`https://example.com/apps/${resource.slug}`]
            };
          }
          break;
          
        default:
          console.log(`Resource type '${resource.type}' not recognized for ${resource.title}`);
      }
      
      // Only update if we have data to update
      if (Object.keys(updateData).length > 0) {
        const updated = await Resource.findByIdAndUpdate(
          resource._id,
          { $set: updateData },
          { new: true }
        );
        console.log(`Updated ${resource.title} with type-specific details`);
        updatedCount++;
      }
    }
    
    // Add new sample resources if they don't exist
    let addedCount = 0;
    for (const sampleResource of sampleResources) {
      try {
        // Check if resource with this slug already exists
        const exists = await Resource.findOne({ slug: sampleResource.slug });
        
        if (!exists) {
          // Make a copy of the sample resource to avoid modifying the original
          const resourceToAdd = { ...sampleResource };
          
          // Log the resource type before modification
          console.log(`Adding resource: ${resourceToAdd.title}, type: ${resourceToAdd.type}`);
          
          // Force the type to match exactly with the enum values in the Resource model
          if (resourceToAdd.type.toLowerCase() === 'videochannel') {
            resourceToAdd.type = 'videoChannel';
            console.log(`  - Fixed type to: ${resourceToAdd.type}`);
          } else if (resourceToAdd.type.toLowerCase() === 'retreatcenter') {
            resourceToAdd.type = 'retreatCenter';
            console.log(`  - Fixed type to: ${resourceToAdd.type}`);
          }
          
          const newResource = new Resource(resourceToAdd);
          await newResource.save();
          console.log(`Added new sample resource: ${resourceToAdd.title}`);
          addedCount++;
        } else {
          console.log(`Sample resource ${sampleResource.title} already exists, skipping`);
        }
      } catch (err) {
        console.error(`Error adding resource ${sampleResource.title}:`, err.message);
      }
    }
    
    console.log(`\nResource update summary:`);
    console.log(`- ${updatedCount} existing resources updated`);
    console.log(`- ${addedCount} new sample resources added`);
    console.log(`- ${existingResources.length + addedCount} total resources in database`);
    console.log('\nAll resources updated successfully!');
    
    // Close the connection
    mongoose.connection.close()
      .then(() => {
        console.log('Database connection closed');
        process.exit(0);
      })
      .catch(err => {
        console.error('Error closing connection:', err);
        process.exit(1);
      });
      
  } catch (error) {
    console.error('Error updating resources:', error);
    process.exit(1);
  }
}

// Run the function
updateResources();
