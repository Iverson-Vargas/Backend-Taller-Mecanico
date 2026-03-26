const prisma = require('../db');

// GET - Listar todos
const obtenerClientes = async (req, res) => {
    try {
        const clientes = await prisma.cliente.findMany({ include: { carros: true } });
        res.status(200).json(clientes);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener clientes' });
    }
};

// POST - Crear 
const registrarRecepcion = async (req, res) => {
    const { cedula_rif, nombre, apellido, telefono, direccion, placa, marca, modelo, ano, kilometraje } = req.body;
    try {
        const resultado = await prisma.cliente.create({
            data: {
                cedula_rif, nombre, apellido, telefono, direccion,
                carros: { create: { placa, marca, modelo, ano: parseInt(ano), kilometraje: parseInt(kilometraje) } }
            },
            include: { carros: true }
        });
        res.status(201).json(resultado);
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar' });
    }
};

// PUT - Actualizar datos del cliente
const actualizarCliente = async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, telefono, direccion } = req.body;
    try {
        const clienteActualizado = await prisma.cliente.update({
            where: { id_cliente: parseInt(id) },
            data: { nombre, apellido, telefono, direccion }
        });
        res.status(200).json(clienteActualizado);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar cliente' });
    }
};

// DELETE - Borrar cliente
const eliminarCliente = async (req, res) => {
    const { id } = req.params;
    const idCliente = parseInt(id);

    try {
        // 1.  eliminar todos los carros asociados a ese cliente
        await prisma.carro.deleteMany({
            where: { id_cliente: idCliente }
        });

        // 2. eliminar al cliente
        await prisma.cliente.delete({
            where: { id_cliente: idCliente }
        });

        res.status(200).json({ mensaje: 'Cliente y sus vehículos eliminados correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar: Verifica si el cliente tiene órdenes de servicio activas' });
    }
};

module.exports = { obtenerClientes, registrarRecepcion, actualizarCliente, eliminarCliente };