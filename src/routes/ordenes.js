const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Obtener todas las órdenes finalizadas (o en el estado pertinente para ser facturadas)
router.get('/finalizadas', async (req, res) => {
    try {
        const ordenesFinalizadas = await prisma.ordenServicio.findMany({
            where: {
                estado: 'finalizada' // Ajustar si el estado exacto es distinto en BD
            },
            select: {
                id_orden: true,
                placa_carro: true,
                carro: {
                    select: {
                        marca: true,
                        modelo: true
                    }
                }
            }
        });
        
        // Mapeamos para enviar "descripcion" combinada si es util, o lo enviamos tal cual
        const respuesta = ordenesFinalizadas.map(orden => ({
            id_orden: orden.id_orden,
            placa_carro: orden.placa_carro,
            descripcion: orden.carro ? `${orden.carro.marca} ${orden.carro.modelo} - ${orden.placa_carro}` : orden.placa_carro
        }));

        res.json(respuesta);
    } catch (error) {
        console.error('Error al obtener órdenes finalizadas:', error);
        res.status(500).json({ error: 'Error al obtener órdenes finalizadas' });
    }
});

// Obtener detalle completo de una orden por ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        const ordenEncontrada = await prisma.ordenServicio.findUnique({
            where: { id_orden: parseInt(id) },
            include: {
                detalle_orden_repuestos: {
                    include: {
                        repuesto: true
                    }
                },
                detalle_orden_servicios: {
                    include: {
                        servicio: true
                    }
                }
            }
        });

        if (!ordenEncontrada) {
            return res.status(404).json({ error: 'Orden no encontrada' });
        }

        // Aunque buscamos por ID, opcionalmente el frontend validaba si estaba finalizada.
        // Lo devolvemos tal cual, el frontend maneja la lógica de visualización.
        res.json(ordenEncontrada);
    } catch (error) {
        console.error('Error al obtener detalle de la orden:', error);
        res.status(500).json({ error: 'Error al obtener detalle de la orden' });
    }
});

module.exports = router;
