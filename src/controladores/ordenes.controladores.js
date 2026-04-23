import { OrdenServices } from '../servicios/ordenes.servicios.js';

export class OrdenController {
    getFinalizadas = async (req, res) => {
        const { message, status, data } = await OrdenServices.getFinalizadas();
        return res.status(status).json({ message, data });
    };

    getAll = async (req, res) => {
        const { message, status, data } = await OrdenServices.getAll();
        return res.status(status).json({ message, data });
    };

    getOne = async (req, res) => {
        const { id } = req.params;
        const { message, status, data } = await OrdenServices.getOne(id);
        return res.status(status).json({ message, data });
    };

    created = async (req, res) => {
        const { message, status, data } = await OrdenServices.create(req.body);
        return res.status(status).json({ message, data });
    };

    updated = async (req, res) => {
        const { id } = req.params;
        const { message, status, data } = await OrdenServices.update(id, req.body);
        return res.status(status).json({ message, data });
    };

    deleted = async (req, res) => {
        const { id } = req.params;
        const { message, status, data } = await OrdenServices.delete(id);
        return res.status(status).json({ message, data });
    };
}