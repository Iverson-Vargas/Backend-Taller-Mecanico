const express = require('express');
const cors = require('cors');


// Importación de rutas
const clienteRoutes = require('./routes/cliente.routes');
const carroRoutes = require('./routes/vehiculo.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors()); // Permite peticiones desde tu frontend en React
app.use(express.json()); // Permite recibir datos en formato JSON


//rutas
app.use('/api/clientes', require('./routes/cliente.routes')); 
app.use('/api/carros', carroRoutes);




// Ruta de prueba
app.get('/api', (req, res) => {
  res.json({ mensaje: '¡ API del taller mecánico ' });
});


// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en en puerto http://localhost:${PORT}`);
});