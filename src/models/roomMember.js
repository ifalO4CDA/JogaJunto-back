const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RoomMember = sequelize.define('RoomMember', {
  id_sala: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'salas', // Certifique-se de que esta tabela existe
      key: 'id_sala',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'usuarios', // Certifique-se de que esta tabela existe
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
  timestamps: false, // Não usar createdAt e updatedAt
});

RoomMember.associate = (models) => {
  RoomMember.belongsTo(models.User, {
    foreignKey: 'id_usuario',
    as: 'usuario',
  });
};
module.exports = RoomMember;
