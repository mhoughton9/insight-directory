/**
 * Script to update existing teachers with description sections
 * Run with: node scripts/update-teacher-sections.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Import the Teacher model
const Teacher = require('../models/teacher');

// Sample data for teachers
const teacherSections = {
  'Ramana Maharshi': {
    biography: "Ramana Maharshi (1879-1950) was an Indian sage who emphasized self-inquiry as the direct path to self-realization. After a spontaneous awakening at age 16, he left home for the sacred mountain Arunachala where he spent the rest of his life. He taught primarily through silence and simple, direct pointers to the nature of the self.",
    teaching_style: "Ramana's teaching style was characterized by simplicity, silence, and direct pointing to the nature of consciousness. He often used analogies and stories from Hindu scriptures to illustrate his points, but always returned to the core inquiry: 'Who am I?'",
    key_concepts: [
      "Self-inquiry (Who am I?)",
      "The Heart as the seat of consciousness",
      "Surrender to the Self",
      "The unreality of the ego",
      "Direct path to realization through awareness"
    ],
    recommended_resources: [
      "'Be As You Are: The Teachings of Sri Ramana Maharshi' edited by David Godman",
      "'Talks with Sri Ramana Maharshi'",
      "'The Collected Works of Ramana Maharshi'",
      "'Self-Enquiry' (Vichara Sangraham)"
    ],
    quotes: [
      "The mind is only a bundle of thoughts. The thoughts arise because there is the thinker. The thinker is the ego. The ego, if sought, will automatically vanish.",
      "Your own Self-realization is the greatest service you can render the world.",
      "Happiness is your nature. It is not wrong to desire it. What is wrong is seeking it outside when it is inside.",
      "The real Self is waiting there to take you in. Then whatever is done is done by something else and you have no hand in it."
    ],
    common_misconceptions: "Many seekers misunderstand Ramana's self-inquiry as an intellectual exercise or meditation technique, when it is actually a direct investigation into the nature of the 'I' thought and its source. Another misconception is that his path requires renunciation of worldly life, when in fact he taught that true renunciation is internal—the dropping of identification with the ego."
  },
  'Eckhart Tolle': {
    biography: "Eckhart Tolle (born 1948) is a spiritual teacher known for his emphasis on presence and the power of now. After experiencing a profound inner transformation at age 29 following years of depression, he devoted himself to understanding and sharing his insights. His teachings blend elements from various traditions while focusing on direct experience rather than theory.",
    teaching_style: "Eckhart's teaching style is conversational, accessible, and often humorous. He uses simple language to point to profound truths, frequently pausing to allow listeners to experience the silence between words. He emphasizes practical application in daily life rather than abstract philosophy.",
    key_concepts: [
      "The Power of Now (present moment awareness)",
      "The pain-body (accumulated emotional pain)",
      "Transcending the thinking mind",
      "Conscious presence",
      "The arising of awareness from form"
    ],
    recommended_resources: [
      "'The Power of Now'",
      "'A New Earth: Awakening to Your Life's Purpose'",
      "'Stillness Speaks'",
      "Eckhart Tolle TV (subscription service with talks and teachings)"
    ],
    quotes: [
      "Realize deeply that the present moment is all you have. Make the NOW the primary focus of your life.",
      "The primary cause of unhappiness is never the situation but your thoughts about it.",
      "Life is the dancer and you are the dance.",
      "You are not your mind. The mind is an instrument you can use, but it is not who you are."
    ],
    common_misconceptions: "A common misconception about Eckhart's teachings is that they encourage passivity or detachment from life's challenges. In reality, he teaches that true presence leads to more effective and conscious action. Another misunderstanding is that his approach is purely about relaxation or stress reduction, when it's actually about a fundamental shift in identity and consciousness."
  },
  'Adyashanti': {
    biography: "Adyashanti (born Steven Gray in 1962) is an American spiritual teacher who began his journey in Zen Buddhism before his own awakening led him beyond traditional frameworks. After a series of profound awakenings, he began teaching in 1996 at the request of his Zen teacher. His approach integrates insights from various traditions while emphasizing direct realization.",
    teaching_style: "Adya's teaching style is direct, clear, and compassionate. He combines precision with warmth, challenging spiritual bypassing while honoring the depth of genuine awakening. He teaches through dialogues, silent meditation, and talks that point to what he calls 'the natural state.'",
    key_concepts: [
      "The end of your world (ego dissolution)",
      "True meditation (objectless awareness)",
      "Emptiness and luminosity",
      "The falling away of the spiritual seeker",
      "Embodied awakening"
    ],
    recommended_resources: [
      "'The End of Your World'",
      "'Falling into Grace'",
      "'True Meditation'",
      "'The Way of Liberation'",
      "Adyashanti's audio and video recordings of retreats"
    ],
    quotes: [
      "The question of being is everything. Nothing could be more important to examine.",
      "Enlightenment is a destructive process. It has nothing to do with becoming better or being happier. Enlightenment is the crumbling away of untruth.",
      "The most important kind of freedom is to be what you really are.",
      "The truth is that you already are what you are seeking."
    ],
    common_misconceptions: "A common misconception about Adyashanti's teaching is that awakening is a purely blissful or peaceful state, when he actually emphasizes that true awakening often involves a confrontation with one's deepest conditioning and can be quite challenging. Another misunderstanding is that his path is about gaining special experiences, when it's actually about recognizing what is already present."
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
        console.log(`Successfully updated ${teacher.name} with description sections`);
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
