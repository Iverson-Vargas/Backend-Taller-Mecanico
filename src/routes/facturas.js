const express = require('express');
const router = express.Router();
const prisma = require('../../db');

// Crear una nueva factura
router.post('/', async (req, res) => {
    console.log('--- POST /api/facturas ---');
    console.log('Body recibido:', req.body);

    const { 
      id_orden, 
      monto_total, 
      metodo_pago,
    } = req.body;

    try {
        // Validación básica
        if (!id_orden || monto_total === undefined || monto_total === null) {
            console.log('Error de validación: faltan id_orden o monto_total', { id_orden, monto_total });
            return res.status(400).json({ error: 'Faltan datos requeridos (id_orden, monto_total)' });
        }

        // Verificamos si la orden existe
        const orden = await prisma.ordenServicio.findUnique({
            where: { id_orden }
        });

        if (!orden) return res.status(404).json({ error: 'Orden no encontrada' });
        
        // Usamos una transacción para asegurar integridad de la BD: 
        // Crear factura y actualizar el estado de la orden a la vez
        const [nuevaFactura, ordenActualizada] = await prisma.$transaction([
            prisma.factura.create({
                data: {
                    id_orden,
                    monto_total,
                    metodo_pago: metodo_pago || 'Efectivo',
                    // fecha_emision se genera sola mediante @default(now()) según el schema
                }
            }),
            prisma.ordenServicio.update({
                where: { id_orden },
                data: {
                    estado: 'facturada' // O 'pagada' dependiendo de la lógica preferida
                }
            })
        ]);

        res.status(201).json({
            mensaje: 'Factura generada exitosamente',
            factura: nuevaFactura,
            orden: ordenActualizada
        });
    } catch (error) {
        console.error('Error al generar factura:', error);
        
        // Manejar el error de clave única en caso de reintentos
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'Ya existe una factura para esta orden de servicio' });
        }
        
        res.status(500).json({ error: 'Error interno del servidor al crear factura' });
    }
});

// Obtener todas las facturas
router.get('/', async (req, res) => {
    try {
        const facturas = await prisma.factura.findMany({
            include: {
                orden: {
                    select: {
                        placa_carro: true,
                        diagnostico_inicial: true
                    }
                }
            },
            orderBy: {
                fecha_emision: 'desc'
            }
        });
        res.json(facturas);
    } catch (error) {
        console.error('Error al obtener facturas:', error);
        res.status(500).json({ error: 'Error al obtener las facturas' });
    }
});

// Obtener una factura especifica por ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const factura = await prisma.factura.findUnique({
            where: { id_factura: parseInt(id) },
            include: {
                orden: {
                    include: {
                        carro: true,
                        mecanico: true
                    }
                },
                detalle_factura_repuestos: {
                    include: {
                        repuesto: true
                    }
                }
            }
        });

        if (!factura) {
            return res.status(404).json({ error: 'Factura no encontrada' });
        }

        res.json(factura);
    } catch (error) {
        console.error('Error al obtener factura:', error);
        res.status(500).json({ error: 'Error al obtener el detalle de la factura' });
    }
});

module.exports = router;
