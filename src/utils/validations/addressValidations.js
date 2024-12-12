const { body } = require('express-validator');

const createAddressValidation = [
  body('logradouro')
    .notEmpty().withMessage('O logradouro é obrigatório.'),
  
  body('numero')
    .notEmpty().withMessage('O número é obrigatório.'),
  
  body('bairro')
    .notEmpty().withMessage('O bairro é obrigatório.'),
  
  body('cidade')
    .notEmpty().withMessage('A cidade é obrigatória.'),
  
  body('estado')
    .notEmpty().withMessage('O estado é obrigatório.')
    .isLength({ min: 2, max: 2 }).withMessage('O estado deve ter 2 caracteres (ex.: SP, RJ).'),
  
  body('cep')
    .notEmpty().withMessage('O CEP é obrigatório.')
    .isLength({ min: 8, max: 8 }).withMessage('O CEP deve ter exatamente 8 caracteres.')
    .isNumeric().withMessage('O CEP deve conter apenas números.'),
  
  body('id_usuario')
    .optional()
    .isInt().withMessage('O ID do usuário deve ser um número inteiro.'),
  
  body('id_quadra')
    .optional()
    .isInt().withMessage('O ID da quadra deve ser um número inteiro.'),
  
  body()
    .custom((value, { req }) => {
      // Certifica que ao menos `id_usuario` ou `id_quadra` seja informado
      if (!req.body.id_usuario && !req.body.id_quadra) {
        throw new Error('O endereço deve estar associado a um usuário ou uma quadra.');
      }
      return true;
    }),
];

module.exports = {
  createAddressValidation,
};
