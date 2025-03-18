const express = require('express');
const traditionController = require('../controllers/tradition-controller');

const router = express.Router();

/**
 * Tradition routes
 * Base path: /api/traditions
 */

// GET routes
router.get('/', traditionController.getAllTraditions);
router.get('/search', traditionController.searchTraditions);
router.get('/:idOrSlug', traditionController.getTraditionById);

// POST routes
router.post('/', traditionController.createTradition);

// PUT routes
router.put('/:id', traditionController.updateTradition);

// DELETE routes
router.delete('/:id', traditionController.deleteTradition);

module.exports = router;
