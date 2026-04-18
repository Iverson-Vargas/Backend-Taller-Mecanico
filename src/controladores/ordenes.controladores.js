import { OrdenServices } from '../servicios/ordenes.servicios.js';

export class OrdenController {
  getAll = async (req, res) => {
    const { message, status, data } = await OrdenServices.getAll();
    return res.status(status).json({ message, data });
  };

  getOne = async (req, res) => {
    const { message, status, data } = await OrdenServices.getById(Number(req.params.id));
    return res.status(status).json(data);
  };

  getFinalizadas = async (req, res) => {
    const { message, status, data } = await OrdenServices.getFinalizadas();
    return res.status(status).json(data);
  };

  created = async (req, res) => {
    const { message, status, data } = await OrdenServices.create(req.body);
    return res.status(status).json({ message, data });
  };

  updated = async (req, res) => {
    const { message, status, data } = await OrdenServices.update(Number(req.params.id), req.body);
    return res.status(status).json({ message, data });
  };

  deleted = async (req, res) => {
    const { message, status } = await OrdenServices.delete(Number(req.params.id));
    return res.status(status).json({ message });
  };
}
