import { Router } from 'express';
import { InventarioController } from '../controladores/inventario.controladores.js';
import { InventarioValidator } from '../validators/inventario.validator.js';
import { validateFields } from '../middlewares/validate-fields.middleware.js';

const router = Router();
const controller = new InventarioController();
const validator = new InventarioValidator();

router.get('/', controller.getAll);
router.get('/:id', ...validator.validateRepuestoId, validateFields, controller.getOne);
router.post('/', ...validator.validateRepuesto, validateFields, controller.created);
router.put('/:id', ...validator.validateRepuestoId, validateFields, controller.updated);
router.delete('/:id', ...validator.validateRepuestoId, validateFields, controller.deleted);

export default router;
