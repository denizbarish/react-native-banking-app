const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');


router.get('/applications', adminController.getApplications);

router.put('/applications/:id/status', adminController.updateApplicationStatus);

router.get('/settings', adminController.getSystemSettings);

router.put('/settings', adminController.updateSystemSettings);

router.get('/card-applications', adminController.getCardApplications);

router.put('/card-applications/:id/approve', adminController.approveCardApplication);

router.put('/card-applications/:id/reject', adminController.rejectCardApplication);

module.exports = router;
