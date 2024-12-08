const User = require('./../models/user');
const MoreInformation = require('./../models/moreInformation');
const { validationResult } = require('express-validator');
const { createMoreInformationsValidation, getMoreInformationsValidation, updateMoreInformationsValidation } = require('../utils/validations/moreInformationsValidations');
const createResponse = require('./../utils/helpers/responseHelper');
exports.createMoreInformations = [
    createMoreInformationsValidation,
    async (req, res) => {
        let { id_usuario, documento_oficial, data_nascimento, cpf } = req.body;

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

        const user = await User.findByPk(id_usuario);
        if (!user) {
            return res.status(400).json(
                createResponse({
                    status: 'Erro',
                    message: 'Usuário não encontrado.',
                })
            );
        }

        const moreInformations = await MoreInformation.create({ id_usuario, documento_oficial, data_nascimento, cpf });
        res.status(201).json(
            createResponse({
                status: 'Sucesso',
                message: 'Informações adicionais cadastradas com sucesso!',
                data: { "id": moreInformations["id_usuario"] }
            })
        );
    },
];

exports.getMoreInformations = [
    getMoreInformationsValidation,
    async (req, res) => {
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

        const { id } = req.params;
        const moreInformations = await MoreInformation.findByPk(id);
        res.status(200).json(
            createResponse({
                status: 'Sucesso',
                data: moreInformations,
            })
        );
    }
];

exports.updateMoreInformations = [
    updateMoreInformationsValidation,
    async (req, res) => {
        const { id } = req.params;

        const { documento_oficial, data_nascimento, cpf } = req.body;

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

        const moreInformations = await MoreInformation.update(
            { id, documento_oficial, data_nascimento, cpf },
            { where: { id_usuario: id } }
        );

        res.status(201).json(
            createResponse({
                status: 'Sucesso',
                message: 'Informações adicionais alteradas com sucesso!',
                data: { "id": id }
            })
        );
    }
]