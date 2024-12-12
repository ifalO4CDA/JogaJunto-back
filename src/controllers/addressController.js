const { validationResult } = require('express-validator');
const Address = require('../models/address');
const createResponse = require('./../utils/helpers/responseHelper');
const User = require('../models/user'); // Import do modelo de usuário
// const Quadra = require('../models/quadra'); // Import do modelo de quadra

// Criar um endereço
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
      // Verificar se está associado a um usuário ou quadra
      if (!id_usuario && !id_quadra) {
        return res.status(400).json(createResponse({
          status: 'Erro',
          message: 'O endereço deve estar associado a um usuário ou uma quadra.',
        }));
      }

      // Criar o endereço na tabela `enderecos`
      const newAddress = await Address.create({
        logradouro,
        numero,
        complemento,
        bairro,
        cidade,
        estado,
        cep,
      });

      // Associar o endereço ao usuário ou à quadra
      if (id_usuario) {
        const user = await User.findByPk(id_usuario);
        if (!user) {
          return res.status(404).json(createResponse({
            status: 'Erro',
            message: 'Usuário não encontrado.',
          }));
        }
        await user.update({ id_endereco: newAddress.id_endereco });
        // } else if (id_quadra) {
        //   const quadra = await Quadra.findByPk(id_quadra);
        //   if (!quadra) {
        //     return res.status(404).json(createResponse({
        //       status: 'Erro',
        //       message: 'Quadra não encontrada.',
        //     }));
        //   }
        //   await quadra.update({ id_endereco: newAddress.id_endereco });
        // 
      }

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

// Buscar endereços associados a um usuário ou quadra
exports.getAddresses = async (req, res) => {
  const { id_usuario, id_quadra } = req.query;

  try {
    // Verificar se o ID de usuário ou quadra foi fornecido
    if (!id_usuario && !id_quadra) {
      return res.status(400).json(createResponse({
        status: 'Erro',
        message: 'Você deve fornecer o ID de um usuário ou uma quadra.',
      }));
    }

    let address;
    if (id_usuario) {
      const user = await User.findByPk(id_usuario, {
        include: { model: Address, as: 'endereco' },
      });
      if (!user || !user.endereco) {
        return res.status(404).json(createResponse({
          status: 'Erro',
          message: 'Endereço do usuário não encontrado.',
        }));
      }
      address = user.endereco;
    }
    //  else if (id_quadra) {
    //   const quadra = await Quadra.findByPk(id_quadra, {
    //     include: { model: Address, as: 'endereco' },
    //   });
    //   if (!quadra || !quadra.endereco) {
    //     return res.status(404).json(createResponse({
    //       status: 'Erro',
    //       message: 'Endereço da quadra não encontrado.',
    //     }));
    //   }
    //   address = quadra.endereco;
    // }

    return res.status(200).json(createResponse({
      status: 'Sucesso',
      message: 'Endereço encontrado com sucesso!',
      data: address,
    }));
  } catch (error) {
    console.error('Erro ao buscar endereço:', error);
    return res.status(500).json(createResponse({
      status: 'Erro',
      message: 'Erro interno do servidor.',
      errors: [error.message],
    }));
  }
};
