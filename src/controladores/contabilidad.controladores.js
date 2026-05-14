import { ContabilidadServices } from '../servicios/contabilidad.servicios.js';

export class ContabilidadController {
  getAll = async (req, res) => {
    const { usuarioLogueado, startDate, endDate } = req.query;
    const { success, message, status, data, error } = await ContabilidadServices.getAll(usuarioLogueado, startDate, endDate);
    if (!success) return res.status(status).json({ success, error });
    return res.status(status).json({ success, message, data });
  };

  create = async (req, res) => {
    const { success, message, status, data, error } = await ContabilidadServices.create(req.body);
    if (!success) return res.status(status).json({ success, error });
    return res.status(status).json({ success, message, data });
  };

  getProveedores = async (req, res) => {
    const { success, message, status, data, error } = await ContabilidadServices.getProveedores();
    if (!success) return res.status(status).json({ success, error });
    return res.status(status).json({ success, message, data });
  };

  postProveedor = async (req, res) => {
    const { success, message, status, data, error } = await ContabilidadServices.createProveedor(req.body);
    if (!success) return res.status(status).json({ success, error });
    return res.status(status).json({ success, message, data });
  };

  patchEstado = async (req, res) => {
    const { id, tipo } = req.body;
    const { success, message, status, data, error } = await ContabilidadServices.updateEstado(id, tipo);
    if (!success) return res.status(status).json({ success, error });
    return res.status(status).json({ success, message, data });
  };

  delete = async (req, res) => {
    const { id } = req.params;
    const { tipo } = req.query;
    const { success, message, status, data, error } = await ContabilidadServices.delete(id, tipo);
    if (!success) return res.status(status).json({ success, error });
    return res.status(status).json({ success, message, data });
  };

  deleteProveedor = async (req, res) => {
    const { id } = req.params;
    const { success, message, status, data, error } = await ContabilidadServices.deleteProveedor(id);
    if (!success) return res.status(status).json({ success, error });
    return res.status(status).json({ success, message, data });
  };
}
