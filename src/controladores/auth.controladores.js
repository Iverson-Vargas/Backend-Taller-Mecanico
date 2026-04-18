import { AuthServices } from '../servicios/auth.servicios.js';

export class AuthController {
  login = async (req, res) => {
    const { usuario, password } = req.body;
    const { message, status, data } = await AuthServices.login(usuario, password);
    if (status !== 200) return res.status(status).json({ success: false, error: message });
    return res.status(status).json(data);
  };
}
