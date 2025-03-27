const mongoose = require('mongoose');

/**
 * Schema for spiritual resources (books, videos, podcasts, etc.)
 */
const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Resource title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Resource description is required']
    },
    type: {
      type: String,
      required: [true, 'Resource type is required'],
      enum: [
        'book', 'blog', 'videoChannel', 'video', 'podcast', 'practice', 
        'retreatCenter', 'website', 'app'
      ]
    },
    url: {
      type: String,
      trim: true
    },
    publishedDate: {
      type: Date
    },
    imageUrl: {
      type: String,
      trim: true
    },
    tags: [{
      type: String,
      lowercase: true,
      trim: true
    }],
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    teachers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher'
    }],
    traditions: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tradition'
    }],
    /**
     * Detailed description sections that vary by resource type
     * Each key is a section identifier (e.g., 'in_a_nutshell', 'quotes_worth_reflecting')
     * Values can be either strings (for text sections) or arrays (for list sections)
     */
    descriptionSections: {
      type: Map,
      of: mongoose.Schema.Types.Mixed, // Allows both strings and arrays
      default: {}
    },
    // Book specific fields
    bookDetails: {
      author: [String],
      yearPublished: Number,
      pages: Number,
      publisher: String,
      links: [String]
    },
    // VideoChannel specific fields
    videoChannelDetails: {
      channelName: String,
      creator: String,
      keyTopics: [String],
      links: [String]
    },
    // Website specific fields
    websiteDetails: {
      websiteName: String,
      creator: String,
      primaryContentTypes: [String],
      link: String
    },
    // Blog specific fields
    blogDetails: {
      name: String,
      author: String,
      frequency: String,
      link: String
    },
    // Podcast specific fields
    podcastDetails: {
      podcastName: String,
      hosts: [String],
      datesActive: String,
      episodeCount: Number,
      notableGuests: [String],
      links: [String]
    },
    // RetreatCenter specific fields
    retreatCenterDetails: {
      name: String,
      location: String,
      retreatTypes: [String],
      links: [String],
      upcomingDates: [String]
    },
    // Practice specific fields
    practiceDetails: {
      name: String,
      instructions: String,
      source: String,
      duration: String,
      difficulty: String,
      technique: String,
      benefits: [String]
    },
    // App specific fields
    appDetails: {
      appName: String,
      creator: String,
      platforms: [String],
      price: String,
      teachers: [String],
      features: [String],
      links: [String]
    },
    // Metadata
    featured: {
      type: Boolean,
      default: false
    },
    viewCount: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for formatted date
resourceSchema.virtual('formattedDate').get(function() {
  if (!this.publishedDate) return '';
  return this.publishedDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Pre-save middleware to create slug from title if not provided
resourceSchema.pre('save', function(next) {
  if (!this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove non-word chars
      .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  }
  next();
});

// Virtual for comments/reviews associated with this resource
resourceSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'resource'
});

// Index for full-text search
resourceSchema.index(
  { 
    title: 'text', 
    description: 'text', 
    tags: 'text' 
  },
  {
    weights: {
      title: 10,
      tags: 5,
      description: 1
    }
  }
);

const Resource = mongoose.model('Resource', resourceSchema);

module.exports = Resource;
