const express = require('express');
const ReservationController = require('../controllers/reservationController');

const router = express.Router();

// Rotas de reservas
router.post('/', ReservationController.create);
router.get('/', ReservationController.findAll);
router.get('/:id', ReservationController.findById);
router.put('/:id', ReservationController.update);
router.delete('/:id', ReservationController.delete);

module.exports = router;