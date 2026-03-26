const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/cliente.controller');

router.get('/', clienteController.obtenerClientes);
router.post('/recepcion', clienteController.registrarRecepcion);
router.put('/:id', clienteController.actualizarCliente);   // id del cliente a actualizar
router.delete('/:id', clienteController.eliminarCliente);

module.exports = router;