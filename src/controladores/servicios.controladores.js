import { ServicioServices } from '../servicios/servicios.servicios.js';

export class ServicioController {
  getAll = async (req, res) => {
    const { success, message, status, data, error } = await ServicioServices.getAll();
    if (!success) return res.status(status).json({ success, error });
    return res.status(status).json({ success, message, data });
  };

  getOne = async (req, res) => {
    const { success, message, status, data, error } = await ServicioServices.getById(Number(req.params.id));
    if (!success) return res.status(status).json({ success, error });
    return res.status(status).json({ success, message, data });
  };

  created = async (req, res) => {
    const { success, message, status, data, error } = await ServicioServices.create(req.body);
    if (!success) return res.status(status).json({ success, error });
    return res.status(status).json({ success, message, data });
  };

  updated = async (req, res) => {
    const { success, message, status, data, error } = await ServicioServices.update(Number(req.params.id), req.body);
    if (!success) return res.status(status).json({ success, error });
    return res.status(status).json({ success, message, data });
  };

  deleted = async (req, res) => {
    const { success, message, status, data, error } = await ServicioServices.delete(Number(req.params.id));
    if (!success) return res.status(status).json({ success, error });
    return res.status(status).json({ success, message, data });
  };
}
