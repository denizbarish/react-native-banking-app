const express = require('express');
const router = express.Router();
const hashController = require('../controllers/hash.controller');

// POST /api/hash/hash
router.post('/hash', hashController.hash);

// POST /api/hash/checkhash
router.post('/check', hashController.checkhash);

module.exports = router;
