const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Room = sequelize.define(
    'Room',
    {
        id_sala: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        reserva_ativa: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        privada: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        id_grupo: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'grupos',
                key: 'id_grupo',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
        },
        id_usuario: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'usuarios',
                key: 'id_usuario',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
        },
        max_integrantes: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        qtd_atual_integrantes: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
    },
    {
        schema: 'joga_junto_schema',
        tableName: 'salas',
        timestamps: false,
    }
);

Room.associate = (models) => {
    Room.belongsTo(models.Group, {
        foreignKey: 'id_grupo',
        as: 'grupo',
    });

    Room.belongsTo(models.User, {
        foreignKey: 'id_usuario',
        as: 'criador',
    });

    Room.belongsToMany(models.User, {
        through: models.RoomMember, // Tabela intermediária
        foreignKey: 'id_sala',
        otherKey: 'id_usuario',
        as: 'membros',
    });
};

module.exports = Room;
