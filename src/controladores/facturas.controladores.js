import { FacturaServices } from '../servicios/facturas.servicios.js';

export class FacturaController {
  getAll = async (req, res) => {
    const { status, data } = await FacturaServices.getAll();
    return res.status(status).json(data);
  };

  getOne = async (req, res) => {
    const { status, data } = await FacturaServices.getById(Number(req.params.id));
    return res.status(status).json(data.factura || data);
  };

  created = async (req, res) => {
    const { message, status, data } = await FacturaServices.create(req.body);
    if (status >= 400) return res.status(status).json({ error: message });
    return res.status(status).json({ mensaje: message, ...data });
  };
}
