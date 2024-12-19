const { validationResult } = require('express-validator');
const  Evaluation  = require('../models/evaluation'); // Modelo de Avaliação
const createResponse = require('../utils/helpers/responseHelper');
const {
  createEvaluationValidation,
  deleteEvaluationValidation,
} = require('../utils/validations/evaluationValidation');

// Criar Avaliação
exports.createEvaluation = [
  createEvaluationValidation,
  async (req, res) => {
    const { id_reserva, id_quadra, id_usuario, nota, comentario, data_avaliacao } = req.body;

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

    try {
      const evaluation = await Evaluation.create({
        id_reserva,
        id_quadra,
        id_usuario,
        nota,
        comentario,
        data_avaliacao: data_avaliacao || new Date(),
      });

      res.status(201).json(
        createResponse({
          status: 'Sucesso',
          message: 'Avaliação criada com sucesso!',
          data: { id: evaluation.id_avaliacao },
        })
      );
    } catch (error) {
      console.error(error);
      res.status(500).json(
        createResponse({
          status: 'Erro',
          message: 'Erro ao criar a avaliação.',
          errors: [error.message],
        })
      );
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
      return res.status(400).json(
        createResponse({
          status: 'Erro',
          message: 'Erro de validação.',
          errors: errors.array(),
        })
      );
    }

    try {
      const evaluation = await Evaluation.findOne({
        where: { id_avaliacao, id_usuario },
      });

      if (!evaluation) {
        return res.status(404).json(
          createResponse({
            status: 'Erro',
            message: 'Avaliação não encontrada ou não pertence ao usuário.',
          })
        );
      }

      await evaluation.destroy();

      res.status(200).json(
        createResponse({
          status: 'Sucesso',
          message: 'Avaliação excluída com sucesso!',
          data: { id: id_avaliacao },
        })
      );
    } catch (error) {
      console.error(error);
      res.status(500).json(
        createResponse({
          status: 'Erro',
          message: 'Erro ao excluir a avaliação.',
          errors: [error.message],
        })
      );
    }
  }
];

// Listar Avaliações de uma Quadra
exports.listEvaluationsByCourt = [
  async (req, res) => {
    const  id_quadra  = req.params.id;

    try {
      const evaluations = await Evaluation.findAll({
        where: { id_quadra },
        attributes: ['id_avaliacao', 'nota', 'comentario', 'data_avaliacao', 'id_usuario', 'id_reserva'],
      });

      res.status(201).json(
        createResponse({
          status: 'Sucesso',
          message: 'Avaliações listadas com sucesso!',
          data: evaluations,
        })
      );
    } catch (error) {
      console.error(error);
      res.status(500).json(
        createResponse({
          status: 'Erro',
          message: 'Erro ao listar as avaliações.',
          errors: [error.message],
        })
      );
    }
  }
];

// Listar Avaliações de um Usuário
exports.listEvaluationsByUser = [
  async (req, res) => {
    const  id_usuario  = req.params.id;

    try {
      const evaluations = await Evaluation.findAll({
        where: { id_usuario },
        attributes: ['id_avaliacao', 'nota', 'comentario', 'data_avaliacao', 'id_reserva', 'id_quadra'],
      });

      res.status(201).json(
        createResponse({
          status: 'Sucesso',
          message: 'Avaliações do usuário listadas com sucesso!',
          data: evaluations,
        })
      );
    } catch (error) {
      console.error(error);
      res.status(500).json(
        createResponse({
          status: 'Erro',
          message: 'Erro ao listar as avaliações do usuário.',
          errors: [error.message],
        })
      );
    }
  }
];
