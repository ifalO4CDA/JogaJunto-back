const { body } = require('express-validator');
const User = require('./../../models/user');

const existsEmail = async (email) => {
    const user = await User.findOne({ where: { email } });

    if (user) {
        throw new Error('Já existe um usuário com este email.');
    }
    return true;
}

exports.createUserValidation = [
    body('nome').notEmpty().withMessage('O nome é obrigatório.'),
    body('sobrenome').notEmpty().withMessage('O sobrenome é obrigatório.'),
    body('email')
        .isEmail().withMessage('O email deve ser válido.')
        .custom(existsEmail),
];