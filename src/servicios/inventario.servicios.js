import { prisma } from '../config/prisma.config.js';

export const InventarioServices = {
  getAll: async () => {
    try {
      const repuestos = await prisma.inventario.findMany();
      return { message: 'Inventario obtenido', status: 200, data: { repuestos, total: repuestos.length } };
    } catch (error) {
      console.error(error);
      return { message: 'Error al obtener inventario', status: 500 };
    }
  },

  getById: async (id) => {
    try {
      const repuesto = await prisma.inventario.findUnique({ where: { id_repuesto: id } });
      if (!repuesto) return { message: 'Repuesto no encontrado', status: 404, data: {} };
      return { message: 'Repuesto encontrado', status: 200, data: { repuesto } };
    } catch (error) {
      console.error(error);
      return { message: 'Error al obtener repuesto', status: 500 };
    }
  },

  create: async (repuestoData) => {
    try {
      const nuevo = await prisma.inventario.create({
        data: {
          codigo_barra: repuestoData.codigo_barra || null,
          descripcion: repuestoData.descripcion,
          stock_actual: repuestoData.stock_actual || 0,
          precio_venta_sugerido: repuestoData.precio_venta_sugerido || 0
        }
      });
      return { message: 'Repuesto registrado exitosamente', status: 201, data: { repuesto: nuevo } };
    } catch (error) {
      console.error(error);
      if (error.code === 'P2002') {
        return { message: 'Ya existe un repuesto con ese código de barra', status: 400 };
      }
      return { message: 'Error al crear repuesto', status: 500 };
    }
  },

  update: async (id, repuestoData) => {
    try {
      const actualizado = await prisma.inventario.update({
        where: { id_repuesto: id },
        data: repuestoData
      });
      return { message: 'Repuesto actualizado', status: 200, data: { repuesto: actualizado } };
    } catch (error) {
      console.error(error);
      return { message: 'Error al actualizar repuesto', status: 500 };
    }
  },

  delete: async (id) => {
    try {
      await prisma.inventario.delete({ where: { id_repuesto: id } });
      return { message: 'Repuesto eliminado', status: 200 };
    } catch (error) {
      console.error(error);
      return { message: 'Error al eliminar repuesto', status: 500 };
    }
  }
};
