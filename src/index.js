require('dotenv').config();
const express = require('express');

const userRoutes = require('./routes/userRoutes');
const addressRoutes = require('./routes/addressRoutes');
const moreInformationsRoutes = require('./routes/moreInformationsRoutes');

const reservationRoutes = require('./routes/reservationRoutes');
const groupRoutes = require('./routes/groupRoutes');
const evaluationRoutes = require('./routes/evaluationRoutes');
const courtRoutes = require('./routes/courtRoutes');
const app = express();
const port = process.env.PORT || 3030;
const cors = require('cors');

const sequelize = require('./config/database'); // Importa a instância do Sequelize
app.use(express.json());
app.use(cors());

// Rotas
app.use('/api/users', userRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/moreInformations', moreInformationsRoutes);
app.use('/api/reservation', reservationRoutes);
app.use('/api/group', groupRoutes);
app.use('/api/evaluation', evaluationRoutes);
app.use('/api/rooms/', require('./routes/roomRoutes'));
app.use('/api/courts', courtRoutes);

// Inicializa o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

// sequelize.sync({ alter: true })
//   .then(() => console.log('Modelos sincronizados com sucesso!'))
//   .catch((error) => console.error('Erro ao sincronizar modelos:', error));