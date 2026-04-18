import { prisma } from '../config/prisma.config.js';

export const ClienteServices = {
  getAll: async () => {
    try {
      const clientes = await prisma.cliente.findMany({ include: { carros: true } });
      return { message: 'Clientes encontrados', status: 200, data: { clientes, total: clientes.length } };
    } catch (error) {
      console.error(error);
      return { message: 'Error al obtener clientes', status: 500 };
    }
  },

  getById: async (id) => {
    try {
      const cliente = await prisma.cliente.findUnique({ where: { id_cliente: id }, include: { carros: true } });
      if (!cliente) return { message: 'Cliente no encontrado', status: 404, data: {} };
      return { message: 'Cliente encontrado', status: 200, data: { cliente } };
    } catch (error) {
      console.error(error);
      return { message: 'Error al obtener cliente', status: 500 };
    }
  },

  getByCedula: async (cedula) => {
    try {
      const cliente = await prisma.cliente.findFirst({
        where: { cedula_rif: cedula },
        include: {
          carros: {
            include: {
              ordenes: { orderBy: { fecha_creacion: 'desc' }, take: 1 }
            }
          }
        }
      });

      if (!cliente) return { message: 'No se encontró un cliente con la cédula proporcionada', status: 404, data: {} };

      const carrito = cliente.carros[0];
      const ultimaOrden = carrito?.ordenes[0];

      const clienteData = {
        Datos_del_Cliente: {
          Nombres_Completos: `${cliente.nombre} ${cliente.apellido}`,
          Documento_de_Identidad: cliente.cedula_rif,
          Telefono: cliente.telefono || 'No registrado'
        },
        Vehiculo: carrito ? {
          Placa: carrito.placa,
          Automotor: `${carrito.marca || ''} ${carrito.modelo || ''}`.trim() || 'No especificado'
        } : 'No posee vehículos en el sistema',
        Estado_de_la_Orden: ultimaOrden ? {
          Nro_de_Orden: `#${ultimaOrden.id_orden}`,
          Falla_o_Problema: ultimaOrden.diagnostico_inicial || 'No detallado en recepción',
          Analisis_Tecnico: ultimaOrden.diagnostico_tecnico || 'Pendiente por revisión técnica',
          Estatus_Actual: ultimaOrden.estado?.toUpperCase() || 'EN PROCESO',
          Fecha_de_Ingreso: ultimaOrden.fecha_creacion ? new Date(ultimaOrden.fecha_creacion).toLocaleDateString('es-ES') : 'N/A'
        } : 'No tiene servicios registrados recientemente'
      };

      return { message: 'Cliente encontrado', status: 200, data: clienteData };
    } catch (error) {
      console.error(error);
      return { message: 'Error interno al consultar cliente', status: 500 };
    }
  },

  create: async (clienteData) => {
    try {
      const nuevo = await prisma.cliente.create({ data: clienteData });
      return { message: 'Cliente creado exitosamente', status: 201, data: { cliente: nuevo } };
    } catch (error) {
      console.error(error);
      return { message: 'Error al crear cliente', status: 500 };
    }
  },

  /**
   * Registra cliente + vehículo en una sola transacción (ruta /recepcion)
   */
  registroRecepcion: async (formData) => {
    try {
      const { cedula_rif, nombre, apellido, telefono, direccion, placa, marca, modelo, ano, kilometraje } = formData;

      const resultado = await prisma.$transaction(async (tx) => {
        // Buscar si el cliente ya existe
        let cliente = await tx.cliente.findFirst({ where: { cedula_rif } });

        if (!cliente) {
          cliente = await tx.cliente.create({
            data: { cedula_rif, nombre, apellido, telefono, direccion }
          });
        }

        // Buscar si el vehículo ya existe
        let carro = await tx.carro.findUnique({ where: { placa } });

        if (!carro) {
          carro = await tx.carro.create({
            data: {
              placa,
              id_cliente: cliente.id_cliente,
              marca,
              modelo,
              ano: ano ? parseInt(ano) : null,
              kilometraje: kilometraje ? parseInt(kilometraje) : null
            }
          });
        }

        return { cliente, carro };
      });

      return { message: 'Registro de recepción exitoso', status: 201, data: resultado };
    } catch (error) {
      console.error(error);
      return { message: 'Error al registrar recepción', status: 500 };
    }
  },

  update: async (id, clienteData) => {
    try {
      const actualizado = await prisma.cliente.update({ where: { id_cliente: id }, data: clienteData });
      return { message: 'Cliente actualizado', status: 200, data: { cliente: actualizado } };
    } catch (error) {
      console.error(error);
      return { message: 'Error al actualizar cliente', status: 500 };
    }
  },

  delete: async (id) => {
    try {
      await prisma.cliente.delete({ where: { id_cliente: id } });
      return { message: 'Cliente eliminado', status: 200 };
    } catch (error) {
      console.error(error);
      return { message: 'Error al eliminar cliente', status: 500 };
    }
  }
};
