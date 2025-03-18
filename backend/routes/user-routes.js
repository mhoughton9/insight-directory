const express = require('express');
const userController = require('../controllers/user-controller');

const router = express.Router();

/**
 * User routes
 * Base path: /api/users
 */

// Profile routes
router.get('/profile', userController.getUserProfile);
router.post('/profile', userController.createOrUpdateUser);

// Favorite resources routes
router.post('/favorites/resources/:resourceId', userController.addResourceToFavorites);
router.delete('/favorites/resources/:resourceId', userController.removeResourceFromFavorites);

// Favorite teachers routes
router.post('/favorites/teachers/:teacherId', userController.addTeacherToFavorites);
router.delete('/favorites/teachers/:teacherId', userController.removeTeacherFromFavorites);

// Favorite traditions routes
router.post('/favorites/traditions/:traditionId', userController.addTraditionToFavorites);
router.delete('/favorites/traditions/:traditionId', userController.removeTraditionFromFavorites);

module.exports = router;
