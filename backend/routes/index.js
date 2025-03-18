const express = require('express');
const resourceRoutes = require('./resource-routes');
const teacherRoutes = require('./teacher-routes');
const traditionRoutes = require('./tradition-routes');
const userRoutes = require('./user-routes');
const commentRoutes = require('./comment-routes');

const router = express.Router();

/**
 * API Routes
 * Base path: /api
 */

// Mount resource routes
router.use('/resources', resourceRoutes);

// Mount teacher routes
router.use('/teachers', teacherRoutes);

// Mount tradition routes
router.use('/traditions', traditionRoutes);

// Mount user routes
router.use('/users', userRoutes);

// Mount comment routes
router.use('/comments', commentRoutes);

module.exports = router;
