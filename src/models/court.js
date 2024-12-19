const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Court = sequelize.define(
    'Court',
    {
        id_quadra: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        id_proprietario: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'usuarios',
                key: 'id_usuario',
            },
        },
        nome: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        tipo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        preco_hora: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        localizacao: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        id_endereco: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'enderecos',
                key: 'id_endereco',
            },
        },
    },
    {
        schema: 'joga_junto_schema',
        tableName: 'quadras',
        timestamps: false,
    }
);

Court.associate = (models) => {
    Court.belongsTo(models.User, {
        foreignKey: 'id_proprietario',
        as: 'owner',
    });

    Court.belongsTo(models.Address, {
        foreignKey: 'id_endereco',
        as: 'address',
    });
};

module.exports = Court;
