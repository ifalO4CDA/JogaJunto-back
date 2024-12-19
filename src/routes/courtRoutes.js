const express = require('express');
const courtController = require('../controllers/courtController');
const authenticate = require('../utils/middlewares/authenticate');

const router = express.Router();
router.use(authenticate)

router.get('/', courtController.getCourts);
router.get('/:id_court', courtController.getCourtById);
module.exports = router;
