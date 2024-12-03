const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');

// Rota para criar endereço
router.post('/',addressController.createAddress);

module.exports = router;
