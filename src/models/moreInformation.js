const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const MoreInformation = sequelize.define('MoreInformation', {
    id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },

    documento_oficial: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    data_nascimento: {
        type: DataTypes.DATE,
        allowNull: false,
    },

    cpf: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    schema: 'joga_junto_schema',
    tableName: 'informacoes_adicionais',
    timestamps: false,
});

module.exports = MoreInformation;


