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
        'book', 'blog', 'videoChannel', 'podcast', 'practice', 
        'retreatCenter', 'website', 'app'
      ]
    },
    // Standard date field for all resources - when the resource was published/released
    publishedDate: {
      type: Date
    },
    // Date range for resources that exist over a period (podcasts, blogs, etc.)
    dateRange: {
      start: Date,
      end: Date,
      active: { type: Boolean, default: true } // Whether the resource is still active
    },
    imageUrl: {
      type: String,
      trim: true
    },
    // Standardized creator field for all resource types
    creator: [{
      type: String,
      trim: true
    }],
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
      isbn: { 
        type: String,
        trim: true
      },
      links: [{
        url: String,
        label: String
      }]
    },
    // VideoChannel specific fields
    videoChannelDetails: {
      channelName: String,
      creator: [String], 
      keyTopics: [String],
      links: [{
        url: String,
        label: String
      }]
    },
    // Website specific fields
    websiteDetails: {
      websiteName: String,
      creator: [String],  
      primaryContentTypes: [String],
      link: String,       
      links: [{
        url: String,
        label: String
      }]
    },
    // Blog specific fields
    blogDetails: {
      name: String,
      author: [String],  
      platform: String,
      frequency: String,
      link: String,      
      links: [{
        url: String,
        label: String
      }]
    },
    // Podcast specific fields
    podcastDetails: {
      podcastName: String,
      hosts: [String],
      datesActive: String,
      episodeCount: Number,
      notableGuests: [String],
      links: [{
        url: String,
        label: String
      }]
    },
    // RetreatCenter specific fields
    retreatCenterDetails: {
      name: String,
      creator: [String],     // Added for consistency, though won't be displayed
      location: String,
      retreatTypes: [String],
      upcomingDates: [String],
      links: [{
        url: String,
        label: String
      }]
    },
    // Practice specific fields
    practiceDetails: {
      name: String,
      originator: [String],  
      duration: String,      
      links: [{
        url: String,
        label: String
      }]
    },
    // App specific fields
    appDetails: {
      appName: String,
      creator: [String],     // Changed from developer to creator for consistency
      platforms: [String],   // Keeping but won't be displayed
      teachers: [String],    // Array of teacher names (not ObjectIds)
      features: [String],    // Keeping for potential future use
      links: [{
        url: String,
        label: String
      }]
    },
    // Status field for more granular resource state tracking
    // This works alongside the processed field for backward compatibility
    status: {
      type: String,
      enum: ['pending', 'posted'],
      default: 'pending'
    },
    // Processing metadata
    processed: {
      type: Boolean,
      default: false
    },
    processingNotes: {
      type: String,
      trim: true
    },
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
    },
    imageProcessed: {
      type: Boolean,
      default: false
    },
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

// Pre-save middleware to keep processed field in sync with status
resourceSchema.pre('save', function(next) {
  // Update status based on processed (for backward compatibility)
  if (this.isModified('processed') && !this.isModified('status')) {
    this.status = this.processed ? 'posted' : 'pending';
  }
  
  // Update processed based on status
  if (this.isModified('status') && !this.isModified('processed')) {
    this.processed = this.status === 'posted';
  }
  
  next();
});

// Pre-save middleware to keep type-specific name fields in sync with title
resourceSchema.pre('save', function(next) {
  // Only run if title is modified or this is a new document
  if (this.isModified('title') || this.isNew) {
    const type = this.type;
    const title = this.title;
    
    // Update type-specific name field based on resource type
    switch (type) {
      case 'podcast':
        if (!this.podcastDetails) this.podcastDetails = {};
        this.podcastDetails.podcastName = title;
        break;
        
      case 'website':
        if (!this.websiteDetails) this.websiteDetails = {};
        this.websiteDetails.websiteName = title;
        break;
        
      case 'blog':
        if (!this.blogDetails) this.blogDetails = {};
        this.blogDetails.name = title;
        break;
        
      case 'retreatCenter':
        if (!this.retreatCenterDetails) this.retreatCenterDetails = {};
        this.retreatCenterDetails.name = title;
        break;
        
      case 'practice':
        if (!this.practiceDetails) this.practiceDetails = {};
        this.practiceDetails.name = title;
        break;
        
      case 'app':
        if (!this.appDetails) this.appDetails = {};
        this.appDetails.appName = title;
        break;
        
      case 'videoChannel':
        if (!this.videoChannelDetails) this.videoChannelDetails = {};
        this.videoChannelDetails.channelName = title;
        break;
    }
  }
  
  next();
});

// Pre-save middleware to sync creator and author fields for books
resourceSchema.pre('save', function(next) {
  const type = this.type;
  
  // Only run for book resources
  if (type === 'book') {
    // Initialize bookDetails if it doesn't exist
    if (!this.bookDetails) this.bookDetails = {};
    
    // Sync top-level creator with bookDetails.author
    if (this.isModified('creator') && !this.isModified('bookDetails.author')) {
      // If creator is modified but author isn't, update author
      this.bookDetails.author = [...this.creator];
    } 
    else if (this.isModified('bookDetails.author') && !this.isModified('creator')) {
      // If author is modified but creator isn't, update creator
      this.creator = [...this.bookDetails.author];
    }
  }
  
  next();
});

// Pre-save middleware to sync creator fields for video channels
resourceSchema.pre('save', function(next) {
  const type = this.type;
  
  // Only run for videoChannel resources
  if (type === 'videoChannel') {
    // Initialize videoChannelDetails if it doesn't exist
    if (!this.videoChannelDetails) this.videoChannelDetails = {};
    
    // Initialize creator arrays if they don't exist
    if (!this.creator) this.creator = [];
    if (!this.videoChannelDetails.creator) this.videoChannelDetails.creator = [];
    
    // Sync top-level creator with videoChannelDetails.creator
    if (this.isModified('creator') && !this.isModified('videoChannelDetails.creator')) {
      // If creator is modified but videoChannelDetails.creator isn't, update videoChannelDetails.creator
      this.videoChannelDetails.creator = [...this.creator];
    } 
    else if (this.isModified('videoChannelDetails.creator') && !this.isModified('creator')) {
      // If videoChannelDetails.creator is modified but creator isn't, update creator
      this.creator = [...this.videoChannelDetails.creator];
    }
  }
  
  next();
});

// Pre-save middleware to sync creator fields for podcasts
resourceSchema.pre('save', function(next) {
  const type = this.type;
  
  // Only run for podcast resources
  if (type === 'podcast') {
    // Initialize podcastDetails if it doesn't exist
    if (!this.podcastDetails) this.podcastDetails = {};
    
    // Initialize creator and hosts arrays if they don't exist
    if (!this.creator) this.creator = [];
    if (!this.podcastDetails.hosts) this.podcastDetails.hosts = [];
    
    // Sync top-level creator with podcastDetails.hosts
    if (this.isModified('creator') && !this.isModified('podcastDetails.hosts')) {
      // If creator is modified but hosts isn't, update hosts
      this.podcastDetails.hosts = [...this.creator];
    } 
    else if (this.isModified('podcastDetails.hosts') && !this.isModified('creator')) {
      // If hosts is modified but creator isn't, update creator
      this.creator = [...this.podcastDetails.hosts];
    }
  }
  
  next();
});

// Pre-save middleware to sync creator fields for websites
resourceSchema.pre('save', function(next) {
  const type = this.type;
  
  // Only run for website resources
  if (type === 'website') {
    // Initialize websiteDetails if it doesn't exist
    if (!this.websiteDetails) this.websiteDetails = {};
    
    // Initialize creator arrays if they don't exist
    if (!this.creator) this.creator = [];
    if (!this.websiteDetails.creator) this.websiteDetails.creator = [];
    
    // Sync top-level creator with websiteDetails.creator
    if (this.isModified('creator') && !this.isModified('websiteDetails.creator')) {
      // If creator is modified but websiteDetails.creator isn't, update websiteDetails.creator
      this.websiteDetails.creator = [...this.creator];
    } 
    else if (this.isModified('websiteDetails.creator') && !this.isModified('creator')) {
      // If websiteDetails.creator is modified but creator isn't, update creator
      this.creator = [...this.websiteDetails.creator];
    }
    
    // If there's a link field but no links array entry for it, add it to links
    if (this.websiteDetails.link && 
        (!this.websiteDetails.links || 
         !this.websiteDetails.links.some(link => link.url === this.websiteDetails.link))) {
      
      if (!this.websiteDetails.links) this.websiteDetails.links = [];
      
      // Add the link to the links array with a default label
      this.websiteDetails.links.push({
        url: this.websiteDetails.link,
        label: 'Website'
      });
    }
  }
  
  next();
});

// Pre-save middleware to sync creator fields for blogs
resourceSchema.pre('save', function(next) {
  const type = this.type;
  
  // Only run for blog resources
  if (type === 'blog') {
    // Initialize blogDetails if it doesn't exist
    if (!this.blogDetails) this.blogDetails = {};
    
    // Initialize creator arrays if they don't exist
    if (!this.creator) this.creator = [];
    if (!this.blogDetails.author) this.blogDetails.author = [];
    
    // Sync top-level creator with blogDetails.author
    if (this.isModified('creator') && !this.isModified('blogDetails.author')) {
      // If creator is modified but blogDetails.author isn't, update blogDetails.author
      this.blogDetails.author = [...this.creator];
    } 
    else if (this.isModified('blogDetails.author') && !this.isModified('creator')) {
      // If blogDetails.author is modified but creator isn't, update creator
      this.creator = [...this.blogDetails.author];
    }
    
    // If there's a link field but no links array entry for it, add it to links
    if (this.blogDetails.link && 
        (!this.blogDetails.links || 
         !this.blogDetails.links.some(link => link.url === this.blogDetails.link))) {
      
      if (!this.blogDetails.links) this.blogDetails.links = [];
      
      // Add the link to the links array with a default label
      this.blogDetails.links.push({
        url: this.blogDetails.link,
        label: 'Blog'
      });
    }
    
    // Ensure dateRange exists for consistency
    if (!this.dateRange) {
      this.dateRange = { active: true };
    }
  }
  
  next();
});

// Pre-save middleware to sync creator fields for practices
resourceSchema.pre('save', function(next) {
  const type = this.type;
  
  // Only run for practice resources
  if (type === 'practice') {
    // Initialize practiceDetails if it doesn't exist
    if (!this.practiceDetails) this.practiceDetails = {};
    
    // Initialize creator arrays if they don't exist
    if (!this.creator) this.creator = [];
    if (!this.practiceDetails.originator) this.practiceDetails.originator = [];
    
    // Sync top-level creator with practiceDetails.originator
    if (this.isModified('creator') && !this.isModified('practiceDetails.originator')) {
      // If creator is modified but practiceDetails.originator isn't, update practiceDetails.originator
      this.practiceDetails.originator = [...this.creator];
    } 
    else if (this.isModified('practiceDetails.originator') && !this.isModified('creator')) {
      // If practiceDetails.originator is modified but creator isn't, update creator
      this.creator = [...this.practiceDetails.originator];
    }
    
    // Ensure dateRange exists for consistency
    if (!this.dateRange) {
      this.dateRange = { active: true };
    }
  }
  
  next();
});

// Pre-save middleware to sync creator fields for apps
resourceSchema.pre('save', function(next) {
  const type = this.type;
  
  // Only run for app resources
  if (type === 'app') {
    // Initialize appDetails if it doesn't exist
    if (!this.appDetails) this.appDetails = {};
    
    // Initialize creator arrays if they don't exist
    if (!this.creator) this.creator = [];
    if (!this.appDetails.creator) this.appDetails.creator = [];
    
    // Sync top-level creator with appDetails.creator
    if (this.isModified('creator') && !this.isModified('appDetails.creator')) {
      // If creator is modified but appDetails.creator isn't, update appDetails.creator
      this.appDetails.creator = [...this.creator];
    } 
    else if (this.isModified('appDetails.creator') && !this.isModified('creator')) {
      // If appDetails.creator is modified but creator isn't, update creator
      this.creator = [...this.appDetails.creator];
    }
    
    // Ensure dateRange exists for consistency
    if (!this.dateRange) {
      this.dateRange = { active: true };
    }
  }
  
  next();
});

// Pre-save middleware to sync creator fields for retreat centers
resourceSchema.pre('save', function(next) {
  const type = this.type;
  
  // Only run for retreat center resources
  if (type === 'retreatCenter') {
    // Initialize retreatCenterDetails if it doesn't exist
    if (!this.retreatCenterDetails) this.retreatCenterDetails = {};
    
    // Initialize creator arrays if they don't exist
    if (!this.creator) this.creator = [];
    if (!this.retreatCenterDetails.creator) this.retreatCenterDetails.creator = [];
    
    // Sync top-level creator with retreatCenterDetails.creator
    if (this.isModified('creator') && !this.isModified('retreatCenterDetails.creator')) {
      // If creator is modified but retreatCenterDetails.creator isn't, update retreatCenterDetails.creator
      this.retreatCenterDetails.creator = [...this.creator];
    } 
    else if (this.isModified('retreatCenterDetails.creator') && !this.isModified('creator')) {
      // If retreatCenterDetails.creator is modified but creator isn't, update creator
      this.creator = [...this.retreatCenterDetails.creator];
    }
    
    // Ensure dateRange exists for consistency
    if (!this.dateRange) {
      this.dateRange = { active: true };
    }
  }
  
  next();
});

// Pre-save middleware to keep date fields in sync
resourceSchema.pre('save', function(next) {
  const type = this.type;
  
  // Sync book yearPublished with publishedDate
  if (type === 'book' && this.bookDetails && this.bookDetails.yearPublished) {
    // If yearPublished changes but publishedDate doesn't exist or wasn't modified
    if (this.isModified('bookDetails.yearPublished') && (!this.publishedDate || !this.isModified('publishedDate'))) {
      // Create a date object for January 1st of the year
      this.publishedDate = new Date(this.bookDetails.yearPublished, 0, 1);
    }
    // If publishedDate changes but yearPublished doesn't
    else if (this.isModified('publishedDate') && !this.isModified('bookDetails.yearPublished')) {
      // Extract the year from publishedDate
      if (this.publishedDate) {
        this.bookDetails.yearPublished = this.publishedDate.getFullYear();
      }
    }
  }
  
  // Sync podcast datesActive with dateRange
  if (type === 'podcast' && this.podcastDetails) {
    // If dateRange is modified, update datesActive string
    if ((this.isModified('dateRange.start') || this.isModified('dateRange.end') || this.isModified('dateRange.active')) && 
        !this.isModified('podcastDetails.datesActive')) {
      
      let datesActiveStr = '';
      
      if (this.dateRange && this.dateRange.start) {
        const startYear = this.dateRange.start.getFullYear();
        datesActiveStr = startYear.toString();
        
        if (this.dateRange.end) {
          const endYear = this.dateRange.end.getFullYear();
          datesActiveStr += ` - ${endYear}`;
        } else if (!this.dateRange.active) {
          datesActiveStr += ' - Present';
        }
      }
      
      if (datesActiveStr) {
        if (!this.podcastDetails) this.podcastDetails = {};
        this.podcastDetails.datesActive = datesActiveStr;
      }
    }
    
    // If datesActive string is modified, try to parse and update dateRange
    if (this.isModified('podcastDetails.datesActive') && 
        !this.isModified('dateRange.start') && 
        !this.isModified('dateRange.end')) {
      
      const datesActive = this.podcastDetails.datesActive;
      if (datesActive) {
        // Try to parse patterns like "2010", "2010 - 2020", "2010 - Present"
        const match = datesActive.match(/^(\d{4})(?:\s*-\s*(\d{4}|Present))?$/);
        
        if (match) {
          const startYear = parseInt(match[1]);
          if (!isNaN(startYear)) {
            if (!this.dateRange) this.dateRange = {};
            this.dateRange.start = new Date(startYear, 0, 1);
            
            if (match[2]) {
              if (match[2] === 'Present') {
                this.dateRange.active = true;
                this.dateRange.end = null;
              } else {
                const endYear = parseInt(match[2]);
                if (!isNaN(endYear)) {
                  this.dateRange.end = new Date(endYear, 11, 31); // December 31st
                  this.dateRange.active = false;
                }
              }
            }
          }
        }
      }
    }
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

// Indexes for query optimization
resourceSchema.index({ processed: 1, createdAt: -1 });
resourceSchema.index({ processed: 1, type: 1, createdAt: -1 });
resourceSchema.index({ processed: 1, featured: 1, createdAt: -1 });
resourceSchema.index({ processed: 1, teachers: 1, createdAt: -1 }); // Multikey
resourceSchema.index({ processed: 1, traditions: 1, createdAt: -1 }); // Multikey
resourceSchema.index({ processed: 1, tags: 1, createdAt: -1 }); // Multikey
resourceSchema.index({ tags: 1 }); // For getResourceTags aggregation

const Resource = mongoose.model('Resource', resourceSchema);

module.exports = Resource;
