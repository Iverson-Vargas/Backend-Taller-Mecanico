import { GastoServices } from '../servicios/gastos.servicios.js';

export class GastoController {
  getAll = async (req, res) => {
    const { message, status, data } = await GastoServices.getAll();
    return res.status(status).json({ message, data });
  };

  getOne = async (req, res) => {
    const { message, status, data } = await GastoServices.getById(Number(req.params.id));
    return res.status(status).json({ message, data });
  };

  created = async (req, res) => {
    const { message, status, data } = await GastoServices.create(req.body);
    return res.status(status).json({ message, data });
  };

  updated = async (req, res) => {
    const { message, status, data } = await GastoServices.update(Number(req.params.id), req.body);
    return res.status(status).json({ message, data });
  };

  deleted = async (req, res) => {
    const { message, status } = await GastoServices.delete(Number(req.params.id));
    return res.status(status).json({ message });
  };
}
