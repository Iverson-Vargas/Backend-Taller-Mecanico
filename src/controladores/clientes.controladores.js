import { ClienteServices } from '../servicios/clientes.servicios.js';

export class ClienteController {
  consultaPorCedula = async (req, res) => {
    const { cedula } = req.params;
    const { success, message, status, data, error } = await ClienteServices.consultaPorCedula(cedula);
    if (!success) return res.status(status).json({ success, error });
    return res.status(status).json({ success, message, data });
  };

  getAll = async (req, res) => {
    const { success, message, status, data, error } = await ClienteServices.getAll();
    if (!success) return res.status(status).json({ success, error });
    return res.status(status).json({ success, message, data });
  };

  getOne = async (req, res) => {
    const { id } = req.params;
    const { success, message, status, data, error } = await ClienteServices.getOne(id);
    if (!success) return res.status(status).json({ success, error });
    return res.status(status).json({ success, message, data });
  };

  registroRecepcion = async (req, res) => {
    const { success, message, status, data, error } = await ClienteServices.registroRecepcion(req.body);
    if (!success) return res.status(status).json({ success, error });
    return res.status(status).json({ success, message, data });
  };

  created = async (req, res) => {
    const { success, message, status, data, error } = await ClienteServices.create(req.body);
    if (!success) return res.status(status).json({ success, error });
    return res.status(status).json({ success, message, data });
  };

  updated = async (req, res) => {
    const { id } = req.params;
    const { success, message, status, data, error } = await ClienteServices.update(id, req.body);
    if (!success) return res.status(status).json({ success, error });
    return res.status(status).json({ success, message, data });
  };

  deleted = async (req, res) => {
    const { id } = req.params;
    const { success, message, status, data, error } = await ClienteServices.delete(id);
    if (!success) return res.status(status).json({ success, error });
    return res.status(status).json({ success, message, data });
  };
}