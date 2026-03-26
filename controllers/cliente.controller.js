const prisma = require('../db');

module.exports = {
    // GET
    obtenerClientes: async (req, res) => {
        try {
            const clientes = await prisma.cliente.findMany({ include: { carros: true } });
            res.json(clientes);
        } catch (e) { res.status(500).json({ error: e.message }); }
    },
    // POST
    crearCliente: async (req, res) => {
        try {
            const nuevo = await prisma.cliente.create({ data: req.body });
            res.status(201).json(nuevo);
        } catch (e) { res.status(500).json({ error: 'Error al crear cliente' }); }
    },
    // PUT
    actualizarCliente: async (req, res) => {
        try {
            const actualizado = await prisma.cliente.update({
                where: { id_cliente: Number(req.params.id) },
                data: req.body
            });
            res.json(actualizado);
        } catch (e) { res.status(500).json({ error: 'No se pudo actualizar' }); }
    },
    // DELETE
    eliminarCliente: async (req, res) => {
        try {
            await prisma.cliente.delete({ where: { id_cliente: Number(req.params.id) } });
            res.json({ mensaje: 'Cliente eliminado' });
        } catch (e) { res.status(500).json({ error: 'Error al eliminar' }); }
    }
};