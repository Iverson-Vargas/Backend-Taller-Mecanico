import { InventarioServices } from '../servicios/inventario.servicios.js';

export class InventarioController {
  getAll = async (req, res) => {
    const { status, data } = await InventarioServices.getAll();
    // El frontend espera un array directo, no un wrapper
    return res.status(status).json(data.repuestos || []);
  };

  getOne = async (req, res) => {
    const { message, status, data } = await InventarioServices.getById(Number(req.params.id));
    return res.status(status).json({ message, data });
  };

  created = async (req, res) => {
    const { message, status, data } = await InventarioServices.create(req.body);
    return res.status(status).json({ message, data });
  };

  updated = async (req, res) => {
    const { message, status, data } = await InventarioServices.update(Number(req.params.id), req.body);
    return res.status(status).json({ message, data });
  };

  deleted = async (req, res) => {
    const { message, status } = await InventarioServices.delete(Number(req.params.id));
    return res.status(status).json({ message });
  };
}
