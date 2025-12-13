const express = require('express');
const router = express.Router();
const accountController = require('../controllers/account.controller');

// POST /api/accounts/register - Başvuru kaydı
router.post('/register', accountController.register);

// GET /api/accounts
router.get('/', accountController.getAccounts);

// GET /api/accounts/:id
router.get('/:id', accountController.getAccountById);

// PUT /api/accounts/:id
router.put('/:id', accountController.updateAccount);

// DELETE /api/accounts/:id
router.delete('/:id', accountController.deleteAccount);

module.exports = router;
