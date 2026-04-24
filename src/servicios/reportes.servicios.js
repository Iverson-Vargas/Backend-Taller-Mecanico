import { prisma } from '../config/prisma.config.js';

export const ReporteServices = {
  /**
   * Balance General: Activos (Caja/Bancos), Pasivos (Honorarios por pagar a mecánicos) y Patrimonio.
   */
  getBalance: async () => {
    try {
      // Activos: Total facturado (ingresos en caja)
      const facturas = await prisma.factura.findMany();
      const totalIngresos = facturas.reduce((acc, f) => acc + Number(f.monto_total), 0);

      // Activos: Valor del inventario
      const inventario = await prisma.inventario.findMany();
      const valorInventario = inventario.reduce((acc, r) => acc + (Number(r.precio_venta_sugerido || 0) * (r.stock_actual || 0)), 0);

      // Pasivos: Comisiones pendientes (empleados con comisiones no liquidadas)
      const empleados = await prisma.empleado.findMany({
        where: { aplica_comision: true },
        include: { nominas: true, ordenes: { include: { detalles_servicios: true } } }
      });

      let totalPasivosLaborales = 0;
      for (const emp of empleados) {
        const totalComisionesPagadas = emp.nominas.reduce((acc, n) => acc + Number(n.monto_comision || 0), 0);
        let totalComisionesGeneradas = 0;
        for (const orden of emp.ordenes) {
          const manoObra = orden.detalles_servicios.reduce((acc, d) => acc + Number(d.precio_aplicado || 0), 0);
          totalComisionesGeneradas += manoObra * (Number(emp.monto_comision_fija || 0) / 100);
        }
        totalPasivosLaborales += Math.max(0, totalComisionesGeneradas - totalComisionesPagadas);
      }

      // Gastos totales
      const gastos = await prisma.gasto.findMany();
      const totalGastos = gastos.reduce((acc, g) => acc + Number(g.monto || 0), 0);

      const patrimonio = totalIngresos + valorInventario - totalPasivosLaborales - totalGastos;

      return {
        message: 'Balance general calculado',
        status: 200,
        data: {
          activos: { caja_bancos: totalIngresos, inventario: valorInventario, total: totalIngresos + valorInventario },
          pasivos: { honorarios_por_pagar: totalPasivosLaborales, total: totalPasivosLaborales },
          patrimonio,
          total_gastos: totalGastos
        }
      };
    } catch (error) {
      console.error(error);
      return { message: 'Error al calcular balance', status: 500 };
    }
  },

  /**
   * Estado de Resultados: Ingresos totales vs. Gastos (Nómina + Repuestos + Servicios básicos).
   */
  getEstadoResultados: async (startDate, endDate) => {
    try {
      const dateFilterFactura = {};
      const dateFilterGasto = {};
      const dateFilterNomina = {};

      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate + 'T23:59:59.999Z');
        
        dateFilterFactura.fecha_emision = { gte: start, lte: end };
        dateFilterGasto.fecha = { gte: start, lte: end };
        dateFilterNomina.fecha_pago = { gte: start, lte: end };
      }

      const facturas = await prisma.factura.findMany({ where: dateFilterFactura });
      const totalIngresos = facturas.reduce((acc, f) => acc + Number(f.monto_total), 0);

      const nominas = await prisma.nomina.findMany({ where: dateFilterNomina });
      const totalNomina = nominas.reduce((acc, n) => acc + Number(n.monto_comision || 0), 0);

      const gastos = await prisma.gasto.findMany({ where: dateFilterGasto });
      const totalGastos = gastos.reduce((acc, g) => acc + Number(g.monto || 0), 0);

      const gastosPorCategoria = {};
      gastos.forEach(g => {
        const cat = g.categoria || 'otros';
        gastosPorCategoria[cat] = (gastosPorCategoria[cat] || 0) + Number(g.monto || 0);
      });

      const totalEgresos = totalNomina + totalGastos;
      const utilidadNeta = totalIngresos - totalEgresos;

      return {
        message: 'Estado de resultados calculado',
        status: 200,
        data: {
          ingresos: totalIngresos,
          egresos: { nomina: totalNomina, gastos_operativos: totalGastos, total: totalEgresos, por_categoria: gastosPorCategoria },
          utilidad_neta: utilidadNeta,
          margen: totalIngresos > 0 ? ((utilidadNeta / totalIngresos) * 100).toFixed(2) : 0
        }
      };
    } catch (error) {
      console.error(error);
      return { message: 'Error al calcular estado de resultados', status: 500 };
    }
  },

  /**
   * Rentabilidad por Servicio: Qué reparaciones generan mayor margen.
   */
  getRentabilidadServicios: async (startDate, endDate) => {
    try {
      const dateFilter = {};
      if (startDate && endDate) {
        dateFilter.createdAt = {
          gte: new Date(startDate),
          lte: new Date(endDate + 'T23:59:59.999Z')
        };
      }

      const servicios = await prisma.servicio.findMany({
        include: { 
          detalle_orden_servicios: {
            where: {
              orden: dateFilter
            }
          } 
        }
      });

      const rentabilidad = servicios.map(servicio => {
        const totalVeces = servicio.detalle_orden_servicios.length;
        const totalIngreso = servicio.detalle_orden_servicios.reduce(
          (acc, d) => acc + Number(d.precio_aplicado || servicio.precio_base), 0
        );

        return {
          id_servicio: servicio.id_servicio,
          nombre: servicio.nombre_servicio,
          tipo: servicio.tipo_servicio,
          precio_base: Number(servicio.precio_base),
          veces_realizado: totalVeces,
          ingreso_total: totalIngreso,
          ingreso_promedio: totalVeces > 0 ? totalIngreso / totalVeces : 0
        };
      });

      rentabilidad.sort((a, b) => b.ingreso_total - a.ingreso_total);

      return {
        message: 'Rentabilidad por servicio calculada',
        status: 200,
        data: { servicios: rentabilidad }
      };
    } catch (error) {
      console.error(error);
      return { message: 'Error al calcular rentabilidad', status: 500 };
    }
  }
};
