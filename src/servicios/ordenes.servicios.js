// ordenes.servicios.js
import { prisma } from '../config/prisma.config.js';

export const OrdenServices = {
  create: async (ordenData) => {
    try {
      const nueva = await prisma.ordenServicio.create({
        data: {
          placa_carro: ordenData.placa_carro,
          id_mecanico: ordenData.id_mecanico || null,
          motivo_visita: ordenData.motivo_visita,
          falla_declarada: ordenData.falla_declarada,
          tiene_caucho: Boolean(ordenData.tiene_caucho),
          tiene_radio: Boolean(ordenData.tiene_radio),
          tiene_rayones: Boolean(ordenData.tiene_rayones),
          observaciones: ordenData.observaciones,
          estado: 'Activa'
        }
      });
      return { message: 'Orden creada', status: 201, data: nueva };
    } catch (error) {
      console.error("Error en orden:", error);
      return { message: 'Error al crear orden', status: 500 };
    }
  }
};