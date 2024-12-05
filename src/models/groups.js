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
      model: 'usuarios',
      key: 'id_usuario',
    },
  },
  data_criacao: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  }
}, {
  tableName: "grupos",
  schema: "joga_junto_schema",
  timestamps: false,
});

module.exports = Group;
