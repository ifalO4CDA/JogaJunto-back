const User = require('../models/user');
const { validationResult } = require('express-validator');
const { createUserValidation, alterUserValidation } = require('./../utils/validations/userValidations');
const  createResponse = require('./../utils/helpers/responseHelper');
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
        data: {"id": user["id_usuario"]}
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
        data: {"id": userID}
      })
    );
  }
]

