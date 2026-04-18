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

  pagar = async (req, res) => {
    const { id_empleado, monto_total } = req.body;
    const response = await NominaServices.pagar(id_empleado, monto_total);
    return res.status(response.status).json(response);
  };
}
