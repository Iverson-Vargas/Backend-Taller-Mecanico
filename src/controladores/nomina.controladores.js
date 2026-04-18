import { NominaServices } from '../servicios/nomina.servicios.js';

export class NominaController {
  getResumen = async (req, res) => {
    const { status, data } = await NominaServices.getResumen();
    return res.status(status).json(data.empleados || []);
  };

  getHistorial = async (req, res) => {
    const { status, data } = await NominaServices.getHistorial();
    return res.status(status).json(data.historial || []);
  };
}
