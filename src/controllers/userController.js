const { User } = require('../models/indexModel');
const { validationResult } = require('express-validator');
const { createUserValidation, alterUserValidation, removeUserValidation } = require('./../utils/validations/userValidations');
const MoreInformation = require('./../models/moreInformation');

const createResponse = require('./../utils/helpers/responseHelper');
exports.createUser = [
  createUserValidation,
  async (req, res) => {
    const { nome, sobrenome, email, senha } = req.body;

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
    const user = await User.create({ nome, sobrenome, email, senha });

    res.status(201).json(
      createResponse({
        status: 'Sucesso',
        message: 'Usuário cadastrado com sucesso!',
        data: { "id": user["id_usuario"] }
      })
    );
  },
];

exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar usuários', error });
  }
};

exports.removeUser = [
  removeUserValidation,
  async (req, res) => {
    const userID = req.params.id;

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
      const moreInformations = await MoreInformation.findByPk(userID);
      if (moreInformations) {
        await MoreInformation.destroy({ where: { id_usuario: userID } });
      }
    } catch (error) {
      return res.status(500).json(
        createResponse({
          status: 'Erro',
          message: 'Erro ao remover informações adicionais do usuário.',
          errors: error
        })
      );
    }

    const user = await User.destroy({ where: { id_usuario: userID } });

    res.status(201).json(
      createResponse({
        status: 'Sucesso',
        message: 'Usuário removido com sucesso!',
        data: { "id": userID }
      })
    );
  }
]

exports.alterUser = [
  alterUserValidation,
  async (req, res) => {
    const userID = req.params.id;
    const { nome, sobrenome, email, senha } = req.body;

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

    const user = await User.update(
      { nome, sobrenome, email, senha },
      { where: { id_usuario: userID } }
    );
    res.status(201).json(
      createResponse({
        status: 'Sucesso',
        message: 'Usuário alterado com sucesso!',
        data: { "id": userID }
      })
    );
  }
]

