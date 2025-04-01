# Awakening Resources Directory - Schema Guide

## Overview

This document serves as a reference guide for the resource schema structure in the Awakening Resources Directory. It details the standardized fields across all resource types and the specific fields for each resource type, along with the synchronization middleware that maintains consistency between related fields.

## Common Fields

All resources share these common top-level fields:

| Field | Type | Description |
|-------|------|-------------|
| `title` | String | The primary title of the resource (required) |
| `description` | String | A detailed description of the resource (required) |
| `type` | String | The type of resource (e.g., 'book', 'podcast', 'videoChannel', 'website', 'blog', 'practice', 'app', 'retreatCenter') |
| `publishedDate` | Date | When the resource was published/released |
| `dateRange` | Object | For resources that exist over a period |
| `dateRange.start` | Date | When the resource started |
| `dateRange.end` | Date | When the resource ended (if applicable) |
| `dateRange.active` | Boolean | Whether the resource is still active |
| `creator` | Array of Strings | The creators/authors of the resource |
| `imageUrl` | String | URL to the resource's image |
| `tags` | Array of Strings | Keywords associated with the resource |
| `slug` | String | URL-friendly version of the title (required, unique) |
| `teachers` | Array of ObjectIds | References to Teacher documents |
| `traditions` | Array of ObjectIds | References to Tradition documents |
| `descriptionSections` | Map | Detailed sections for the description |
| `status` | String | Status of the resource ('pending' or 'posted') |
| `processed` | Boolean | Whether the resource has been processed |

## Resource-Specific Fields

### Books

Books have specific fields in the `bookDetails` object:

```javascript
bookDetails: {
  author: [String],        // Synced with top-level creator field
  yearPublished: Number,   // Synced with top-level publishedDate
  pages: Number,
  publisher: String,
  isbn: String,            // ISBN number (also stored at top-level for backward compatibility)
  links: [{                // Links to purchase or view the book
    url: String,
    label: String
  }]
}
```

**Synchronization:**
- The `bookDetails.author` array is synchronized with the top-level `creator` array
- The `bookDetails.yearPublished` is synchronized with the top-level `publishedDate`
- The `bookDetails.isbn` is synchronized with the top-level `isbn` field (for backward compatibility)

### Video Channels

Video channels have specific fields in the `videoChannelDetails` object:

```javascript
videoChannelDetails: {
  channelName: String,     // Synced with top-level title
  creator: [String],       // Synced with top-level creator field
  keyTopics: [String],     // Main topics covered by the channel
  links: [{                // Links to the channel on various platforms
    url: String,
    label: String
  }]
}
```

**Synchronization:**
- The `videoChannelDetails.channelName` is synchronized with the top-level `title`
- The `videoChannelDetails.creator` array is synchronized with the top-level `creator` array

### Podcasts

Podcasts have specific fields in the `podcastDetails` object:

```javascript
podcastDetails: {
  podcastName: String,     // Synced with top-level title
  hosts: [String],         // Synced with top-level creator field
  datesActive: String,     // Text representation of active dates (e.g., "2016–Present")
  episodeCount: Number,    // Number of episodes
  notableGuests: [String], // Notable guests featured on the podcast
  links: [{                // Links to the podcast on various platforms
    url: String,
    label: String
  }]
}
```

**Synchronization:**
- The `podcastDetails.podcastName` is synchronized with the top-level `title`
- The `podcastDetails.hosts` array is synchronized with the top-level `creator` array
- The `podcastDetails.datesActive` string is synchronized with the top-level `dateRange` object

### Websites

Websites have specific fields in the `websiteDetails` object:

```javascript
websiteDetails: {
  websiteName: String,     // Synced with top-level title
  creator: [String],       // Synced with top-level creator field
  primaryContentTypes: [String], // Types of content on the website
  link: String,            // Legacy field, migrated to links array
  links: [{                // Links to the website and related resources
    url: String,
    label: String
  }]
}
```

**Synchronization:**
- The `websiteDetails.websiteName` is synchronized with the top-level `title`
- The `websiteDetails.creator` array is synchronized with the top-level `creator` array
- The `websiteDetails.link` is automatically added to the `links` array if not already present

### Blogs

Blogs have specific fields in the `blogDetails` object:

```javascript
blogDetails: {
  name: String,           // Synced with top-level title
  author: [String],       // Synced with top-level creator field
  platform: String,       // Platform where the blog is hosted
  frequency: String,      // How often the blog is updated (e.g., "Weekly", "Monthly")
  link: String,           // Legacy field, migrated to links array
  links: [{                // Links to the blog and related resources
    url: String,
    label: String
  }]
}
```

**Synchronization:**
- The `blogDetails.name` is synchronized with the top-level `title`
- The `blogDetails.author` array is synchronized with the top-level `creator` array
- The `blogDetails.link` is automatically added to the `links` array if not already present

### Practices

Practices have specific fields in the `practiceDetails` object:

```javascript
practiceDetails: {
  name: String,           // Synced with top-level title
  originator: [String],   // Synced with top-level creator field (optional)
  duration: String,       // Typical duration of the practice (e.g., "20-30 minutes")
  links: [{                // Links to resources about the practice (optional)
    url: String,
    label: String
  }]
}
```

**Synchronization:**
- The `practiceDetails.name` is synchronized with the top-level `title`
- The `practiceDetails.originator` array is synchronized with the top-level `creator` array

### Apps

Apps have specific fields in the `appDetails` object:

```javascript
appDetails: {
  appName: String,         // Synced with top-level title
  creator: [String],       // Synced with top-level creator field
  platforms: [String],     // Platforms where the app is available (e.g., "iOS", "Android")
  teachers: [String],      // Names of teachers featured in the app
  features: [String],      // Key features of the app
  links: [{                // Links to app stores and website
    url: String,
    label: String
  }]
}
```

**Synchronization:**
- The `appDetails.appName` is synchronized with the top-level `title`
- The `appDetails.creator` array is synchronized with the top-level `creator` array

### Retreat Centers

Retreat centers have specific fields in the `retreatCenterDetails` object:

```javascript
retreatCenterDetails: {
  name: String,           // Synced with top-level title
  creator: [String],      // Synced with top-level creator field (not displayed)
  location: String,       // Physical location of the retreat center
  retreatTypes: [String], // Types of retreats offered (e.g., "Residential", "Day Retreats")
  upcomingDates: [String], // Dates of upcoming retreats
  links: [{                // Links to the retreat center website and booking pages
    url: String,
    label: String
  }]
}
```

**Synchronization:**
- The `retreatCenterDetails.name` is synchronized with the top-level `title`
- The `retreatCenterDetails.creator` array is synchronized with the top-level `creator` array

## Middleware

The schema includes several middleware functions that maintain consistency between related fields:

### Title Synchronization

When the top-level `title` is modified, the type-specific name field is updated automatically:

- For books: No specific name field (uses title directly)
- For video channels: Updates `videoChannelDetails.channelName`
- For podcasts: Updates `podcastDetails.podcastName`
- For websites: Updates `websiteDetails.websiteName`
- For blogs: Updates `blogDetails.name`
- For practices: Updates `practiceDetails.name`
- For apps: Updates `appDetails.appName`
- For retreat centers: Updates `retreatCenterDetails.name`

### Creator Synchronization

When the top-level `creator` array is modified, the type-specific creator/author field is updated automatically:

- For books: Updates `bookDetails.author`
- For video channels: Updates `videoChannelDetails.creator`
- For podcasts: Updates `podcastDetails.hosts`
- For websites: Updates `websiteDetails.creator`
- For blogs: Updates `blogDetails.author`
- For practices: Updates `practiceDetails.originator`
- For apps: Updates `appDetails.creator`
- For retreat centers: Updates `retreatCenterDetails.creator`

The synchronization also works in reverse: when the type-specific field is modified, the top-level `creator` array is updated.

### Date Synchronization

Date fields are synchronized to maintain consistency:

- For books: `bookDetails.yearPublished` is synchronized with `publishedDate`
- For podcasts: `podcastDetails.datesActive` is synchronized with `dateRange`

## Adding New Resources

When adding a new resource through the admin interface:

1. Always set the top-level fields (`title`, `description`, `type`, `creator`, etc.)
2. Set the type-specific fields in the appropriate details object
3. The middleware will automatically keep related fields in sync

### Example: Adding a Book

```javascript
const newBook = new Resource({
  title: "The Power of Now",
  description: "A guide to spiritual enlightenment...",
  type: "book",
  creator: ["Eckhart Tolle"],
  publishedDate: new Date(1997, 0, 1),  // January 1, 1997
  bookDetails: {
    isbn: "9781577314806",
    publisher: "New World Library",
    pages: 236,
    links: [
      { url: "https://amzn.to/example", label: "Amazon" }
    ]
  }
});
```

The middleware will automatically:
- Sync `creator` with `bookDetails.author`
- Sync `publishedDate` with `bookDetails.yearPublished`

### Example: Adding a Podcast

```javascript
const newPodcast = new Resource({
  title: "Deconstructing Yourself",
  description: "A podcast about meditation, consciousness, and awakening...",
  type: "podcast",
  creator: ["Michael Taft"],
  dateRange: {
    start: new Date(2016, 0, 1),  // January 1, 2016
    active: true
  },
  podcastDetails: {
    episodeCount: 87,
    notableGuests: ["John Yates", "Daniel Ingram", "Shinzen Young"],
    links: [
      { url: "https://open.spotify.com/show/example", label: "Spotify" },
      { url: "https://podcasts.apple.com/us/podcast/example", label: "Apple Podcasts" }
    ]
  }
});
```

The middleware will automatically:
- Sync `title` with `podcastDetails.podcastName`
- Sync `creator` with `podcastDetails.hosts`
- Sync `dateRange` with `podcastDetails.datesActive`

### Example: Adding a Website

```javascript
const newWebsite = new Resource({
  title: "Liberation Unleashed",
  description: "A global movement of people helping others to see through the illusion of a separate self...",
  type: "website",
  creator: ["Ilona Ciunaite", "Elena Nezhinsky"],
  dateRange: {
    active: true
  },
  websiteDetails: {
    primaryContentTypes: ["Forum", "Guides", "Books", "Community"],
    links: [
      { url: "https://www.liberationunleashed.com", label: "Website" }
    ]
  }
});
```

The middleware will automatically:
- Sync `title` with `websiteDetails.websiteName`
- Sync `creator` with `websiteDetails.creator`

### Example: Adding a Blog

```javascript
const newBlog = new Resource({
  title: "Awake Blog",
  description: "A blog exploring non-dual awareness and the direct path to self-realization...",
  type: "blog",
  creator: ["John Smith"],
  dateRange: {
    active: true
  },
  blogDetails: {
    platform: "WordPress",
    frequency: "Weekly",
    links: [
      { url: "https://example.com/awake-blog", label: "Blog" }
    ]
  }
});
```

The middleware will automatically:
- Sync `title` with `blogDetails.name`
- Sync `creator` with `blogDetails.author`

### Example: Adding a Practice

```javascript
const newPractice = new Resource({
  title: "Self-Inquiry: Who Am I?",
  description: "A fundamental practice of self-inquiry as taught by Ramana Maharshi. This direct approach helps reveal one's true nature beyond identification with thoughts and the body.",
  type: "practice",
  creator: ["Ramana Maharshi"],  // Optional for practices
  dateRange: {
    active: true
  },
  practiceDetails: {
    duration: "20-30 minutes",
    links: [
      { url: "https://example.com/self-inquiry-guide", label: "Practice Guide" }
    ]
  }
});
```

The middleware will automatically:
- Sync `title` with `practiceDetails.name`
- Sync `creator` with `practiceDetails.originator`

### Example: Adding an App

```javascript
const newApp = new Resource({
  title: "Waking Up",
  description: "A meditation app focused on both mindfulness and the nature of consciousness...",
  type: "app",
  creator: ["Sam Harris"],
  dateRange: {
    active: true
  },
  appDetails: {
    teachers: ["Sam Harris", "Joseph Goldstein", "Loch Kelly"],
    platforms: ["iOS", "Android", "Web"],
    features: ["Guided Meditations", "Theory Lessons", "Timer"],
    links: [
      { url: "https://apps.apple.com/us/app/waking-up-guided-meditation/id1307736395", label: "App Store" },
      { url: "https://play.google.com/store/apps/details?id=org.wakingup.android", label: "Google Play" },
      { url: "https://www.wakingup.com", label: "Website" }
    ]
  }
});
```

The middleware will automatically:
- Sync `title` with `appDetails.appName`
- Sync `creator` with `appDetails.creator`

### Example: Adding a Retreat Center

```javascript
const newRetreatCenter = new Resource({
  title: "Spirit Rock Meditation Center",
  description: "A meditation and retreat center in the San Francisco Bay Area...",
  type: "retreatCenter",
  creator: [], // Optional for retreat centers
  dateRange: {
    active: true
  },
  retreatCenterDetails: {
    location: "Woodacre, California, USA",
    retreatTypes: ["Residential Retreats", "Day Retreats", "Online Programs", "Classes"],
    upcomingDates: ["June 15-21, 2025", "July 10-17, 2025", "August 5-12, 2025"],
    links: [
      { url: "https://www.spiritrock.org", label: "Website" },
      { url: "https://www.spiritrock.org/calendar", label: "Calendar" },
      { url: "https://www.spiritrock.org/residential-retreats", label: "Residential Retreats" }
    ]
  }
});
```

The middleware will automatically:
- Sync `title` with `retreatCenterDetails.name`
- Sync `creator` with `retreatCenterDetails.creator`

## Best Practices

1. **Always use the top-level fields** when possible, as they provide a consistent interface across all resource types
2. **Let the middleware handle synchronization** rather than manually updating both fields
3. **Use the standard link format** `{ url: String, label: String }` for all resource types
4. **Set the `dateRange` object** for resources that exist over time, rather than just using `publishedDate`
5. **Use arrays for creator fields** even when there's only one creator, for consistency

## Teacher Model

The Teacher model represents spiritual teachers, authors, and figures in the directory:

```javascript
teacherSchema = {
  name: String,              // Required, unique
  biography: String,         // Required, short biography
  biographyFull: String,     // Optional, defaults to biography if not provided
  birthDate: Date,           // Full birth date (if known)
  deathDate: Date,           // Full death date (if applicable)
  birthYear: Number,         // Birth year only (displayed in UI)
  deathYear: Number,         // Death year only (displayed in UI)
  country: String,           // Country of origin
  keyTeachings: [String],    // Main teachings or concepts
  notableTeachings: [String], // Notable quotes or teachings
  slug: String,              // URL-friendly version of name
  imageUrl: String,          // Profile image URL
  website: String,           // Main website (also added to links array)
  links: [{                  // All related links
    url: String,
    label: String
  }],
  traditions: [ObjectId],    // References to associated traditions
  descriptionSections: Map,  // Structured description with standardized sections
  relatedTeachers: [ObjectId] // References to related teachers
}
```

### Description Sections

The Teacher model uses a standardized structure for `descriptionSections` with these fields:

- `in_a_nutshell`: Brief summary of the teacher's approach
- `key_contributions`: Major contributions to spiritual teachings
- `teaching_style`: Description of their teaching approach
- `notable_quotes`: Array of significant quotes
- `historical_context`: Their place in the broader spiritual landscape

### Middleware

The Teacher model includes middleware to:

- Automatically add the `website` URL to the `links` array with the label "Website"
- This ensures all links are consistently stored in the links array for UI display

## Tradition Model

The Tradition model represents spiritual traditions, paths, and lineages in the directory:

```javascript
traditionSchema = {
  name: String,              // Required, unique
  description: String,       // Required, short description
  descriptionFull: String,   // Optional, longer description
  origin: String,            // Geographical origin
  foundingPeriod: String,    // Time period when tradition was founded
  keyTeachings: [String],    // Main teachings or concepts
  slug: String,              // URL-friendly version of name
  imageUrl: String,          // Tradition image URL
  links: [{                  // All related links
    url: String,
    label: String
  }],
  relatedTraditions: [ObjectId], // References to related traditions
  descriptionSections: Map,  // Structured description with standardized sections
}
```

### Description Sections

The Tradition model uses a standardized structure for `descriptionSections` with these fields:

- `in_a_nutshell`: Brief summary of the tradition
- `historical_context`: Origins and development of the tradition
- `key_teachings`: Core principles and concepts (array)
- `practices`: Common practices associated with the tradition (array)
- `modern_relevance`: How the tradition is practiced or interpreted today

### Virtual Fields

The Tradition model includes virtual fields for:

- `teachers`: References to teachers associated with this tradition
- `resources`: References to resources associated with this tradition

## Future Considerations

As the application evolves, consider these potential enhancements:

1. Adding validation for ISBN numbers, URLs, and other structured data
2. Implementing more sophisticated date parsing for different formats
3. Expanding the link structure to include additional metadata (e.g., affiliate status, primary/secondary)

---

This document will be updated as additional resource types are standardized and as the schema evolves.
