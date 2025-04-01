const mongoose = require('mongoose');

/**
 * Schema for spiritual traditions or paths
 */
const traditionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tradition name is required'],
      unique: true,
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Tradition description is required']
    },
    descriptionFull: {
      type: String,
      trim: true
    },
    origin: {
      type: String,
      trim: true
    },
    foundingPeriod: {
      type: String,
      trim: true
    },
    keyTeachings: [{
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
    links: [{
      url: String,
      label: String
    }],
    relatedTraditions: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tradition'
    }],
    /**
     * Detailed description sections for tradition profiles
     * Each key is a section identifier with standardized fields:
     * - in_a_nutshell: Brief summary of the tradition
     * - historical_context: Origins and development of the tradition
     * - key_teachings: Core principles and concepts
     * - practices: Common practices associated with the tradition
     * - modern_relevance: How the tradition is practiced or interpreted today
     */
    descriptionSections: {
      type: Map,
      of: mongoose.Schema.Types.Mixed, // Allows both strings and arrays
      default: {}
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for teachers associated with this tradition
traditionSchema.virtual('teachers', {
  ref: 'Teacher',
  localField: '_id',
  foreignField: 'traditions'
});

// Virtual for resources associated with this tradition
traditionSchema.virtual('resources', {
  ref: 'Resource',
  localField: '_id',
  foreignField: 'traditions'
});

const Tradition = mongoose.model('Tradition', traditionSchema);

module.exports = Tradition;
