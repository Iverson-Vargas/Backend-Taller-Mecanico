const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

const empleadoRoutes = require('./src/routes/empleados'); 
const nominaRoutes = require('./src/routes/nomina');

app.use(cors());
app.use(express.json());

app.use('/api/empleados', empleadoRoutes);
app.use('/api/nomina', nominaRoutes);

app.get('/api', (req, res) => {
  res.json({ mensaje: '¡Bienvenido a la API del Taller Mecánico!' });
});

// RUTA PARA EL LOGIN CON CREDENCIALES DE PRUEBA
app.post('/api/login', async (req, res) => {
  const { usuario, password } = req.body;

  // --- CREDENCIALES PARA PROBAR ---
  if (usuario === "admin" && password === "12345") {
    console.log("Acceso concedido con usuario de prueba");
    return res.json({ 
      success: true, 
      mensaje: "¡Bienvenido (Prueba)!", 
      empleado: { nombre: "Administrador", cargo: "Jefe" } 
    });
  }

  // --- BÚSQUEDA EN BASE DE DATOS  ---
  try {
    const empleadoEncontrado = await prisma.empleado.findFirst({
      where: {
        usuario: usuario,
        password: password
      }
    });

    if (empleadoEncontrado) {
      res.json({ 
        success: true, 
        mensaje: "¡Bienvenido!", 
        empleado: { nombre: empleadoEncontrado.nombre, cargo: empleadoEncontrado.cargo } 
      });
    } else {
      res.status(401).json({ success: false, mensaje: "Usuario o contraseña incorrectos" });
    }
  } catch (error) {
    console.error("Error de Prisma:", error.message);
    res.status(500).json({ success: false, mensaje: "Error en el servidor" });
  }
});

app.listen(PORT, () => {
  console.log(`==============================================`);
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`==============================================`);
});