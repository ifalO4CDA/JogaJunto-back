const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Reservation = sequelize.define(
  'Reservation',
  {
      id_reserva: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
      },
      id_quadra: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
              model: 'quadras',
              key: 'id_quadra',
          },
      },
      id_sala: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
              model: 'salas',
              key: 'id_sala',
          },
      },
      data_reserva: {
          type: DataTypes.DATE,
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
          defaultValue: 'pendente',
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
  },
  {
      schema: 'joga_junto_schema',
      tableName: 'reservas',
      timestamps: false,
  }
);

Reservation.associate = (models) => {
  Reservation.belongsTo(models.Room, {
      foreignKey: 'id_sala',
      as: 'sala',
  });

  Reservation.belongsTo(models.Court, {
      foreignKey: 'id_quadra',
      as: 'quadra',
  });
};

module.exports = Reservation;
