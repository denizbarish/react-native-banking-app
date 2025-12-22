const express = require('express');
const router = express.Router();
const exchangeController = require('../controllers/exchange.controller');

// GET /api/exchange/get - Döviz kuru alma
router.get('/get', exchangeController.get);

// GET /api/exchange/get/:currency - Belirli döviz kuru alma
router.get('/get/:currency', exchangeController.getByCurrency);

module.exports = router;