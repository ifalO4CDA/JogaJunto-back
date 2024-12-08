const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Group = require('../models/group');  // Certifique-se de que o caminho está correto
const Address = require('../models/address');

const User = sequelize.define('User', {
  id_usuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sobrenome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  numero_celular: {
    type: DataTypes.STRING,
  },
  data_cadastro: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  foto_perfil: {
    type: DataTypes.STRING,
  },
}, {
  schema: 'joga_junto_schema',
  tableName: 'usuarios',
  timestamps: false,
});


module.exports = User;
