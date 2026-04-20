const express = require('express');
const router = express.Router();
const egresosController = require('../controllers/egresos.controller');

// NOTA: No pongas '/api/egresos' aquí, solo la barra '/'
// porque el prefijo ya se pone en el index.js

// Ruta para obtener los datos (GET)
router.get('/', egresosController.getEgresos);

// Ruta para crear un nuevo registro (POST)
router.post('/', egresosController.createEgreso);

// Ruta para pagar (PATCH)
router.patch('/pagar', egresosController.updateEstado);

// Ruta para eliminar (DELETE)
router.delete('/:id', egresosController.deleteEgreso);

// CRÍTICO: Si no exportas esto, el index.js no verá las rutas
module.exports = router;