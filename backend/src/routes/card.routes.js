const express = require('express');
const router = express.Router();
const cardController = require('../controllers/card.controller.js');

// GET /api// Get user's cards
router.get('/', cardController.getCards);

// Get user's card applications
router.get('/applications', cardController.getCardApplications);

// Apply for a card
router.post('/apply', cardController.applyForCard);

// Get card detail
router.get('/:id', cardController.getCardDetail);

module.exports = router;
