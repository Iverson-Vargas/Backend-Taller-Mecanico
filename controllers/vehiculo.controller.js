const prisma = require('../db');

const obtenerVehiculos = async (req, res) => {
    try {
        const vehiculos = await prisma.carro.findMany({ include: { cliente: true } });
        res.json(vehiculos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener vehículos' });
    }
};

const crearVehiculo = async (req, res) => {
    try {
        const nuevo = await prisma.carro.create({ data: req.body });
        res.status(201).json(nuevo);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear vehículo' });
    }
};

const actualizarVehiculo = async (req, res) => {
    try {
        const actualizado = await prisma.carro.update({
            where: { placa: req.params.placa },
            data: req.body
        });
        res.json(actualizado);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar' });
    }
};

const eliminarVehiculo = async (req, res) => {
    try {
        await prisma.carro.delete({ where: { placa: req.params.placa } });
        res.json({ mensaje: 'Vehículo eliminado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar' });
    }
};

module.exports = { obtenerVehiculos, crearVehiculo, actualizarVehiculo, eliminarVehiculo };