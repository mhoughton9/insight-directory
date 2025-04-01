const express = require('express');
const router = express.Router();
const suggestionController = require('../controllers/suggestion-controller');
const authMiddleware = require('../middleware/auth-middleware');

/**
 * Admin Suggestion routes
 * Base path: /api/admin/suggestions
 */

// Apply authMiddleware to all admin routes
router.use(authMiddleware);

// Get suggestion statistics
router.get('/stats', suggestionController.getSuggestionStats);

// Get all suggestions with filtering and pagination
router.get('/', suggestionController.getAllSuggestions);

// Get a specific suggestion by ID
router.get('/:id', suggestionController.getSuggestionById);

// Update a suggestion (status, admin notes)
router.put('/:id', suggestionController.updateSuggestion);

// Delete a suggestion
router.delete('/:id', suggestionController.deleteSuggestion);

module.exports = router;
