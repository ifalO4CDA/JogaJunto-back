const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MemberGroup = sequelize.define('MemberGroup', {
  id_grupo: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'grupos',
      key: 'id_grupo',
    },
    onDelete: 'CASCADE', // Configurado para corresponder ao DDL
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'usuarios',
      key: 'id_usuario',
    },
    onDelete: 'CASCADE', // Configurado para corresponder ao DDL
  },
  data_entrada: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW, // Valor padrão como no DDL
  },
}, {
  schema: 'joga_junto_schema',
  tableName: 'membros_grupos',
  timestamps: false, // Sem `createdAt` e `updatedAt`
});

module.exports = MemberGroup;