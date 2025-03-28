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

module.exports = router;
