import { prisma } from '../config/prisma.config.js';

export const ClienteServices = {
  consultaPorCedula: async (cedula) => {
    try {
      // Limpiar cédula (solo números)
      const cedulaLimpia = cedula.replace(/[^0-9]/g, '');

      console.log('Buscando cédula:', cedulaLimpia);

      const cliente = await prisma.cliente.findFirst({
        where: {
          cedula_rif: {
            contains: cedulaLimpia
          }
        },
        include: { carros: true }
      });

      console.log('Cliente encontrado:', cliente);

      if (!cliente) {
        return { success: false, error: 'Cédula no encontrada', status: 404 };
      }
      return {
        success: true,
        message: 'Cliente encontrado',
        status: 200,
        data: { cliente }
      };
    } catch (error) {
      console.error('Error en consultaPorCedula:', error);
      return { success: false, error: 'Error al consultar cliente', status: 500 };
    }
  },

  getAll: async () => {
    try {
      const clientes = await prisma.cliente.findMany({
        include: { carros: true }
      });
      return {
        success: true,
        message: 'Clientes obtenidos',
        status: 200,
        data: { clientes, total: clientes.length }
      };
    } catch (error) {
      console.error('Error al obtener clientes:', error);
      return { success: false, error: 'Error al obtener clientes', status: 500 };
    }
  },

  getOne: async (id) => {
    try {
      const cliente = await prisma.cliente.findUnique({
        where: { id_cliente: Number(id) },
        include: { carros: true }
      });
      if (!cliente) {
        return { success: false, error: 'Cliente no encontrado', status: 404 };
      }
      return {
        success: true,
        message: 'Cliente obtenido',
        status: 200,
        data: { cliente }
      };
    } catch (error) {
      console.error('Error al obtener cliente:', error);
      return { success: false, error: 'Error al obtener cliente', status: 500 };
    }
  },

  registroRecepcion: async (data) => {
    const {
      cedula_rif, nombre, apellido, telefono, direccion, correo,
      placa, marca, modelo, ano, kilometraje, gasolina,
      vehiculos_extra = []
    } = data;

    try {
      const resultado = await prisma.$transaction(async (tx) => {
        // 1. Buscar o crear el cliente
        let cliente = await tx.cliente.findFirst({
          where: { cedula_rif: cedula_rif }
        });

        if (!cliente) {
          cliente = await tx.cliente.create({
            data: {
              cedula_rif,
              nombre,
              apellido,
              telefono: telefono || '',
              direccion: direccion || '',
              correo: correo || ''
            }
          });
          console.log('Cliente creado:', cliente);
        } else {
          console.log('Cliente existente:', cliente);
        }

        // 2. Crear o actualizar el carro principal vinculado al cliente
        const carroPrincipal = await tx.carro.upsert({
          where: { placa: placa },
          update: {
            id_cliente: cliente.id_cliente,
            marca: marca || '',
            modelo: modelo || '',
            ano: ano ? parseInt(ano) : null,
            kilometraje: kilometraje ? parseInt(kilometraje) : null,
            capacidad_tanque: gasolina || '',
            cedula_rif: cedula_rif
          },
          create: {
            placa: placa,
            marca: marca || '',
            modelo: modelo || '',
            ano: ano ? parseInt(ano) : null,
            kilometraje: kilometraje ? parseInt(kilometraje) : null,
            capacidad_tanque: gasolina || '',
            id_cliente: cliente.id_cliente,
            cedula_rif: cedula_rif
          }
        });
        console.log('Carro principal guardado:', carroPrincipal);

        // 3. Crear vehículos adicionales
        const vehiculosCreados = [];
        for (const v of vehiculos_extra) {
          if (v.placa) {
            const vehiculoExtra = await tx.carro.upsert({
              where: { placa: v.placa },
              update: {
                id_cliente: cliente.id_cliente,
                marca: v.marca || '',
                modelo: v.modelo || '',
                ano: v.ano ? parseInt(v.ano) : null,
                kilometraje: v.kilometraje ? parseInt(v.kilometraje) : null,
                capacidad_tanque: v.gasolina || '',
                cedula_rif: cedula_rif
              },
              create: {
                placa: v.placa,
                marca: v.marca || '',
                modelo: v.modelo || '',
                ano: v.ano ? parseInt(v.ano) : null,
                kilometraje: v.kilometraje ? parseInt(v.kilometraje) : null,
                capacidad_tanque: v.gasolina || '',
                id_cliente: cliente.id_cliente,
                cedula_rif: cedula_rif
              }
            });
            vehiculosCreados.push(vehiculoExtra);
            console.log('Vehículo adicional guardado:', vehiculoExtra);
          }
        }

        return {
          cliente,
          carro_principal: carroPrincipal,
          vehiculos_extra: vehiculosCreados
        };
      });

      return {
        success: true,
        message: 'Recepción exitosa: Cliente y vehículo(s) guardados correctamente',
        status: 201,
        data: resultado
      };
    } catch (error) {
      console.error("Error en registroRecepcion:", error);
      return { success: false, error: `Error en el proceso de recepción: ${error.message}`, status: 500 };
    }
  },

  create: async (data) => {
    try {
      const cliente = await prisma.cliente.create({ data });
      return {
        success: true,
        message: 'Cliente creado',
        status: 201,
        data: { cliente }
      };
    } catch (error) {
      console.error('Error al crear cliente:', error);
      return { success: false, error: 'Error al crear cliente', status: 500 };
    }
  },

  update: async (id, data) => {
    try {
      const cliente = await prisma.cliente.update({
        where: { id_cliente: Number(id) },
        data
      });
      return {
        success: true,
        message: 'Cliente actualizado',
        status: 200,
        data: { cliente }
      };
    } catch (error) {
      console.error('Error al actualizar cliente:', error);
      return { success: false, error: 'Error al actualizar cliente', status: 500 };
    }
  },

  delete: async (id) => {
    try {
      await prisma.cliente.delete({ where: { id_cliente: Number(id) } });
      return {
        success: true,
        message: 'Cliente eliminado',
        status: 200,
        data: null
      };
    } catch (error) {
      console.error('Error al eliminar cliente:', error);
      return { success: false, error: 'Error al eliminar cliente', status: 500 };
    }
  }
};