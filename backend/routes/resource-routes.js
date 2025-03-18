const express = require('express');
const resourceController = require('../controllers/resource-controller');

const router = express.Router();

/**
 * Resource routes
 * Base path: /api/resources
 */

// GET routes
router.get('/', resourceController.getAllResources);
router.get('/search', resourceController.searchResources);
router.get('/featured', resourceController.getFeaturedResources);
router.get('/types', resourceController.getResourceTypes); 
router.get('/tags', resourceController.getResourceTags); 
router.get('/types/:type', resourceController.getResourcesByType);
router.get('/:idOrSlug', resourceController.getResourceById);

// POST routes
router.post('/', resourceController.createResource);

// PUT routes
router.put('/:id', resourceController.updateResource);

// DELETE routes
router.delete('/:id', resourceController.deleteResource);

module.exports = router;
