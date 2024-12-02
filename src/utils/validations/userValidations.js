const { body, param } = require('express-validator');
const User = require('./../../models/user');

const existsEmail = async (email) => {
    const user = await User.findOne({ where: { email } });

    if (user) {
        throw new Error('Já existe um usuário com este email.');
    }
    return true;
}

const existsUser = async (id) => {
    const user = await User.findByPk(id);

    if (!user) {
        throw new Error('ID do usuário inválido.');
    }
    return true;
}

exports.createUserValidation = [
    body('senha').trim().escape().notEmpty().withMessage('A senha é obrigatória.'),
    body('nome').trim().escape().notEmpty().withMessage('O nome é obrigatório.'),
    body('sobrenome').trim().escape().notEmpty().withMessage('O sobrenome é obrigatório.'),
    body('email')
        .trim().escape().normalizeEmail()
        .isEmail().withMessage('O email deve ser válido.')
        .custom(existsEmail),
];
 
exports.alterUserValidation = [
    param('id')
        .notEmpty().withMessage('O ID precisa ser informado.')
        .isInt().withMessage('O ID deve ser um número inteiro.')
        .custom(existsUser),
    body('senha').trim().escape().notEmpty().withMessage('A senha é obrigatória.'),
    body('nome').trim().escape().notEmpty().withMessage('O nome é obrigatório.'),
    body('sobrenome').trim().escape().notEmpty().withMessage('O sobrenome é obrigatório.'),
    body('email')
        .trim().escape().normalizeEmail()
        .isEmail().withMessage('O email deve ser válido.')
        .custom(existsEmail)
];