const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');
const { createAddressValidation } = require('../utils/validations/addressValidations');
const authenticate = require('../utils/middlewares/authenticate'); // Middleware de autenticação

router.use(authenticate)

// Rota para criar endereço
router.post('/', createAddressValidation, addressController.createAddress);
router.get('/', addressController.getAddresses);
module.exports = router;
