const express = require('express');
const router = express.Router();
const resourceProcessingController = require('../controllers/resource-processing-controller');

// Get the next unprocessed resource
router.get('/next-unprocessed', resourceProcessingController.getNextUnprocessedResource);

// Process a resource
router.put('/:id', resourceProcessingController.processResource);

// Skip a resource
router.put('/:id/skip', resourceProcessingController.skipResource);

// Get processing progress
router.get('/progress', resourceProcessingController.getProgress);

module.exports = router;
