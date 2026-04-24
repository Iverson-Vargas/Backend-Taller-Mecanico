import { prisma } from '../config/prisma.config.js';

export const EmpleadoServices = {
  getAll: async (startDate, endDate) => {
    try {
      const dateFilter = {};
      if (startDate && endDate) {
        dateFilter.createdAt = {
          gte: new Date(startDate),
          lte: new Date(endDate + 'T23:59:59.999Z')
        };
      }

      const empleados = await prisma.empleado.findMany({ 
        include: { 
          nominas: true,
          _count: {
            select: {
              ordenes: {
                where: dateFilter
              }
            }
          }
        } 
      });
      return { message: 'Empleados encontrados', status: 200, data: { empleados, total: empleados.length } };
    } catch (error) {
      console.error(error);
      return { message: 'Error al obtener empleados', status: 500 };
    }
  },

  getById: async (id) => {
    try {
      const empleado = await prisma.empleado.findUnique({
        where: { id_empleado: id },
        include: { nominas: true, ordenes_servicio: true }
      });
      if (!empleado) return { message: 'Empleado no encontrado', status: 404, data: {} };
      return { message: 'Empleado encontrado', status: 200, data: { empleado } };
    } catch (error) {
      console.error(error);
      return { message: 'Error al obtener empleado', status: 500 };
    }
  },

  create: async (empleadoData) => {
    try {
      const nuevo = await prisma.empleado.create({
        data: {
          id_empleado: empleadoData.id_empleado,
          nombre: empleadoData.nombre,
          apellido: empleadoData.apellido,
          cargo: empleadoData.cargo,
          telefono: empleadoData.telefono || null,
          direccion: empleadoData.direccion || null,
          sueldo_base: empleadoData.sueldo_base || null,
          aplica_comision: empleadoData.aplica_comision || false,
          monto_comision_fija: empleadoData.monto_comision_fija || null
        }
      });
      return { message: 'Empleado creado exitosamente', status: 201, data: { empleado: nuevo } };
    } catch (error) {
      console.error(error);
      return { message: 'Error al crear empleado', status: 500 };
    }
  },

  update: async (id, empleadoData) => {
    try {
      const actualizado = await prisma.empleado.update({
        where: { id_empleado: id },
        data: empleadoData
      });
      return { message: 'Empleado actualizado', status: 200, data: { empleado: actualizado } };
    } catch (error) {
      console.error(error);
      return { message: 'Error al actualizar empleado', status: 500 };
    }
  },

  /**
   * Calcula la comisión del mecánico al finalizar una orden.
   * CORREGIDO: Se arreglaron los typos que rompían esta funcionalidad.
   */
  calcularComision: async (id_orden) => {
    try {
      // Buscar la orden con su mecánico y detalle de servicios
      const orden = await prisma.ordenServicio.findUnique({
        where: { id_orden },
        include: {
          mecanico: true,
          detalle_orden_servicios: true
        }
      });

      if (!orden) {
        return { message: 'Orden no encontrada', status: 404 };
      }

      if (!orden.mecanico || !orden.mecanico.aplica_comision) {
        return { message: 'El mecánico no aplica a comisión', status: 400 };
      }

      // Calcular el total de mano de obra (suma de precios aplicados)
      const totalManoObra = orden.detalle_orden_servicios.reduce(
        (acc, curr) => acc + Number(curr.precio_aplicado || 0), 0
      );

      // Calcular monto de comisión usando el porcentaje del mecánico
      const porcentaje = Number(orden.mecanico.monto_comision_fija) / 100;
      const montoPagar = totalManoObra * porcentaje;

      // Registrar en tabla Nomina
      const nuevoPago = await prisma.nomina.create({
        data: {
          id_empleado: orden.id_mecanico,
          monto_comision: montoPagar,
          tipo_pago: 'comision',
          fecha_pago: new Date()
        }
      });

      return {
        message: 'Comisión calculada y registrada',
        status: 200,
        data: {
          orden: id_orden,
          mecanico: `${orden.mecanico.nombre} ${orden.mecanico.apellido}`,
          total_mano_obra: totalManoObra,
          porcentaje_comision: Number(orden.mecanico.monto_comision_fija),
          monto_pagado: montoPagar,
          pago: nuevoPago
        }
      };
    } catch (error) {
      console.error(error);
      return { message: 'Error al calcular comisión', status: 500 };
    }
  },

  getComisiones: async (id) => {
    try {
      const historial = await prisma.nomina.findMany({
        where: { id_empleado: id },
        orderBy: { fecha_pago: 'desc' }
      });
      return { message: 'Historial de comisiones', status: 200, data: { historial } };
    } catch (error) {
      console.error(error);
      return { message: 'Error al consultar historial', status: 500 };
    }
  }
};
