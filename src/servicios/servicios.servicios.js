import { prisma } from '../config/prisma.config.js';

export const ServicioServices = {
  getAll: async () => {
    try {
      const servicios = await prisma.servicio.findMany();
      return { message: 'Servicios encontrados', status: 200, data: { servicios, total: servicios.length } };
    } catch (error) {
      console.error(error);
      return { message: 'Error al obtener servicios', status: 500 };
    }
  },

  getById: async (id) => {
    try {
      const servicio = await prisma.servicio.findUnique({ where: { id_servicio: id } });
      if (!servicio) return { message: 'Servicio no encontrado', status: 404, data: {} };
      return { message: 'Servicio encontrado', status: 200, data: { servicio } };
    } catch (error) {
      console.error(error);
      return { message: 'Error al obtener servicio', status: 500 };
    }
  },

  create: async (servicioData) => {
    try {
      const nuevo = await prisma.servicio.create({
        data: {
          nombre_servicio: servicioData.nombre_servicio,
          tipo_servicio: servicioData.tipo_servicio || null,
          precio_base: servicioData.precio_base
        }
      });
      return { message: 'Servicio creado exitosamente', status: 201, data: { servicio: nuevo } };
    } catch (error) {
      console.error(error);
      return { message: 'Error al crear servicio', status: 500 };
    }
  },

  update: async (id, servicioData) => {
    try {
      const actualizado = await prisma.servicio.update({
        where: { id_servicio: id },
        data: servicioData
      });
      return { message: 'Servicio actualizado', status: 200, data: { servicio: actualizado } };
    } catch (error) {
      console.error(error);
      return { message: 'Error al actualizar servicio', status: 500 };
    }
  },

  delete: async (id) => {
    try {
      await prisma.servicio.delete({ where: { id_servicio: id } });
      return { message: 'Servicio eliminado', status: 200 };
    } catch (error) {
      console.error(error);
      return { message: 'Error al eliminar servicio', status: 500 };
    }
  }
};
