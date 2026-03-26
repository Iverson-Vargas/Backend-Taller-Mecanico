const express = require('express');
const router = express.Router();

const vehiculoController = require('../controllers/vehiculo.controller'); 

router.get('/', vehiculoController.obtenerVehiculos);
router.post('/', vehiculoController.agregarVehiculo);
router.put('/:id', vehiculoController.actualizarVehiculo);
router.delete('/:id', vehiculoController.eliminarVehiculo);

module.exports = router;