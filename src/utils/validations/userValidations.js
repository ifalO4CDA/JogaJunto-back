const { body, param } = require('express-validator');
const User = require('./../../models/user');

// Verifica se o email já existe
const existsEmail = async (email, { req }) => {
    const { method } = req;
    const user = await User.findOne({ where: { email } });

    if (method === 'PUT') {
        const { id } = req.params;
        if (user && user['id_usuario'] == id) return true;
    }

    if (user) {
        throw new Error('Já existe um usuário com este email.');
    }

    return true;
};

// Verifica se o usuário existe pelo ID
const existsUser = async (id) => {
    const user = await User.findByPk(id);

    if (!user) {
        throw new Error('ID do usuário inválido.');
    }

    return true;
};

// Validações de endereço (opcional)
const addressValidation = [
    body('endereco.logradouro').optional().notEmpty().withMessage('O logradouro é obrigatório.'),
    body('endereco.numero').optional().notEmpty().withMessage('O número é obrigatório.'),
    body('endereco.bairro').optional().notEmpty().withMessage('O bairro é obrigatório.'),
    body('endereco.cidade').optional().notEmpty().withMessage('A cidade é obrigatória.'),
    body('endereco.estado')
        .optional()
        .notEmpty().withMessage('O estado é obrigatório.')
        .isLength({ min: 2, max: 2 }).withMessage('O estado deve ter 2 caracteres.'),
    body('endereco.cep')
        .optional()
        .notEmpty().withMessage('O CEP é obrigatório.')
        .isLength({ min: 8, max: 8 }).withMessage('O CEP deve ter 8 caracteres.')
        .isNumeric().withMessage('O CEP deve conter apenas números.'),
];

exports.createUserValidation = [
    body('senha').trim().escape().notEmpty().withMessage('A senha é obrigatória.'),
    body('nome').trim().escape().notEmpty().withMessage('O nome é obrigatório.'),
    body('sobrenome').trim().escape().notEmpty().withMessage('O sobrenome é obrigatório.'),
    body('email')
        .trim().escape().normalizeEmail()
        .isEmail().withMessage('O email deve ser válido.')
        .custom(existsEmail),
    ...addressValidation, // Inclui validações para endereço, se fornecido
];

exports.removeUserValidation = [
    param('id')
        .notEmpty().withMessage('O ID precisa ser informado.')
        .isInt().withMessage('O ID deve ser um número inteiro.')
        .custom(existsUser),
];

exports.alterUserValidation = [
    param('id')
        .notEmpty().withMessage('O ID precisa ser informado.')
        .isInt().withMessage('O ID deve ser um número inteiro.')
        .custom(existsUser),
    body('senha').optional().trim().escape().notEmpty().withMessage('A senha é obrigatória.'),
    body('nome').optional().trim().escape().notEmpty().withMessage('O nome é obrigatório.'),
    body('sobrenome').optional().trim().escape().notEmpty().withMessage('O sobrenome é obrigatório.'),
    body('email')
        .optional()
        .trim().escape().normalizeEmail()
        .isEmail().withMessage('O email deve ser válido.')
        .custom(existsEmail),
    ...addressValidation, // Inclui validações para endereço, se fornecido
];
