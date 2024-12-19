const { validationResult } = require('express-validator');
const {Group, User} = require('../models/indexModel');
const createResponse = require('../utils/helpers/responseHelper');
const { Op } = require('sequelize');
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
    const id_usuario = Number(req.params.id);

    if (!id_usuario) {
      return res.status(400).json({
        status: 'Erro',
        message: 'ID do usuário é obrigatório.',
      });
    }

    try {
      const groups = await Group.findAll({
        where: {
          [Op.or]: [
            { id_criador: id_usuario }, // Usuário é o criador
            { '$Users.id_usuario$': id_usuario }, // Usuário está na tabela intermediária
          ],
        },
        include: [
          {
            model: User,
            through: { attributes: [] },
            attributes: [],
          },
        ],
      });

      if (!groups.length) {
        return res.status(404).json({
          status: 'Erro',
          message: 'O usuário não participa de nenhum grupo.',
        });
      }

      res.status(200).json({
        status: 'Sucesso',
        message: 'Grupos do usuário listados com sucesso!',
        data: groups,
      });
    } catch (error) {
      res.status(500).json({
        status: 'Erro',
        message: 'Erro ao listar os grupos do usuário.',
        errors: [error.message],
      });
    }
  },
];

exports.listGroupMembers = [
  async (req, res) => {
    const id_grupo = req.params.id;

    if (!id_grupo) {
      return res.status(400).json(
        createResponse({
          status: 'Erro',
          message: 'O ID do grupo é obrigatório.',
        })
      );
    }

    try {
      // Buscar o grupo e incluir os membros
      const group = await Group.findByPk(id_grupo, {
        include: [
          {
            model: User,
            through: { attributes: [] }, // Exclui dados da tabela intermediária
            attributes: ['id_usuario', 'nome', 'sobrenome', 'email', 'foto_perfil'], // Retorna apenas os campos necessários
          },
        ],
      });

      if (!group) {
        return res.status(404).json(
          createResponse({
            status: 'Erro',
            message: 'Grupo não encontrado.',
          })
        );
      }

      // Verificar se o grupo tem membros
      if (!group.Users || group.Users.length === 0) {
        return res.status(404).json(
          createResponse({
            status: 'Erro',
            message: 'Nenhum membro encontrado para este grupo.',
            data: [],
          })
        );
      }

      // Retornar os membros do grupo
      res.status(200).json(
        createResponse({
          status: 'Sucesso',
          message: 'Membros do grupo listados com sucesso!',
          data: group.Users, // Os membros do grupo estão na propriedade `Users`
        })
      );
    } catch (error) {
      console.error('Erro ao listar membros do grupo:', error);

      res.status(500).json(
        createResponse({
          status: 'Erro',
          message: 'Erro ao listar os membros do grupo.',
          errors: [error.message],
        })
      );
    }
  },
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
