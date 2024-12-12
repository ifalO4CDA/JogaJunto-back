const { body, param } = require('express-validator');
const Room = require('./../../models/room');

// Validação para criar uma sala
exports.createRoomValidation = [
  body('reserva_ativa')
    .optional()
    .isBoolean().withMessage('O campo "reserva_ativa" deve ser um booleano.'),
  body('privada')
    .optional()
    .isBoolean().withMessage('O campo "privada" deve ser um booleano.'),
  body('max_integrantes')
    .optional()
    .isInt({ min: 1 }).withMessage('O campo "max_integrantes" deve ser um número inteiro maior ou igual a 1.'),
  body('id_usuario')
    .optional()
    .isInt().withMessage('O campo "id_usuario" deve ser um número inteiro.'),
  body('id_grupo')
    .optional()
    .isInt().withMessage('O campo "id_grupo" deve ser um número inteiro.'),
];

// Validação para atualizar uma sala
exports.updateRoomValidation = [
  param('id')
    .notEmpty().withMessage('O ID da sala deve ser informado.')
    .isInt().withMessage('O ID da sala deve ser um número inteiro.'),
  body('reserva_ativa')
    .optional()
    .isBoolean().withMessage('O campo "reserva_ativa" deve ser um booleano.'),
  body('privada')
    .optional()
    .isBoolean().withMessage('O campo "privada" deve ser um booleano.'),
  body('max_integrantes')
    .optional()
    .isInt({ min: 1 }).withMessage('O campo "max_integrantes" deve ser um número inteiro maior ou igual a 1.'),
];

// Validação para excluir uma sala
exports.deleteRoomValidation = [
  param('id')
    .notEmpty().withMessage('O ID da sala deve ser informado.')
    .isInt().withMessage('O ID da sala deve ser um número inteiro.'),
];

// Validação para buscar uma sala pelo ID
exports.getRoomByIdValidation = [
  param('id')
    .notEmpty().withMessage('O ID da sala deve ser informado.')
    .isInt().withMessage('O ID da sala deve ser um número inteiro.'),
];
