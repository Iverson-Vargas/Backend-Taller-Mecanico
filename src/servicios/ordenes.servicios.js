import { prisma } from '../config/prisma.config.js';

export const OrdenServices = {
  getFinalizadas: async () => {
    try {
      const ordenes = await prisma.ordenServicio.findMany({
        where: { estado: 'finalizada' },
        include: { carro: { include: { cliente: true } } }
      });
      return { message: 'Órdenes finalizadas obtenidas', status: 200, data: ordenes };
    } catch (error) {
      return { message: 'Error al obtener órdenes finalizadas', status: 500 };
    }
  },

  getAll: async () => {
    try {
      const ordenes = await prisma.ordenServicio.findMany({
        include: { carro: { include: { cliente: true } }, mecanico: true }
      });
      return { message: 'Órdenes obtenidas', status: 200, data: ordenes };
    } catch (error) {
      return { message: 'Error al obtener órdenes', status: 500 };
    }
  },

  getOne: async (id) => {
    try {
      const orden = await prisma.ordenServicio.findUnique({
        where: { id_orden: Number(id) },
        include: { carro: { include: { cliente: true } }, mecanico: true, detalles_repuestos: true, detalles_servicios: true }
      });
      if (!orden) return { message: 'Orden no encontrada', status: 404 };
      return { message: 'Orden obtenida', status: 200, data: orden };
    } catch (error) {
      return { message: 'Error al obtener orden', status: 500 };
    }
  },

  create: async (data) => {
    try {
      const nueva = await prisma.ordenServicio.create({
        data: {
          placa_carro: data.placa_carro,
          id_mecanico: data.id_mecanico || null,
          motivo_visita: data.motivo_visita || data.diagnostico_inicial,
          falla_declarada: data.falla_declarada,
          tiene_caucho: Boolean(data.tiene_caucho),
          tiene_radio: Boolean(data.tiene_radio),
          tiene_rayones: Boolean(data.tiene_rayones),
          observaciones: data.observaciones,
          estado: data.estado || 'recepcion'
        }
      });
      return { message: 'Orden creada', status: 201, data: nueva };
    } catch (error) {
      console.error("Error en orden:", error);
      return { message: 'Error al crear orden', status: 500 };
    }
  },

  update: async (id, data) => {
    try {
      const orden = await prisma.ordenServicio.update({
        where: { id_orden: Number(id) },
        data
      });
      return { message: 'Orden actualizada', status: 200, data: orden };
    } catch (error) {
      return { message: 'Error al actualizar orden', status: 500 };
    }
  },

  delete: async (id) => {
    try {
      await prisma.ordenServicio.delete({ where: { id_orden: Number(id) } });
      return { message: 'Orden eliminada', status: 200 };
    } catch (error) {
      return { message: 'Error al eliminar orden', status: 500 };
    }
  }
};