const { validationResult } = require('express-validator');
const Reservation = require('../models/reservation');
const Room = require('../models/room');
const { createReservationValidation, updateReservationValidation, removeReservationValidation } = require('./../utils/validations/reservationValidation');
const createResponse = require('./../utils/helpers/responseHelper');

exports.CreateReservation = [
  createReservationValidation,
  async (req, res) => {
    const { id_quadra, data_reserva, horario_inicio, horario_fim, status, valor_total, ativo, motivo_cancelamento, id_sala } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(createResponse({
        status: 'Erro',
        message: 'Erro de validação.',
        errors: errors.array(),
      })
      );
    }

    const reservation = await Reservation.create({ id_quadra, data_reserva, horario_inicio, horario_fim, status, valor_total, ativo, motivo_cancelamento, id_sala });
    res.status(201).json(createResponse({
      status: 'Sucesso',
      message: 'Reserva feita com sucesso!',
      data: { "id": reservation["id_reserva"] }
    })
    );
  }
];

exports.findById = [
  async (req, res) => {
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
  }
];

exports.findAll = [
  async (req, res) => {
    try {
      const reservations = await Reservation.findAll();
      res.status(200).json(reservations);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao buscar reservas' });
    }
  }
];

exports.findActiveReservationByRoom = [
  async (req, res) => {
    const id_sala = req.params.id; // Recebe o ID da sala da URL

    try {
      // Verifica se a sala foi enviada
      if (!id_sala) {
        return res.status(400).json(
          createResponse({
            status: 'Erro',
            message: 'ID da sala é obrigatório.',
            errors: [{ msg: 'O ID da sala não foi fornecido.' }],
          })
        );
      }

      // Busca a reserva ativa associada à sala
      const reservation = await Reservation.findAll({
        where: {
          id_sala,
          ativo: true, // Busca apenas reservas ativas
        },
        include: [
          {
            model: Room,
            as: 'sala', // Nome do alias definido no modelo
            attributes: ['id_sala', 'max_integrantes', 'privada'],
          },
        ],
      });

      // Verifica se encontrou a reserva
      if (!reservation) {
        return res.status(404).json(
          createResponse({
            status: 'Erro',
            message: 'Nenhuma reserva ativa encontrada para a sala informada.',
            errors: [],
          })
        );
      }

      // Retorna a reserva encontrada
      return res.status(200).json(
        createResponse({
          status: 'Sucesso',
          message: 'Reserva ativa encontrada com sucesso!',
          data: reservation,
        })
      );
    } catch (error) {
      console.error('Erro ao buscar reserva ativa por sala:', error);
      return res.status(500).json(
        createResponse({
          status: 'Erro',
          message: 'Erro ao buscar reserva ativa pela sala.',
          errors: [{ msg: error.message }],
        })
      );
    }
  },
];

exports.update = [
  updateReservationValidation,
  async (req, res) => {
    const reservationID = req.body.id_reserva;
    const { data_reserva, horario_inicio, horario_fim, status, valor_total, ativo } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(
        createResponse({
          status: 'Erro',
          message: 'Erro de validação.',
          errors: errors.array(),
        })
      );
    }

    const reservation = await Reservation.update(
      {data_reserva, horario_inicio, horario_fim, status, valor_total, ativo},
      {where: {id_reserva: reservationID}}
    );
    res.status(201).json(
      createResponse({
        status: 'Sucesso',
        message: 'Reserva alterada com sucesso!',
        data: {"id": reservationID}
      })
    );
  }
];

exports.delete = [
  removeReservationValidation,  // Validação
  async (req, res) => {
      const reservationID = req.body.id_reserva;
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json(
          createResponse({
            status: 'Erro',
            message: 'Erro de validação.',
            errors: errors.array(),
          })
        );
      }

      const { motivo_cancelamento } = req.body; // Obtém o motivo de cancelamento do corpo da requisição

      // Se o motivo de cancelamento não for informado, retornar erro
      if (!motivo_cancelamento) {
        return res.status(400).json(
          createResponse({
            status: 'Erro',
            message: 'Motivo de cancelamento é obrigatório.',
          })
        );
      }

      // Tenta encontrar a reserva pelo ID
      const reservation = await Reservation.findByPk(reservationID);
      
      if (!reservation) {
        return res.status(404).json(
          createResponse({
            status: 'Erro',
            message: 'Reserva não encontrada.',
          })
        );
      }

      // Atualiza a reserva para marcar como cancelada e registra o motivo
      await reservation.update({
        status: 'cancelada',  // Atualiza o status da reserva para "cancelada"
        motivo_cancelamento,  // Armazena o motivo de cancelamento
        ativo: false,         // Marca como inativo
      });

      // Retorna a resposta de sucesso
      res.status(200).json(
        createResponse({
          status: 'Sucesso',
          message: 'Reserva cancelada com sucesso!',
          data: { id: reservationID, motivo_cancelamento },
        })
      );
  }
];