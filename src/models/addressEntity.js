const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AddressEntity = sequelize.define('AddressEntity', {
  id_endereco: {
    type: DataTypes.INTEGER,
    references: {
      model: 'enderecos',
      key: 'id_endereco',
    },
    allowNull: false,
  },
  entidade: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['usuario', 'quadra']],
    },
  },
  id_entidade: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  schema: 'joga_junto_schema',
  tableName: 'enderecos_entidades',
  timestamps: false,
});

module.exports = AddressEntity;
