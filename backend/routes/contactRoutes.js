const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const contactController = require('../controllers/contactController');
const authMiddleware = require('../middleware/auth-middleware'); // Assuming middleware path

// --- Rate Limiter Configuration for Contact Form ---
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per window (slightly stricter than suggestions)
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many contact messages submitted from this IP, please try again after 15 minutes'
});
// ---

/**
 * Contact form routes
 * Base path: /api/contact (when registered in server.js)
 */

// Handle contact form submission (authenticated users only)
router.post('/', contactLimiter, authMiddleware, contactController.handleContactSubmission);

module.exports = router;
