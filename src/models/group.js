const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Group = sequelize.define(
    'Group',
    {
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
        max_integrantes: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0,
            validate: {
                min: 0,
            },
        },
        qtd_atual_integrantes: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0,
            validate: {
                min: 0,
            },
        },
    },
    {
        schema: 'joga_junto_schema',
        tableName: 'grupos',
        timestamps: false,
    }
);

Group.associate = (models) => {
    Group.belongsTo(models.User, {
        foreignKey: 'id_criador',
        as: 'criador',
    });

    Group.hasMany(models.Room, {
        foreignKey: 'id_grupo',
        as: 'salas',
    });

    Group.belongsToMany(models.User, {
        through: models.MemberGroup,
        foreignKey: 'id_grupo',
        otherKey: 'id_usuario',
        as: 'membros',
    });
};

module.exports = Group;
