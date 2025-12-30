const express = require('express');
const router = express.Router();
const exchangeController = require('../controllers/exchange.controller');

router.get('/', exchangeController.getExchangeRates);
router.post('/buy', exchangeController.buyCurrency);
router.post('/sell', exchangeController.sellCurrency);

module.exports = router;