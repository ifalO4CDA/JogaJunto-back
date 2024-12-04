const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Group = sequelize.define("Group", {
  id_grupo: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  id_criador: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios', // Supondo que a tabela de usuários tenha um nome 'usuarios'
      key: 'id_usuario',
    },
  },
  data_criacao: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW, // Data de criação será a data atual por padrão
  }
}, {
  tableName: "grupos",
  schema: "joga_junto_schema",
  timestamps: false, // Caso você não queira campos de timestamp automáticos
});

module.exports = Group;
