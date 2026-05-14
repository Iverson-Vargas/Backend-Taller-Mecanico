import { prisma } from '../config/prisma.config.js';

export const InventarioServices = {
  getAll: async () => {
    try {
      const repuestos = await prisma.inventario.findMany();
      return {
        success: true,
        message: 'Inventario obtenido',
        status: 200,
        data: { repuestos, total: repuestos.length }
      };
    } catch (error) {
      console.error(error);
      return { success: false, error: 'Error al obtener inventario', status: 500 };
    }
  },

  getById: async (id) => {
    try {
      const repuesto = await prisma.inventario.findUnique({ where: { id_repuesto: id } });
      if (!repuesto) {
        return { success: false, error: 'Repuesto no encontrado', status: 404 };
      }
      return {
        success: true,
        message: 'Repuesto encontrado',
        status: 200,
        data: { repuesto }
      };
    } catch (error) {
      console.error(error);
      return { success: false, error: 'Error al obtener repuesto', status: 500 };
    }
  },

  create: async (repuestoData) => {
    try {
      const nuevo = await prisma.inventario.create({
        data: {
          codigo_barra: repuestoData.codigo_barra || null,
          descripcion: repuestoData.descripcion,
          stock_actual: repuestoData.stock_actual || 0,
          precio_venta_sugerido: repuestoData.precio_venta_sugerido || 0,
          precio_compra: repuestoData.precio_compra || 0
        }
      });
      return {
        success: true,
        message: 'Repuesto registrado exitosamente',
        status: 201,
        data: { repuesto: nuevo }
      };
    } catch (error) {
      console.error(error);
      if (error.code === 'P2002') {
        return { success: false, error: 'Ya existe un repuesto con ese código de barra', status: 400 };
      }
      return { success: false, error: 'Error al crear repuesto', status: 500 };
    }
  },

  update: async (id, repuestoData) => {
    try {
      const actualizado = await prisma.inventario.update({
        where: { id_repuesto: id },
        data: repuestoData
      });
      return {
        success: true,
        message: 'Repuesto actualizado',
        status: 200,
        data: { repuesto: actualizado }
      };
    } catch (error) {
      console.error(error);
      return { success: false, error: 'Error al actualizar repuesto', status: 500 };
    }
  },

  delete: async (id) => {
    try {
      await prisma.inventario.delete({ where: { id_repuesto: id } });
      return {
        success: true,
        message: 'Repuesto eliminado',
        status: 200,
        data: null
      };
    } catch (error) {
      console.error(error);
      return { success: false, error: 'Error al eliminar repuesto', status: 500 };
    }
  }
};
