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
      model: 'usuarios', // Deve corresponder ao nome da tabela "usuarios"
      key: 'id_usuario', // Deve corresponder à chave primária em "usuarios"
    },
  },
  data_criacao: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  max_integrantes: {
    type: DataTypes.INTEGER, // Deve ser INTEGER para corresponder ao DDL
    allowNull: true,
    defaultValue: 0,
    validate: {
      min: 0, // Validação adicional no Sequelize para refletir o CHECK
    },
  },
  qtd_atual_integrantes: {
    type: DataTypes.INTEGER, // Deve ser INTEGER para corresponder ao DDL
    allowNull: true,
    defaultValue: 0,
    validate: {
      min: 0, // Validação adicional no Sequelize para refletir o CHECK
    },
  },
}, {
  schema: 'joga_junto_schema', // Definindo o schema
  tableName: 'grupos', // Nome da tabela conforme o DDL
  timestamps: false, // Sem createdAt e updatedAt
});

// // Associações
// Group.belongsToMany(User, {
//   through: 'membros_grupos' // Usando o nome da tabela intermediária diretamente
//   // foreignKey: 'id_grupo',
//   // otherKey: 'id_usuario',
// });

module.exports = Group;
