const prisma = require('../db');

module.exports = {
    // GET (Consulta Frontend)
    consultaEstadoCliente: async (req, res) => {
        const { cedula } = req.params;
        console.log('--- GET /api/clientes/consulta ---');
        console.log(`Recibida la petición para buscar la cédula: "${cedula}"`);

        try {
            const cliente = await prisma.cliente.findFirst({
                where: { cedula_rif: cedula },
                include: {
                    carros: {
                        include: {
                            ordenes: {
                                orderBy: { fecha_creacion: 'desc' },
                                take: 1
                            }
                        }
                    }
                }
            });

            if (!cliente) return res.status(404).json({ error: 'No se encontró un cliente con la cédula proporcionada' });

            const carrito = cliente.carros[0];
            const ultimaOrden = carrito?.ordenes[0];

            const clienteData = {
                "Datos_del_Cliente": {
                    Nombres_Completos: `${cliente.nombre} ${cliente.apellido}`,
                    Documento_de_Identidad: cliente.cedula_rif,
                    Teléfono: cliente.telefono || 'No registrado'
                },
                "Vehículo": carrito ? {
                    Placa: carrito.placa,
                    Automotor: `${carrito.marca || ''} ${carrito.modelo || ''}`.trim() || 'No especificado'
                } : 'No posee vehículos en el sistema',
                "Estado_de_la_Orden": ultimaOrden ? {
                    Nro_de_Orden: `#${ultimaOrden.id_orden}`,
                    Falla_o_Problema: ultimaOrden.diagnostico_inicial || 'No detallado en recepción',
                    Análisis_Técnico: ultimaOrden.diagnostico_tecnico || 'Pendiente por revisión técnica',
                    Estatus_Actual: ultimaOrden.estado.toUpperCase() || 'EN PROCESO',
                    Fecha_de_Ingreso: ultimaOrden.fecha_creacion ? new Date(ultimaOrden.fecha_creacion).toLocaleDateString('es-ES') : 'N/A'
                } : 'No tiene servicios registrados recientemente'
            };

            res.json(clienteData);
        } catch (error) {
            console.error('Error consultando cliente por cédula:', error);
            res.status(500).json({ error: 'Error interno del servidor al consultar el cliente' });
        }
    },
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