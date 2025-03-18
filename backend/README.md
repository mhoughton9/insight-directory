# Awakening Resources Directory - Backend API

This is the backend API for the Awakening Resources Directory, a comprehensive platform for spiritual awakening, non-duality, and self-inquiry resources.

## Tech Stack

- **Node.js** with Express for the API server
- **MongoDB** with Mongoose for database and schema modeling
- **Clerk** for user authentication
- **Cloudinary** for image storage and optimization

## Directory Structure

```
backend/
├── config/           # Configuration files (database connection)
├── controllers/      # Business logic for API routes
├── middleware/       # Custom middleware (error handling, auth)
├── models/           # Mongoose schemas
├── routes/           # Express API routes
├── utils/            # Utility functions (seeding data, etc.)
├── .env              # Environment variables (not in repo)
├── .env.example      # Example environment variables
├── package.json      # Dependencies and scripts
└── server.js         # Main application entry point
```

## API Endpoints

### Resources
- `GET /api/resources` - Get all resources (with pagination)
- `GET /api/resources/search` - Search resources
- `GET /api/resources/featured` - Get featured resources
- `GET /api/resources/types/:type` - Get resources by type
- `GET /api/resources/:idOrSlug` - Get a single resource
- `POST /api/resources` - Create a new resource
- `PUT /api/resources/:id` - Update a resource
- `DELETE /api/resources/:id` - Delete a resource

### Teachers
- `GET /api/teachers` - Get all teachers (with pagination)
- `GET /api/teachers/search` - Search teachers
- `GET /api/teachers/:idOrSlug` - Get a single teacher
- `POST /api/teachers` - Create a new teacher
- `PUT /api/teachers/:id` - Update a teacher
- `DELETE /api/teachers/:id` - Delete a teacher

### Traditions
- `GET /api/traditions` - Get all traditions (with pagination)
- `GET /api/traditions/search` - Search traditions
- `GET /api/traditions/:idOrSlug` - Get a single tradition
- `POST /api/traditions` - Create a new tradition
- `PUT /api/traditions/:id` - Update a tradition
- `DELETE /api/traditions/:id` - Delete a tradition

### Users & Favorites
- `GET /api/users/profile` - Get user profile
- `POST /api/users/profile` - Create or update user profile
- `POST /api/users/favorites/resources/:resourceId` - Add resource to favorites
- `DELETE /api/users/favorites/resources/:resourceId` - Remove resource from favorites
- `POST /api/users/favorites/teachers/:teacherId` - Add teacher to favorites
- `DELETE /api/users/favorites/teachers/:teacherId` - Remove teacher from favorites
- `POST /api/users/favorites/traditions/:traditionId` - Add tradition to favorites
- `DELETE /api/users/favorites/traditions/:traditionId` - Remove tradition from favorites

### Comments
- `GET /api/comments/resource/:resourceId` - Get comments for a resource
- `POST /api/comments` - Create a new comment
- `PUT /api/comments/:id` - Update a comment
- `DELETE /api/comments/:id` - Delete a comment
- `POST /api/comments/:id/like` - Like a comment

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local instance or MongoDB Atlas)

### Installation

1. Clone the repository
2. Navigate to the backend directory
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file based on `.env.example`
5. Start the development server:
   ```
   npm run dev
   ```

### Database Seeding

To populate the database with sample data for development:

```
npm run seed
```

## Development

- The API server runs on port 5000 by default
- API routes are prefixed with `/api`
- MongoDB connection is configured in `config/db.js`
- Environment variables are loaded from `.env` file

## Production Deployment

For production deployment:

1. Set `NODE_ENV=production` in your environment
2. Ensure all required environment variables are set
3. Run `npm start` to start the server
