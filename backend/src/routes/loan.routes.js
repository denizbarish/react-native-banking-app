const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loan.controller');

router.get('/info/:tcNo', loanController.getLoanInfo);
router.post('/check', loanController.checkloan);
router.post('/score', loanController.testloan);
router.post('/take', loanController.giveloan); // Using giveloan as take
router.post('/pay', loanController.payLoan);
router.post('/delete', loanController.deleteloan);

module.exports = router;
