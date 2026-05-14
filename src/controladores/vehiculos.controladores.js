import { VehiculoServices } from '../servicios/vehiculos.servicios.js';

export class VehiculoController {
    getAll = async (req, res) => {
        const { message, status, data } = await VehiculoServices.getAll();
        return res.status(status).json({ message, data });
    };

    getByPlaca = async (req, res) => {
        const { placa } = req.params;
        const { message, status, data } = await VehiculoServices.getByPlaca(placa);
        return res.status(status).json({ message, data });
    };

    // AGREGAR ESTE MÉTODO - Buscar vehículos por cédula del cliente
    getByClienteCedula = async (req, res) => {
        const { cedula } = req.params;
        const { message, status, data } = await VehiculoServices.getByClienteCedula(cedula);
        return res.status(status).json({ message, data });
    };

    create = async (req, res) => {
        const { message, status, data } = await VehiculoServices.create(req.body);
        return res.status(status).json({ message, data });
    };

    update = async (req, res) => {
        const { placa } = req.params;
        const { message, status, data } = await VehiculoServices.update(placa, req.body);
        return res.status(status).json({ message, data });
    };

    delete = async (req, res) => {
        const { placa } = req.params;
        const { message, status, data } = await VehiculoServices.delete(placa);
        return res.status(status).json({ message, data });
    };
}