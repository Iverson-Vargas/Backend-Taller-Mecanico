import { ReporteServices } from '../servicios/reportes.servicios.js';

export class ReporteController {
  getBalance = async (req, res) => {
    const { success, message, status, data, error } = await ReporteServices.getBalance();
    if (!success) return res.status(status).json({ success, error });
    return res.status(status).json({ success, message, data });
  };

  getEstadoResultados = async (req, res) => {
    const { startDate, endDate } = req.query;
    const { success, message, status, data, error } = await ReporteServices.getEstadoResultados(startDate, endDate);
    if (!success) return res.status(status).json({ success, error });
    return res.status(status).json({ success, message, data });
  };

  getRentabilidadServicios = async (req, res) => {
    const { startDate, endDate } = req.query;
    const { success, message, status, data, error } = await ReporteServices.getRentabilidadServicios(startDate, endDate);
    if (!success) return res.status(status).json({ success, error });
    return res.status(status).json({ success, message, data });
  };
}
