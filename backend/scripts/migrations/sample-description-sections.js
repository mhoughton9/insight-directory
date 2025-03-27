/**
 * Sample data generator for resource description sections
 * This file contains sample content for each resource type's sections
 */

// Helper function to generate sample data for a specific resource type
const generateSampleSections = (type) => {
  switch (type) {
    case 'book':
      return {
        in_a_nutshell: "This book offers a comprehensive exploration of non-dual awareness through accessible language and practical exercises.",
        practitioner_perspective: "Many readers report that this book helped them recognize the ever-present nature of awareness in their daily experience.",
        quotes_worth_reflecting: [
          "The separate self is an illusion created by thought.",
          "You are not in the world; the world is in you.",
          "Awareness is not something you have; it's what you are."
        ],
        most_interesting_idea: "The author suggests that our search for enlightenment is itself what prevents us from recognizing our true nature, which is already complete.",
        most_common_criticism: "Some readers find the concepts repetitive or abstract without enough practical guidance for implementation."
      };
      
    case 'video':
    case 'video_channel':
      return {
        in_a_nutshell: "This video channel offers clear explanations of complex spiritual concepts through engaging visual presentations and guided meditations.",
        style: "Conversational and accessible, with high-quality production and thoughtful pacing that allows viewers to absorb difficult concepts.",
        best_videos_to_start: [
          "Introduction to Non-Duality",
          "The Myth of the Separate Self",
          "Guided Self-Inquiry Meditation"
        ],
        unique_strength: "The creator has a remarkable ability to use visual metaphors that make abstract concepts tangible and relatable.",
        most_common_criticism: "Some viewers find the approach too intellectual and would prefer more emphasis on experiential practices."
      };
      
    case 'podcast':
      return {
        in_a_nutshell: "This podcast features in-depth conversations with teachers and practitioners from various wisdom traditions, exploring the nature of consciousness and awakening.",
        notable_guests: [
          "Rupert Spira",
          "Adyashanti",
          "Joan Tollifson",
          "John Butler"
        ],
        episodes_worth_the_hype: [
          "Episode 42: The Nature of Awareness",
          "Episode 78: Beyond the Seeking Mind",
          "Episode 103: The End of Suffering"
        ],
        hidden_gems: [
          "Episode 17: Ordinary Awakening",
          "Episode 63: The Paradox of Practice"
        ],
        most_common_criticism: "Episodes can sometimes be lengthy and meander through topics without clear structure."
      };
      
    case 'website':
      return {
        in_a_nutshell: "This website serves as a comprehensive resource hub for spiritual seekers, offering articles, videos, and practice guides from multiple traditions.",
        main_topics: [
          "Self-inquiry",
          "Meditation techniques",
          "Non-dual awareness",
          "Integration practices"
        ],
        design_and_usability: "Clean, minimalist design with intuitive navigation and well-organized content categories. Mobile-friendly with fast loading times.",
        how_to_get_the_most: "Start with the 'New to Non-Duality' section and follow the recommended reading/viewing path. The site also offers a useful search function to explore specific topics.",
        most_common_criticism: "Some users report that the sheer volume of content can be overwhelming without more personalized guidance."
      };
      
    case 'blog':
      return {
        in_a_nutshell: "This blog offers personal insights and reflections on the journey of awakening, with a focus on integrating spiritual understanding into everyday life.",
        main_topics: [
          "Daily mindfulness practices",
          "Working with difficult emotions",
          "Relationships as spiritual practice",
          "Beyond spiritual bypassing"
        ],
        posts_worth_saving: [
          "When Awakening Meets Real Life",
          "The Myth of the Perfect Teacher",
          "Awareness in the Midst of Chaos"
        ],
        biggest_takeaway: "Spiritual awakening isn't about escaping ordinary life but discovering the extraordinary within it.",
        most_common_criticism: "Some readers find the personal anecdotes too dominant compared to practical guidance."
      };
      
    case 'practice':
      return {
        in_a_nutshell: "This meditation practice focuses on directly investigating the nature of consciousness through sustained, gentle attention.",
        practitioners_perspective: "Regular practitioners report a gradual dissolution of the sense of separation and a natural emergence of compassion and clarity.",
        how_to_do_it_well: "Begin with short sessions (10-15 minutes) in a quiet space. Rather than forcing concentration, allow attention to rest naturally on whatever arises in awareness without judgment or analysis.",
        what_it_feels_like: "Initially, practitioners often experience a mix of restlessness and moments of unusual clarity. With consistent practice, many report a deepening sense of spaciousness and present-moment awareness.",
        most_common_criticism: "Some find the lack of structure challenging and prefer practices with clearer milestones or signs of progress."
      };
      
    case 'app':
      return {
        in_a_nutshell: "This meditation app offers a progressive approach to mindfulness and self-inquiry through guided sessions, talks, and tracking features.",
        ease_of_use: "Intuitive interface with customizable sessions and offline access. The clean design minimizes distractions during practice.",
        most_helpful_features: [
          "Guided self-inquiry meditations",
          "Progress tracking and insights",
          "Teacher Q&A sessions",
          "Customizable meditation timer"
        ],
        who_its_best_for: "Ideal for both beginners seeking structure and experienced meditators looking to deepen their practice. Particularly useful for those with busy schedules who benefit from shorter, focused sessions.",
        most_common_criticism: "The subscription cost is relatively high compared to similar apps, and some users wish for more content variety."
      };
      
    case 'retreat_center':
      return {
        in_a_nutshell: "This retreat center offers immersive experiences in a serene natural setting, with programs ranging from weekend introductions to month-long deep dives into contemplative practice.",
        what_visitors_say: [
          "The silence and natural beauty created space for insights I couldn't access in daily life.",
          "The teachers struck a perfect balance between guidance and allowing my own experience to unfold.",
          "Even the simple meals and work periods became profound practice opportunities."
        ],
        location_and_atmosphere: "Nestled in a peaceful forest with walking paths, meditation halls with natural light, and simple but comfortable accommodations. The atmosphere balances structure with spaciousness.",
        teacher_facilitator_spotlight: "The resident teachers bring decades of practice experience and emphasize direct experience over dogma. Guest teachers from various traditions regularly offer specialized retreats.",
        most_common_criticism: "Some participants find the daily schedule too rigorous, with limited free time for personal integration."
      };
      
    default:
      return {
        in_a_nutshell: "This resource offers valuable insights and practices for those interested in spiritual awakening and non-dual awareness.",
        highlights: [
          "Clear, accessible explanations",
          "Practical application suggestions",
          "Balanced perspective on different approaches"
        ],
        unique_aspects: "Combines traditional wisdom with contemporary understanding in a way that speaks to modern seekers.",
        best_for: "Those who appreciate a non-dogmatic approach that honors multiple traditions while focusing on direct experience.",
        considerations: "As with any spiritual resource, it's beneficial to engage with it as part of a broader exploration rather than as the only source of guidance."
      };
  }
};

module.exports = { generateSampleSections };
