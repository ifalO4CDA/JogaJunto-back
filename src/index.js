require('dotenv').config();
const express = require('express');

const userRoutes = require('./routes/userRoutes');
const addressRoutes = require('./routes/addressRoutes');
const moreInformationsRoutes = require('./routes/moreInformationsRoutes');

const app = express();
const port = process.env.PORT || 3030;


app.use(express.json());


// Rotas
app.use('/api/users', userRoutes); 
app.use('/api/addresses', addressRoutes);
app.use('/api/moreInformations', moreInformationsRoutes);

// Inicializa o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
