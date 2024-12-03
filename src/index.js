require('dotenv').config();
const express = require('express');
const db = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const app = express();
const port = process.env.PORT || 3030;


app.use(express.json());


// Rotas
app.use('/api/users', userRoutes); 
app.use('/api/reservation', reservationRoutes);


// Inicializa o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
