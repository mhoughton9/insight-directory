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
- **Home**: Intro and resource-type navigation tiles.
- **Resources**: Lists resources, searchable and filterable.
- **Teachers**: Directory of teacher profiles with linked resources.
- **Traditions**: Descriptions of spiritual approaches and lineages.
- **My Account**: User profile, favorites, comment history.
- **About**: Mission and contact info.

## Database Structure (Simplified)
- **Resources**: Title, description, format, tags, teacherIds, traditionIds.
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

## Example User Flow
1. Visitor lands on Home page → clicks "Books."
2. Browses books → filters by Tradition "Zen."
3. Clicks on a book → sees its teacher and tradition.
4. Registers an account → adds the book to Favorites.
5. Leaves a review/comment.

## Goals
- Create a simple, structured codebase AI can work with.
- Keep the UI minimalist, clean, and distraction-free.
- Make discovery of resources and connections easy.
