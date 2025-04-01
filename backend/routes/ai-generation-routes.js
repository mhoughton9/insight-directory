/**
 * AI Generation Routes
 * 
 * API routes for AI-powered description generation
 */

const express = require('express');
const router = express.Router();
const { generateDescriptions } = require('../controllers/ai-generation-controller');
const authMiddleware = require('../middleware/auth-middleware');

// All routes in this file require authentication
router.use(authMiddleware);

/**
 * @route   POST /api/admin/resources/:id/generate-descriptions
 * @desc    Generate descriptions for a resource using AI
 * @access  Admin only
 */
router.post('/resources/:id/generate-descriptions', generateDescriptions);

module.exports = router;
