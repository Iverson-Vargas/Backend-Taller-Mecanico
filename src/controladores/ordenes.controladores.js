import { OrdenServices } from '../servicios/ordenes.servicios.js';

export class OrdenController {
  getFinalizadas = async (req, res) => {
    const { success, message, status, data, error } = await OrdenServices.getFinalizadas();
    if (!success) return res.status(status).json({ success, error });
    return res.status(status).json({ success, message, data });
  };

  getAll = async (req, res) => {
    const { success, message, status, data, error } = await OrdenServices.getAll();
    if (!success) return res.status(status).json({ success, error });
    return res.status(status).json({ success, message, data });
  };

  getOne = async (req, res) => {
    const { id } = req.params;
    const { success, message, status, data, error } = await OrdenServices.getOne(id);
    if (!success) return res.status(status).json({ success, error });
    return res.status(status).json({ success, message, data });
  };

  created = async (req, res) => {
    const { success, message, status, data, error } = await OrdenServices.create(req.body);
    if (!success) return res.status(status).json({ success, error });
    return res.status(status).json({ success, message, data });
  };

  updated = async (req, res) => {
    const { id } = req.params;
    const { success, message, status, data, error } = await OrdenServices.update(id, req.body);
    if (!success) return res.status(status).json({ success, error });
    return res.status(status).json({ success, message, data });
  };

  deleted = async (req, res) => {
    const { id } = req.params;
    const { success, message, status, data, error } = await OrdenServices.delete(id);
    if (!success) return res.status(status).json({ success, error });
    return res.status(status).json({ success, message, data });
  };
}