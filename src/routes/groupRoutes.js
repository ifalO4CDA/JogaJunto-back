const express = require('express');
const GroupsController = require('../controllers/groupController');
const router = express.Router();
const authenticate = require('../utils/middlewares/authenticate'); // Middleware de autenticação

router.use(authenticate)

// Rotas de grupos
router.post('/', GroupsController.createGroup); // Criar grupo
router.get('/', GroupsController.listAllGroups); // Listar todos os grupos
router.get('/usuario/:id', GroupsController.listUserGroups); // Listar grupos de um usuário
router.put('/', GroupsController.updateGroup); // Atualizar grupo
router.delete('/', GroupsController.deleteGroup); // Excluir grupo
router.post('/membro', GroupsController.addRemoveGroupMember); // Adicionar/Remover membros
router.get('/grupoMembros/:id', GroupsController.listGroupMembers);

module.exports = router;
