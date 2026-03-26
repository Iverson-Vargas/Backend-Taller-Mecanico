const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
app.use(cors());
app.use(express.json());
const prisma = new PrismaClient();

// Función para manejar inventario
const inventarioController = {
    listar: async (req, res) => {
        try {
            const repuestos = await prisma.inventario.findMany();
            res.json(repuestos);
        } catch (error) {
            res.status(500).json({ error: "Error al obtener inventario" });
        }
    },
    crear: async (req, res) => {
        try {
            const { codigo_barra, descripcion, stock_actual, precio_venta_sugerido } = req.body;
            const nuevo = await prisma.inventario.create({
                data: {
                    codigo_barra,
                    descripcion,
                    stock_actual: parseInt(stock_actual),
                    precio_venta_sugerido: parseFloat(precio_venta_sugerido)
                }
            });
            res.json({ mensaje: "Repuesto guardado!", data: nuevo });
        } catch (error) {
            res.status(500).json({ error: "Error al guardar" });
        }
    }
};
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

// -- Endpoints de Inventario ---
// Ruta para obtener todos los repuestos (GET)
app.get('/api/inventario', async (req, res) => {
    try {
        const repuestos = await prisma.inventario.findMany();
        res.json(repuestos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener inventario' });
    }
});

// Ruta para crear un repuesto (POST) - 
app.post('/api/inventario', async (req, res) => {
    try {
        const nuevo = await prisma.inventario.create({
            data: req.body
        });
        res.json(nuevo);
    } catch (error) {
        res.status(500).json({ error: 'Error al guardar' });
    }
});


// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});