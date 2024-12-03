const { Reservation } = require('../models/reservation');

const ReservationController = {
  // Criar uma nova reserva
  create: async (req, res) => {
    try {
      const data = req.body;
      const reservation = await Reservation.create(data);
      res.status(201).json(reservation);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao criar reserva' });
    }
  },

  // Buscar reserva por ID
  findById: async (req, res) => {
    try {
      const { id } = req.params;
      const reservation = await Reservation.findByPk(id);
      if (!reservation) {
        return res.status(404).json({ error: 'Reserva não encontrada' });
      }
      res.status(200).json(reservation);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao buscar reserva' });
    }
  },

  // Listar todas as reservas
  findAll: async (req, res) => {
    try {
      const reservations = await Reservation.findAll();
      res.status(200).json(reservations);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao buscar reservas' });
    }
  },

  // Atualizar reserva
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const reservation = await Reservation.findByPk(id);
      if (!reservation) {
        return res.status(404).json({ error: 'Reserva não encontrada' });
      }
      const updatedReservation = await reservation.update(data);
      res.status(200).json(updatedReservation);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao atualizar reserva' });
    }
  },

  // Cancelar reserva
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const reservation = await Reservation.findByPk(id);
      if (!reservation) {
        return res.status(404).json({ error: 'Reserva não encontrada' });
      }
      await reservation.destroy();
      res.status(200).json({ message: 'Reserva cancelada com sucesso' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao cancelar reserva' });
    }
  },
};

module.exports = ReservationController;