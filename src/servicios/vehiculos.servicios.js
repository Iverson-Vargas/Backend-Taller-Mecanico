import { prisma } from '../config/prisma.config.js';

export const VehiculoServices = {
  getAll: async () => {
    try {
      const vehiculos = await prisma.carro.findMany({ 
        include: { cliente: true, ordenes: true } 
      });
      return { message: 'Vehículos encontrados', status: 200, data: vehiculos };
    } catch (error) {
      return { message: 'Error al obtener vehículos', status: 500, data: null };
    }
  },

  getByPlaca: async (placa) => {
    try {
      const vehiculo = await prisma.carro.findUnique({ 
        where: { placa }, 
        include: { cliente: true, ordenes: true } 
      });
      if (!vehiculo) return { message: 'Vehículo no encontrado', status: 404, data: null };
      return { message: 'Vehículo encontrado', status: 200, data: vehiculo };
    } catch (error) {
      return { message: 'Error al obtener vehículo', status: 500, data: null };
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
        return { message: 'Cliente no encontrado', status: 404, data: [] };
      }
      
      // Luego buscar vehículos por id_cliente
      const vehiculos = await prisma.carro.findMany({
        where: { 
          id_cliente: cliente.id_cliente
        },
        include: { 
          cliente: true,
          ordenes: true
        }
      });
      
      return { message: 'Vehículos encontrados', status: 200, data: vehiculos };
    } catch (error) {
      console.error('Error en getByClienteCedula:', error);
      return { message: 'Error al obtener vehículos del cliente', status: 500, data: null };
    }
  },

  create: async (data) => {
    try {
      // Buscar el cliente por cédula para obtener el id_cliente
      let id_cliente = data.id_cliente;
      
      if (!id_cliente && data.cedula_rif) {
        const cliente = await prisma.cliente.findFirst({
          where: { cedula_rif: data.cedula_rif }
        });
        if (cliente) {
          id_cliente = cliente.id_cliente;
        } else {
          return { message: 'Cliente no encontrado. Registre el cliente primero.', status: 404, data: null };
        }
      }
      
      // Crear el vehículo - SIN cedula_rif porque no existe en el modelo Carro
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
      
      return { message: 'Vehículo creado exitosamente', status: 201, data: nuevo };
    } catch (error) {
      console.error('Error al crear vehículo:', error);
      
      if (error.code === 'P2002') {
        return { message: 'Ya existe un vehículo con esta placa', status: 400, data: null };
      }
      
      return { message: 'Error al crear vehículo: ' + error.message, status: 500, data: null };
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
      return { message: 'Vehículo actualizado', status: 200, data: actualizado };
    } catch (error) {
      console.error('Error al actualizar vehículo:', error);
      return { message: 'Error al actualizar vehículo', status: 500, data: null };
    }
  },

  delete: async (placa) => {
    try {
      await prisma.carro.delete({ where: { placa } });
      return { message: 'Vehículo eliminado', status: 200, data: null };
    } catch (error) {
      console.error('Error al eliminar vehículo:', error);
      return { message: 'Error al eliminar vehículo', status: 500, data: null };
    }
  }
};