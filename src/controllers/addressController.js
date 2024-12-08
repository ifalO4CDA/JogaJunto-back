const { validationResult } = require('express-validator');
const Address = require('../models/address');
const AddressEntity = require('../models/AddressEntity'); // Modelo para enderecos_entidades
const createResponse = require('./../utils/helpers/responseHelper');

exports.createAddress = [
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(createResponse({
        status: 'Erro',
        message: 'Erro de validação.',
        errors: errors.array(),
      }));
    }

    const {
      logradouro,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
      cep,
      id_usuario,
      id_quadra,
    } = req.body;

    try {
      if (!id_usuario && !id_quadra) {
        return res.status(400).json(createResponse({
          status: 'Erro',
          message: 'O endereço deve estar associado a um usuário ou uma quadra.',
        }));
      }

      // Criar o endereço na tabela enderecos
      const newAddress = await Address.create({
        logradouro,
        numero,
        complemento,
        bairro,
        cidade,
        estado,
        cep
      });

      // Associar o endereço na tabela enderecos_entidades
      const entidade = id_usuario ? 'usuario' : 'quadra';
      const id_entidade = id_usuario || id_quadra;


      await AddressEntity.create({
        id_endereco: newAddress.id_endereco,
        entidade,
        id_entidade,
      });


      return res.status(201).json(createResponse({
        status: 'Sucesso',
        message: 'Endereço cadastrado com sucesso!',
        data: newAddress,
      }));
    } catch (error) {
      console.error('Erro ao criar endereço:', error);
      return res.status(500).json(createResponse({
        status: 'Erro',
        message: 'Erro interno do servidor.',
        errors: [error.message],
      }));
    }
  },
];

exports.getAddresses = async (req, res) => {
    const { id_usuario, id_quadra } = req.query;
  
    try {
      if (!id_usuario && !id_quadra) {
        return res.status(400).json(createResponse({
          status: 'Erro',
          message: 'Você deve fornecer o ID de um usuário ou uma quadra.',
        }));
      }
  
      const entidade = id_usuario ? 'usuario' : 'quadra';
      const id_entidade = id_usuario || id_quadra;
  
      const addresses = await AddressEntity.findAll({
        where: { entidade, id_entidade },
        include: [{
          model: Address,
          as: 'endereco', // Relacionamento configurado no Sequelize
        }],
      });
  
      return res.status(200).json(createResponse({
        status: 'Sucesso',
        message: 'Endereços encontrados com sucesso!',
        data: addresses.map(a => a.endereco),
      }));
    } catch (error) {
      console.error('Erro ao buscar endereços:', error);
      return res.status(500).json(createResponse({
        status: 'Erro',
        message: 'Erro interno do servidor.',
        errors: [error.message],
      }));
    }
  };
  