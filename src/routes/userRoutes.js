const express = require('express');
const userController = require('../controllers/userController');
const {
  createUserValidation,
  alterUserValidation,
  removeUserValidation,
  loginUserValidation
} = require('../utils/validations/userValidations');
const router = express.Router();
const authenticate = require('../utils/middlewares/authenticate');
console.log(authenticate);

// Rotas de usuários com validações aplicadas
router.post('/', createUserValidation, userController.createUser); // Validação de criação
router.get('/', authenticate, userController.getUsers); // Listar usuários
router.put('/:id', authenticate, alterUserValidation, userController.alterUser); // Validação de alteração
router.delete('/:id', authenticate,removeUserValidation, userController.removeUser); // Validação de remoção

router.post('/login', loginUserValidation, userController.login);

module.exports = router;
