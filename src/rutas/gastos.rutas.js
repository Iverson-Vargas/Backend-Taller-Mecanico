import { Router } from 'express';
import { GastoController } from '../controladores/gastos.controladores.js';
import { GastoValidator } from '../validators/gastos.validator.js';
import { validateFields } from '../middlewares/validate-fields.middleware.js';

const router = Router();
const controller = new GastoController();
const validator = new GastoValidator();

router.get('/', controller.getAll);
router.get('/:id', ...validator.validateGastoId, validateFields, controller.getOne);
router.post('/', ...validator.validateGasto, validateFields, controller.created);
router.put('/:id', ...validator.validateGastoId, validateFields, controller.updated);
router.delete('/:id', ...validator.validateGastoId, validateFields, controller.deleted);

export default router;
