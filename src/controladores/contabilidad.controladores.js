import { ContabilidadServices } from '../servicios/contabilidad.servicios.js';

export class ContabilidadController {
  getAll = async (req, res) => {
    const { usuarioLogueado, startDate, endDate } = req.query;
    const { message, status, data } = await ContabilidadServices.getAll(usuarioLogueado, startDate, endDate);
    return res.status(status).json(data || { message });
  };

  create = async (req, res) => {
    const { message, status, data } = await ContabilidadServices.create(req.body);
    return res.status(status).json(data || { message });
  };

  getProveedores = async (req, res) => {
    const { message, status, data } = await ContabilidadServices.getProveedores();
    return res.status(status).json(data || { message });
  };

  postProveedor = async (req, res) => {
    const { message, status, data } = await ContabilidadServices.createProveedor(req.body);
    return res.status(status).json(data || { message });
  };

  patchEstado = async (req, res) => {
    const { id, tipo } = req.body;
    const { message, status, data } = await ContabilidadServices.updateEstado(id, tipo);
    return res.status(status).json(data || { message });
  };

  delete = async (req, res) => {
    const { id } = req.params;
    const { tipo } = req.query;
    const { message, status } = await ContabilidadServices.delete(id, tipo);
    return res.status(status).json({ message });
  };

  deleteProveedor = async (req, res) => {
    const { id } = req.params;
    const { message, status } = await ContabilidadServices.deleteProveedor(id);
    return res.status(status).json({ message });
  };
}
