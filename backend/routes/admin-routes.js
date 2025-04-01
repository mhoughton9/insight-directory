const express = require('express');
const adminController = require('../controllers/admin-controller');

const router = express.Router();

/**
 * Admin routes
 * Base path: /api/admin
 */

// Resource statistics route
router.get('/resources/stats', adminController.getResourceStats);

// Book management routes
router.get('/books/unprocessed', adminController.getUnprocessedBooks);
router.get('/books/next-unprocessed', adminController.getNextUnprocessedBook);
router.get('/books/progress', adminController.getProgress);
router.put('/books/:id', adminController.updateBookData);
router.put('/books/:id/skip', adminController.skipBook);
router.delete('/books/:id', adminController.deleteBook);

// Resource management routes
router.get('/resources', adminController.getAllResources);
router.get('/resources/:id', adminController.getResourceById);
router.post('/resources', adminController.createResource);
router.put('/resources/:id', adminController.updateResource);
router.delete('/resources/:id', adminController.deleteResource);

// Bulk import route
router.post('/bulk-import', adminController.bulkImportResources);

// Resource processing routes
router.use('/process', require('./resource-processing-routes'));

// Suggestion management routes
router.use('/suggestions', require('./admin-suggestion-routes'));

module.exports = router;
