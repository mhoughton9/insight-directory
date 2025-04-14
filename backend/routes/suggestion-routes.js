const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit'); 
const suggestionController = require('../controllers/suggestion-controller');
const authMiddleware = require('../middleware/auth-middleware');

// --- Rate Limiter Configuration ---
const suggestionLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 10, // Limit each IP to 10 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'Too many suggestions submitted from this IP, please try again after 15 minutes'
});
// ---

/**
 * Suggestion routes
 * Base path: /api/suggestions
 */

// Create a new suggestion (authenticated users only)
router.post('/', suggestionLimiter, authMiddleware, suggestionController.createSuggestion); 

module.exports = router;
