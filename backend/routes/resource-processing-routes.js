const express = require('express');
const router = express.Router();
const resourceProcessingController = require('../controllers/resource-processing-controller');
const authMiddleware = require('../middleware/auth-middleware'); 

// --- Resource Processing Routes ---
// Apply authMiddleware individually to each route

// GET next unprocessed resource (apply middleware)
router.get('/next-unprocessed', authMiddleware, resourceProcessingController.getNextUnprocessedResource);

// PUT process a specific resource (apply middleware)
// Using /resource/:id for clarity
router.put('/resource/:id', authMiddleware, resourceProcessingController.processResource);

// GET processing progress statistics (apply middleware)
router.get('/progress', authMiddleware, resourceProcessingController.getProgress);

module.exports = router;
