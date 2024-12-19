const express = require('express');
const moreInformationsController = require('../controllers/moreInformationsController');
const router = express.Router();

const authenticate = require('../utils/middlewares/authenticate'); // Middleware de autenticação

router.use(authenticate)

router.post('/', moreInformationsController.createMoreInformations);
router.get('/:id', moreInformationsController.getMoreInformations);
router.put('/:id', moreInformationsController.updateMoreInformations);

module.exports = router;