import { EmpleadoServices } from '../servicios/empleados.servicios.js';

export class EmpleadoController {
  getAll = async (req, res) => {
    const { startDate, endDate } = req.query;
    const { message, status, data } = await EmpleadoServices.getAll(startDate, endDate);
    return res.status(status).json({ message, data });
  };

  getOne = async (req, res) => {
    const { message, status, data } = await EmpleadoServices.getById(req.params.id);
    return res.status(status).json({ message, data });
  };

  created = async (req, res) => {
    const { message, status, data } = await EmpleadoServices.create(req.body);
    return res.status(status).json({ message, data });
  };

  updated = async (req, res) => {
    const { message, status, data } = await EmpleadoServices.update(req.params.id, req.body);
    return res.status(status).json({ message, data });
  };

  calcularComision = async (req, res) => {
    const { id_orden } = req.body;
    const { message, status, data } = await EmpleadoServices.calcularComision(id_orden);
    return res.status(status).json({ message, data });
  };

  getComisiones = async (req, res) => {
    const { message, status, data } = await EmpleadoServices.getComisiones(req.params.id);
    return res.status(status).json({ message, data });
  };
}
