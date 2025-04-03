const express = require('express');
const adminController = require('../controllers/admin-controller');

const router = express.Router();

/**
 * Admin routes
 * Base path: /api/admin
 */

// Resource statistics route
router.get('/resources/stats', adminController.getResourceStats);

// Teacher statistics route
router.get('/teachers/stats', adminController.getTeacherStats);

// Tradition statistics route
router.get('/traditions/stats', adminController.getTraditionStats);

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

// Bulk import routes
router.post('/bulk-import', adminController.bulkImport); // New unified endpoint that handles all entity types

// Teacher management routes
router.get('/teachers', adminController.getAllTeachers);
router.get('/teachers/:id', adminController.getTeacherById);
router.post('/teachers', adminController.createTeacher);
router.put('/teachers/:id', adminController.updateTeacher);
router.delete('/teachers/:id', adminController.deleteTeacher);

// Tradition management routes
router.get('/traditions', adminController.getAllTraditions);
router.get('/traditions/:id', adminController.getTraditionById);
router.post('/traditions', adminController.createTradition);
router.put('/traditions/:id', adminController.updateTradition);
router.delete('/traditions/:id', adminController.deleteTradition);

// Resource processing routes
router.use('/process', require('./resource-processing-routes'));

// Suggestion management routes
router.use('/suggestions', require('./admin-suggestion-routes'));

// AI generation routes
router.use('/', require('./ai-generation-routes'));

module.exports = router;
