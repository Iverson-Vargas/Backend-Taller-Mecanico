const prisma = require('../db');

// GET - Listar todas las órdenes con sus datos relacionados
const obtenerOrdenes = async (req, res) => {
    try {
        const ordenes = await prisma.ordenServicio.findMany({
            include: {
                cliente: true,
                carro: true,
                mecanico: true
            }
        });
        res.status(200).json(ordenes);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las órdenes' });
    }
};

// POST - Crear una nueva orden
const crearOrden = async (req, res) => {
    const { fecha_emision, placa_carro, id_cliente, id_mecanico, total_estimado, estado } = req.body;

    try {
        const nuevaOrden = await prisma.ordenServicio.create({
            data: {
                fecha_emision: new Date(fecha_emision), 
                placa_carro: placa_carro, 
                id_cliente: parseInt(id_cliente),
                id_mecanico: id_mecanico ? parseInt(id_mecanico) : null,
                total_estimado: parseFloat(total_estimado) || 0,
                estado: estado || 'Pendiente'
            }
        });
        res.status(201).json(nuevaOrden);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear la orden. Verifica que la placa y el cliente existan.' });
    }
};

// PUT - Actualizar orden por su ID
const actualizarOrden = async (req, res) => {
    const { id } = req.params; 
    const { estado, total_estimado, id_mecanico } = req.body;

    try {
        const actualizada = await prisma.ordenServicio.update({
            where: { id_orden: Number(id) }, 
            data: {
                estado: estado || undefined,
                total_estimado: total_estimado ? parseFloat(total_estimado) : undefined,
                id_mecanico: id_mecanico ? parseInt(id_mecanico) : undefined
            }
        });
        res.status(200).json(actualizada);
    } catch (error) {
        res.status(500).json({ error: 'No se pudo actualizar la orden. Verifica el ID.' });
    }
};

// DELETE - Eliminar una orden
const eliminarOrden = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.ordenServicio.delete({
            where: { id_orden: Number(id) }
        });
        res.status(200).json({ mensaje: 'Orden eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la orden.' });
    }
};

module.exports = { obtenerOrdenes, crearOrden, actualizarOrden, eliminarOrden };