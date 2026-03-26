const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /api/clientes/consulta/:cedula
router.get('/consulta/:cedula', async (req, res) => {
    const { cedula } = req.params;

    try {
        const cliente = await prisma.cliente.findFirst({
            where: { cedula_rif: cedula },
            include: {
                carros: {
                    include: {
                        ordenes: {
                            orderBy: { fecha_creacion: 'desc' },
                            take: 1 // Traemos sólo la última orden para reflejar el estado actual
                        }
                    }
                }
            }
        });

        if (!cliente) {
            return res.status(404).json({ error: 'No se encontró un cliente con la cédula proporcionada' });
        }

        // Extraer el primer vehículo y la orden más reciente si existen
        const carrito = cliente.carros[0];
        const ultimaOrden = carrito?.ordenes[0];

        // Formatear estructuradamente la respuesta incluyendo los datos solicitados
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
});

module.exports = router;
