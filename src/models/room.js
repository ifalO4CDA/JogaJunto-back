const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Room = sequelize.define('Room', {
  id_sala: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  reserva_ativa: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  privada: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  max_integrantes: {
    type: DataTypes.INTEGER,
    defaultValue: 10,
    validate: {
      min: 1, // Mínimo de 1 integrante
    },
  },
  qtd_atual_integrantes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0, // Não pode ser negativo
    },
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'usuarios',
      key: 'id_usuario',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  },
  id_grupo: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'grupos',
      key: 'id_grupo',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  },
}, {
  schema: 'joga_junto_schema',
  tableName: 'salas',
  timestamps: false,
});

Room.associate = (models) => {
  Room.belongsTo(models.User, {
    foreignKey: 'id_usuario',
    as: 'creator',
  });

  Room.belongsTo(models.Group, {
    foreignKey: 'id_grupo',
    as: 'group',
  });
  Room.belongsToMany(models.User, { through: models.RoomMember, foreignKey: 'id_sala', as: 'membros' });
};



module.exports = Room;
