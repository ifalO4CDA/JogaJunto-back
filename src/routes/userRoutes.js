const express = require('express');
const userController = require('../controllers/userController');
const {
  createUserValidation,
  alterUserValidation,
  removeUserValidation,
} = require('../utils/validations/userValidations');
const router = express.Router();

// Rotas de usuários com validações aplicadas
router.post('/', createUserValidation, userController.createUser); // Validação de criação
router.get('/', userController.getUsers); // Listar usuários
router.put('/:id', alterUserValidation, userController.alterUser); // Validação de alteração
router.delete('/:id', removeUserValidation, userController.removeUser); // Validação de remoção

module.exports = router;
