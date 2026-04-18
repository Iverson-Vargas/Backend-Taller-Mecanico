import { prisma } from '../config/prisma.config.js';

export const VehiculoServices = {
  getAll: async () => {
    try {
      const vehiculos = await prisma.carro.findMany({ include: { cliente: true } });
      return { message: 'Vehículos encontrados', status: 200, data: { vehiculos, total: vehiculos.length } };
    } catch (error) {
      console.error(error);
      return { message: 'Error al obtener vehículos', status: 500 };
    }
  },

  getByPlaca: async (placa) => {
    try {
      const vehiculo = await prisma.carro.findUnique({ where: { placa }, include: { cliente: true, ordenes: true } });
      if (!vehiculo) return { message: 'Vehículo no encontrado', status: 404, data: {} };
      return { message: 'Vehículo encontrado', status: 200, data: { vehiculo } };
    } catch (error) {
      console.error(error);
      return { message: 'Error al obtener vehículo', status: 500 };
    }
  },

  create: async (vehiculoData) => {
    try {
      const nuevo = await prisma.carro.create({ data: vehiculoData });
      return { message: 'Vehículo creado exitosamente', status: 201, data: { vehiculo: nuevo } };
    } catch (error) {
      console.error(error);
      return { message: 'Error al crear vehículo', status: 500 };
    }
  },

  update: async (placa, vehiculoData) => {
    try {
      const actualizado = await prisma.carro.update({ where: { placa }, data: vehiculoData });
      return { message: 'Vehículo actualizado', status: 200, data: { vehiculo: actualizado } };
    } catch (error) {
      console.error(error);
      return { message: 'Error al actualizar vehículo', status: 500 };
    }
  },

  delete: async (placa) => {
    try {
      await prisma.carro.delete({ where: { placa } });
      return { message: 'Vehículo eliminado', status: 200 };
    } catch (error) {
      console.error(error);
      return { message: 'Error al eliminar vehículo', status: 500 };
    }
  }
};
