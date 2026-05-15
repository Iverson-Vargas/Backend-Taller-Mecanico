import { AuthServices } from '../servicios/auth.servicios.js';

export class AuthController {
  login = async (req, res) => {
    const { usuario, password } = req.body;
    const { success, message, status, data, error } = await AuthServices.login(usuario, password);
    if (!success) return res.status(status).json({ success, error });
    return res.status(status).json({ success, message, data });
  };
}
