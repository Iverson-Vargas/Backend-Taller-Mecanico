const express = require('express');
const cors = require('cors');


// Importación de rutas
const clienteRoutes = require('./routes/cliente.routes');
const carroRoutes = require('./routes/vehiculo.routes');
const ordenRoutes = require('./routes/orden.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// CORRECCIÓN: Las rutas están dentro de la carpeta 'src' según tu estructura
const empleadoRoutes = require('./src/routes/empleados'); 
const nominaRoutes = require('./src/routes/nomina');
const ordenesRoutes = require('./src/routes/ordenes');
const facturasRoutes = require('./src/routes/facturas');

// Middlewares
app.use(cors()); // Permite peticiones desde tu frontend en React
app.use(express.json()); // Permite recibir datos en formato JSON

<<<<<<< HEAD

//rutas
app.use('/api/clientes', require('./routes/cliente.routes')); 
app.use('/api/carros', carroRoutes);
app.use('/api/ordenes', ordenRoutes);




// Ruta de prueba
app.get('/api', (req, res) => {
  res.json({ mensaje: '¡ API del taller mecánico ' });
=======
// Registro de rutas con el prefijo /api
app.use('/api/empleados', empleadoRoutes);
app.use('/api/nomina', nominaRoutes);

// Registro de rutas para facturación
// El frontend llama a estos endpoints en la raíz
app.use('/api/ordenes', ordenesRoutes);
app.use('/api/facturas', facturasRoutes);

// Ruta de prueba
app.get('/api', (req, res) => {
  res.json({ mensaje: '¡Bienvenido a la API del Taller Mecánico!' });
>>>>>>> desarrollo
});


// Iniciar servidor
app.listen(PORT, () => {
<<<<<<< HEAD
  console.log(`Servidor corriendo en en puerto http://localhost:${PORT}`);
=======
  console.log(`==============================================`);
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Módulo de Nómina y Empleados: LISTO`);
  console.log(`==============================================`);
>>>>>>> desarrollo
});