const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT,
    logging: console.log
  }
);

sequelize
  .authenticate()
  .then(() => console.log('Conectado ao PostgreSQL com sucesso!'))
  .catch((err) => console.error('Erro ao conectar no PostgreSQL:', err));




module.exports = sequelize;
