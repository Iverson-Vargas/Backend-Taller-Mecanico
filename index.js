const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

const empleadoRoutes = require('./src/routes/empleados'); 
const nominaRoutes = require('./src/routes/nomina');
const ordenesRoutes = require('./src/routes/ordenes');
const facturasRoutes = require('./src/routes/facturas');
const authRoutes = require('./src/routes/usuarios');
const clientesRoutes = require('./src/routes/clientes');

app.use(cors());
app.use(express.json());

app.use('/api/empleados', empleadoRoutes);
app.use('/api/nomina', nominaRoutes);
app.use('/api/clientes', clientesRoutes);

// Registro de rutas para facturación
// El frontend llama a estos endpoints en la raíz
app.use('/api/ordenes', ordenesRoutes);
app.use('/api/facturas', facturasRoutes);

// Ruta de prueba
app.get('/api', (req, res) => {
  res.json({ mensaje: '¡Bienvenido a la API del Taller Mecánico!' });
});

// Registrar rutas de Autenticación
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`==============================================`);
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`==============================================`);
});