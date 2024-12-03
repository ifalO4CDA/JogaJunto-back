const express = require('express');
const moreInformationsController = require('../controllers/moreInformationsController');
const router = express.Router();


router.post('/', moreInformationsController.createMoreInformations);

module.exports = router;