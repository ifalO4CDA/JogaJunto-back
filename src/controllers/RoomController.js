const { validationResult } = require('express-validator');
const { Room, User, Group } = require('../models/indexModel');
const createResponse = require('./../utils/helpers/responseHelper');


exports.createRoom = async (req, res) => {
    const { reserva_ativa, privada, id_usuario, id_grupo, max_integrantes } = req.body;

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
        if (id_usuario) {
            const user = await User.findByPk(id_usuario);
            if (!user) {
                return res.status(404).json(
                    createResponse({
                        status: 'Erro',
                        message: 'Usuário não encontrado.',
                    })
                );
            }
        }

        // Criar a sala
        const room = await Room.create({
            reserva_ativa: reserva_ativa || true,
            privada: privada || false,
            id_usuario: id_usuario || null,
            id_grupo: id_grupo || null,
            max_integrantes: max_integrantes || 10,
            qtd_atual_integrantes: 0,
        });

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

// Listar todas as salas
exports.getRooms = async (req, res) => {
    try {
        const rooms = await Room.findAll({
            include: [
                { model: User, as: 'creator', attributes: ['id_usuario', 'nome', 'email'] },
                { model: Group, as: 'group', attributes: ['id_grupo', 'nome'] },
            ],
        });

        return res.status(200).json(
            createResponse({
                status: 'Sucesso',
                message: 'Salas listadas com sucesso!',
                data: rooms,
            })
        );
    } catch (error) {
        console.error('Erro ao buscar salas:', error);
        return res.status(500).json(
            createResponse({
                status: 'Erro',
                message: 'Erro ao buscar salas.',
                errors: [error.message],
            })
        );
    }
};

// Buscar uma sala pelo ID
exports.getRoomById = async (req, res) => {
    const roomId = req.params.id;

    try {
        const room = await Room.findByPk(roomId, {
            include: [
                { model: User, as: 'creator', attributes: ['id_usuario', 'nome', 'email'] },
                { model: Group, as: 'group', attributes: ['id_grupo', 'nome'] },
            ],
        });

        if (!room) {
            return res.status(404).json(
                createResponse({
                    status: 'Erro',
                    message: 'Sala não encontrada.',
                })
            );
        }

        return res.status(200).json(
            createResponse({
                status: 'Sucesso',
                message: 'Sala encontrada com sucesso!',
                data: room,
            })
        );
    } catch (error) {
        console.error('Erro ao buscar sala:', error);
        return res.status(500).json(
            createResponse({
                status: 'Erro',
                message: 'Erro ao buscar sala.',
                errors: [error.message],
            })
        );
    }
};

// Atualizar uma sala
exports.updateRoom = async (req, res) => {
    const roomId = req.params.id;
    const { reserva_ativa, privada, max_integrantes } = req.body;

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
        const room = await Room.findByPk(roomId);

        if (!room) {
            return res.status(404).json(
                createResponse({
                    status: 'Erro',
                    message: 'Sala não encontrada.',
                })
            );
        }

        // Atualizar a sala
        await room.update({
            reserva_ativa,
            privada,
            max_integrantes,
        });

        return res.status(200).json(
            createResponse({
                status: 'Sucesso',
                message: 'Sala atualizada com sucesso!',
                data: room,
            })
        );
    } catch (error) {
        console.error('Erro ao atualizar sala:', error);
        return res.status(500).json(
            createResponse({
                status: 'Erro',
                message: 'Erro ao atualizar sala.',
                errors: [error.message],
            })
        );
    }
};

// Remover uma sala
exports.deleteRoom = async (req, res) => {
    const roomId = req.params.id;

    try {
        const room = await Room.findByPk(roomId);

        if (!room) {
            return res.status(404).json(
                createResponse({
                    status: 'Erro',
                    message: 'Sala não encontrada.',
                })
            );
        }

        // Remover a sala
        await Room.destroy({ where: { id_sala: roomId } });

        return res.status(200).json(
            createResponse({
                status: 'Sucesso',
                message: 'Sala removida com sucesso!',
                data: { id: roomId },
            })
        );
    } catch (error) {
        console.error('Erro ao remover sala:', error);
        return res.status(500).json(
            createResponse({
                status: 'Erro',
                message: 'Erro ao remover sala.',
                errors: [error.message],
            })
        );
    }
};


exports.addMemberToRoom = async (req, res) => {
  const { id_usuario } = req.body; // ID do usuário a ser adicionado
  const { id_sala } = req.params; // ID da sala

  try {
      // Verificar se a sala existe
      const sala = await Room.findByPk(id_sala);
      if (!sala) {
          return res.status(404).json({
              status: 'Erro',
              message: 'Sala não encontrada.',
          });
      }

      // Verificar se o usuário existe
      const user = await User.findByPk(id_usuario);
      if (!user) {
          return res.status(404).json({
              status: 'Erro',
              message: 'Usuário não encontrado.',
          });
      }

      // Adicionar o membro à sala
      await Room.addMembro(user); // Alias `membros` configurado na associação

      // Incrementar a quantidade de integrantes na sala
      sala.qtd_atual_integrantes += 1;
      await sala.save();

      return res.status(200).json({
          status: 'Sucesso',
          message: 'Membro adicionado à sala com sucesso!',
          data: { id_sala, id_usuario },
      });
  } catch (error) {
      console.error('Erro ao adicionar membro à sala:', error);
      return res.status(500).json({
          status: 'Erro',
          message: 'Erro ao adicionar membro à sala.',
          errors: [error.message],
      });
  }
};

exports.removeMemberFromRoom = async (req, res) => {
  const { id_usuario } = req.body; // ID do usuário a ser removido
  const { id_sala } = req.params; // ID da sala

  try {
      // Verificar se a sala existe
      const room = await Room.findByPk(id_sala);
      if (!room) {
          return res.status(404).json(
              createResponse({
                  status: 'Erro',
                  message: 'Sala não encontrada.',
              })
          );
      }

      // Verificar se o usuário existe
      const user = await User.findByPk(id_usuario);
      if (!user) {
          return res.status(404).json(
              createResponse({
                  status: 'Erro',
                  message: 'Usuário não encontrado.',
              })
          );
      }

      // Remover o membro da sala
      await room.removeMember(user);
      room.qtd_atual_integrantes -= 1;
      await room.save();

      return res.status(200).json(
          createResponse({
              status: 'Sucesso',
              message: 'Membro removido da sala com sucesso!',
              data: { id_sala: id_sala, id_usuario: id_usuario },
          })
      );
  } catch (error) {
      console.error('Erro ao remover membro da sala:', error);
      return res.status(500).json(
          createResponse({
              status: 'Erro',
              message: 'Erro ao remover membro da sala.',
              errors: [error.message],
          })
      );
  }
};

exports.getRoomsOfUser = async (req, res) => {
  const { id_usuario } = req.params; // ID do usuário

  try {
      // Buscar as salas do usuário
      const rooms = await Room.findAll({
          include: {
              model: User,
              as: 'members',
              where: { id_usuario: id_usuario }, // Condição para pegar somente as salas do usuário
          },
      });

      if (rooms.length === 0) {
          return res.status(404).json(
              createResponse({
                  status: 'Erro',
                  message: 'Nenhuma sala encontrada para esse usuário.',
              })
          );
      }

      return res.status(200).json(
          createResponse({
              status: 'Sucesso',
              message: 'Salas listadas com sucesso!',
              data: rooms,
          })
      );
  } catch (error) {
      console.error('Erro ao buscar salas do usuário:', error);
      return res.status(500).json(
          createResponse({
              status: 'Erro',
              message: 'Erro ao buscar salas do usuário.',
              errors: [error.message],
          })
      );
  }
};
