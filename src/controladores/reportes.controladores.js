import { ReporteServices } from '../servicios/reportes.servicios.js';

export class ReporteController {
  getBalance = async (req, res) => {
    const { message, status, data } = await ReporteServices.getBalance();
    return res.status(status).json({ message, data });
  };

  getEstadoResultados = async (req, res) => {
    const { startDate, endDate } = req.query;
    const { message, status, data } = await ReporteServices.getEstadoResultados(startDate, endDate);
    return res.status(status).json({ message, data });
  };

  getRentabilidadServicios = async (req, res) => {
    const { startDate, endDate } = req.query;
    const { message, status, data } = await ReporteServices.getRentabilidadServicios(startDate, endDate);
    return res.status(status).json({ message, data });
  };
}
