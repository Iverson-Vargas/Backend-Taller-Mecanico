import { ReporteServices } from '../servicios/reportes.servicios.js';

export class ReporteController {
  getBalance = async (req, res) => {
    const { message, status, data } = await ReporteServices.getBalance();
    return res.status(status).json({ message, data });
  };

  getEstadoResultados = async (req, res) => {
    const { message, status, data } = await ReporteServices.getEstadoResultados();
    return res.status(status).json({ message, data });
  };

  getRentabilidadServicios = async (req, res) => {
    const { message, status, data } = await ReporteServices.getRentabilidadServicios();
    return res.status(status).json({ message, data });
  };
}
