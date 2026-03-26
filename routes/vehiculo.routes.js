const express = require('express');
const router = express.Router();
const vehiculoController = require('../controllers/vehiculo.controller');

// Obtener todos los vehículos con sus dueños
router.get('/', vehiculoController.obtenerVehiculos);

// Registrar un nuevo vehículo
router.post('/', vehiculoController.crearVehiculo);

// Actualizar datos de un vehículo por su PLACA
router.put('/:placa', vehiculoController.actualizarVehiculo);

// Eliminar un vehículo por su PLACA
router.delete('/:placa', vehiculoController.eliminarVehiculo);

module.exports = router;