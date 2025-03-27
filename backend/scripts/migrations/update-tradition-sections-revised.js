/**
 * Script to update existing traditions with revised description sections
 * Run with: node scripts/update-tradition-sections-revised.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Import the Tradition model
const Tradition = require('../models/tradition');

// Sample data for traditions with the new section structure
const traditionSections = {
  'Advaita Vedanta': {
    in_a_nutshell: "Advaita Vedanta is a non-dualistic school of Hindu philosophy that teaches that Brahman (ultimate reality) and Atman (individual self) are one and the same. The word 'Advaita' means 'not two,' pointing to the fundamental unity of all existence.",
    the_steel_man_case: "The strongest case for Advaita is that it resolves the subject-object divide at the root of human suffering. By recognizing that consciousness is not divided but singular and universal, it offers a direct solution to the sense of separation that underlies psychological pain. Its logical consistency and experiential verification through centuries of practice provide a compelling framework for understanding reality.",
    if_you_only_read_one_book: "'I Am That' by Nisargadatta Maharaj, while not a traditional Advaita text, presents the essence of Advaita teaching in accessible, direct language for modern seekers. It consistently points to the experiential recognition of one's true nature beyond concepts.",
    common_misunderstanding_clarified: "Many misunderstand Advaita as claiming that the world is an illusion and therefore meaningless. In reality, Advaita teaches that the world is not separate from consciousness—it appears as a manifestation within consciousness rather than as an independent material reality outside of awareness.",
    practical_exercises: [
      "Self-inquiry: Repeatedly ask 'Who am I?' while tracing awareness back to its source",
      "Neti-neti meditation: Systematically recognize what you are not ('not this, not this')",
      "Witness practice: Observe thoughts, sensations and perceptions without identification",
      "Contemplation of mahavakyas (great sayings) such as 'I am That' or 'Consciousness is all there is'"
    ]
  },
  'Zen Buddhism': {
    in_a_nutshell: "Zen Buddhism is a Mahayana Buddhist tradition emphasizing direct experience of one's true nature through meditation (zazen), mindful awareness, and the transcendence of conceptual thinking. It focuses on immediate, intuitive understanding rather than intellectual knowledge or religious ritual.",
    the_steel_man_case: "Zen's strongest case lies in its pragmatic approach that cuts through intellectual complexity to address suffering directly. By emphasizing present-moment awareness and the dropping of conceptual thinking, it offers a path to freedom that doesn't require belief systems. Its time-tested methods have proven effective across cultures, and its aesthetic of simplicity resonates with the modern need for directness.",
    if_you_only_read_one_book: "'Zen Mind, Beginner's Mind' by Shunryu Suzuki presents the essence of Zen practice with remarkable clarity and depth. It emphasizes the importance of maintaining a 'beginner's mind'—open, eager, and free from preconceptions—in meditation and daily life.",
    common_misunderstanding_clarified: "Many believe Zen is about emptying the mind of all thoughts or achieving a special state of consciousness. In reality, Zen practice is about seeing clearly into the nature of mind and reality without attachment to thoughts, not their elimination. It's about being fully present with whatever arises.",
    practical_exercises: [
      "Zazen (seated meditation): Sitting in stable posture with attention on breath and posture",
      "Kinhin (walking meditation): Slow, mindful walking between periods of sitting",
      "Koan contemplation: Dwelling on paradoxical questions that cannot be solved by rational thinking",
      "Mindful work practice: Bringing full attention to everyday activities like cleaning or preparing food",
      "Just sitting (shikantaza): Open awareness without focusing on any particular object"
    ]
  },
  'Direct Path': {
    in_a_nutshell: "The Direct Path is a contemporary approach to non-dual understanding that points directly to the nature of awareness as our true identity. It uses experiential investigation rather than progressive practices or belief systems to reveal the fundamental nature of consciousness that is always already present.",
    the_steel_man_case: "The Direct Path's strongest case is its immediacy and accessibility without religious or cultural frameworks. By directly investigating the nature of experience, it offers a clear methodology for recognizing what we already are. Its approach is compatible with both contemplative traditions and modern scientific inquiry into consciousness, making it uniquely positioned for contemporary seekers.",
    if_you_only_read_one_book: "'The Transparency of Things' by Rupert Spira offers a series of contemplations that systematically investigate experience to reveal its non-dual nature. Through clear, precise language, it guides readers to recognize awareness as the fundamental reality of all experience.",
    common_misunderstanding_clarified: "Many assume the Direct Path is merely intellectual or philosophical. In reality, it's an experiential exploration that uses precise language to point to direct recognition of our true nature as awareness. It's not about gaining new knowledge but seeing through the assumptions that create the illusion of separation.",
    practical_exercises: [
      "Guided meditation on being aware of being aware",
      "Investigation of the apparent subject-object relationship in experience",
      "Exploration of the nature of perception through the senses",
      "Contemplation of awareness as the substance of all experience",
      "Tracing thoughts, feelings and sensations back to their source"
    ]
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
        console.log(`Successfully updated ${tradition.name} with revised description sections`);
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
