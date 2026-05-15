import { prisma } from '../config/prisma.config.js';

export const VehiculoServices = {
  getAll: async () => {
    try {
      const vehiculos = await prisma.carro.findMany({
        include: { cliente: true, ordenes: true }
      });
      return {
        success: true,
        message: 'Vehículos encontrados',
        status: 200,
        data: { vehiculos, total: vehiculos.length }
      };
    } catch (error) {
      console.error(error);
      return { success: false, error: 'Error al obtener vehículos', status: 500 };
    }
  },

  getByPlaca: async (placa) => {
    try {
      const vehiculo = await prisma.carro.findUnique({
        where: { placa },
        include: { cliente: true, ordenes: true }
      });
      if (!vehiculo) {
        return { success: false, error: 'Vehículo no encontrado', status: 404 };
      }
      return {
        success: true,
        message: 'Vehículo encontrado',
        status: 200,
        data: { vehiculo }
      };
    } catch (error) {
      console.error(error);
      return { success: false, error: 'Error al obtener vehículo', status: 500 };
    }
  },

  getByClienteCedula: async (cedula) => {
    try {
      const cedulaLimpia = cedula.replace(/[^0-9]/g, '');

      // Primero buscar el cliente por cédula
      const cliente = await prisma.cliente.findFirst({
        where: {
          cedula_rif: {
            contains: cedulaLimpia
          }
        }
      });

      if (!cliente) {
        return { success: false, error: 'Cliente no encontrado', status: 404 };
      }

      // Luego buscar vehículos por id_cliente (relación íntegra garantizada)
      const vehiculos = await prisma.carro.findMany({
        where: {
          id_cliente: cliente.id_cliente
        },
        include: {
          cliente: true,
          ordenes: true
        }
      });

      return {
        success: true,
        message: 'Vehículos encontrados',
        status: 200,
        data: { vehiculos, cliente, total: vehiculos.length }
      };
    } catch (error) {
      console.error('Error en getByClienteCedula:', error);
      return { success: false, error: 'Error al obtener vehículos del cliente', status: 500 };
    }
  },

  create: async (data) => {
    try {
      // Resolver id_cliente desde cédula si no viene directo
      let id_cliente = data.id_cliente;

      if (!id_cliente && data.cedula_rif) {
        const cliente = await prisma.cliente.findFirst({
          where: { cedula_rif: data.cedula_rif }
        });
        if (cliente) {
          id_cliente = cliente.id_cliente;
        } else {
          return { success: false, error: 'Cliente no encontrado. Registre el cliente primero.', status: 404 };
        }
      }

      // Crear el vehículo con la relación id_cliente íntegra
      const nuevo = await prisma.carro.create({
        data: {
          placa: data.placa,
          marca: data.marca || '',
          modelo: data.modelo || '',
          ano: data.ano ? parseInt(data.ano) : null,
          kilometraje: data.kilometraje ? parseInt(data.kilometraje) : null,
          capacidad_tanque: data.capacidad_tanque || '',
          id_cliente: id_cliente
          // ❌ NO incluir cedula_rif aquí
        }
      });

      return {
        success: true,
        message: 'Vehículo creado exitosamente',
        status: 201,
        data: { vehiculo: nuevo }
      };
    } catch (error) {
      console.error('Error al crear vehículo:', error);
      if (error.code === 'P2002') {
        return { success: false, error: 'Ya existe un vehículo con esta placa', status: 400 };
      }
      return { success: false, error: `Error al crear vehículo: ${error.message}`, status: 500 };
    }
  },

  update: async (placa, data) => {
    try {
      const actualizado = await prisma.carro.update({
        where: { placa },
        data: {
          marca: data.marca,
          modelo: data.modelo,
          ano: data.ano ? parseInt(data.ano) : null,
          kilometraje: data.kilometraje ? parseInt(data.kilometraje) : null,
          capacidad_tanque: data.capacidad_tanque || data.gasolina || null,
          id_cliente: data.id_cliente || null
        }
      });
      return {
        success: true,
        message: 'Vehículo actualizado',
        status: 200,
        data: { vehiculo: actualizado }
      };
    } catch (error) {
      console.error('Error al actualizar vehículo:', error);
      return { success: false, error: 'Error al actualizar vehículo', status: 500 };
    }
  },

  delete: async (placa) => {
    try {
      await prisma.carro.delete({ where: { placa } });
      return {
        success: true,
        message: 'Vehículo eliminado',
        status: 200,
        data: null
      };
    } catch (error) {
      console.error('Error al eliminar vehículo:', error);
      return { success: false, error: 'Error al eliminar vehículo', status: 500 };
    }
  }
};