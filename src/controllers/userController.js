const { validationResult } = require('express-validator');
const { User, Address } = require('../models/indexModel');
const createResponse = require('./../utils/helpers/responseHelper');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
exports.createUser = [
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

        try {

            // Criptografar a senha
            const hashedPassword = await bcrypt.hash(senha, 10);

            const user = await User.create({
                nome,
                sobrenome,
                email,
                senha: hashedPassword,
            });

            res.status(201).json(
                createResponse({
                    status: 'Sucesso',
                    message: 'Usuário cadastrado com sucesso!',
                    data: { id: user.id_usuario },
                })
            );
        } catch (error) {
            console.error('Erro ao criar usuário:', error);
            res.status(500).json(
                createResponse({
                    status: 'Erro',
                    message: 'Erro ao cadastrar usuário.',
                    errors: [error.message],
                })
            );
        }
    },
];

exports.alterUser = [
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

        try {
            const user = await User.findByPk(userID);

            if (!user) {
                return res.status(404).json(
                    createResponse({
                        status: 'Erro',
                        message: 'Usuário não encontrado.',
                    })
                );
            }

            // Atualizar usuário
            await user.update({ nome, sobrenome, email, senha });

            res.status(200).json(
                createResponse({
                    status: 'Sucesso',
                    message: 'Usuário alterado com sucesso!',
                    data: { id: userID },
                })
            );
        } catch (error) {
            console.error('Erro ao alterar usuário:', error);
            res.status(500).json(
                createResponse({
                    status: 'Erro',
                    message: 'Erro ao alterar usuário.',
                    errors: [error.message],
                })
            );
        }
    },
];

exports.getUsers = async (req, res) => {
    try {
      const users = await User.findAll({
        include: {
          model: Address,
          as: 'endereco', // Deve corresponder ao alias definido na associação
        },
      });
  
      res.status(200).json(
        createResponse({
          status: 'Sucesso',
          message: 'Usuários buscados com sucesso!',
          data: users,
        })
      );
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      res.status(500).json(
        createResponse({
          status: 'Erro',
          message: 'Erro ao buscar usuários.',
          errors: [error.message],
        })
      );
    }
  };
  
exports.removeUser = [
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
            const user = await User.findByPk(userID, {
                include: { model: Address, as: 'endereco' },
            });

            if (!user) {
                return res.status(404).json(
                    createResponse({
                        status: 'Erro',
                        message: 'Usuário não encontrado.',
                    })
                );
            }

            // Remover o usuário (não exclui endereço, pois ele pode ser reutilizado)
            await User.destroy({ where: { id_usuario: userID } });

            res.status(200).json(
                createResponse({
                    status: 'Sucesso',
                    message: 'Usuário removido com sucesso!',
                    data: { id: userID },
                })
            );
        } catch (error) {
            console.error('Erro ao remover usuário:', error);
            res.status(500).json(
                createResponse({
                    status: 'Erro',
                    message: 'Erro ao remover usuário.',
                    errors: [error.message],
                })
            );
        }
    },
];


exports.login = async (req, res) => {
    const { email, senha } = req.body;

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
        // Verificar se o usuário existe
        let user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json(
                createResponse({
                    status: 'Erro',
                    message: 'Usuário ou senha inválidos.',
                })
            );
        }

        // Verificar a senha
        console.log('senha', senha);
        console.log('user.senha', user.senha);
        const isPasswordValid = await bcrypt.compare(senha, user.senha);
        if (!isPasswordValid) {
            return res.status(401).json(
                createResponse({
                    status: 'Erro',
                    message: 'Usuário ou senha inválidos.',
                })
            );
        }

        // Gerar token JWT
        const token = jwt.sign(
            { id_usuario: user.id_usuario, email: user.email },
            process.env.JWT_SECRET || 'seu-segredo-jwt',
            { expiresIn: '1h' } // Token expira em 2 horas
        );


        delete user.dataValues.senha;

        res.status(200).json(
            createResponse({
                status: 'Sucesso',
                message: 'Login realizado com sucesso!',
                data: { ...user.dataValues, token },
            })
        );
    } catch (error) {
        console.error('Erro ao realizar login:', error);
        res.status(500).json(
            createResponse({
                status: 'Erro',
                message: 'Erro ao realizar login.',
                errors: [error.message],
            })
        );
    }
};
