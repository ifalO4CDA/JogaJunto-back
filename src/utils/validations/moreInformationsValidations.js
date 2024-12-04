const { body, param } = require('express-validator');
const User = require('./../../models/user');
const MoreInformation = require('./../../models/moreInformation');

const userExists = async (id_usuario) => {
    const user = await User.findByPk(id_usuario);
    if (!user) {
        throw new Error('Usuário não encontrado.');
    }
    return true;
}

const cpfExists = async (cpf) => {
    const moreInformation = await MoreInformation.findOne({ where: { cpf } });
    if (moreInformation) {
        throw new Error('CPF já cadastrado.');
    }
    return true;
}

// Validação para CPF válido (Tipo de dados	bpchar(11))
const cpfValidation = (cpf) => {

    if (cpf.length !== 11) {
        throw new Error('O CPF deve ter 11 caracteres.');
    }

    // Verificar se o cpf é uma sequência de números iguais
    const sequence = cpf[0].repeat(11);
    if (cpf === sequence) {
        throw new Error('CPF inválido.');
    }

    // Verificar o primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf[i]) * (10 - i);
    }
    let rest = sum % 11;
    let digit = rest < 2 ? 0 : 11 - rest;
    if (parseInt(cpf[9]) !== digit) {
        throw new Error('CPF inválido.');
    }

    // Verificar o segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf[i]) * (11 - i);
    }
    rest = sum % 11;
    digit = rest < 2 ? 0 : 11 - rest;
    if (parseInt(cpf[10]) !== digit) {
        throw new Error('CPF inválido.');
    }

    return cpfExists(cpf);
}

// Validação para data de nascimento válida
const birthDateValidation = (data_nascimento) => {
    const birthDate = new Date(data_nascimento)
    if (isNaN(birthDate)) {
        throw new Error('Data de nascimento inválida.');
    }
    return true;
}

exports.createMoreInformationsValidation = [
    body('id_usuario')
        .trim().escape()
        .notEmpty().withMessage('O ID do usuário é obrigatório.')
        .isInt().withMessage('O ID do usuário deve ser um número inteiro.')
        .custom(userExists),
    body('documento_oficial')
        .trim().escape().notEmpty().withMessage('O documento oficial é obrigatório.'),
    body('data_nascimento')
        .trim().escape().notEmpty().withMessage('A data de nascimento é obrigatória.')
        .custom(birthDateValidation),
    body('cpf')
        .notEmpty().withMessage('O CPF é obrigatório.')
        .trim().escape()
        .custom(cpfValidation),
];

exports.getMoreInformationsValidation = [
    param('id')
        .notEmpty().withMessage('O ID do usuário é obrigatório.')
        .isInt().withMessage('O ID do usuário deve ser um número inteiro.')
        .custom(userExists),
];
