const express = require('express');
const router = express.Router();
const accountController = require('../controllers/account.controller');

// POST /api/accounts/register - Başvuru kaydı
router.post('/register', accountController.register);

// GET /api/accounts
router.get('/', accountController.getAccounts);

// GET /api/accounts/:tc
router.get('/:tc', accountController.getAccountByTC);

// PUT /api/accounts/:tc
router.put('/:tc', accountController.updateAccount);

// DELETE /api/accounts/:tc
router.delete('/:tc', accountController.deleteAccount);

module.exports = router;
