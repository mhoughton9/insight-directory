const express = require('express');
const userController = require('../controllers/user-controller');

const router = express.Router();

/**
 * User routes
 * Base path: /api/users
 */

// Sync user from Clerk
router.post('/sync', userController.syncUser);

// Profile routes
router.get('/profile', userController.getUserProfile);
router.post('/profile', userController.createOrUpdateUser);

// Favorites routes - using unified endpoint
router.get('/favorites', userController.getUserFavorites);
router.post('/favorites', userController.toggleFavorite);

module.exports = router;
