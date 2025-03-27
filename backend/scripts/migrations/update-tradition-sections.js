/**
 * Script to update existing traditions with description sections
 * Run with: node scripts/update-tradition-sections.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Import the Tradition model
const Tradition = require('../models/tradition');

// Sample data for traditions
const traditionSections = {
  'Advaita Vedanta': {
    overview: "Advaita Vedanta is a non-dualistic school of Hindu philosophy that emphasizes the ultimate unity of consciousness. The word 'Advaita' means 'not two,' pointing to the teaching that reality is fundamentally non-dual in nature. It asserts that Brahman (ultimate reality) and Atman (individual self) are one and the same.",
    historical_context: "Advaita Vedanta emerged in India around the 8th century CE, with Adi Shankaracharya systematizing its teachings through commentaries on the Upanishads, Bhagavad Gita, and Brahma Sutras. It developed as a response to dualistic interpretations of the Vedas and became one of the most influential schools of Indian philosophy.",
    core_teachings: [
      "Brahman alone is real; the world is an appearance (maya)",
      "The individual self (Atman) is identical to Brahman",
      "Ignorance (avidya) is the cause of suffering and bondage",
      "Self-knowledge (Atma Jnana) leads to liberation (moksha)",
      "The nature of reality is Existence-Consciousness-Bliss (Sat-Chit-Ananda)"
    ],
    key_practices: [
      "Self-inquiry (Atma Vichara)",
      "Discrimination between the real and unreal (Viveka)",
      "Study of Vedantic texts (Sravana)",
      "Contemplation on teachings (Manana)",
      "Meditation on the Self (Nididhyasana)"
    ],
    notable_teachers: [
      "Adi Shankaracharya",
      "Ramana Maharshi",
      "Nisargadatta Maharaj",
      "Swami Chinmayananda",
      "Sri Atmananda Krishna Menon"
    ],
    modern_relevance: "Advaita Vedanta has gained significant popularity in the West through the Neo-Advaita movement and has influenced contemporary non-dual teachings. Its emphasis on direct experience rather than belief makes it accessible to modern seekers. The core insight that consciousness is fundamental to reality resonates with some interpretations of quantum physics and consciousness studies."
  },
  'Zen Buddhism': {
    overview: "Zen Buddhism is a Mahayana Buddhist tradition that emphasizes direct experience of one's true nature through meditation (zazen), simplicity, and mindful awareness in everyday activities. The word 'Zen' derives from the Chinese 'Chan', which comes from the Sanskrit 'Dhyana', meaning meditation.",
    historical_context: "Zen originated in China as Chan Buddhism around the 6th century CE when Indian Buddhism met Chinese Taoism. It was later transmitted to Japan in the 12th century, where it developed into several schools including Rinzai and Soto. Each school maintained the essential focus on direct experience while developing unique teaching methods.",
    core_teachings: [
      "Direct pointing to the mind (beyond scriptures and concepts)",
      "Sudden enlightenment (satori) versus gradual cultivation",
      "Buddha-nature is inherent in all beings",
      "Emptiness (sunyata) and impermanence",
      "Non-duality of subject and object"
    ],
    key_practices: [
      "Zazen (seated meditation)",
      "Koan study (paradoxical questions/statements)",
      "Mindfulness in everyday activities",
      "Direct transmission from teacher to student",
      "Shikantaza (just sitting)"
    ],
    notable_teachers: [
      "Bodhidharma",
      "Dogen Zenji",
      "Hakuin Ekaku",
      "Shunryu Suzuki",
      "Thich Nhat Hanh"
    ],
    modern_relevance: "Zen has profoundly influenced Western culture, from mindfulness practices to minimalist aesthetics. Its emphasis on direct experience and present-moment awareness has made it particularly accessible to Westerners seeking spiritual practice outside religious dogma. Zen principles have been applied in psychotherapy, stress reduction, creative arts, and even business leadership."
  },
  'Non-Duality': {
    overview: "Non-Duality (Advaita) refers to the understanding that separation is an illusion, and that reality is fundamentally one undivided whole. It points to the direct recognition that the sense of being a separate self is a mental construct, while our true nature is the awareness in which all experience appears.",
    historical_context: "While non-dual understanding appears in many traditions throughout history, contemporary non-duality often represents a modern distillation of ancient wisdom traditions freed from cultural and religious trappings. It draws from Advaita Vedanta, Buddhism, Taoism, Sufism, and mystical Christianity, emphasizing direct experience over belief systems.",
    core_teachings: [
      "There is only one reality (consciousness/awareness)",
      "The separate self is an illusion created by thought",
      "You are not the person you take yourself to be",
      "Freedom is recognizing your true nature as awareness",
      "All experiences arise in and as consciousness"
    ],
    key_practices: [
      "Self-inquiry ('Who am I?')",
      "Direct pointing to immediate experience",
      "Recognizing awareness as ever-present",
      "Seeing through the belief in separation",
      "Resting as awareness"
    ],
    notable_teachers: [
      "Ramana Maharshi",
      "Nisargadatta Maharaj",
      "Rupert Spira",
      "Tony Parsons",
      "Adyashanti"
    ],
    modern_relevance: "Contemporary non-duality offers a direct approach to spiritual awakening that resonates with the modern mind's skepticism of religious dogma. Its emphasis on direct experience rather than belief makes it accessible to people from diverse backgrounds. The core insight of non-separation also aligns with emerging understandings in quantum physics, neuroscience, and consciousness studies."
  }
};

async function updateTraditionSections() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/awakening-resources');
    console.log('Connected to MongoDB');
    
    // Get all traditions
    const traditions = await Tradition.find();
    console.log(`Found ${traditions.length} traditions in the database`);
    
    // Update each tradition with sample sections if available
    for (const tradition of traditions) {
      if (traditionSections[tradition.name]) {
        console.log(`Updating tradition: ${tradition.name}`);
        tradition.descriptionSections = traditionSections[tradition.name];
        await tradition.save();
        console.log(`Successfully updated ${tradition.name} with description sections`);
      } else {
        console.log(`No sample data available for tradition: ${tradition.name}`);
      }
    }
    
    console.log('Tradition update process completed');
    
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
updateTraditionSections();
