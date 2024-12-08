const express = require('express');
const moreInformationsController = require('../controllers/moreInformationsController');
const router = express.Router();


router.post('/', moreInformationsController.createMoreInformations);
router.get('/:id', moreInformationsController.getMoreInformations);
router.put('/:id', moreInformationsController.updateMoreInformations);

module.exports = router;