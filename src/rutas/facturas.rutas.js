import { Router } from 'express';
import { FacturaController } from '../controladores/facturas.controladores.js';
import { FacturaValidator } from '../validators/facturas.validator.js';
import { validateFields } from '../middlewares/validate-fields.middleware.js';

const router = Router();
const controller = new FacturaController();
const validator = new FacturaValidator();

router.get('/', controller.getAll);
router.get('/:id', ...validator.validateFacturaId, validateFields, controller.getOne);
router.post('/', ...validator.validateFactura, validateFields, controller.created);

export default router;
