const express = require('express');
const db = require('./config/database');

const app = express();
const port = 3030;

// Testa a conexão com o banco
db.authenticate()
  .then(() => console.log('Banco conectado com sucesso'))
  .catch(err => console.error('Erro ao conectar ao banco:', err));

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
