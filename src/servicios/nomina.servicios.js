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
  }
};
