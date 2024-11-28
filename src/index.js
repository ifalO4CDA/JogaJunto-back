require('dotenv').config();
const express = require('express');
const db = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const User = require('./models/user');
const app = express();
const port = process.env.PORT || 3030;


app.use(express.json());

// Testa a conexão com o banco na inicialização
db.authenticate()
  .then(() => console.log('Banco conectado com sucesso!'))
  .catch((err) => console.error('Erro ao conectar ao banco:', err));

// Rotas
app.use('/api/users', userRoutes); 

// Sincronizar o banco de dados
db.sync({ force: false })
  .then(() => console.log('Banco sincronizado!'))
  .catch((err) => console.error('Erro ao sincronizar o banco:', err));

// Inicializa o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
