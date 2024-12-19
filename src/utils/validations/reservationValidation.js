const { body, param } = require('express-validator');
const Reservation = require('./../../models/reservation');
const User = require('./../../models/user');
const Room = require('./../../models/room');

// Verifica se a reserva existe
const existsReservation = async (id_reserva) => {
    const reservation = await Reservation.findByPk(id_reserva);

    if (!reservation) {
        throw new Error('Reserva não encontrada.');
    }

    const validStatuses = ['pendente', 'confirmada'];
    if (!validStatuses.includes(reservation.status)) {
        throw new Error('Somente reservas com status "pendente" ou "confirmada" podem ser alteradas.');
    }

    return true;
};

// Verifica se a sala existe
const existsSala = async (id_sala) => {
    const sala = await Room.findByPk(id_sala);
    if (!sala) {
        throw new Error('Sala não encontrada.');
    }
    return true;
};

// Verifica se o usuário existe
const existsUser = async (id_usuario) => {
    const user = await User.findByPk(id_usuario);
    if (!user) {
        throw new Error('Usuário não encontrado.');
    }
    return true;
};

// Validação de criação de reservas
exports.createReservationValidation = [
    body('id_quadra')
        .notEmpty().withMessage('O ID da quadra é obrigatório.')
        .isInt().withMessage('O ID da quadra deve ser um número inteiro.'),

    body('id_sala')
        .notEmpty().withMessage('O ID da sala é obrigatório.')
        .isInt().withMessage('O ID da sala deve ser um número inteiro.')
        .custom(existsSala),

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
        .matches(/^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/).withMessage('O horário de início deve estar no formato HH:mm.'),

    body('horario_fim')
        .notEmpty().withMessage('O horário de fim é obrigatório.')
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
        .isIn(['pendente', 'confirmada', 'cancelada']).withMessage('O status deve ser um dos seguintes: pendente, confirmada, cancelada.')
];

// Validação de atualização de reservas
exports.updateReservationValidation = [
    param('id') // Pegando ID como parâmetro na rota
        .notEmpty().withMessage('O ID da reserva é obrigatório.')
        .isInt().withMessage('O ID da reserva deve ser um número inteiro.')
        .custom(existsReservation),

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
        .matches(/^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/).withMessage('O horário de início deve estar no formato HH:mm.'),

    body('horario_fim')
        .optional()
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
        .isIn(['pendente', 'confirmada', 'cancelada']).withMessage('O status deve ser um dos seguintes: pendente, confirmada, cancelada.')
];

// Validação de remoção de reservas
exports.removeReservationValidation = [
    param('id') // Pegando ID como parâmetro na rota
        .notEmpty().withMessage('O ID da reserva é obrigatório.')
        .isInt().withMessage('O ID da reserva deve ser um número inteiro.')
        .custom(existsReservation)
];
