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
router.get('/profile', userController.getUserProfile);
router.post('/profile', userController.createOrUpdateUser);

// Favorites routes - using unified endpoint with authentication
router.get('/favorites', authMiddleware, userController.getUserFavorites);
router.post('/favorites', authMiddleware, userController.toggleFavorite);

module.exports = router;
