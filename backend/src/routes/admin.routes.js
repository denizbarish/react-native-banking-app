const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');


router.get('/applications', adminController.getApplications);


router.put('/applications/:id/status', adminController.updateApplicationStatus);


router.get('/settings', adminController.getSystemSettings);


router.put('/settings', adminController.updateSystemSettings);

module.exports = router;
