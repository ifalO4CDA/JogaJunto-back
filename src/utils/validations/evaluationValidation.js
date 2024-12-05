const { body, param } = require('express-validator');
const { Reserva, Quadra, Avaliacao, Usuario } = require('../../models/indexModel');

// Validação para criação de avaliação
exports.createEvaluationValidation = [
  // Verifica se o ID da reserva é um número inteiro
  body('id_reserva')
    .isInt().withMessage('ID da reserva deve ser um número inteiro')
    .custom(async (value) => {
      // Verifica se a reserva existe
      const reserva = await Reserva.findByPk(value);
      if (!reserva) {
        throw new Error('Reserva não encontrada');
      }
    }),

  // Verifica se o ID da quadra é um número inteiro
  body('id_quadra')
    .isInt().withMessage('ID da quadra deve ser um número inteiro')
    .custom(async (value) => {
      // Verifica se a quadra existe
      const quadra = await Quadra.findByPk(value);
      if (!quadra) {
        throw new Error('Quadra não encontrada');
      }
    }),

  // Verifica se o ID do usuário é um número inteiro
  body('id_usuario')
    .isInt().withMessage('ID do usuário deve ser um número inteiro')
    .custom(async (value) => {
      // Verifica se o usuário existe
      const usuario = await Usuario.findByPk(value);
      if (!usuario) {
        throw new Error('Usuário não encontrado');
      }
    }),

  // Verifica se a nota é um número entre 1 e 5
  body('nota')
    .isInt({ min: 1, max: 5 }).withMessage('Nota deve ser um número entre 1 e 5')
    .optional({ nullable: true }),

  // Verifica se o comentário é uma string válida (opcional)
  body('comentario')
    .isString().withMessage('Comentário deve ser uma string válida')
    .optional({ nullable: true }),

  // Garantir que a data de avaliação (caso fornecida) seja um formato de data válido
  body('data_avaliacao')
    .isDate().withMessage('Data de avaliação inválida')
    .optional({ nullable: true }),
];

// Validação para exclusão de avaliação
exports.deleteEvaluationValidation = [
  // Verifica se o ID da avaliação é um número inteiro
  body('id_avaliacao')
    .isInt().withMessage('ID da avaliação deve ser um número inteiro')
    .custom(async (value) => {
      // Verifica se a avaliação existe
      const avaliacao = await Avaliacao.findByPk(value);
      if (!avaliacao) {
        throw new Error('Avaliação não encontrada');
      }
    }),

  // Verifica se o ID do usuário é um número inteiro e se ele é o dono da avaliação
  body('id_usuario')
    .isInt().withMessage('ID do usuário deve ser um número inteiro')
    .custom(async (value, { req }) => {
      // Verifica se o usuário existe e se é o dono da avaliação
      const avaliacao = await Avaliacao.findByPk(req.body.id_avaliacao);
      if (avaliacao && avaliacao.id_usuario !== value) {
        throw new Error('Somente o autor da avaliação pode excluí-la');
      }
    }),
];

// Validação para listar avaliações de uma quadra
exports.listCourtEvaluationsValidation = [
  param('id_quadra')
    .isInt().withMessage('ID da quadra deve ser um número inteiro')
    .custom(async (value) => {
      // Verifica se a quadra existe
      const quadra = await Quadra.findByPk(value);
      if (!quadra) {
        throw new Error('Quadra não encontrada');
      }
    }),
];
