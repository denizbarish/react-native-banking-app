const express = require('express');
const router = express.Router();
const cardController = require('../controllers/card.controller.js');

router.get('/', cardController.getCards);

router.get('/applications', cardController.getCardApplications);

router.post('/apply', cardController.applyForCard);

router.get('/:id', cardController.getCardDetail);

module.exports = router;
