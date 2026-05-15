import { GastoServices } from '../servicios/gastos.servicios.js';

export class GastoController {
  getAll = async (req, res) => {
    const { success, message, status, data, error } = await GastoServices.getAll();
    if (!success) return res.status(status).json({ success, error });
    return res.status(status).json({ success, message, data });
  };

  getOne = async (req, res) => {
    const { success, message, status, data, error } = await GastoServices.getById(Number(req.params.id));
    if (!success) return res.status(status).json({ success, error });
    return res.status(status).json({ success, message, data });
  };

  created = async (req, res) => {
    const { success, message, status, data, error } = await GastoServices.create(req.body);
    if (!success) return res.status(status).json({ success, error });
    return res.status(status).json({ success, message, data });
  };

  updated = async (req, res) => {
    const { success, message, status, data, error } = await GastoServices.update(Number(req.params.id), req.body);
    if (!success) return res.status(status).json({ success, error });
    return res.status(status).json({ success, message, data });
  };

  deleted = async (req, res) => {
    const { success, message, status, data, error } = await GastoServices.delete(Number(req.params.id));
    if (!success) return res.status(status).json({ success, error });
    return res.status(status).json({ success, message, data });
  };
}
