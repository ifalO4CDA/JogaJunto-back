const { validationResult } = require('express-validator');
const createResponse = require('../utils/helpers/responseHelper');
const { 
  createEvaluationValidation, 
  deleteEvaluationValidation, 
  listCourtEvaluationsValidation 
} = require('../utils/validations/evaluationValidation');

// Criar Avaliação
exports.createEvaluation = [
  createEvaluationValidation, 
  async (req, res) => {
    const { id_reserva, id_quadra, id_usuario, nota, comentario, data_avaliacao } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(createResponse({
        status: 'Erro',
        message: 'Erro de validação.',
        errors: errors.array(),
      }));
    }

    try {
      // Verifica se a reserva existe
      const reserva = await Reserva.findByPk(id_reserva);
      if (!reserva) {
        return res.status(404).json(createResponse({
          status: 'Erro',
          message: 'Reserva não encontrada.',
        }));
      }

      // Verifica se o usuário fez a reserva (garante que o usuário possa avaliar sua própria reserva)
      if (reserva.id_usuario !== id_usuario) {
        return res.status(403).json(createResponse({
          status: 'Erro',
          message: 'Usuário não pode avaliar uma reserva que não foi feita por ele.',
        }));
      }

      // Criação da avaliação
      const avaliacao = await Avaliacao.create({
        id_reserva,
        id_quadra,
        id_usuario,
        nota,
        comentario,
        data_avaliacao: data_avaliacao || new Date(),
      });

      return res.status(201).json(createResponse({
        status: 'Sucesso',
        message: 'Avaliação criada com sucesso!',
        data: avaliacao,
      }));

    } catch (error) {
      console.error(error);
      return res.status(500).json(createResponse({
        status: 'Erro',
        message: 'Erro ao criar avaliação.',
        errors: [error.message],
      }));
    }
  }
];

// Excluir Avaliação
exports.deleteEvaluation = [
  deleteEvaluationValidation,
  async (req, res) => {
    const { id_avaliacao, id_usuario } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(createResponse({
        status: 'Erro',
        message: 'Erro de validação.',
        errors: errors.array(),
      }));
    }

    try {
      // Verifica se a avaliação existe
      const avaliacao = await Avaliacao.findByPk(id_avaliacao);
      if (!avaliacao) {
        return res.status(404).json(createResponse({
          status: 'Erro',
          message: 'Avaliação não encontrada.',
        }));
      }

      // Verifica se o usuário é o autor da avaliação
      if (avaliacao.id_usuario !== id_usuario) {
        return res.status(403).json(createResponse({
          status: 'Erro',
          message: 'Somente o autor da avaliação pode excluí-la.',
        }));
      }

      // Exclui a avaliação
      await avaliacao.destroy();

      return res.status(200).json(createResponse({
        status: 'Sucesso',
        message: 'Avaliação excluída com sucesso!',
      }));

    } catch (error) {
      console.error(error);
      return res.status(500).json(createResponse({
        status: 'Erro',
        message: 'Erro ao excluir avaliação.',
        errors: [error.message],
      }));
    }
  }
];

// Listar Avaliações de uma Quadra
exports.listCourtEvaluations = [
  listCourtEvaluationsValidation,
  async (req, res) => {
    const id_quadra = req.body.id_quadra;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(createResponse({
        status: 'Erro',
        message: 'Erro de validação.',
        errors: errors.array(),
      }));
    }

    try {
      // Verifica se a quadra existe
      const quadra = await Quadra.findByPk(id_quadra);
      if (!quadra) {
        return res.status(404).json(createResponse({
          status: 'Erro',
          message: 'Quadra não encontrada.',
        }));
      }

      // Busca todas as avaliações relacionadas à quadra
      const avaliacoes = await Avaliacao.findAll({
        where: { id_quadra },
        include: [
          { model: Usuario, attributes: ['id_usuario', 'nome'] }, // Inclui informações do usuário
          { model: Reserva, attributes: ['id_reserva', 'data_reserva'] }, // Inclui informações da reserva
        ],
      });

      return res.status(200).json(createResponse({
        status: 'Sucesso',
        message: 'Avaliações da quadra listadas com sucesso!',
        data: avaliacoes,
      }));

    } catch (error) {
      console.error(error);
      return res.status(500).json(createResponse({
        status: 'Erro',
        message: 'Erro ao listar avaliações da quadra.',
        errors: [error.message],
      }));
    }
  }
];
