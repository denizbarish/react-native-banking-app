const express = require('express');
const router = express.Router();
const exchangeController = require('../controllers/exchange.controller');


router.get('/get', exchangeController.get);


router.get('/get/:currency', exchangeController.getByCurrency);

module.exports = router;