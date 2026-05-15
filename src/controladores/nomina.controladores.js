import { NominaServices } from '../servicios/nomina.servicios.js';

export class NominaController {
  getResumen = async (req, res) => {
    const { success, message, status, data, error } = await NominaServices.getResumen();
    if (!success) return res.status(status).json({ success, error });
    return res.status(status).json({ success, message, data });
  };

  getHistorial = async (req, res) => {
    const { success, message, status, data, error } = await NominaServices.getHistorial();
    if (!success) return res.status(status).json({ success, error });
    return res.status(status).json({ success, message, data });
  };

  pagar = async (req, res) => {
    const { id_empleado, monto_total } = req.body;
    const response = await NominaServices.pagar(id_empleado, monto_total);
    return res.status(response.status).json(response);
  };
}
