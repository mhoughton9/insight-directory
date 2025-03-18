const express = require('express');
const commentController = require('../controllers/comment-controller');

const router = express.Router();

/**
 * Comment routes
 * Base path: /api/comments
 */

// GET routes
router.get('/resource/:resourceId', commentController.getResourceComments);

// POST routes
router.post('/', commentController.createComment);
router.post('/:id/like', commentController.likeComment);

// PUT routes
router.put('/:id', commentController.updateComment);

// DELETE routes
router.delete('/:id', commentController.deleteComment);

module.exports = router;
