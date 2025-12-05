const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction.controller');

// GET /api/transactions
router.get('/', transactionController.getTransactions);

// GET /api/transactions/:id
router.get('/:id', transactionController.getTransactionById);

// POST /api/transactions
router.post('/', transactionController.createTransaction);

module.exports = router;
