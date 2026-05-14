import { InventarioServices } from '../servicios/inventario.servicios.js';

export class InventarioController {
  getAll = async (req, res) => {
    const { success, message, status, data, error } = await InventarioServices.getAll();
    if (!success) return res.status(status).json({ success, error });
    return res.status(status).json({ success, message, data });
  };

  getOne = async (req, res) => {
    const { success, message, status, data, error } = await InventarioServices.getById(Number(req.params.id));
    if (!success) return res.status(status).json({ success, error });
    return res.status(status).json({ success, message, data });
  };

  created = async (req, res) => {
    const { success, message, status, data, error } = await InventarioServices.create(req.body);
    if (!success) return res.status(status).json({ success, error });
    return res.status(status).json({ success, message, data });
  };

  updated = async (req, res) => {
    const { success, message, status, data, error } = await InventarioServices.update(Number(req.params.id), req.body);
    if (!success) return res.status(status).json({ success, error });
    return res.status(status).json({ success, message, data });
  };

  deleted = async (req, res) => {
    const { success, message, status, data, error } = await InventarioServices.delete(Number(req.params.id));
    if (!success) return res.status(status).json({ success, error });
    return res.status(status).json({ success, message, data });
  };
}
