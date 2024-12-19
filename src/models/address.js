const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Address = sequelize.define('Endereco', {
  id_endereco: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  logradouro: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  numero: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  complemento: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  bairro: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cidade: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  estado: {
    type: DataTypes.STRING(2),
    allowNull: false,
    validate: {
      len: [2, 2], // Deve ter exatamente 2 caracteres (ex.: SP, RJ)
    },
  },
  cep: {
    type: DataTypes.STRING(8),
    allowNull: false,
    validate: {
      len: [8, 8], // Deve ter exatamente 8 caracteres (ex.: 12345678)
    },
  },
}, {
  schema: 'joga_junto_schema',
  tableName: 'enderecos',
  timestamps: false, // Não estamos usando createdAt e updatedAt
});

Address.associate = (models) => {
  Address.hasOne(models.User, {
    foreignKey: 'id_endereco',
    as: 'usuario', // Alias para o lado inverso da relação
  });


  Address.hasMany(models.Court, {
    foreignKey: 'id_endereco',
    as: 'quadras', // Relacionamento com quadras
  });
};


module.exports = Address;
