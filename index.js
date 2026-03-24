const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors()); // Permite peticiones desde tu frontend en React
app.use(express.json()); // Permite recibir datos en formato JSON

// Ruta de prueba
app.get('/api', (req, res) => {
  res.json({ mensaje: '¡Bienvenido a la API del Taller Mecánico soy Iverso Vargas!' });
});

// Ejemplo: Ruta para obtener todos los clientes
app.get('/api/clientes', async (req, res) => {
  try {
    const clientes = await prisma.cliente.findMany();
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los clientes' });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});