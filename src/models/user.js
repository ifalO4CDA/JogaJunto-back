const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

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
  id_endereco: {
    type: DataTypes.INTEGER,
    allowNull: true, // Um usuário pode ou não ter um endereço associado
    references: {
      model: 'enderecos', // Nome da tabela de endereços
      key: 'id_endereco',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  },
}, {
  schema: 'joga_junto_schema',
  tableName: 'usuarios',
  timestamps: false,
});

User.associate = (models) => {
  User.belongsTo(models.Address, {
    foreignKey: 'id_endereco',
    as: 'endereco', // Alias utilizado na busca
  });
};



// Exportar o modelo
module.exports = User;
