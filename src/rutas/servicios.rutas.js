import { Router } from 'express';
import { ServicioController } from '../controladores/servicios.controladores.js';
import { ServicioValidator } from '../validators/servicios.validator.js';
import { validateFields } from '../middlewares/validate-fields.middleware.js';

const router = Router();
const controller = new ServicioController();
const validator = new ServicioValidator();

router.get('/', controller.getAll);
router.get('/:id', ...validator.validateServicioId, validateFields, controller.getOne);
router.post('/', ...validator.validateServicio, validateFields, controller.created);
router.put('/:id', ...validator.validateServicioId, validateFields, controller.updated);
router.delete('/:id', ...validator.validateServicioId, validateFields, controller.deleted);

export default router;
