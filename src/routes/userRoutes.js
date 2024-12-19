const express = require('express');
const userController = require('../controllers/userController');
const {
  createUserValidation,
  alterUserValidation,
  removeUserValidation,
  loginUserValidation,
  getUserValidation
} = require('../utils/validations/userValidations');
const router = express.Router();
const authenticate = require('../utils/middlewares/authenticate');
console.log(authenticate);

// Rotas de usuários com validações aplicadas
router.get('/:id', authenticate, getUserValidation, userController.getUser);
router.get('/', authenticate, userController.getUsers); 
router.put('/:id', authenticate, alterUserValidation, userController.alterUser); 
router.delete('/:id', authenticate,removeUserValidation, userController.removeUser);

router.post('/login', loginUserValidation, userController.login);
router.post('/', createUserValidation, userController.createUser); 

module.exports = router;
