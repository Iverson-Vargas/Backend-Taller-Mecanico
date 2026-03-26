const express = require('express');
const cors = require('cors');
const clienteRoutes = require('./routes/cliente.routes');
const carroRoutes = require('./routes/vehiculo.routes');
const ordenRoutes = require('./routes/orden.routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rutas con prefijo /api
app.use('/api/clientes', clienteRoutes);
app.use('/api/carros', carroRoutes);
app.use('/api/ordenes', ordenRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en: http://localhost:${PORT}`);
});