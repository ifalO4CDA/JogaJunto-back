const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');
const { createAddressValidation } = require('../utils/validations/addressValidations');

// Rota para criar endereço
router.post('/', createAddressValidation, addressController.createAddress);
router.get('/', addressController.getAddresses);
module.exports = router;
