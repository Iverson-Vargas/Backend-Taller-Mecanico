const express = require('express');
const cors = require('cors');

// Importaciones de rutas recientes (rama desarrollo - HEAD)
const clienteRoutes = require('./routes/cliente.routes');
const carroRoutes = require('./routes/vehiculo.routes');
const ordenRoutes = require('./routes/orden.routes');

// Importaciones de módulos de la rama (rama Daviana)
const empleadoRoutes = require('./src/routes/empleados'); 
const nominaRoutes = require('./src/routes/nomina');
const ordenesRoutes = require('./src/routes/ordenes');
const facturasRoutes = require('./src/routes/facturas');
const authRoutes = require('./src/routes/usuarios');
const clientesRoutes = require('./src/routes/clientes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ===================================
// REGISTRO DE RUTAS MEZCLADO (MERGED)
// ===================================

// Aseguramos montar primero las relativas al login y consultas específicas de Daviana
app.use('/api/clientes', clientesRoutes); // Consulta de estado (frontend)
app.use('/api/ordenes', ordenesRoutes);   // Consulta para facturación (frontend)
app.use('/api/facturas', facturasRoutes);
app.use('/api/auth', authRoutes);

app.use('/api/empleados', empleadoRoutes);
app.use('/api/nomina', nominaRoutes);

// Montamos las rutas de negocio CRUD del equipo de desarrollo posteriormente
app.use('/api/clientes', clienteRoutes);
app.use('/api/carros', carroRoutes);
app.use('/api/ordenes', ordenRoutes);

// Ruta de prueba general
app.get('/api', (req, res) => {
  res.json({ mensaje: '¡Bienvenido a la API del Taller Mecánico!' });
});

app.listen(PORT, () => {
  console.log(`==============================================`);
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`==============================================`);
});