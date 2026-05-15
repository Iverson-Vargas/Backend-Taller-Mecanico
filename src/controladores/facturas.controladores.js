import { FacturaServices } from '../servicios/facturas.servicios.js';

export class FacturaController {
  getAll = async (req, res) => {
    const { success, message, status, data, error } = await FacturaServices.getAll();
    if (!success) return res.status(status).json({ success, error });
    return res.status(status).json({ success, message, data });
  };

  getOne = async (req, res) => {
    const { success, message, status, data, error } = await FacturaServices.getById(Number(req.params.id));
    if (!success) return res.status(status).json({ success, error });
    return res.status(status).json({ success, message, data });
  };

  created = async (req, res) => {
    const { success, message, status, data, error } = await FacturaServices.create(req.body);
    if (!success) return res.status(status).json({ success, error });
    return res.status(status).json({ success, message, data });
  };
}
