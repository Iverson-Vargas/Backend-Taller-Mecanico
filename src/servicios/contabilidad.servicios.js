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

      // 2. Datos para el Dashboard (Global del Taller - Todo el mes actual por defecto si no hay filtro)
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const dashboardFilter = {
        fecha: {
          gte: firstDay
        }
      };

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
        message: 'Datos contables obtenidos', 
        status: 200, 
        data: { gastos, compras, resumenGlobal, resumenPersonal } 
      };
    } catch (error) {
      console.error(error);
      return { message: 'Error al obtener datos contables', status: 500 };
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
        throw new Error("El usuario logueado es requerido");
      }

      // Datos comunes para ambos modelos
      const commonData = {
        descripcion: descripcion || "Sin descripción",
        estado: estado || "POR PAGAR",
        fecha: new Date(),
        registrado_por_usuario: usuarioLogueado, // Usar el campo ID directamente
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
        return { message: 'Gasto registrado', status: 201, data: nuevo };
      } else {
        // COMPRA no tiene campo 'categoria' ni 'monto' (usa monto_total)
        const nuevo = await prisma.compra.create({
          data: {
            ...commonData,
            monto_total: parseFloat(monto || 0)
          }
        });
        return { message: 'Compra registrada', status: 201, data: nuevo };
      }
    } catch (error) {
      console.error("DETALLE ERROR REGISTRO:", error);
      const detailedMessage = error.message || "Error desconocido";
      return { 
        message: `Error al registrar: ${detailedMessage}`, 
        status: 500, 
        error: error.message 
      };
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
        return { message: 'Gasto marcado como pagado', status: 200, data: actualizado };
      } else {
        const actualizado = await prisma.compra.update({
          where: { id_compra: parseInt(id) },
          data: { estado: 'PAGADO' }
        });
        return { message: 'Compra marcada como pagada', status: 200, data: actualizado };
      }
    } catch (error) {
      console.error(error);
      return { message: 'No se pudo actualizar el estado', status: 500 };
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
      return { message: 'Proveedores obtenidos', status: 200, data: proveedores };
    } catch (error) {
      console.error(error);
      return { message: 'Error al obtener proveedores', status: 500 };
    }
  },

  /**
   * Crea un nuevo proveedor
   */
  createProveedor: async (data) => {
    try {
      // Validaciones básicas
      if (!data.rif || !data.nombre_empresa) {
        return { message: 'RIF y Nombre de Empresa son obligatorios', status: 400 };
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
      return { message: 'Proveedor creado', status: 201, data: nuevo };
    } catch (error) {
      console.error("Error detallado al crear proveedor:", error);
      
      // Capturar errores específicos de Prisma
      if (error.code === 'P2002') {
        return { message: 'Ya existe un proveedor con ese RIF', status: 400 };
      }
      
      return { 
        message: `Error al crear proveedor: ${error.message}`, 
        status: 500 
      };
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
          message: 'No se puede eliminar el proveedor porque tiene registros de gastos o compras asociados.', 
          status: 400 
        };
      }

      await prisma.proveedor.delete({
        where: { id_proveedor: providerId }
      });

      return { message: 'Proveedor eliminado correctamente', status: 200 };
    } catch (error) {
      console.error("Error al eliminar proveedor:", error);
      return { message: 'Error al eliminar proveedor', status: 500 };
    }
  },

  /**
   * Elimina un registro
   */
  delete: async (id, tipo) => {
    try {
      if (tipo === 'Gasto') {
        await prisma.gasto.delete({ where: { id_gasto: parseInt(id) } });
      } else {
        await prisma.compra.delete({ where: { id_compra: parseInt(id) } });
      }
      return { message: 'Registro eliminado correctamente', status: 200 };
    } catch (error) {
      console.error(error);
      return { message: 'No se pudo eliminar el registro', status: 500 };
    }
  }
};
