import { prisma } from '../config/prisma.config.js';

export const ContabilidadServices = {
  /**
   * Obtiene todos los gastos y compras
   */
  getAll: async (usuarioId, startDate, endDate) => {
    try {
      const dateFilter = {};
      if (startDate && endDate) {
        dateFilter.fecha = {
          gte: new Date(startDate),
          lte: new Date(endDate + 'T23:59:59.999Z')
        };
      }

      // 1. Filtro para la tabla (Personalizado)
      const listFilter = { ...dateFilter };
      if (usuarioId) {
        listFilter.registrado_por_usuario = usuarioId;
      }

      const gastos = await prisma.gasto.findMany({
        where: listFilter,
        include: {
          usuario: { select: { nombre: true, apellido: true } },
          proveedor: true
        },
        orderBy: { fecha: 'desc' }
      });

      const compras = await prisma.compra.findMany({
        where: listFilter,
        include: {
          usuario: { select: { nombre: true, apellido: true } },
          proveedor: true
        },
        orderBy: { fecha: 'desc' }
      });

      // 2. Datos para el Dashboard (Global del Taller)
      // Si el usuario envia un filtro de fechas, lo usamos. Si no, usamos el mes actual.
      let dashboardFilter = { ...dateFilter };
      if (!startDate) {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        dashboardFilter = { fecha: { gte: firstDay } };
      }

      const todosGastos = await prisma.gasto.findMany({ where: dashboardFilter });
      const todasCompras = await prisma.compra.findMany({ where: dashboardFilter });

      const totalGastosMes = todosGastos.reduce((acc, g) => acc + parseFloat(g.monto || 0), 0) +
                             todasCompras.reduce((acc, c) => acc + parseFloat(c.monto_total || 0), 0);

      const porPagarGastos = todosGastos.filter(g => g.estado !== 'PAGADO').reduce((acc, g) => acc + parseFloat(g.monto || 0), 0);
      const porPagarCompras = todasCompras.filter(c => c.estado !== 'PAGADO').reduce((acc, c) => acc + parseFloat(c.monto_total || 0), 0);

      const resumenGlobal = {
        totalMes: totalGastosMes,
        pendiente: porPagarGastos + porPagarCompras,
        pagado: totalGastosMes - (porPagarGastos + porPagarCompras)
      };

      // 3. Resumen Personal (Basado en el usuario logueado)
      let resumenPersonal = null;
      if (usuarioId) {
        const totalPers = gastos.reduce((acc, g) => acc + parseFloat(g.monto || 0), 0) +
                        compras.reduce((acc, c) => acc + parseFloat(c.monto_total || 0), 0);
        const pendPers = gastos.filter(g => g.estado !== 'PAGADO').reduce((acc, g) => acc + parseFloat(g.monto || 0), 0) +
                        compras.filter(c => c.estado !== 'PAGADO').reduce((acc, c) => acc + parseFloat(c.monto_total || 0), 0);

        resumenPersonal = {
          totalMes: totalPers,
          pendiente: pendPers,
          pagado: totalPers - pendPers
        };
      }

      return {
        success: true,
        message: 'Datos contables obtenidos',
        status: 200,
        data: { gastos, compras, resumenGlobal, resumenPersonal }
      };
    } catch (error) {
      console.error(error);
      return { success: false, error: 'Error al obtener datos contables', status: 500 };
    }
  },

  /**
   * Crea un nuevo registro (Gasto o Compra)
   */
  create: async (payload) => {
    const { tipo, descripcion, monto, id_proveedor, usuarioLogueado, estado, categoria } = payload;
    try {
      console.log("Registrando movimiento:", { tipo, usuarioLogueado, id_proveedor, monto });

      if (!usuarioLogueado) {
        return { success: false, error: 'El usuario logueado es requerido', status: 400 };
      }

      // Datos comunes para ambos modelos
      const commonData = {
        descripcion: descripcion || "Sin descripción",
        estado: estado || "POR PAGAR",
        fecha: new Date(),
        registrado_por_usuario: usuarioLogueado,
        id_proveedor: id_proveedor ? parseInt(id_proveedor) : null
      };

      if (tipo === 'Gasto') {
        const nuevo = await prisma.gasto.create({
          data: {
            ...commonData,
            monto: parseFloat(monto || 0),
            categoria: categoria || 'Otros'
          }
        });
        return {
          success: true,
          message: 'Gasto registrado',
          status: 201,
          data: { gasto: nuevo }
        };
      } else {
        // COMPRA no tiene campo 'categoria' ni 'monto' (usa monto_total)
        const nuevo = await prisma.compra.create({
          data: {
            ...commonData,
            monto_total: parseFloat(monto || 0)
          }
        });
        return {
          success: true,
          message: 'Compra registrada',
          status: 201,
          data: { compra: nuevo }
        };
      }
    } catch (error) {
      console.error("DETALLE ERROR REGISTRO:", error);
      return { success: false, error: `Error al registrar: ${error.message || 'Error desconocido'}`, status: 500 };
    }
  },

  /**
   * Actualiza el estado a PAGADO
   */
  updateEstado: async (id, tipo) => {
    try {
      if (tipo === 'Gasto') {
        const actualizado = await prisma.gasto.update({
          where: { id_gasto: parseInt(id) },
          data: { estado: 'PAGADO' }
        });
        return {
          success: true,
          message: 'Gasto marcado como pagado',
          status: 200,
          data: { gasto: actualizado }
        };
      } else {
        const actualizado = await prisma.compra.update({
          where: { id_compra: parseInt(id) },
          data: { estado: 'PAGADO' }
        });
        return {
          success: true,
          message: 'Compra marcada como pagada',
          status: 200,
          data: { compra: actualizado }
        };
      }
    } catch (error) {
      console.error(error);
      return { success: false, error: 'No se pudo actualizar el estado', status: 500 };
    }
  },

  /**
   * Obtiene la lista de todos los proveedores
   */
  getProveedores: async () => {
    try {
      const proveedores = await prisma.proveedor.findMany({
        orderBy: { nombre_empresa: 'asc' }
      });
      return {
        success: true,
        message: 'Proveedores obtenidos',
        status: 200,
        data: { proveedores, total: proveedores.length }
      };
    } catch (error) {
      console.error(error);
      return { success: false, error: 'Error al obtener proveedores', status: 500 };
    }
  },

  /**
   * Crea un nuevo proveedor
   */
  createProveedor: async (data) => {
    try {
      if (!data.rif || !data.nombre_empresa) {
        return { success: false, error: 'RIF y Nombre de Empresa son obligatorios', status: 400 };
      }

      const nuevo = await prisma.proveedor.create({
        data: {
          rif: data.rif,
          nombre_empresa: data.nombre_empresa,
          especialidad: data.especialidad || "",
          nombre_contacto: data.nombre_contacto || null,
          apellido_contacto: data.apellido_contacto || null
        }
      });
      return {
        success: true,
        message: 'Proveedor creado',
        status: 201,
        data: { proveedor: nuevo }
      };
    } catch (error) {
      console.error("Error detallado al crear proveedor:", error);
      if (error.code === 'P2002') {
        return { success: false, error: 'Ya existe un proveedor con ese RIF', status: 400 };
      }
      return { success: false, error: `Error al crear proveedor: ${error.message}`, status: 500 };
    }
  },

  /**
   * Eliminar un proveedor
   */
  deleteProveedor: async (id) => {
    try {
      const providerId = parseInt(id);

      // Verificar si tiene transacciones asociadas
      const tieneGastos = await prisma.gasto.findFirst({ where: { id_proveedor: providerId } });
      const tieneCompras = await prisma.compra.findFirst({ where: { id_proveedor: providerId } });

      if (tieneGastos || tieneCompras) {
        return {
          success: false,
          error: 'No se puede eliminar el proveedor porque tiene registros de gastos o compras asociados.',
          status: 400
        };
      }

      await prisma.proveedor.delete({
        where: { id_proveedor: providerId }
      });

      return {
        success: true,
        message: 'Proveedor eliminado correctamente',
        status: 200,
        data: null
      };
    } catch (error) {
      console.error("Error al eliminar proveedor:", error);
      return { success: false, error: 'Error al eliminar proveedor', status: 500 };
    }
  },

  /**
   * Elimina un registro (Gasto o Compra)
   */
  delete: async (id, tipo) => {
    try {
      if (tipo === 'Gasto') {
        await prisma.gasto.delete({ where: { id_gasto: parseInt(id) } });
      } else {
        await prisma.compra.delete({ where: { id_compra: parseInt(id) } });
      }
      return {
        success: true,
        message: 'Registro eliminado correctamente',
        status: 200,
        data: null
      };
    } catch (error) {
      console.error(error);
      return { success: false, error: 'No se pudo eliminar el registro', status: 500 };
    }
  }
};
