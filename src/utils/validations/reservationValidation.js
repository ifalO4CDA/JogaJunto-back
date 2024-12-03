const { body, param } = require('express-validator');
const Reservation = require('../models/reservation');
const User = require('../models/user');
const Court = require('../models/court'); // Caso haja um modelo para a quadra (id_quadra)

const existsReservation = async (id) => {
    const reservation = await Reservation.findByPk(id);
    if (!reservation) {
        throw new Error('Reserva não encontrada.');
    }
    return true;
};

const existsUser = async (id_usuario) => {
    const user = await User.findByPk(id_usuario);
    if (!user) {
        throw new Error('Usuário não encontrado.');
    }
    return true;
};

const existsCourt = async (id_quadra) => {
    const court = await Court.findByPk(id_quadra); // Supondo que você tenha um modelo de Court
    if (!court) {
        throw new Error('Quadra não encontrada.');
    }
    return true;
};

exports.createReservationValidation = [
    body('id_usuario')
        .notEmpty().withMessage('O ID do usuário é obrigatório.')
        .isInt().withMessage('O ID do usuário deve ser um número inteiro.')
        .custom(existsUser),  // Verifica se o usuário existe

    body('id_quadra')
        .notEmpty().withMessage('O ID da quadra é obrigatório.')
        .isInt().withMessage('O ID da quadra deve ser um número inteiro.')
        .custom(existsCourt), // Verifica se a quadra existe

    body('data_reserva')
        .notEmpty().withMessage('A data da reserva é obrigatória.')
        .isDate().withMessage('A data da reserva deve ser uma data válida.')
        .custom((value) => {
            const today = new Date();
            const selectedDate = new Date(value);
            if (selectedDate < today) {
                throw new Error('A data da reserva não pode ser anterior à data atual.');
            }
            return true;
        }),

    body('horario_inicio')
        .notEmpty().withMessage('O horário de início é obrigatório.')
        .isString().withMessage('O horário de início deve ser uma string no formato HH:mm.')
        .matches(/^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/).withMessage('O horário de início deve estar no formato HH:mm.'),

    body('horario_fim')
        .notEmpty().withMessage('O horário de fim é obrigatório.')
        .isString().withMessage('O horário de fim deve ser uma string no formato HH:mm.')
        .matches(/^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/).withMessage('O horário de fim deve estar no formato HH:mm.')
        .custom((value, { req }) => {
            const startTime = req.body.horario_inicio;
            if (value <= startTime) {
                throw new Error('O horário de fim não pode ser anterior ao horário de início.');
            }
            return true;
        }),

    body('valor_total')
        .notEmpty().withMessage('O valor total é obrigatório.')
        .isDecimal().withMessage('O valor total deve ser um número decimal.')
        .custom((value) => {
            if (value <= 0) {
                throw new Error('O valor total deve ser maior que zero.');
            }
            return true;
        }),

    body('status')
        .optional()
        .isIn(['pendente', 'confirmada', 'cancelada']).withMessage('O status deve ser um dos seguintes: pendente, confirmada, cancelada.'),

    body('motivo_cancelamento')
        .optional()
        .isString().withMessage('O motivo de cancelamento deve ser uma string.'),

    body('ativo')
        .optional()
        .isBoolean().withMessage('O campo "ativo" deve ser um valor booleano.')
];

exports.updateReservationValidation = [
    param('id')
        .notEmpty().withMessage('O ID da reserva é obrigatório.')
        .isInt().withMessage('O ID da reserva deve ser um número inteiro.')
        .custom(existsReservation), // Verifica se a reserva existe

    body('id_usuario')
        .optional()
        .isInt().withMessage('O ID do usuário deve ser um número inteiro.')
        .custom(existsUser),  // Verifica se o usuário existe

    body('id_quadra')
        .optional()
        .isInt().withMessage('O ID da quadra deve ser um número inteiro.')
        .custom(existsCourt), // Verifica se a quadra existe

    body('data_reserva')
        .optional()
        .isDate().withMessage('A data da reserva deve ser uma data válida.')
        .custom((value) => {
            const today = new Date();
            const selectedDate = new Date(value);
            if (selectedDate < today) {
                throw new Error('A data da reserva não pode ser anterior à data atual.');
            }
            return true;
        }),

    body('horario_inicio')
        .optional()
        .isString().withMessage('O horário de início deve ser uma string no formato HH:mm.')
        .matches(/^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/).withMessage('O horário de início deve estar no formato HH:mm.'),

    body('horario_fim')
        .optional()
        .isString().withMessage('O horário de fim deve ser uma string no formato HH:mm.')
        .matches(/^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/).withMessage('O horário de fim deve estar no formato HH:mm.')
        .custom((value, { req }) => {
            const startTime = req.body.horario_inicio;
            if (value <= startTime) {
                throw new Error('O horário de fim não pode ser anterior ao horário de início.');
            }
            return true;
        }),

    body('valor_total')
        .optional()
        .isDecimal().withMessage('O valor total deve ser um número decimal.')
        .custom((value) => {
            if (value <= 0) {
                throw new Error('O valor total deve ser maior que zero.');
            }
            return true;
        }),

    body('status')
        .optional()
        .isIn(['pendente', 'confirmada', 'cancelada']).withMessage('O status deve ser um dos seguintes: pendente, confirmada, cancelada.'),

    body('motivo_cancelamento')
        .optional()
        .isString().withMessage('O motivo de cancelamento deve ser uma string.'),

    body('ativo')
        .optional()
        .isBoolean().withMessage('O campo "ativo" deve ser um valor booleano.')
];

exports.removeReservationValidation = [
    param('id')
        .notEmpty().withMessage('O ID da reserva é obrigatório.')
        .isInt().withMessage('O ID da reserva deve ser um número inteiro.')
        .custom(existsReservation) // Verifica se a reserva existe
];
