const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 1. Obtener todos los empleados y sus comisiones (Para tu reporte de Admin)
router.get('/resumen', async (req, res) => {
  try {
    const empleados = await prisma.empleado.findMany({
      include: {
        nominas: true // Trae el historial de pagos de cada uno
      }
    });
    res.json(empleados);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener resumen de nómina' });
  }
});

// 2. Ver solo los registros de la tabla nomina
router.get('/historial', async (req, res) => {
  try {
    const historial = await prisma.nomina.findMany({
      include: { empleado: true }
    });
    res.json(historial);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener historial' });
  }
});

module.exports = router;