import { ServicioServices } from '../servicios/servicios.servicios.js';

export class ServicioController {
  getAll = async (req, res) => {
    const { message, status, data } = await ServicioServices.getAll();
    return res.status(status).json({ message, data });
  };

  getOne = async (req, res) => {
    const { message, status, data } = await ServicioServices.getById(Number(req.params.id));
    return res.status(status).json({ message, data });
  };

  created = async (req, res) => {
    const { message, status, data } = await ServicioServices.create(req.body);
    return res.status(status).json({ message, data });
  };

  updated = async (req, res) => {
    const { message, status, data } = await ServicioServices.update(Number(req.params.id), req.body);
    return res.status(status).json({ message, data });
  };

  deleted = async (req, res) => {
    const { message, status } = await ServicioServices.delete(Number(req.params.id));
    return res.status(status).json({ message });
  };
}
