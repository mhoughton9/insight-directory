const mongoose = require('mongoose');

/**
 * Schema for user-submitted resource suggestions
 */
const suggestionSchema = new mongoose.Schema(
  {
    // Basic suggestion information
    title: {
      type: String,
      required: [true, 'Suggestion title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Suggestion description is required']
    },
    type: {
      type: String,
      required: [true, 'Resource type is required'],
      enum: [
        'book', 'blog', 'videoChannel', 'podcast', 'practice', 
        'retreatCenter', 'website', 'app', 'teacher', 'tradition'
      ]
    },
    link: {
      type: String,
      trim: true
    },
    creator: {
      type: String,
      trim: true
    },
    
    // Submitter information
    submitterId: {
      type: String, // Clerk user ID
      required: [true, 'Submitter ID is required']
    },
    submitterName: {
      type: String,
      trim: true
    },
    submitterEmail: {
      type: String,
      trim: true
    },
    
    // Additional information
    additionalInfo: {
      type: String,
      trim: true
    },
    
    // Admin processing fields
    status: {
      type: String,
      enum: ['new', 'reviewed', 'approved', 'rejected'],
      default: 'new'
    },
    adminNotes: {
      type: String,
      trim: true
    },
    reviewedAt: {
      type: Date
    },
    reviewedBy: {
      type: String // Clerk admin ID
    }
  },
  { timestamps: true }
);

// Virtual for formatted creation date
suggestionSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Virtual for formatted review date
suggestionSchema.virtual('formattedReviewDate').get(function() {
  if (!this.reviewedAt) return '';
  return this.reviewedAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Virtual for age of suggestion in days
suggestionSchema.virtual('ageInDays').get(function() {
  const now = new Date();
  const created = this.createdAt;
  const diffTime = Math.abs(now - created);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

const Suggestion = mongoose.model('Suggestion', suggestionSchema);

module.exports = Suggestion;
