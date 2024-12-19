const { Court, User, Address } = require('../models/indexModel');
const createResponse = require('../utils/helpers/responseHelper');

exports.getCourts = async (req, res) => {
    try {
        const courts = await Court.findAll({
            include: [
                {
                    model: User,
                    as: 'owner',
                    attributes: ['id_usuario', 'nome', 'email'],
                },
                {
                    model: Address,
                    as: 'address',
                    attributes: ['logradouro', 'numero', 'bairro', 'cidade', 'estado', 'cep'],
                },
            ],
        });

        return res.status(200).json(
            createResponse({
                status: 'Sucesso',
                message: 'Quadras listadas com sucesso!',
                data: courts,
            })
        );
    } catch (error) {
        console.error('Error fetching courts:', error);
        return res.status(500).json(
            createResponse({
                status: 'Erro',
                message: 'Erro ao listar quadras.',
                errors: [error.message],
            })
        );
    }
};

exports.getCourtById = async (req, res) => {
    const { id_court } = req.params;

    try {
        // Procurar a quadra pelo ID
        const court = await Court.findByPk(id_court, {
            include: [
                {
                    model: Address,
                    as: 'address',
                },
                {
                    model: User,
                    as: 'owner',
                    attributes: ['id_usuario', 'nome', 'email'],
                },
            ],
        });

        // Se a quadra não for encontrada, retorne um erro
        if (!court) {
            return res.status(404).json(
                createResponse({
                    status: 'Erro',
                    message: 'Quadra não encontrada.',
                    errors: [{ msg: 'Nenhuma quadra foi encontrada com o ID fornecido.' }],
                })
            );
        }

        // Resposta de sucesso
        return res.status(200).json(
            createResponse({
                status: 'Sucesso',
                message: 'Quadra encontrada com sucesso!',
                data: court,
            })
        );
    } catch (error) {
        console.error('Erro ao buscar quadra:', error);
        return res.status(500).json(
            createResponse({
                status: 'Erro',
                message: 'Erro ao buscar quadra.',
                errors: [{ msg: error.message }],
            })
        );
    }
};
