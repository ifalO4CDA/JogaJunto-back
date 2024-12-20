const express = require('express');
const ReservationController = require('../controllers/reservationController');
const router = express.Router();

const authenticate = require('../utils/middlewares/authenticate'); // Middleware de autenticação

router.use(authenticate)


// Rotas de reservas
router.post('/', ReservationController.CreateReservation);
router.get('/', ReservationController.findAll);
router.get('/:id', ReservationController.findById);
router.get('/ativa/:id', ReservationController.findActiveReservationByRoom);
router.put('/', ReservationController.update);
router.delete('/', ReservationController.delete);

module.exports = router;