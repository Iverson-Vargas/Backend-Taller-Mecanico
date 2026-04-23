import { prisma } from '../config/prisma.config.js';

export const ClienteServices = {
  consultaPorCedula: async (cedula) => {
    try {
      const cliente = await prisma.cliente.findUnique({
        where: { cedula_rif: cedula },
        include: { carros: { include: { ordenes: true } } }
      });
      
      if (!cliente) {
        return { message: 'Cédula no encontrada en el sistema', status: 404 };
      }
      
      return { message: 'Cliente encontrado', status: 200, data: cliente };
    } catch (error) {
      console.error(error);
      return { message: 'Error al consultar cliente', status: 500 };
    }
  },

  getAll: async () => {
    try {
      const clientes = await prisma.cliente.findMany();
      return { message: 'Clientes obtenidos', status: 200, data: clientes };
    } catch (error) {
      return { message: 'Error al obtener clientes', status: 500 };
    }
  },

  getOne: async (id) => {
    try {
      const cliente = await prisma.cliente.findUnique({ where: { id_cliente: Number(id) } });
      return { message: 'Cliente obtenido', status: 200, data: cliente };
    } catch (error) {
      return { message: 'Error al obtener cliente', status: 500 };
    }
  },

  create: async (data) => {
    try {
      const cliente = await prisma.cliente.create({ data });
      return { message: 'Cliente creado', status: 201, data: cliente };
    } catch (error) {
      return { message: 'Error al crear cliente', status: 500 };
    }
  },

  update: async (id, data) => {
    try {
      const cliente = await prisma.cliente.update({ where: { id_cliente: Number(id) }, data });
      return { message: 'Cliente actualizado', status: 200, data: cliente };
    } catch (error) {
      return { message: 'Error al actualizar cliente', status: 500 };
    }
  },

  delete: async (id) => {
    try {
      await prisma.cliente.delete({ where: { id_cliente: Number(id) } });
      return { message: 'Cliente eliminado', status: 200 };
    } catch (error) {
      return { message: 'Error al eliminar cliente', status: 500 };
    }
  },

  registroRecepcion: async (data) => {
    const { 
        cedula_rif, nombre, apellido, telefono, direccion, correo,
        placa, marca, modelo, ano, kilometraje, gasolina 
    } = data;

    try {
      const resultado = await prisma.$transaction(async (tx) => {
        let cliente = await tx.cliente.findUnique({
          where: { cedula_rif: cedula_rif }
        });

        if (!cliente) {
          cliente = await tx.cliente.create({
            data: { cedula_rif, nombre, apellido, telefono, direccion, correo }
          });
        }

        const carro = await tx.carro.upsert({
          where: { placa: placa },
          update: {
            id_cliente: cliente.id_cliente, 
            kilometraje: kilometraje ? parseInt(kilometraje) : null,
            capacidad_tanque: gasolina
          },
          create: {
            placa, marca, modelo,
            ano: ano ? parseInt(ano) : null,
            kilometraje: kilometraje ? parseInt(kilometraje) : null,
            capacidad_tanque: gasolina,
            id_cliente: cliente.id_cliente
          }
        });

        return { cliente, carro };
      });

      return { message: 'Recepción exitosa', status: 201, data: resultado };
    } catch (error) {
      console.error("Error en transacción:", error);
      return { message: 'Error al procesar registro', status: 500 };
    }
  }
};