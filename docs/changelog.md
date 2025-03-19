# Changelog

## March 19, 2025

### UI Enhancements
- **Resource Categories Section**:
  - Improved styling with rounded corners (rounded-xl), subtle shadows, and hover effects
  - Added soft color gradient on hover that matches each category's icon color
  - Changed the font for the "Resource Categories" heading back to Lora and increased its size
  - Removed bold styling from the heading for a cleaner look

- **Navigation Bar**:
  - Removed the "Home" link from the navigation for simplicity
  - Added an "About" link to the navigation bar to the right of "Traditions"
  - Maintained consistent styling across all navigation links

- **Hero Section**:
  - Changed the button text to "Sign up for free" to emphasize user accounts
  - Updated the description below the button to explain the benefits of creating an account
  - Linked the button to the "/signup" page

- **About Section**:
  - Updated the button to match the gradient styling from the Hero section
  - Changed the button text to "Learn more about us"
  - Linked the button to the "/about" page

### Code Simplification
- **Component Cleanup**:
  - Removed the duplicate ResourceCard component from the UI folder
  - Deleted the RelatedResources component to simplify the resource detail page
  - Removed unused components: FilterBar, SearchBar, and InfiniteScroll

- **Resource Type Handling**:
  - Fixed multi-word resource type handling for "Video Channel" and "Retreat Center"
  - Added support for space-separated versions of resource types in the normalizeResourceType function
  - Added debug logging to the resource type page for easier troubleshooting

### Navigation Structure
- Updated all navigation links to use path-based routing (/resources/type/book) instead of query parameters
- Simplified the ResourceTags component to display tags as static elements rather than clickable filters

### Resource Types
- Standardized resource types across the application:
  - Book
  - Video Channel
  - Podcast
  - Website
  - Blog
  - Practice
  - App
  - Retreat Center
