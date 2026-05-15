import { prisma } from '../config/prisma.config.js';

export const NominaServices = {
  getResumen: async () => {
    try {
      const empleados = await prisma.empleado.findMany({ include: { nominas: true } });
      return {
        success: true,
        message: 'Resumen de nómina obtenido',
        status: 200,
        data: { empleados, total: empleados.length }
      };
    } catch (error) {
      console.error(error);
      return { success: false, error: 'Error al obtener resumen de nómina', status: 500 };
    }
  },

  getHistorial: async () => {
    try {
      const historial = await prisma.nomina.findMany({
        include: { empleado: true },
        orderBy: { fecha_pago: 'desc' }
      });
      return {
        success: true,
        message: 'Historial de nómina obtenido',
        status: 200,
        data: { historial, total: historial.length }
      };
    } catch (error) {
      console.error(error);
      return { success: false, error: 'Error al obtener historial de nómina', status: 500 };
    }
  },

  pagar: async (id_empleado, monto_total) => {
    try {
      const pago = await prisma.nomina.create({
        data: {
          id_empleado,
          monto_total: parseFloat(monto_total || 0),
          tipo_pago: 'liquidacion',
          fecha_pago: new Date()
        }
      });
      return { message: 'Pago registrado exitosamente', status: 201, data: { pago } };
    } catch (error) {
      console.error('Error procesando pago:', error);
      return { message: 'Error procesando el pago', status: 500 };
    }
  }
};
