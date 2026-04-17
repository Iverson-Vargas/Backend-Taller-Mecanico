const express = require('express');
const router = express.Router();
const ordenController = require('../controllers/orden.controller');

// Obtener órdenes finalizadas (React Frontend Facturación)
router.get('/finalizadas', ordenController.obtenerOrdenesFinalizadas);

// Listar todas las órdenes de servicio
router.get('/', ordenController.obtenerOrdenes);

// Obtener detalle completo de una orden por ID
// IMPORTANTE: /:id debe ir DESPUÉS de /finalizadas
router.get('/:id', ordenController.obtenerDetalleOrden);

// Crear una nueva orden (recepción)
router.post('/', ordenController.crearOrden);

// Actualizar estado o datos de una orden por ID
router.put('/:id', ordenController.actualizarOrden);

// Eliminar una orden por ID
router.delete('/:id', ordenController.eliminarOrden);

module.exports = router;