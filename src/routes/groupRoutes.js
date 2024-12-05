const express = require('express');
const GroupsController = require('../controllers/groupController');
const router = express.Router();

// Rotas de grupos
router.post('/', GroupsController.createGroup); // Criar grupo
router.get('/', GroupsController.listAllGroups); // Listar todos os grupos
router.get('/usuario/:id_usuario', GroupsController.listUserGroups); // Listar grupos de um usuário
router.put('/:id_grupo', GroupsController.updateGroup); // Atualizar grupo
router.delete('/:id_grupo', GroupsController.deleteGroup); // Excluir grupo
router.post('/:id_grupo/membros', GroupsController.addRemoveGroupMember); // Adicionar/Remover membros

module.exports = router;
