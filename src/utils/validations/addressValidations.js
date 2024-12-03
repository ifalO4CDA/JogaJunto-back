const { body, param } = require('express-validator');
const User = require('./../../models/user'); 

// Validação para verificar se o usuário existe
const userExists = async (id_usuario) => {
  const user = await User.findByPk(id_usuario);
  if (!user) {
    throw new Error('Usuário não encontrado.');
  }
  return true;
};

// Validações para criar endereço
const createAddressValidation = [
  body('id_usuario')
    .notEmpty().withMessage('O ID do usuário é obrigatório.')
    .isInt().withMessage('O ID do usuário deve ser um número inteiro.')
    .custom(userExists),
  body('logradouro').notEmpty().withMessage('O logradouro é obrigatório.'),
  body('numero').notEmpty().withMessage('O número é obrigatório.'),
  body('bairro').notEmpty().withMessage('O bairro é obrigatório.'),
  body('cidade').notEmpty().withMessage('A cidade é obrigatória.'),
  body('estado').notEmpty().withMessage('O estado é obrigatório.'),
  body('cep')
    .notEmpty().withMessage('O CEP é obrigatório.')
    .isLength({ min: 8, max: 8 }).withMessage('O CEP deve ter 8 caracteres.'),
];

module.exports = {
  createAddressValidation,
};
