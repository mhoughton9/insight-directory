# Awakening Resources Directory - Project Overview

## Purpose
A custom-coded website that serves as a comprehensive directory for spiritual awakening, non-duality, and self-inquiry resources.

## Core Features
- Organizes resources by type (books, videos, podcasts, etc.).
- Connects resources to teachers and spiritual traditions.
- User accounts for comments/reviews and favoriting resources.
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
- **My Account**: User profile, favorites, comment history (planned).

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
- **Users**: Username, favorites, comments.
- **Comments**: Linked to Resources and Users.

## Tech Stack
- **Frontend**: Next.js + React + TailwindCSS
- **Backend**: Node.js + Express
- **Database**: MongoDB with Mongoose
- **Authentication**: Clerk (or Auth0)
- **Deployment**: Vercel + MongoDB Atlas
- **Image Handling**: Cloudinary (optional)

## Navigation Structure
- **Path-based routing**: Resources are accessed via clean URLs (e.g., /resources/type/book)
- **Simplified header**: Navigation includes Resources, Teachers, Traditions, and About
- **Resource categories**: Visual tiles on the homepage for quick access to resource types

## Example User Flow
1. Visitor lands on Home page → clicks a resource type (e.g., "Books").
2. Browses resources of that type → views details of an interesting resource.
3. Explores related teachers and traditions from the resource detail page.
4. Creates an account → adds resources to Favorites (planned feature).
5. Leaves reviews/comments on resources (planned feature).

## Goals
- Create a simple, structured codebase with minimal complexity.
- Keep the UI minimalist, clean, and distraction-free.
- Make discovery of resources and connections intuitive.
- Prioritize performance and maintainability.

## Documentation
- **UI Guidelines**: See `docs/ui-guidelines.md` for design principles and styling.
- **Changelog**: See `docs/changelog.md` for a history of project updates.
