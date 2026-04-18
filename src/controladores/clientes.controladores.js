import { ClienteServices } from '../servicios/clientes.servicios.js';

export class ClienteController {
  getAll = async (req, res) => {
    const { message, status, data } = await ClienteServices.getAll();
    return res.status(status).json({ message, data });
  };

  getOne = async (req, res) => {
    const { message, status, data } = await ClienteServices.getById(Number(req.params.id));
    return res.status(status).json({ message, data });
  };

  consultaPorCedula = async (req, res) => {
    const { message, status, data } = await ClienteServices.getByCedula(req.params.cedula);
    return res.status(status).json(status === 200 ? data : { error: message });
  };

  created = async (req, res) => {
    const { message, status, data } = await ClienteServices.create(req.body);
    return res.status(status).json({ message, data });
  };

  registroRecepcion = async (req, res) => {
    const { message, status, data } = await ClienteServices.registroRecepcion(req.body);
    return res.status(status).json({ message, data });
  };

  updated = async (req, res) => {
    const { message, status, data } = await ClienteServices.update(Number(req.params.id), req.body);
    return res.status(status).json({ message, data });
  };

  deleted = async (req, res) => {
    const { message, status } = await ClienteServices.delete(Number(req.params.id));
    return res.status(status).json({ message });
  };
}
