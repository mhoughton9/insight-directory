const express = require('express');
const userController = require('../controllers/user-controller');
const authMiddleware = require('../middleware/auth-middleware');

const router = express.Router();

/**
 * User routes
 * Base path: /api/users
 */

// Sync user from Clerk - requires authentication
router.post('/sync', authMiddleware, userController.syncUser);

// Profile routes
router.get('/profile', authMiddleware, userController.getUserProfile);
router.post('/profile', authMiddleware, userController.createOrUpdateUser);

// Favorites routes - using unified endpoint with authentication
router.get('/favorites', authMiddleware, userController.getUserFavorites);
router.post('/favorites', authMiddleware, userController.toggleFavorite);
router.delete('/favorites', authMiddleware, userController.toggleFavorite); // Add DELETE method

module.exports = router;
