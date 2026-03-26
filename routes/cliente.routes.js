const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/cliente.controller');

// Consulta específica de estado (React Frontend)
router.get('/consulta/:cedula', clienteController.consultaEstadoCliente);

// Obtener todos los clientes
router.get('/', clienteController.obtenerClientes);

// Crear un nuevo cliente
router.post('/', clienteController.crearCliente);

// Actualizar datos de un cliente por ID
router.put('/:id', clienteController.actualizarCliente);

// Eliminar un cliente por ID
router.delete('/:id', clienteController.eliminarCliente);

module.exports = router;