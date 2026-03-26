const prisma = require('../db');

// GET - Listar todas las órdenes
const obtenerOrdenes = async (req, res) => {
    try {
        const ordenes = await prisma.ordenServicio.findMany({
            include: {
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
    const { 
        placa_carro, 
        id_mecanico, 
        diagnostico_inicial, 
        estado 
    } = req.body;

    try {
        const nuevaOrden = await prisma.ordenServicio.create({
            data: {
                placa_carro: placa_carro,
                id_mecanico: id_mecanico || null,
                diagnostico_inicial: diagnostico_inicial,
                estado: estado || "recepcion"
          
            }
        });
        res.status(201).json(nuevaOrden);
    } catch (error) {
        console.error("ERROR AL CREAR:", error);
        res.status(500).json({ 
            error: 'No se pudo crear la orden.',
            detalle: error.message 
        });
    }
};

// PUT - Actualizar orden
const actualizarOrden = async (req, res) => {
    const { id } = req.params;
    try {
        const actualizada = await prisma.ordenServicio.update({
            where: { id_orden: Number(id) },
            data: req.body
        });
        res.status(200).json(actualizada);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar' });
    }
};

// DELETE - Eliminar orden
const eliminarOrden = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.ordenServicio.delete({
            where: { id_orden: Number(id) }
        });
        res.status(200).json({ mensaje: 'Orden eliminada' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar' });
    }
};

module.exports = { 
    obtenerOrdenes, 
    crearOrden, 
    actualizarOrden, 
    eliminarOrden 
};