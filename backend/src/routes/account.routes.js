const express = require('express');
const router = express.Router();
const accountController = require('../controllers/account.controller');


router.post('/register', accountController.register);


router.get('/', accountController.getAccounts);


router.get('/:tc', accountController.getAccountByTC);


router.put('/:tc', accountController.updateAccount);


router.delete('/:tc', accountController.deleteAccount);

module.exports = router;
