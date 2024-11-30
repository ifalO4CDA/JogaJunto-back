require('dotenv').config();
const express = require('express');
const db = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const app = express();
const port = process.env.PORT || 3030;


app.use(express.json());


// Rotas
app.use('/api/users', userRoutes); 


// Inicializa o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
