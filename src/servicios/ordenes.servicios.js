import { prisma } from '../config/prisma.config.js';

export const OrdenServices = {
  getAll: async () => {
    try {
      const ordenes = await prisma.ordenServicio.findMany({
        include: { carro: true, mecanico: true }
      });
      return { message: 'Órdenes encontradas', status: 200, data: { ordenes, total: ordenes.length } };
    } catch (error) {
      console.error(error);
      return { message: 'Error al obtener órdenes', status: 500 };
    }
  },

  getById: async (id) => {
    try {
      const orden = await prisma.ordenServicio.findUnique({
        where: { id_orden: id },
        include: {
          carro: true,
          mecanico: true,
          detalle_orden_repuestos: { include: { repuesto: true } },
          detalle_orden_servicios: { include: { servicio: true } }
        }
      });
      if (!orden) return { message: 'Orden no encontrada', status: 404, data: {} };
      return { message: 'Orden encontrada', status: 200, data: orden };
    } catch (error) {
      console.error(error);
      return { message: 'Error al obtener detalle de la orden', status: 500 };
    }
  },

  getFinalizadas: async () => {
    try {
      const ordenesFinalizadas = await prisma.ordenServicio.findMany({
        where: { estado: 'finalizada' },
        select: {
          id_orden: true,
          placa_carro: true,
          carro: { select: { marca: true, modelo: true } }
        }
      });
      const respuesta = ordenesFinalizadas.map(orden => ({
        id_orden: orden.id_orden,
        placa_carro: orden.placa_carro,
        descripcion: orden.carro ? `${orden.carro.marca} ${orden.carro.modelo} - ${orden.placa_carro}` : orden.placa_carro
      }));
      return { message: 'Órdenes finalizadas encontradas', status: 200, data: respuesta };
    } catch (error) {
      console.error(error);
      return { message: 'Error al obtener órdenes finalizadas', status: 500 };
    }
  },

  create: async (ordenData) => {
    try {
      const nueva = await prisma.ordenServicio.create({
        data: {
          placa_carro: ordenData.placa_carro,
          id_mecanico: ordenData.id_mecanico || null,
          diagnostico_inicial: ordenData.diagnostico_inicial,
          diagnostico_tecnico: ordenData.diagnostico_tecnico || null,
          estado: ordenData.estado || 'recepcion',
          prioridad: ordenData.prioridad || 'normal'
        }
      });
      return { message: 'Orden creada exitosamente', status: 201, data: { orden: nueva } };
    } catch (error) {
      console.error(error);
      return { message: 'Error al crear orden', status: 500 };
    }
  },

  update: async (id, ordenData) => {
    try {
      const actualizada = await prisma.ordenServicio.update({
        where: { id_orden: id },
        data: ordenData
      });
      return { message: 'Orden actualizada', status: 200, data: { orden: actualizada } };
    } catch (error) {
      console.error(error);
      return { message: 'Error al actualizar orden', status: 500 };
    }
  },

  delete: async (id) => {
    try {
      await prisma.ordenServicio.delete({ where: { id_orden: id } });
      return { message: 'Orden eliminada', status: 200 };
    } catch (error) {
      console.error(error);
      return { message: 'Error al eliminar orden', status: 500 };
    }
  }
};
