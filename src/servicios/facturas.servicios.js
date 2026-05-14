import { prisma } from '../config/prisma.config.js';

export const FacturaServices = {
  getAll: async () => {
    try {
      const facturas = await prisma.factura.findMany({
        include: {
          orden: { select: { placa_carro: true, diagnostico_inicial: true } }
        },
        orderBy: { fecha_emision: 'desc' }
      });
      return {
        success: true,
        message: 'Facturas encontradas',
        status: 200,
        data: { facturas, total: facturas.length }
      };
    } catch (error) {
      console.error(error);
      return { success: false, error: 'Error al obtener facturas', status: 500 };
    }
  },

  getById: async (id) => {
    try {
      const factura = await prisma.factura.findUnique({
        where: { id_factura: id },
        include: {
          orden: { include: { carro: true, mecanico: true } },
          detalle_factura_repuestos: { include: { repuesto: true } }
        }
      });
      if (!factura) {
        return { success: false, error: 'Factura no encontrada', status: 404 };
      }
      return {
        success: true,
        message: 'Factura encontrada',
        status: 200,
        data: { factura }
      };
    } catch (error) {
      console.error(error);
      return { success: false, error: 'Error al obtener factura', status: 500 };
    }
  },

  create: async (facturaData) => {
    try {
      const { id_orden, monto_total, metodo_pago, subtotal, monto_iva, monto_igtf, tasa_cambio } = facturaData;

      if (!id_orden || monto_total === undefined || monto_total === null) {
        return { success: false, error: 'Faltan datos requeridos (id_orden, monto_total)', status: 400 };
      }

      // Verificar que la orden existe
      const orden = await prisma.ordenServicio.findUnique({ where: { id_orden } });
      if (!orden) {
        return { success: false, error: 'Orden no encontrada', status: 404 };
      }

      // Transacción: crear factura + actualizar estado de la orden
      const [nuevaFactura, ordenActualizada] = await prisma.$transaction([
        prisma.factura.create({
          data: {
            id_orden,
            monto_total,
            subtotal: subtotal || null,
            monto_iva: monto_iva || null,
            monto_igtf: monto_igtf || null,
            tasa_cambio: tasa_cambio || null,
            metodo_pago: metodo_pago || 'Efectivo'
          }
        }),
        prisma.ordenServicio.update({
          where: { id_orden },
          data: { estado: 'facturada' }
        })
      ]);

      return {
        success: true,
        message: 'Factura generada exitosamente',
        status: 201,
        data: { factura: nuevaFactura, orden: ordenActualizada }
      };
    } catch (error) {
      console.error(error);
      if (error.code === 'P2002') {
        return { success: false, error: 'Ya existe una factura para esta orden', status: 400 };
      }
      return { success: false, error: 'Error al crear factura', status: 500 };
    }
  }
};
