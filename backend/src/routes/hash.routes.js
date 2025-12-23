const express = require('express');
const router = express.Router();
const hashController = require('../controllers/hash.controller');


router.post('/hash', hashController.hash);


router.post('/check', hashController.checkhash);

module.exports = router;
