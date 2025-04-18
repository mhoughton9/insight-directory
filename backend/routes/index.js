const express = require('express');
const resourceRoutes = require('./resource-routes');
const teacherRoutes = require('./teacher-routes');
const traditionRoutes = require('./tradition-routes');
const userRoutes = require('./user-routes');
const commentRoutes = require('./comment-routes');
const adminRoutes = require('./admin-routes');
const suggestionRoutes = require('./suggestion-routes');
const cacheMiddleware = require('../middleware/cache-middleware');

const router = express.Router();

/**
 * API Routes
 * Base path: /api
 */

// Mount resource routes with 5-minute caching for improved performance
router.use('/resources', cacheMiddleware(300), resourceRoutes);

// Mount teacher routes with 10-minute caching
router.use('/teachers', cacheMiddleware(600), teacherRoutes);

// Mount tradition routes with 10-minute caching
router.use('/traditions', cacheMiddleware(600), traditionRoutes);

// Mount user routes
router.use('/users', userRoutes);

// Mount comment routes
router.use('/comments', commentRoutes);

// Mount suggestion routes
router.use('/suggestions', suggestionRoutes);

// Mount admin routes
router.use('/admin', adminRoutes);

module.exports = router;
