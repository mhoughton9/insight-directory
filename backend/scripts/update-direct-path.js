/**
 * Script to update Direct Path tradition with a full description
 * Run with: node scripts/update-direct-path.js
 */

const mongoose = require('mongoose');
const Tradition = require('../models/tradition');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/awakening-resources')
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Direct Path full description
const directPathDescription = `The Direct Path is a contemporary approach to non-dual understanding that emerged in the late 20th century, primarily through the teachings of Sri Atmananda Krishna Menon and later developed by his student Jean Klein and others like Rupert Spira. It offers a direct investigation into the nature of experience and consciousness without relying heavily on traditional religious frameworks or gradual spiritual practices.

Unlike more traditional approaches that might emphasize years of meditation or purification, the Direct Path focuses on immediate, experiential inquiry into the nature of awareness itself. It suggests that our true nature as pure consciousness is always already present and accessible, not something to be achieved through effort or time.

At its core, the Direct Path employs a systematic investigation of experience through guided contemplation and self-inquiry. This investigation typically begins with exploring the nature of objects and perceptions, then proceeds to examine the perceiving subject, and finally investigates the nature of awareness itself. Through this process, the apparent distinction between subject and object, knower and known, gradually dissolves into the recognition of non-dual awareness as the fundamental reality.

The methodology of the Direct Path is often described as "experiential" rather than theoretical or belief-based. It invites practitioners to directly verify the teachings through their own experience rather than accepting them on authority. This approach resonates with the contemporary Western mind that values direct experience and critical thinking over traditional religious authority.

Key teachers associated with the Direct Path include Jean Klein, Francis Lucille, Rupert Spira, and Greg Goode, each of whom has contributed to making these teachings accessible to modern audiences while maintaining the essence of the non-dual understanding. The Direct Path continues to evolve as a living tradition that bridges ancient wisdom with contemporary understanding, offering a clear and accessible approach to recognizing our true nature as boundless awareness.`;

// Update Direct Path tradition
async function updateDirectPath() {
  try {
    // Try to find by exact name
    let tradition = await Tradition.findOneAndUpdate(
      { name: 'Direct Path' },
      { $set: { descriptionFull: directPathDescription } },
      { new: true }
    );
    
    // If not found, try with case-insensitive search
    if (!tradition) {
      tradition = await Tradition.findOneAndUpdate(
        { name: { $regex: 'direct path', $options: 'i' } },
        { $set: { descriptionFull: directPathDescription } },
        { new: true }
      );
    }
    
    if (tradition) {
      console.log(`Updated tradition: ${tradition.name}`);
    } else {
      console.log('Direct Path tradition not found');
    }
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error updating Direct Path tradition:', error);
    mongoose.connection.close();
    process.exit(1);
  }
}

updateDirectPath();
