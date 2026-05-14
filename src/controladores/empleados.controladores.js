import { EmpleadoServices } from '../servicios/empleados.servicios.js';

export class EmpleadoController {
  getAll = async (req, res) => {
    const { startDate, endDate } = req.query;
    const { success, message, status, data, error } = await EmpleadoServices.getAll(startDate, endDate);
    if (!success) return res.status(status).json({ success, error });
    return res.status(status).json({ success, message, data });
  };

  getOne = async (req, res) => {
    const { success, message, status, data, error } = await EmpleadoServices.getById(req.params.id);
    if (!success) return res.status(status).json({ success, error });
    return res.status(status).json({ success, message, data });
  };

  created = async (req, res) => {
    const { success, message, status, data, error } = await EmpleadoServices.create(req.body);
    if (!success) return res.status(status).json({ success, error });
    return res.status(status).json({ success, message, data });
  };

  updated = async (req, res) => {
    const { success, message, status, data, error } = await EmpleadoServices.update(req.params.id, req.body);
    if (!success) return res.status(status).json({ success, error });
    return res.status(status).json({ success, message, data });
  };

  calcularComision = async (req, res) => {
    const { id_orden } = req.body;
    const { success, message, status, data, error } = await EmpleadoServices.calcularComision(id_orden);
    if (!success) return res.status(status).json({ success, error });
    return res.status(status).json({ success, message, data });
  };

  getComisiones = async (req, res) => {
    const { success, message, status, data, error } = await EmpleadoServices.getComisiones(req.params.id);
    if (!success) return res.status(status).json({ success, error });
    return res.status(status).json({ success, message, data });
  };
}
