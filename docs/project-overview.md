# Insight Directory - Project Overview

## Purpose
A custom-coded website that serves as a comprehensive directory for spiritual awakening, non-duality, and self-inquiry resources.

## Core Features
- Organizes resources by type (books, videos, podcasts, etc.).
- Connects resources to teachers and spiritual traditions.
- User accounts for favoriting resources.
- Clean, intuitive navigation with a resource-type-first approach.
- Search and filtering by teacher, tradition, topic, and more.
- Mobile-friendly, minimalist design reflecting non-dual themes.

## Primary Pages
- **Home**: Intro and resource-type navigation tiles with enhanced visual styling.
- **Resource Types**: Dedicated pages for each resource type (e.g., /resources/type/book).
- **Resource Detail**: Individual resource pages with teacher and tradition connections.
- **Teachers**: Directory of teacher profiles with linked resources.
- **Traditions**: Descriptions of spiritual approaches and lineages.
- **About**: Mission and contact information.
- **Suggest a Resource**: Form for users to suggest new resources to add to the directory.
- **My Account**: User profile and favorites (for authenticated users).

## Resource Types
The application supports the following resource types:
- Book
- Video Channel
- Podcast
- Website
- Blog
- Practice
- App
- Retreat Center

## Database Structure (Simplified)
- **Resources**: Title, description, type, tags, teacherIds, traditionIds.
- **Teachers**: Name, bio, photo, teaching style, traditionIds.
- **Traditions**: Name, description, historical context.
- **Users**: Username, favorites.

## Tech Stack
- **Frontend**: Next.js + React + TailwindCSS
- **Backend**: Node.js + Express
- **Database**: MongoDB with Mongoose
- **Authentication**: Clerk
- **Deployment**: Vercel + MongoDB Atlas
- **Image Handling**: Cloudinary

## Development Guidelines
- **Command Line Usage**: NEVER use the `&&` operator in commands. Always use separate commands or scripts instead.
- **Code Style**: Follow the established patterns in the codebase for consistency.
- **API Changes**: Be cautious when modifying the API client to avoid breaking functionality.
- **Documentation**: Keep documentation updated when making significant changes.

## Authentication Approach
- **Component-based protection**: Uses a `ProtectedRoute` component with Clerk's `useUser` hook
- **Public content**: All directory content is publicly accessible
- **Protected features**: User-specific features (favorites, profile) require authentication
- **No middleware**: Authentication is handled at the component level, not via middleware

## Navigation Structure
- **Path-based routing**: Resources are accessed via clean URLs (e.g., /resources/type/book)
- **Simplified header**: Navigation includes Resources, Teachers, Traditions, About
- **Resource categories**: Visual tiles on the homepage for quick access to resource types

## Error Handling
- **Centralized system**: Comprehensive error handling across frontend and backend
- **Standardized format**: Consistent error responses with codes and user-friendly messages
- **API client integration**: Error handling built into the API client with retry capabilities

## Typography System
- **Standardized components**: Heading, Subheading, Text, and Caption components
- **Font pairing**: Lora (serif) for headings, Inter (sans-serif) for body text
- **Consistent sizing**: Standardized text sizes across the application

## Example User Flow
1. Visitor lands on Home page → clicks a resource type (e.g., "Books").
2. Browses resources of that type → views details of an interesting resource.
3. Explores related teachers and traditions from the resource detail page.
4. Creates an account → adds resources to Favorites.
5. Suggests new resources via the Suggest a Resource page.

## Goals
- Create a simple, structured codebase with minimal complexity.
- Keep the UI minimalist, clean, and distraction-free.
- Make discovery of resources and connections intuitive.
- Prioritize performance and maintainability.

## Documentation
- **UI Guidelines**: See `docs/ui-guidelines.md` for design principles and styling.
- **UI Style Guide**: See `docs/ui-style-guide.md` for detailed styling specifications.
- **API Error Handling**: See `docs/api-error-handling.md` for error handling approach.
- **Changelog**: See `docs/changelog.md` for a history of project updates.
