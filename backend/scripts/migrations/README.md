# Data Migration Scripts

This directory contains one-time data migration scripts used to populate and update the database with structured content for resources, teachers, and traditions.

## Description Sections Migration

These scripts were used to add the `descriptionSections` field to various entities in the database, providing rich, structured content for the detail pages.

### Resource Scripts

- `sample-description-sections.js` - Helper functions to generate sample content for different resource types
- `test-update-description-sections.js` - Test script to update a single resource
- `update-all-description-sections.js` - Script to update all resources at once
- `update-remaining-resources.js` - Script to update resources that were missed in the initial run
- `update-video-resource.js` - Script to update the "Who Am I?" video resource
- `update-video-channel.js` - Script to update the "Buddha at the Gas Pump" video channel resource

### Teacher Scripts

- `update-teacher-sections.js` - Initial script to update teachers with description sections
- `update-teacher-sections-revised.js` - Updated script with the revised section structure:
  - In a Nutshell
  - What students say
  - Common Misunderstanding clarified
  - If you only read/watch one thing
  - Quotes worth remembering

### Tradition Scripts

- `update-tradition-sections.js` - Initial script to update traditions with description sections
- `update-tradition-sections-revised.js` - Updated script with the revised section structure:
  - In a Nutshell (description)
  - The Steel-man case
  - If you only read one book
  - Common misunderstanding clarified
  - Practical Exercises

### Miscellaneous

- `update-remaining-sections.js` - Script to update any remaining teachers or traditions that were missed

## Usage

These scripts are intended for one-time use to migrate data. If you need to run them again, make sure to check the current state of the database first to avoid duplicate or inconsistent data.

To run a script:

```bash
node scripts/migrations/script-name.js
```

## Schema Changes

These migrations added the following field to the Resource, Teacher, and Tradition schemas:

```javascript
descriptionSections: {
  type: Map,
  of: mongoose.Schema.Types.Mixed, // Allows both strings and arrays
  default: {}
}
```

This field stores structured content for dynamic rendering on detail pages.
