const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');


router.post('/login', authController.login);


router.post('/logout', authController.logout);



router.post('/verify-face', authController.verifyFace);

router.post('/send-sms', authController.sendSMS);
router.post('/verify-sms', authController.verifySMS);

module.exports = router;
