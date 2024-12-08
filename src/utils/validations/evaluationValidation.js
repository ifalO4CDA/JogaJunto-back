const { body } = require('express-validator');

const evaluationValidation = {
  createEvaluationValidation: [
    body('id_reserva')
      .notEmpty().withMessage('O campo id_reserva é obrigatório.')
      .isInt({ gt: 0 }).withMessage('O id_reserva deve ser um número inteiro válido.'),
    body('id_quadra')
      .notEmpty().withMessage('O campo id_quadra é obrigatório.')
      .isInt({ gt: 0 }).withMessage('O id_quadra deve ser um número inteiro válido.'),
    body('id_usuario')
      .notEmpty().withMessage('O campo id_usuario é obrigatório.')
      .isInt({ gt: 0 }).withMessage('O id_usuario deve ser um número inteiro válido.'),
    body('nota')
      .optional()
      .isInt({ min: 1, max: 5 }).withMessage('A nota deve ser um número entre 1 e 5.'),
    body('comentario')
      .optional()
      .isString().withMessage('O comentário deve ser um texto válido.')
      .isLength({ max: 500 }).withMessage('O comentário não pode ter mais de 500 caracteres.'),
    body('data_avaliacao')
      .optional()
      .isISO8601().withMessage('A data de avaliação deve estar no formato ISO8601.'),
  ],

  deleteEvaluationValidation: [
    body('id_avaliacao')
      .notEmpty().withMessage('O campo id_avaliacao é obrigatório.')
      .isInt({ gt: 0 }).withMessage('O id_avaliacao deve ser um número inteiro válido.'),
    body('id_usuario')
      .notEmpty().withMessage('O campo id_usuario é obrigatório.')
      .isInt({ gt: 0 }).withMessage('O id_usuario deve ser um número inteiro válido.'),
  ],

  listEvaluationsByCourtValidation: [
    body('id_quadra')
      .notEmpty().withMessage('O campo id_quadra é obrigatório.')
      .isInt({ gt: 0 }).withMessage('O id_quadra deve ser um número inteiro válido.'),
  ],

  listEvaluationsByUserValidation: [
    body('id_usuario')
      .notEmpty().withMessage('O campo id_usuario é obrigatório.')
      .isInt({ gt: 0 }).withMessage('O id_usuario deve ser um número inteiro válido.'),
  ],
};

module.exports = evaluationValidation;
