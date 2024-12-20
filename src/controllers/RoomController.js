const { validationResult } = require('express-validator');
const { Room, User, Group, RoomMember } = require('../models/indexModel');
const createResponse = require('../utils/helpers/responseHelper');

// Criar sala
exports.createRoom = async (req, res) => {
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

    const { reserva_ativa, privada, id_usuario, id_grupo, max_integrantes } = req.body;

    try {
        // Verificar se o usuário existe
        let user = null;
        if (id_usuario) {
            user = await User.findByPk(id_usuario);
            if (!user) {
                return res.status(404).json(
                    createResponse({
                        status: 'Erro',
                        message: 'Usuário criador não encontrado.',
                    })
                );
            }
        }

        // Verificar se o grupo existe (caso fornecido)
        if (id_grupo) {
            const group = await Group.findByPk(id_grupo);
            if (!group) {
                return res.status(404).json(
                    createResponse({
                        status: 'Erro',
                        message: 'Grupo não encontrado.',
                    })
                );
            }
        }

        // Criar a sala
        const room = await Room.create({
            reserva_ativa: reserva_ativa ?? false,
            privada: privada ?? false,
            id_usuario: id_usuario || null,
            id_grupo: id_grupo, // Permitir null aqui
            max_integrantes: max_integrantes || 10,
            qtd_atual_integrantes: 0, // Inicia com 1 porque o criador será o primeiro integrante
        });

        // Adicionar o criador como membro da sala
        if (user) {
            await room.addMembro(user); // Método da associação `belongsToMany`
        }

        return res.status(201).json(
            createResponse({
                status: 'Sucesso',
                message: 'Sala criada com sucesso!',
                data: room,
            })
        );
    } catch (error) {
        console.error('Erro ao criar sala:', error);
        return res.status(500).json(
            createResponse({
                status: 'Erro',
                message: 'Erro ao criar sala.',
                errors: [error.message],
            })
        );
    }
};
// Listar salas
exports.getRooms = async (req, res) => {
    try {
        const rooms = await Room.findAll({
            include: [
                { model: User, as: 'criador', attributes: ['id_usuario', 'nome', 'email'] },
                { model: Group, as: 'grupo', attributes: ['id_grupo', 'nome_grupo'] },
            ],
        });

        return res.status(200).json({
            status: 'Sucesso',
            message: 'Salas listadas com sucesso!',
            data: rooms,
        });
    } catch (error) {
        console.error('Erro ao buscar salas:', error);
        return res.status(500).json({ status: 'Erro', message: 'Erro ao buscar salas.', error: error.message });
    }
};

// Buscar sala por ID
exports.getRoomById = async (req, res) => {
    const { id } = req.params;

    try {
        const room = await Room.findByPk(id, {
            include: [
                { model: User, as: 'criador', attributes: ['id_usuario', 'nome', 'email'] },
                { model: Group, as: 'grupo', attributes: ['id_grupo', 'nome_grupo'] },
            ],
        });

        if (!room) {
            return res.status(404).json({ status: 'Erro', message: 'Sala não encontrada.' });
        }

        return res.status(200).json({
            status: 'Sucesso',
            message: 'Sala encontrada com sucesso!',
            data: room,
        });
    } catch (error) {
        console.error('Erro ao buscar sala:', error);
        return res.status(500).json({ status: 'Erro', message: 'Erro ao buscar sala.', error: error.message });
    }
};

// Listar salas de um usuário
exports.getRoomsOfUser = async (req, res) => {
    const { id_usuario } = req.params;

    try {
        // Buscar as salas do usuário
        const rooms = await Room.findAll({
            where: { id_usuario }, // Filtrar diretamente pelo ID do usuário
            include: [
                { model: Group, as: 'grupo', attributes: ['id_grupo', 'nome_grupo'] },
            ],
            attributes: ['id_sala', 'reserva_ativa', 'privada', 'max_integrantes', 'qtd_atual_integrantes'], // Apenas atributos necessários
        });

        if (rooms.length === 0) {
            return res.status(404).json(
                createResponse({
                    status: 'Erro',
                    message: 'Nenhuma sala encontrada para este usuário.',
                })
            );
        }

        return res.status(200).json(
            createResponse({
                status: 'Sucesso',
                message: 'Salas do usuário listadas com sucesso!',
                data: rooms,
            })
        );
    } catch (error) {
        console.error('Erro ao buscar salas do usuário:', error);
        return res.status(500).json(
            createResponse({
                status: 'Erro',
                message: 'Erro ao buscar salas do usuário.',
                errors: [{ msg: error.message }],
            })
        );
    }
};

// Atualizar sala
exports.updateRoom = async (req, res) => {
    const { id } = req.params;
    const { reserva_ativa, privada, max_integrantes } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 'Erro',
            message: 'Erro de validação.',
            errors: errors.array(),
        });
    }

    try {
        const room = await Room.findByPk(id);

        if (!room) {
            return res.status(404).json({ status: 'Erro', message: 'Sala não encontrada.' });
        }

        await room.update({
            reserva_ativa,
            privada,
            max_integrantes,
        });

        return res.status(200).json({
            status: 'Sucesso',
            message: 'Sala atualizada com sucesso!',
            data: room,
        });
    } catch (error) {
        console.error('Erro ao atualizar sala:', error);
        return res.status(500).json({ status: 'Erro', message: 'Erro ao atualizar sala.', error: error.message });
    }
};

// Remover sala
exports.deleteRoom = async (req, res) => {
    const { id } = req.params;

    try {
        const room = await Room.findByPk(id);

        if (!room) {
            return res.status(404).json({ status: 'Erro', message: 'Sala não encontrada.' });
        }

        await Room.destroy({ where: { id_sala: id } });

        return res.status(200).json({
            status: 'Sucesso',
            message: 'Sala removida com sucesso!',
        });
    } catch (error) {
        console.error('Erro ao remover sala:', error);
        return res.status(500).json({ status: 'Erro', message: 'Erro ao remover sala.', error: error.message });
    }
};

// Adicionar membro à sala
exports.addMemberToRoom = async (req, res) => {
    const { id_sala } = req.params;
    const { id_usuario } = req.body;

    try {
        // Verificar se a sala existe
        const room = await Room.findByPk(id_sala);
        if (!room) {
            return res.status(404).json({ status: 'Erro', message: 'Sala não encontrada.' });
        }

        // Verificar se o usuário existe
        const user = await User.findByPk(id_usuario);
        if (!user) {
            return res.status(404).json({ status: 'Erro', message: 'Usuário não encontrado.' });
        }

        // Verificar limite de integrantes
        if (room.qtd_atual_integrantes >= room.max_integrantes) {
            return res.status(400).json({ status: 'Erro', message: 'A sala atingiu o limite máximo de integrantes.' });
        }

        // Verificar se o usuário já é membro da sala
        const existingMember = await RoomMember.findOne({ where: { id_sala, id_usuario } });
        if (existingMember) {
            return res.status(400).json({ status: 'Erro', message: 'Usuário já é membro da sala.' });
        }

        // Adicionar o membro
        await RoomMember.create({ id_sala, id_usuario });

        // Incrementar a quantidade de integrantes
        room.qtd_atual_integrantes += 1;
        await room.save();

        return res.status(200).json({
            status: 'Sucesso',
            message: 'Usuário adicionado à sala com sucesso!',
        });
    } catch (error) {
        console.error('Erro ao adicionar membro à sala:', error);
        return res.status(500).json({
            status: 'Erro',
            message: 'Erro ao adicionar membro à sala.',
            error: error.message,
        });
    }
};
exports.getUsersOfRoom = async (req, res) => {
    const { id_sala } = req.params;
  
    try {
      // Verificar se a sala existe
      const room = await Room.findByPk(id_sala);
      if (!room) {
        return res.status(404).json({
          status: 'Erro',
          message: 'Sala não encontrada.',
        });
      }
  
      // Obter os usuários da sala
      const roomMembers = await RoomMember.findAll({
        where: { id_sala },
        include: [
          {
            model: User,
            as: 'usuario', // Alias definido no relacionamento
            attributes: ['id_usuario', 'nome', 'email'],
          },
        ],
      });
  
      // Extrair apenas os dados dos usuários
      const users = roomMembers.map((member) => member.usuario);
  
      return res.status(200).json({
        status: 'Sucesso',
        message: 'Usuários da sala listados com sucesso!',
        data: users, // Retorna apenas os usuários
      });
    } catch (error) {
      console.error('Erro ao obter usuários da sala:', error);
      return res.status(500).json({
        status: 'Erro',
        message: 'Erro ao obter usuários da sala.',
        error: error.message,
      });
    }
  };


// Remover membro da sala
exports.removeMemberFromRoom = async (req, res) => {
    const { id_sala } = req.params;
    const { id_usuario } = req.body;

    try {
        const room = await Room.findByPk(id_sala);
        if (!room) {
            return res.status(404).json({ status: 'Erro', message: 'Sala não encontrada.' });
        }

        const user = await User.findByPk(id_usuario);
        if (!user) {
            return res.status(404).json({ status: 'Erro', message: 'Usuário não encontrado.' });
        }

        // Verificar se é membro
        const member = await RoomMember.findOne({ where: { id_sala, id_usuario } });
        if (!member) {
            return res.status(400).json({ status: 'Erro', message: 'Usuário não é membro da sala.' });
        }

        // Remover membro
        await RoomMember.destroy({ where: { id_sala, id_usuario } });

        room.qtd_atual_integrantes -= 1;
        await room.save();

        return res.status(200).json({
            status: 'Sucesso',
            message: 'Usuário removido da sala com sucesso!',
        });
    } catch (error) {
        console.error('Erro ao remover membro da sala:', error);
        return res.status(500).json({ status: 'Erro', message: 'Erro ao remover membro da sala.', error: error.message });
    }
};
