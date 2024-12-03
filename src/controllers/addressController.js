const { validationResult } = require('express-validator');
const Address = require('../models/address');
const { createAddressValidation } = require('../utils/validations/addressValidations');
const createResponse = require('./../utils/helpers/responseHelper');

exports.createAddress = [
    createAddressValidation,
    async (req, res) => {
        // Verifica erros de validação
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(createResponse({
                status: 'Erro',
                message: 'Erro de validação.',
                errors: errors.array(),
            })
            );
        }

        const {
            id_usuario,
            logradouro,
            numero,
            complemento,
            bairro,
            cidade,
            estado,
            cep,
        } = req.body;

        try {
            // Cria o endereço no banco de dados
            const newAddress = await Address.create({
                id_usuario,
                logradouro,
                numero,
                complemento,
                bairro,
                cidade,
                estado,
                cep,
            });

            return res.status(201).json(createResponse({
                status: 'Sucesso',
                message: 'Endereço cadastrado com sucesso!',
                data: newAddress
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
