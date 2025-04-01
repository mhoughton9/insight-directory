const express = require('express');
const router = express.Router();
const suggestionController = require('../controllers/suggestion-controller');
const authMiddleware = require('../middleware/auth-middleware');

/**
 * Suggestion routes
 * Base path: /api/suggestions
 */

// Create a new suggestion (authenticated users only)
router.post('/', authMiddleware, suggestionController.createSuggestion);

module.exports = router;
