const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RoomMember = sequelize.define('RoomMember', {
  id_sala: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'salas', // Nome da tabela de salas
      key: 'id_sala',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'usuarios', // Nome da tabela de usuários
      key: 'id_usuario',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  data_entrada: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  schema: 'joga_junto_schema',
  tableName: 'membros_sala',
  timestamps: false, // Não usaremos createdAt e updatedAt
});

module.exports = RoomMember;
