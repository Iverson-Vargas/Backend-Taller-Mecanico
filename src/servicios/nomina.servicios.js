import { prisma } from '../config/prisma.config.js';

export const NominaServices = {
  getResumen: async () => {
    try {
      const empleados = await prisma.empleado.findMany({ include: { nominas: true } });
      return { message: 'Resumen de nómina obtenido', status: 200, data: { empleados } };
    } catch (error) {
      console.error(error);
      return { message: 'Error al obtener resumen de nómina', status: 500 };
    }
  },

  getHistorial: async () => {
    try {
      const historial = await prisma.nomina.findMany({
        include: { empleado: true },
        orderBy: { fecha_pago: 'desc' }
      });
      return { message: 'Historial de nómina obtenido', status: 200, data: { historial } };
    } catch (error) {
      console.error(error);
      return { message: 'Error al obtener historial', status: 500 };
    }
  }
};
