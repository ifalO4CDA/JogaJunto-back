const { body } = require('express-validator');

exports.createUserValidation = [
    body('nome').notEmpty().withMessage('O nome é obrigatório.'),
    body('sobrenome').notEmpty().withMessage('O sobrenome é obrigatório.'),
    body('email').isEmail().withMessage('O email deve ser válido.'),
    body('senha')
      .isLength({ min: 6 })
      .withMessage('A senha deve ter no mínimo 6 caracteres.'),
  ];