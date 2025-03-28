const express = require('express');
const adminController = require('../controllers/admin-controller');

const router = express.Router();

/**
 * Admin routes
 * Base path: /api/admin
 */

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
router.put('/resources/:id', adminController.updateResource);

// Resource processing routes
router.use('/process', require('./resource-processing-routes'));

module.exports = router;
