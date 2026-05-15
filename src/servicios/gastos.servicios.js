import { prisma } from '../config/prisma.config.js';

export const GastoServices = {
  getAll: async () => {
    try {
      const gastos = await prisma.gasto.findMany({
        include: { usuario: { select: { nombre: true, apellido: true } } },
        orderBy: { fecha: 'desc' }
      });
      return {
        success: true,
        message: 'Gastos encontrados',
        status: 200,
        data: { gastos, total: gastos.length }
      };
    } catch (error) {
      console.error(error);
      return { success: false, error: 'Error al obtener gastos', status: 500 };
    }
  },

  getById: async (id) => {
    try {
      const gasto = await prisma.gasto.findUnique({ where: { id_gasto: id } });
      if (!gasto) {
        return { success: false, error: 'Gasto no encontrado', status: 404 };
      }
      return {
        success: true,
        message: 'Gasto encontrado',
        status: 200,
        data: { gasto }
      };
    } catch (error) {
      console.error(error);
      return { success: false, error: 'Error al obtener gasto', status: 500 };
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
      return {
        success: true,
        message: 'Gasto registrado exitosamente',
        status: 201,
        data: { gasto: nuevo }
      };
    } catch (error) {
      console.error(error);
      return { success: false, error: 'Error al registrar gasto', status: 500 };
    }
  },

  update: async (id, gastoData) => {
    try {
      const actualizado = await prisma.gasto.update({ where: { id_gasto: id }, data: gastoData });
      return {
        success: true,
        message: 'Gasto actualizado',
        status: 200,
        data: { gasto: actualizado }
      };
    } catch (error) {
      console.error(error);
      return { success: false, error: 'Error al actualizar gasto', status: 500 };
    }
  },

  delete: async (id) => {
    try {
      await prisma.gasto.delete({ where: { id_gasto: id } });
      return {
        success: true,
        message: 'Gasto eliminado',
        status: 200,
        data: null
      };
    } catch (error) {
      console.error(error);
      return { success: false, error: 'Error al eliminar gasto', status: 500 };
    }
  }
};
