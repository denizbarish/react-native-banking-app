const express = require('express');
const router = express.Router();
const accountController = require('../controllers/account.controller');

// GET /api/accounts
router.get('/', accountController.getAccounts);

// GET /api/accounts/:id
router.get('/:id', accountController.getAccountById);

// POST /api/accounts
router.post('/', accountController.createAccount);

// PUT /api/accounts/:id
router.put('/:id', accountController.updateAccount);

// DELETE /api/accounts/:id
router.delete('/:id', accountController.deleteAccount);

module.exports = router;
