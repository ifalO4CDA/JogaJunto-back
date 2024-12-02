const User = require('../models/user');
const { validationResult } = require('express-validator');
const { createUserValidation, alterUserValidation } = require('./../utils/validations/userValidations');

exports.createUser = [
  createUserValidation,
  async (req, res) => {
    const { nome, sobrenome, email, senha } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const user = await User.create({ nome, sobrenome, email, senha });
    res.status(201).json(user);
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
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.update(
      { nome, sobrenome, email, senha },
      { where: { id_usuario: userID } }
    );
    res.status(201).json(user);
  }
]

