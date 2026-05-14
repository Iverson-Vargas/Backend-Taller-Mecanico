import { prisma } from '../config/prisma.config.js';

export const ServicioServices = {
  getAll: async () => {
    try {
      const servicios = await prisma.servicio.findMany();
      return {
        success: true,
        message: 'Servicios encontrados',
        status: 200,
        data: { servicios, total: servicios.length }
      };
    } catch (error) {
      console.error(error);
      return { success: false, error: 'Error al obtener servicios', status: 500 };
    }
  },

  getById: async (id) => {
    try {
      const servicio = await prisma.servicio.findUnique({ where: { id_servicio: id } });
      if (!servicio) {
        return { success: false, error: 'Servicio no encontrado', status: 404 };
      }
      return {
        success: true,
        message: 'Servicio encontrado',
        status: 200,
        data: { servicio }
      };
    } catch (error) {
      console.error(error);
      return { success: false, error: 'Error al obtener servicio', status: 500 };
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
      return {
        success: true,
        message: 'Servicio creado exitosamente',
        status: 201,
        data: { servicio: nuevo }
      };
    } catch (error) {
      console.error(error);
      return { success: false, error: 'Error al crear servicio', status: 500 };
    }
  },

  update: async (id, servicioData) => {
    try {
      const actualizado = await prisma.servicio.update({
        where: { id_servicio: id },
        data: servicioData
      });
      return {
        success: true,
        message: 'Servicio actualizado',
        status: 200,
        data: { servicio: actualizado }
      };
    } catch (error) {
      console.error(error);
      return { success: false, error: 'Error al actualizar servicio', status: 500 };
    }
  },

  delete: async (id) => {
    try {
      await prisma.servicio.delete({ where: { id_servicio: id } });
      return {
        success: true,
        message: 'Servicio eliminado',
        status: 200,
        data: null
      };
    } catch (error) {
      console.error(error);
      return { success: false, error: 'Error al eliminar servicio', status: 500 };
    }
  }
};
