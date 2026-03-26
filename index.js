const express = require('express');
const cors = require('cors');


const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors()); // Permite peticiones desde tu frontend en React
app.use(express.json()); // Permite recibir datos en formato JSON

// Ruta de prueba
app.get('/api', (req, res) => {
  res.json({ mensaje: '¡ API del taller mecánico ' });
});


// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en en puerto ${PORT}`);
});