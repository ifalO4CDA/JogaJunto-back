const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('../models/user');  // Certifique-se de que o caminho está correto

const Group = sequelize.define('Group', {
  id_grupo: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome_grupo: {
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
  },
}, {
  schema: 'joga_junto_schema',
  tableName: 'grupos',
  timestamps: false,
});

// Associações
Group.belongsToMany(User, {
  through: 'membros_grupos' // Usando o nome da tabela intermediária diretamente
  // foreignKey: 'id_grupo',
  // otherKey: 'id_usuario',
});

module.exports = Group;
