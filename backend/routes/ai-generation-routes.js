/**
 * AI Generation Routes
 * 
 * API routes for AI-powered description generation
 */

const express = require('express');
const router = express.Router();
const { generateDescriptions, generateTeacherDescriptions, generateTraditionDescriptions } = require('../controllers/ai-generation-controller');
const authMiddleware = require('../middleware/auth-middleware');

// All routes in this file require authentication
router.use(authMiddleware);

/**
 * @route   POST /api/admin/resources/:id/generate-descriptions
 * @desc    Generate descriptions for a resource using AI
 * @access  Admin only
 */
router.post('/resources/:id/generate-descriptions', generateDescriptions);

/**
 * @route   POST /api/admin/teachers/:id/generate-descriptions
 * @desc    Generate descriptions for a teacher using AI
 * @access  Admin only
 */
router.post('/teachers/:id/generate-descriptions', generateTeacherDescriptions);

/**
 * @route   POST /api/admin/traditions/:id/generate-descriptions
 * @desc    Generate descriptions for a tradition using AI
 * @access  Admin only
 */
router.post('/traditions/:id/generate-descriptions', generateTraditionDescriptions);

module.exports = router;
