const express = require('express');
const router = express.Router();
const ordenController = require('../controllers/orden.controller');

router.get('/', ordenController.obtenerOrdenes);
router.post('/', ordenController.crearOrden);
router.put('/:id', ordenController.actualizarOrden);
router.delete('/:id', ordenController.eliminarOrden);

module.exports = router;