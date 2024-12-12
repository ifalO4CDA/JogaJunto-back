const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Reservation = sequelize.define("Reservas", {
  id_reserva: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_quadra: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  data_reserva: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  horario_inicio: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  horario_fim: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "pendente",
  },
  valor_total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  motivo_cancelamento: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  id_sala: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
},{
  tableName: "reservas",
  schema: "joga_junto_schema",
  timestamps: false,
});

module.exports = Reservation;
