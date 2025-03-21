/**
 * Script to update tradition data with full descriptions
 * Run with: node scripts/update-traditions.js
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

// Tradition data with full descriptions
const traditionUpdates = [
  {
    name: 'Advaita Vedanta',
    descriptionFull: `Advaita Vedanta is one of the most influential sub-schools of Vedanta, an ancient Hindu philosophy that emphasizes the ultimate unity of all reality. The word "Advaita" means "non-dual" or "not two," pointing to the tradition's fundamental teaching that Brahman (ultimate reality) and Atman (individual soul) are one and the same.

At its core, Advaita Vedanta teaches that the apparent multiplicity of existence is an illusion (maya) superimposed upon the singular, unchanging reality of Brahman. The goal of spiritual practice in this tradition is to recognize and directly experience this non-dual nature of reality, which is one's true Self.

The philosophical foundations of Advaita Vedanta were systematized by the sage Adi Shankaracharya in the 8th century CE, though its roots extend back to the ancient Upanishads. Shankara's commentaries on the Prasthanatrayi (the three foundational texts: Upanishads, Brahma Sutras, and Bhagavad Gita) established the theoretical framework that continues to guide the tradition today.

The primary spiritual practice in Advaita Vedanta is self-inquiry (atma-vichara), which involves persistent questioning into the nature of the self. This is complemented by the study of scriptures (sravana), contemplation (manana), and meditation (nididhyasana). Through these practices, the seeker gradually dissolves the false identification with the body, mind, and ego, ultimately recognizing their true nature as pure consciousness.

In the modern era, Advaita Vedanta has gained worldwide recognition through teachers like Ramana Maharshi, Nisargadatta Maharaj, and Swami Chinmayananda, who have made these ancient teachings accessible to contemporary audiences while preserving their essential insights into the non-dual nature of reality.`
  },
  {
    name: 'Zen Buddhism',
    descriptionFull: `Zen Buddhism is a Mahayana Buddhist tradition that emphasizes direct experience of one's true nature through meditation and mindful awareness. Originating in China as Chan Buddhism and later spreading to Japan, Korea, and Vietnam, Zen is characterized by its focus on direct transmission of wisdom from teacher to student, beyond written scriptures.

The word "Zen" (Chan in Chinese) is derived from the Sanskrit term "dhyana," meaning meditation or absorption. This points to the tradition's emphasis on zazen (seated meditation) as the primary practice for awakening. In Zen, enlightenment or satori is understood not as something to be achieved in the future, but as the realization of one's inherent Buddha-nature that has always been present.

Zen teachings often employ paradoxical statements, questions, or stories called koans (such as "What is the sound of one hand clapping?") designed to short-circuit conceptual thinking and bring about direct insight. The tradition also values simplicity, spontaneity, and finding spiritual meaning in ordinary activities—expressed in the saying, "Before enlightenment, chop wood and carry water; after enlightenment, chop wood and carry water."

Historically, Zen emerged in China during the Tang dynasty (618-907 CE), influenced by both Indian Buddhism and indigenous Taoist philosophy. The legendary figure Bodhidharma is credited with bringing this meditation-focused approach from India to China in the 5th or 6th century CE. From China, Zen spread throughout East Asia, developing distinct schools and approaches in different countries.

In the modern world, Zen has become one of the most widely recognized forms of Buddhism in the West, largely through the influence of teachers like D.T. Suzuki, Shunryu Suzuki, and Thich Nhat Hanh. Its emphasis on present-moment awareness, direct experience, and the integration of spiritual practice with everyday life continues to resonate with contemporary seekers across cultural and religious boundaries.`
  },
  {
    name: 'Non-Duality',
    descriptionFull: `Non-Duality, or Advaita in Sanskrit, refers to the understanding that the apparent separation between subject and object, self and other, perceiver and perceived is ultimately an illusion. Rather than being a specific tradition with established lineages and practices, Non-Duality represents a core insight shared across various spiritual and philosophical systems worldwide.

At its essence, Non-Duality points to the fundamental unity of all existence. It suggests that the sense of being a separate self—a discrete entity moving through time and space—is a mental construct rather than an ultimate reality. Beyond this construct lies an undivided awareness or consciousness that is the true nature of everything that appears to exist.

While Non-Duality has ancient roots in traditions like Advaita Vedanta, Kashmir Shaivism, Dzogchen, and certain interpretations of Buddhism, it has emerged as a distinct contemporary approach to spirituality that often transcends traditional religious boundaries. Modern non-dual teachings frequently strip away cultural and religious elements to focus directly on the experiential recognition of one's true nature.

Contemporary non-dual teachers often employ a variety of methods to point to this understanding, including self-inquiry, contemplation, meditation, dialogue, and direct pointing. Unlike many traditional paths, Non-Duality as a modern approach typically doesn't emphasize lengthy practices or gradual development, instead suggesting that awakening is always immediately available through recognizing what is already present.

The non-dual perspective has gained significant traction in Western spiritual circles through teachers like Rupert Spira, Eckhart Tolle, Adyashanti, and others who communicate these insights in accessible, contemporary language. The appeal of Non-Duality in modern times may lie in its directness, its compatibility with scientific understandings of reality, and its potential to resolve existential questions without requiring adherence to specific religious beliefs or cultural frameworks.`
  }
];

// Update traditions
async function updateTraditions() {
  try {
    for (const update of traditionUpdates) {
      const result = await Tradition.findOneAndUpdate(
        { name: update.name },
        { $set: { descriptionFull: update.descriptionFull } },
        { new: true }
      );
      
      if (result) {
        console.log(`Updated tradition: ${update.name}`);
      } else {
        console.log(`Tradition not found: ${update.name}`);
      }
    }
    
    console.log('Tradition updates completed');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error updating traditions:', error);
    mongoose.connection.close();
    process.exit(1);
  }
}

updateTraditions();
