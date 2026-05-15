import { VehiculoServices } from '../servicios/vehiculos.servicios.js';

export class VehiculoController {
  getAll = async (req, res) => {
    const { success, message, status, data, error } = await VehiculoServices.getAll();
    if (!success) return res.status(status).json({ success, error });
    return res.status(status).json({ success, message, data });
  };

  getByPlaca = async (req, res) => {
    const { placa } = req.params;
    const { success, message, status, data, error } = await VehiculoServices.getByPlaca(placa);
    if (!success) return res.status(status).json({ success, error });
    return res.status(status).json({ success, message, data });
  };

  // Buscar vehículos por cédula del cliente
  getByClienteCedula = async (req, res) => {
    const { cedula } = req.params;
    const { success, message, status, data, error } = await VehiculoServices.getByClienteCedula(cedula);
    if (!success) return res.status(status).json({ success, error });
    return res.status(status).json({ success, message, data });
  };

  create = async (req, res) => {
    const { success, message, status, data, error } = await VehiculoServices.create(req.body);
    if (!success) return res.status(status).json({ success, error });
    return res.status(status).json({ success, message, data });
  };

  update = async (req, res) => {
    const { placa } = req.params;
    const { success, message, status, data, error } = await VehiculoServices.update(placa, req.body);
    if (!success) return res.status(status).json({ success, error });
    return res.status(status).json({ success, message, data });
  };

  delete = async (req, res) => {
    const { placa } = req.params;
    const { success, message, status, data, error } = await VehiculoServices.delete(placa);
    if (!success) return res.status(status).json({ success, error });
    return res.status(status).json({ success, message, data });
  };
}