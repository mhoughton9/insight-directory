/**
 * Script to update existing teachers with revised description sections
 * Run with: node scripts/update-teacher-sections-revised.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Import the Teacher model
const Teacher = require('../models/teacher');

// Sample data for teachers with the new section structure
const teacherSections = {
  'Ramana Maharshi': {
    in_a_nutshell: "Ramana Maharshi was an Indian sage who taught self-inquiry as the direct path to self-realization. His core teaching centered on the question 'Who am I?' which guides seekers to discover their true nature beyond the mind and ego.",
    what_students_say: "Students of Ramana often report a profound sense of peace in his presence. Many describe how his silent transmission was more powerful than words, and how his simple pointers cut through years of spiritual seeking to reveal what was always present.",
    common_misunderstanding_clarified: "Many believe Ramana's self-inquiry is an intellectual exercise or meditation technique. In reality, it's a direct investigation into the source of the 'I' thought—not analyzing the mind with the mind, but tracing awareness back to its source.",
    if_you_only_read_watch_one_thing: "'Be As You Are: The Teachings of Sri Ramana Maharshi' edited by David Godman distills his essential teachings in a clear, accessible format, organized by topic with helpful explanations.",
    quotes_worth_remembering: [
      "Your own Self-realization is the greatest service you can render the world.",
      "Happiness is your nature. It is not wrong to desire it. What is wrong is seeking it outside when it is inside.",
      "The mind is only a bundle of thoughts. The thoughts arise because there is the thinker. The thinker is the ego. The ego, if sought, will automatically vanish.",
      "All that is required to realize the Self is to be still."
    ]
  },
  'Eckhart Tolle': {
    in_a_nutshell: "Eckhart Tolle is a contemporary spiritual teacher who emphasizes the power of present moment awareness. His teachings focus on transcending the thinking mind and ego-identification to discover the deeper dimension of consciousness within.",
    what_students_say: "Students often describe profound shifts in their perception of life after encountering Eckhart's teachings. Many report that his simple pointers to presence helped them break free from anxiety, overthinking, and identification with mental stories.",
    common_misunderstanding_clarified: "A common misconception is that Eckhart's teachings are about achieving a special state or having only positive experiences. In reality, he teaches about accepting the present moment completely, including any difficult emotions or situations, while recognizing a deeper dimension of consciousness.",
    if_you_only_read_watch_one_thing: "'The Power of Now' remains Eckhart's most essential work, offering a comprehensive introduction to his teachings on presence, the pain-body, and transcending identification with thought.",
    quotes_worth_remembering: [
      "Realize deeply that the present moment is all you have. Make the NOW the primary focus of your life.",
      "The primary cause of unhappiness is never the situation but your thoughts about it.",
      "You are not your mind. The mind is an instrument you can use, but it is not who you are.",
      "Life is the dancer and you are the dance."
    ]
  },
  'Rupert Spira': {
    in_a_nutshell: "Rupert Spira is a contemporary non-dual teacher who explores the nature of consciousness through direct experience. His approach combines clear analytical investigation with meditative inquiry to reveal the fundamental nature of awareness as our true identity.",
    what_students_say: "Students appreciate Rupert's precision, clarity, and methodical approach. Many report that his guided meditations and contemplations helped them directly recognize the nature of awareness in a way that transformed their understanding of experience.",
    common_misunderstanding_clarified: "Many initially think Rupert's approach is purely intellectual or philosophical. In reality, his teaching is deeply experiential, using precise language to point directly to the experience of being aware, which is always present but often overlooked.",
    if_you_only_read_watch_one_thing: "'Being Aware of Being Aware' is perhaps his most direct and essential work, focusing on the experiential recognition of awareness as our fundamental nature.",
    quotes_worth_remembering: [
      "Awareness is not a kind of super-object that can be known objectively; it is the knowing element in all experience.",
      "The separate self is not an entity; it is an activity.",
      "Love is the recognition that we share our being.",
      "Happiness is the experience of being divested of the separate self."
    ]
  }
};

async function updateTeacherSections() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/awakening-resources');
    console.log('Connected to MongoDB');
    
    // Get all teachers
    const teachers = await Teacher.find();
    console.log(`Found ${teachers.length} teachers in the database`);
    
    // Update each teacher with sample sections if available
    for (const teacher of teachers) {
      if (teacherSections[teacher.name]) {
        console.log(`Updating teacher: ${teacher.name}`);
        teacher.descriptionSections = teacherSections[teacher.name];
        await teacher.save();
        console.log(`Successfully updated ${teacher.name} with revised description sections`);
      } else {
        console.log(`No sample data available for teacher: ${teacher.name}`);
      }
    }
    
    console.log('Teacher update process completed');
    
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
updateTeacherSections();
