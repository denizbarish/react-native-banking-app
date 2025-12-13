const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// POST /api/auth/login
router.post('/login', authController.login);

// POST /api/auth/logout
router.post('/logout', authController.logout);

// POST /api/auth/send-sms
router.post('/send-sms', authController.sendSMS);

// POST /api/auth/verify-sms
router.post('/verify-sms', authController.verifySMS);

// POST /api/auth/verify-face
router.post('/verify-face', authController.verifyFace);

module.exports = router;
