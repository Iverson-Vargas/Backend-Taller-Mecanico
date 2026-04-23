// clientes.servicios.js
import { prisma } from '../config/prisma.config.js';

export const ClienteServices = {
  registroRecepcion: async (data) => {
    const { 
        cedula_rif, nombre, apellido, telefono, direccion, correo,
        placa, marca, modelo, ano, kilometraje, gasolina 
    } = data;

    try {
      const resultado = await prisma.$transaction(async (tx) => {
        // 1. Buscar o crear el cliente
        let cliente = await tx.cliente.findUnique({
          where: { cedula_rif: cedula_rif }
        });

        if (!cliente) {
          cliente = await tx.cliente.create({
            data: {
              cedula_rif,
              nombre,
              apellido,
              telefono,
              direccion,
              correo
            }
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
            placa,
            marca,
            modelo,
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