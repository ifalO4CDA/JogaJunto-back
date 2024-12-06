const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Evaluation = sequelize.define('Avaliacao', {
  id_avaliacao: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_reserva: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'reservas',
      key: 'id_reserva',
    },
  },
  id_quadra: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'quadras',
      key: 'id_quadra',
    },
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'id_usuario',
    },
  },
  nota: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 5,  // A nota deve ser entre 1 e 5
    },
  },
  comentario: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  data_avaliacao: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  schema: 'joga_junto_schema',
  tableName: 'avaliacoes',
  timestamps: false,  // Não estamos usando timestamps
});

module.exports = Evaluation;