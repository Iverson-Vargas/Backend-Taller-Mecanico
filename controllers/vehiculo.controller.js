const prisma = require('../db');

// GET - Listar todos los carros y su dueño
const obtenerVehiculos = async (req, res) => {
    try {
        const vehiculos = await prisma.carro.findMany({
            include: { cliente: true }
        });
        res.status(200).json(vehiculos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener vehículos' });
    }
};

// GET - Buscar un carro  por PLACA
const obtenerPorPlaca = async (req, res) => {
    const { placa } = req.params;
    try {
        const vehiculo = await prisma.carro.findUnique({
            where: { placa: placa },
            include: { cliente: true }
        });
        if (!vehiculo) return res.status(404).json({ mensaje: 'Vehículo no encontrado' });
        res.status(200).json(vehiculo);
    } catch (error) {
        res.status(500).json({ error: 'Error en la búsqueda' });
    }
};

// POST - Agregar un vehículo a un cliente que YA EXISTE
const agregarVehiculo = async (req, res) => {
    const { placa, marca, modelo, ano, kilometraje, id_cliente } = req.body;

    try {
        const nuevoCarro = await prisma.carro.create({
            data: {
                placa,
                marca,
                modelo,
                ano: parseInt(ano),
                kilometraje: parseInt(kilometraje),
                // Conectamos el carro al cliente usando su ID
                cliente: {
                    connect: { id_cliente: parseInt(id_cliente) }
                }
            }
        });
        res.status(201).json(nuevoCarro);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al registrar el vehículo. Verifica que el id_cliente sea correcto.' });
    }
};

// PUT - Actualizar datos del carro
const actualizarVehiculo = async (req, res) => {
    const { id } = req.params;
    const { kilometraje, marca, modelo, placa } = req.body;

    try {
        const actualizado = await prisma.carro.update({
            where: { placa: id }, // Convertimos el ID de la URL a número
            data: { 
                // Usamos validaciones simples para no enviar nulos a la BD
                kilometraje: kilometraje ? parseInt(kilometraje) : undefined,
                marca: marca || undefined,
                modelo: modelo || undefined,
                placa: placa || undefined
            }
        });
        res.status(200).json(actualizado);
    } catch (error) {
        console.error("Error en PUT:", error);
        res.status(500).json({ error: 'No se pudo actualizar. Verifica que el ID exista.' });
    }
};

// DELETE - Eliminar un vehículo
const eliminarVehiculo = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.carro.delete({
            where: { placa : id }
        });
        res.status(200).json({ mensaje: 'Vehículo eliminado correctamente' });
    } catch (error) {
        // El error P2003 en Prisma es cuando hay una llave foránea (órdenes asociadas)
        if (error.code === 'P2003') {
            return res.status(400).json({ 
                error: 'No se puede eliminar el vehículo porque tiene órdenes de servicio registradas.' 
            });
        }
        res.status(500).json({ error: 'Error interno al intentar eliminar.' });
    }
};

module.exports = { 
    obtenerVehiculos, 
    agregarVehiculo, 
    actualizarVehiculo, 
    eliminarVehiculo 
};