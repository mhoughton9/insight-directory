const mongoose = require('mongoose');

/**
 * Schema for spiritual teachers/authors
 */
const teacherSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Teacher name is required'],
      unique: true,
      trim: true
    },
    biography: {
      type: String,
      required: [true, 'Teacher biography is required']
    },
    biographyFull: {
      type: String,
      default: function() {
        return this.biography; // Default to the short bio if full bio isn't provided
      }
    },
    birthDate: {
      type: Date
    },
    deathDate: {
      type: Date
    },
    birthYear: {
      type: Number
    },
    deathYear: {
      type: Number
    },
    country: {
      type: String,
      trim: true
    },
    keyTeachings: [{
      type: String,
      trim: true
    }],
    notableTeachings: [{
      type: String,
      trim: true
    }],
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    imageUrl: {
      type: String,
      trim: true
    },
    website: {
      type: String,
      trim: true
    },
    links: [{
      url: String,
      label: String
    }],
    traditions: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tradition'
    }],
    /**
     * Detailed description sections for teacher profiles
     * Each key is a section identifier with standardized fields:
     * - in_a_nutshell: Brief summary of the teacher's approach
     * - key_contributions: Major contributions to spiritual teachings
     * - teaching_style: Description of their teaching approach
     * - notable_quotes: Array of significant quotes
     * - historical_context: Their place in the broader spiritual landscape
     */
    descriptionSections: {
      type: Map,
      of: mongoose.Schema.Types.Mixed, // Allows both strings and arrays
      default: {}
    },
    relatedTeachers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher'
    }],
    processed: {
      type: Boolean,
      default: false, // Default to 'Pending' status
      description: 'Whether the teacher is fully processed and ready to be displayed (true = Posted, false = Pending)'
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for resources associated with this teacher
teacherSchema.virtual('resources', {
  ref: 'Resource',
  localField: '_id',
  foreignField: 'teachers'
});

// Pre-save middleware to sync website with links array
teacherSchema.pre('save', function(next) {
  // If website is set but not in links, add it to links
  if (this.website) {
    // Initialize links array if it doesn't exist
    if (!this.links) {
      this.links = [];
    }
    
    // Check if website is already in links
    const websiteInLinks = this.links.some(link => link.url === this.website);
    
    // If not, add it to links
    if (!websiteInLinks) {
      this.links.push({
        url: this.website,
        label: 'Website'
      });
    }
  }
  
  next();
});

const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;
