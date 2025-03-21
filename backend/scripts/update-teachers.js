/**
 * Script to update teacher data with birth/death years, links, and detailed biographies
 */
const mongoose = require('mongoose');
const Teacher = require('../models/teacher');
const connectDB = require('../config/db');
require('dotenv').config();

// Connect to MongoDB
connectDB()
  .then(() => {
    console.log('MongoDB Connected for teacher updates');
    updateTeachers();
  })
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  });

async function updateTeachers() {
  try {
    // Update Ramana Maharshi
    const ramana = await Teacher.findOne({ slug: 'ramana-maharshi' });
    if (ramana) {
      ramana.birthYear = 1879;
      ramana.deathYear = 1950;
      ramana.country = 'India';
      ramana.notableTeachings = ['Self-inquiry', 'Who am I?'];
      ramana.biographyFull = `Ramana Maharshi (1879-1950) was one of India's most influential spiritual teachers of the twentieth century. Born as Venkataraman Iyer in Tiruchuli, Tamil Nadu, he had a profound spiritual awakening at the age of 16 when he experienced a sudden fear of death that led him to intense self-inquiry.

After this transformative experience, he left home and traveled to Arunachala, a sacred mountain in Tiruvannamalai, where he would spend the rest of his life. Initially living in various temples and caves on the mountain, he eventually settled at what would become Sri Ramanasramam, the ashram that grew around him.

Ramana Maharshi rarely spoke, preferring to teach in silence. When he did speak, his primary teaching was the path of self-inquiry, encouraging devotees to persistently ask themselves "Who am I?" to trace the source of the ego and realize the Self. He maintained that the Self (Atman) is identical with Brahman, the absolute principle of existence, consciousness, and bliss.

He taught that the ego or sense of individuality is ultimately an illusion, and that through self-inquiry, one could directly experience the non-dual nature of existence. His presence itself was said to transmit a profound peace and silence that would quiet the minds of those around him.

Despite being diagnosed with cancer in later years, Ramana maintained his equanimity and continued to be available to devotees until his passing in 1950. His teachings continue to influence spiritual seekers worldwide, and his ashram remains an active center of spiritual practice.`;
      ramana.links = [
        { url: 'https://www.sriramanamaharshi.org/', label: 'Official Website' },
        { url: 'https://www.youtube.com/channel/UCKfyr1qSjIamm_V3FFGklBQ', label: 'YouTube Channel' }
      ];
      await ramana.save();
      console.log('Updated Ramana Maharshi');
    }

    // Update Eckhart Tolle
    const eckhart = await Teacher.findOne({ slug: 'eckhart-tolle' });
    if (eckhart) {
      eckhart.birthYear = 1948;
      eckhart.country = 'Germany/Canada';
      eckhart.notableTeachings = ['The Power of Now', 'Presence'];
      eckhart.biographyFull = `Eckhart Tolle (born 1948) is a spiritual teacher and author known for his teachings on presence, consciousness, and spiritual awakening. Born in Germany and educated at the Universities of London and Cambridge, Tolle underwent a profound inner transformation at the age of 29 after suffering from long periods of depression and suicidal thoughts.

One night in 1977, after experiencing intense feelings of dread, Tolle had a life-changing epiphany. He describes feeling as if he could no longer live with himself, which led to a realization that there were two selves: the "I" and the "self" he could no longer live with. This insight triggered a deep spiritual awakening that dissolved his old identity and transformed his life completely.

After spending several years in a state of deep bliss, Tolle gradually began to understand his experience through exposure to spiritual texts and teachings. He eventually became a spiritual teacher, working with individuals and small groups in London before moving to North America.

Tolle gained worldwide recognition after the publication of his first book, "The Power of Now," in 1997, which became a New York Times bestseller and was translated into over 30 languages. His second book, "A New Earth," further expanded his influence, especially after being selected for Oprah Winfrey's book club in 2008.

The core of Tolle's teaching is the transformation of consciousness through present moment awareness. He emphasizes that dwelling on past regrets or future anxieties creates unnecessary suffering, while fully engaging with the present moment leads to peace and spiritual awakening. He teaches that the ego, which he defines as the identification with thoughts and the conditioned mind, is the source of human suffering.

Tolle does not identify with any specific religion but acknowledges influences from various spiritual traditions, including Buddhism, Hinduism, and Christianity. He continues to teach through books, online courses, retreats, and his presence in various media platforms.`;
      eckhart.links = [
        { url: 'https://eckharttolle.com/', label: 'Official Website' },
        { url: 'https://www.youtube.com/channel/UCj9fPezLH1HUh7mSo-tB1Mg', label: 'YouTube Channel' },
        { url: 'https://www.instagram.com/eckharttolle/', label: 'Instagram' }
      ];
      await eckhart.save();
      console.log('Updated Eckhart Tolle');
    }

    // Update Rupert Spira
    const rupert = await Teacher.findOne({ slug: 'rupert-spira' });
    if (rupert) {
      rupert.birthYear = 1960;
      rupert.country = 'United Kingdom';
      rupert.notableTeachings = ['Non-duality', 'Direct Path', 'The Nature of Consciousness'];
      rupert.biographyFull = `Rupert Spira (born 1960) is a British teacher of non-duality and ceramic artist whose work explores the nature of consciousness and the essence of experience. His journey began in the realm of art, studying pottery with Henry Hammond and later with Michael Cardew, one of the most respected studio potters of the 20th century.

While developing his artistic career, Spira simultaneously pursued a spiritual path. His search began in his teenage years with the teachings of Jiddu Krishnamurti and Nisargadatta Maharaj, and later included explorations of the Sufi mystical tradition. The most significant influence on his understanding came through his association with Francis Lucille, a teacher of Advaita Vedanta (non-duality), whom he met in 1997.

Through his interactions with Lucille and subsequent explorations, Spira came to recognize what he describes as the "essential non-dual understanding that lies at the heart of all the great religious and spiritual traditions." He began sharing this understanding in 2004 and has since become known for his clear and accessible articulation of non-dual awareness.

Spira's teaching focuses on direct investigation of experience rather than abstract philosophy or religious doctrine. He guides students to explore the nature of awareness itself—the common factor in all experience—and to recognize that this awareness is not a personal possession but rather the fundamental reality of all things. His approach is methodical and experiential, often using guided meditations and dialogues to help people recognize the ever-present nature of awareness.

He has authored several books, including "The Transparency of Things," "Presence: The Art of Peace and Happiness," and "Being Aware of Being Aware." He regularly conducts retreats and meetings worldwide and has an extensive online presence through videos and courses.

As both an artist and spiritual teacher, Spira embodies a unique integration of aesthetic sensitivity and philosophical depth. His ceramic work, characterized by its simplicity and attention to form, reflects the same clarity and directness that distinguishes his teaching of non-duality.`;
      rupert.links = [
        { url: 'https://rupertspira.com/', label: 'Official Website' },
        { url: 'https://www.youtube.com/user/rupertspira', label: 'YouTube Channel' },
        { url: 'https://www.instagram.com/rupertspira/', label: 'Instagram' }
      ];
      await rupert.save();
      console.log('Updated Rupert Spira');
    }

    console.log('All teachers updated successfully!');
    setTimeout(() => process.exit(0), 1000);
  } catch (error) {
    console.error('Error updating teachers:', error);
    process.exit(1);
  }
}
