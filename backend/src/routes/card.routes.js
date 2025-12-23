const express = require('express');
const router = express.Router();
const cardController = require('../controllers/card.controller.js');

// POST /api/card/checklimit
router.post('/checklimit', cardController.checklimit);

// POST /api/card/checkskt
router.post('/checkskt', cardController.checkskt);

//POST /api/card/checkinfo
router.post('/checkinfo', cardController.checkinfo);

//POST /api/card/checkdou
router.post('/checkdou', cardController.checkdou);

//POST /api/card/getharcamalar
router.get('/getharcamalar', cardController.getharcamalar);

//POST /api/card/checkesktre
router.post('/checkesktre', cardController.checkesktre);

module.exports = router;
