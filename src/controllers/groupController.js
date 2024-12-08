const { validationResult } = require('express-validator');
const {Group, User} = require('../models/indexModel');
const createResponse = require('../utils/helpers/responseHelper');
const { createGroupValidation, updateGroupValidation, removeGroupValidation } = require('../utils/validations/groupValidation');

exports.createGroup = [
  createGroupValidation,
  async (req, res) => {
    const { nome_grupo, id_criador } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(
        createResponse({
          status: 'Erro',
          message: 'Erro de validação.',
          errors: errors.array(),
        })
      );
    }

    try {
      const group = await Group.create({ nome_grupo, id_criador });
      res.status(201).json(
        createResponse({
          status: 'Sucesso',
          message: 'Grupo criado com sucesso!',
          data: { id: group.id_grupo },
        })
      );
    } catch (error) {
      console.error(error);
      res.status(500).json(
        createResponse({
          status: 'Erro',
          message: 'Erro ao criar o grupo.',
          errors: [error.message],
        })
      );
    }
  }
];

exports.updateGroup = [
  updateGroupValidation,
  async (req, res) => {
    const id_grupo = req.body.id_grupo;
    const { nome_grupo } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(
        createResponse({
          status: 'Erro',
          message: 'Erro de validação.',
          errors: errors.array(),
        })
      );
    }

    try {
      const group = await Group.findByPk(id_grupo);
      if (!group) {
        return res.status(404).json(
          createResponse({
            status: 'Erro',
            message: 'Grupo não encontrado.',
          })
        );
      }

      await group.update({ nome_grupo });
      res.status(200).json(
        createResponse({
          status: 'Sucesso',
          message: 'Grupo atualizado com sucesso!',
          data: { id: id_grupo },
        })
      );
    } catch (error) {
      console.error(error);
      res.status(500).json(
        createResponse({
          status: 'Erro',
          message: 'Erro ao atualizar o grupo.',
          errors: [error.message],
        })
      );
    }
  }
];

exports.deleteGroup = [
  async (req, res) => {
    const { id_grupo, id_usuario } = req.body;

    // Verifica erros de validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(
        createResponse({
          status: 'Erro',
          message: 'Erro de validação.',
          errors: errors.array(),
        })
      );
    }

    try {
      // Busca o grupo
      const group = await Group.findByPk(id_grupo);
      if (!group) {
        return res.status(404).json(
          createResponse({
            status: 'Erro',
            message: 'Grupo não encontrado.',
          })
        );
      }

      // Verifica novamente a permissão (apenas por precaução)
      if (group.id_criador !== id_usuario) {
        return res.status(403).json(
          createResponse({
            status: 'Erro',
            message: 'Apenas o criador do grupo pode excluí-lo.',
          })
        );
      }

      // Exclui o grupo
      await group.destroy();
      res.status(200).json(
        createResponse({
          status: 'Sucesso',
          message: 'Grupo excluído com sucesso!',
          data: { id: id_grupo },
        })
      );
    } catch (error) {
      console.error('Erro ao excluir o grupo:', error);
      res.status(500).json(
        createResponse({
          status: 'Erro',
          message: 'Erro ao excluir o grupo.',
          errors: [error.message],
        })
      );
    }
  },
];

exports.listAllGroups = [
  async (req, res) => {
    try {
      const groups = await Group.findAll();
      res.status(200).json(
        createResponse({
          status: 'Sucesso',
          message: 'Grupos listados com sucesso!',
          data: groups,
        })
      );
    } catch (error) {
      console.error(error);
      res.status(500).json(
        createResponse({
          status: 'Erro',
          message: 'Erro ao listar os grupos.',
          errors: [error.message],
        })
      );
    }
  }
];

exports.listUserGroups = [
  async (req, res) => {
    const id_usuario = req.body.id_usuario;

    try {
      const groups = await Group.findAll({ where: { id_criador: id_usuario } });
      res.status(200).json(
        createResponse({
          status: 'Sucesso',
          message: 'Grupos do usuário listados com sucesso!',
          data: groups,
        })
      );
    } catch (error) {
      console.error(error);
      res.status(500).json(
        createResponse({
          status: 'Erro',
          message: 'Erro ao listar os grupos do usuário.',
          errors: [error.message],
        })
      );
    }
  }
];

exports.addRemoveGroupMember = [
  async (req, res) => {
    const id_grupo = req.body.id_grupo;
    const { id_usuario, acao } = req.body; // 'adicionar' ou 'remover'

    try {
      const group = await Group.findByPk(id_grupo);
      if (!group) {
        return res.status(404).json(
          createResponse({
            status: 'Erro',
            message: 'Grupo não encontrado.',
          })
        );
      }

      if (acao === 'adicionar') {
        // Lógica para adicionar membro
        await group.addUser(id_usuario); // Exemplo: método addUser() via associação Sequelize
        res.status(200).json(
          createResponse({
            status: 'Sucesso',
            message: 'Usuário adicionado ao grupo com sucesso!',
            data: { id_grupo, id_usuario },
          })
        );
      } else if (acao === 'remover') {
        // Lógica para remover membro
        await group.removeUser(id_usuario); // Exemplo: método removeUser() via associação Sequelize
        res.status(200).json(
          createResponse({
            status: 'Sucesso',
            message: 'Usuário removido do grupo com sucesso!',
            data: { id_grupo, id_usuario },
          })
        );
      } else {
        res.status(400).json(
          createResponse({
            status: 'Erro',
            message: 'Ação inválida. Use "adicionar" ou "remover".',
          })
        );
      }
    } catch (error) {
      console.error(error);
      res.status(500).json(
        createResponse({
          status: 'Erro',
          message: 'Erro ao gerenciar membros do grupo.',
          errors: [error.message],
        })
      );
    }
  }
];
