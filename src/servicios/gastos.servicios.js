import { prisma } from '../config/prisma.config.js';

export const GastoServices = {
  getAll: async () => {
    try {
      const gastos = await prisma.gasto.findMany({
        include: { usuario: { select: { nombre: true, apellido: true } } },
        orderBy: { fecha: 'desc' }
      });
      return { message: 'Gastos encontrados', status: 200, data: { gastos, total: gastos.length } };
    } catch (error) {
      console.error(error);
      return { message: 'Error al obtener gastos', status: 500 };
    }
  },

  getById: async (id) => {
    try {
      const gasto = await prisma.gasto.findUnique({ where: { id_gasto: id } });
      if (!gasto) return { message: 'Gasto no encontrado', status: 404, data: {} };
      return { message: 'Gasto encontrado', status: 200, data: { gasto } };
    } catch (error) {
      console.error(error);
      return { message: 'Error al obtener gasto', status: 500 };
    }
  },

  create: async (gastoData) => {
    try {
      const nuevo = await prisma.gasto.create({
        data: {
          descripcion: gastoData.descripcion,
          monto: gastoData.monto,
          categoria: gastoData.categoria || null,
          registrado_por_usuario: gastoData.registrado_por_usuario || null
        }
      });
      return { message: 'Gasto registrado exitosamente', status: 201, data: { gasto: nuevo } };
    } catch (error) {
      console.error(error);
      return { message: 'Error al registrar gasto', status: 500 };
    }
  },

  update: async (id, gastoData) => {
    try {
      const actualizado = await prisma.gasto.update({ where: { id_gasto: id }, data: gastoData });
      return { message: 'Gasto actualizado', status: 200, data: { gasto: actualizado } };
    } catch (error) {
      console.error(error);
      return { message: 'Error al actualizar gasto', status: 500 };
    }
  },

  delete: async (id) => {
    try {
      await prisma.gasto.delete({ where: { id_gasto: id } });
      return { message: 'Gasto eliminado', status: 200 };
    } catch (error) {
      console.error(error);
      return { message: 'Error al eliminar gasto', status: 500 };
    }
  }
};
