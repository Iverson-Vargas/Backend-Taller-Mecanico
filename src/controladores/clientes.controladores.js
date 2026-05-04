import { ClienteServices } from '../servicios/clientes.servicios.js';

export class ClienteController {
    consultaPorCedula = async (req, res) => {
        const { cedula } = req.params;
        const { message, status, data } = await ClienteServices.consultaPorCedula(cedula);
        return res.status(status).json({ message, data });
    };

    getAll = async (req, res) => {
        const { message, status, data } = await ClienteServices.getAll();
        return res.status(status).json({ message, data });
    };

    getOne = async (req, res) => {
        const { id } = req.params;
        const { message, status, data } = await ClienteServices.getOne(id);
        return res.status(status).json({ message, data });
    };

    registroRecepcion = async (req, res) => {
        const { message, status, data } = await ClienteServices.registroRecepcion(req.body);
        return res.status(status).json({ message, data });
    };

    created = async (req, res) => {
        const { message, status, data } = await ClienteServices.create(req.body);
        return res.status(status).json({ message, data });
    };

updated = async (req, res) => {
    const { id } = req.params;
    const { message, status, data } = await ClienteServices.update(id, req.body);
    return res.status(status).json({ message, data });
};

    deleted = async (req, res) => {
        const { id } = req.params;
        const { message, status, data } = await ClienteServices.delete(id);
        return res.status(status).json({ message, data });
    };
}