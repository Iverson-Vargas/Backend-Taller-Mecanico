import { VehiculoServices } from '../servicios/vehiculos.servicios.js';

export class VehiculoController {
  getAll = async (req, res) => {
    const { message, status, data } = await VehiculoServices.getAll();
    return res.status(status).json({ message, data });
  };

  getOne = async (req, res) => {
    const { message, status, data } = await VehiculoServices.getByPlaca(req.params.placa);
    return res.status(status).json({ message, data });
  };

  created = async (req, res) => {
    const { message, status, data } = await VehiculoServices.create(req.body);
    return res.status(status).json({ message, data });
  };

  updated = async (req, res) => {
    const { message, status, data } = await VehiculoServices.update(req.params.placa, req.body);
    return res.status(status).json({ message, data });
  };

  deleted = async (req, res) => {
    const { message, status } = await VehiculoServices.delete(req.params.placa);
    return res.status(status).json({ message });
  };
}
