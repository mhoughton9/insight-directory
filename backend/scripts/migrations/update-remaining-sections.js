/**
 * Script to update remaining teachers and traditions with description sections
 * Run with: node scripts/update-remaining-sections.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Teacher = require('../models/teacher');
const Tradition = require('../models/tradition');

// Sample data for remaining items
const remainingData = {
  teachers: {
    'Rupert Spira': {
      biography: "Rupert Spira (born 1960) is a British spiritual teacher and author who explores the nature of consciousness and the direct path to self-realization. With a background in ceramics and the arts, he brings a unique aesthetic sensibility to his teachings. After studying with Francis Lucille, he began sharing his own insights on non-duality and the nature of experience.",
      teaching_style: "Rupert's teaching style is characterized by precise, clear language and a methodical approach to investigating experience. He uses careful reasoning and contemplative inquiry to guide students to recognize the nature of awareness. His presentations are often structured as dialogues, allowing for deep exploration of concepts.",
      key_concepts: [
        "Consciousness as the fundamental reality",
        "The direct path of self-inquiry",
        "The transparency of experience",
        "The absence of separation between awareness and its content",
        "Love as the recognition of our shared being"
      ],
      recommended_resources: [
        "'The Transparency of Things'",
        "'Being Aware of Being Aware'",
        "'The Nature of Consciousness'",
        "'The Light of Pure Knowing' (audio recordings)",
        "Rupert's YouTube channel with guided meditations and dialogues"
      ],
      quotes: [
        "Awareness is not a kind of super-object that can be known objectively; it is the knowing element in all experience.",
        "The separate self is not an entity; it is an activity.",
        "Love is the recognition that we share our being.",
        "Happiness is the experience of being divested of the separate self.",
        "All experience is a modulation of consciousness."
      ],
      common_misconceptions: "A common misconception about Rupert's teaching is that it is primarily intellectual or philosophical, when in fact it is deeply experiential and practical. Another misunderstanding is that his approach requires special meditative states, when it actually points to the ever-present nature of awareness in all experience, including ordinary daily activities."
    }
  },
  traditions: {
    'Direct Path': {
      overview: "The Direct Path is a contemporary approach to non-dual understanding that emphasizes direct investigation of experience rather than progressive practices or stages of development. It points directly to the nature of awareness as the fundamental reality of our experience, bypassing many traditional spiritual practices and concepts.",
      historical_context: "The Direct Path emerged in the late 20th century as a distillation of Advaita Vedanta freed from cultural and religious trappings. It was developed by teachers like Atmananda Krishna Menon, Jean Klein, and Francis Lucille, who sought to make non-dual understanding accessible to modern Western seekers through direct experiential inquiry rather than traditional scriptural study.",
      core_teachings: [
        "Consciousness/awareness is the fundamental reality",
        "The separate self is an illusion created by thought",
        "Direct investigation of experience reveals its non-dual nature",
        "No separation exists between awareness and its content",
        "Liberation is the recognition of our true nature as awareness"
      ],
      key_practices: [
        "Self-inquiry into the nature of awareness",
        "Investigation of the apparent subject-object relationship",
        "Contemplation of the nature of experience",
        "Guided meditations that explore the qualities of awareness",
        "Dialogues and conversations that clarify understanding"
      ],
      notable_teachers: [
        "Atmananda Krishna Menon",
        "Jean Klein",
        "Francis Lucille",
        "Rupert Spira",
        "Greg Goode"
      ],
      modern_relevance: "The Direct Path's emphasis on direct experience and its freedom from religious dogma makes it particularly accessible to contemporary seekers, especially those with scientific or philosophical backgrounds. Its investigation of consciousness aligns with current interests in consciousness studies, and its practical approach offers a way to explore non-dual understanding without adopting traditional religious practices or beliefs."
    }
  }
};

async function updateRemainingSections() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/awakening-resources');
    console.log('Connected to MongoDB');
    
    // Update Rupert Spira
    const rupertSpira = await Teacher.findOne({ name: 'Rupert Spira' });
    if (rupertSpira) {
      console.log('Updating teacher: Rupert Spira');
      rupertSpira.descriptionSections = remainingData.teachers['Rupert Spira'];
      await rupertSpira.save();
      console.log('Successfully updated Rupert Spira with description sections');
    } else {
      console.log('Teacher "Rupert Spira" not found');
    }
    
    // Update Direct Path
    const directPath = await Tradition.findOne({ name: 'Direct Path' });
    if (directPath) {
      console.log('Updating tradition: Direct Path');
      directPath.descriptionSections = remainingData.traditions['Direct Path'];
      await directPath.save();
      console.log('Successfully updated Direct Path with description sections');
    } else {
      console.log('Tradition "Direct Path" not found');
    }
    
    console.log('Update process completed');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the function
updateRemainingSections();
