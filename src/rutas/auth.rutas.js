import { Router } from 'express';
import { AuthController } from '../controladores/auth.controladores.js';
import { AuthValidator } from '../validators/auth.validator.js';
import { validateFields } from '../middlewares/validate-fields.middleware.js';

const router = Router();
const controller = new AuthController();
const validator = new AuthValidator();

router.post('/login', ...validator.validateLogin, validateFields, controller.login);

export default router;
