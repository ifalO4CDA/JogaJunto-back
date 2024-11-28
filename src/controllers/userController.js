const User = require('../models/user');

exports.createUser = async (req, res) => {
  try {
    const { nome, sobrenome, email, senha } = req.body;
    const user = await User.create({ nome, sobrenome, email, senha });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar usuário', error });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar usuários', error });
  }
};
