import { Router } from 'express';
import { OrdenController } from '../controladores/ordenes.controladores.js';
import { OrdenValidator } from '../validators/ordenes.validator.js';
import { validateFields } from '../middlewares/validate-fields.middleware.js';

const router = Router();
const controller = new OrdenController();
const validator = new OrdenValidator();

// Rutas específicas ANTES de las parametrizadas
router.get('/finalizadas', controller.getFinalizadas);

router.get('/', controller.getAll);
router.get('/:id', ...validator.validateOrdenId, validateFields, controller.getOne);
router.post('/', ...validator.validateOrden, validateFields, controller.created);
router.put('/:id', ...validator.validateOrdenId, validateFields, controller.updated);
router.delete('/:id', ...validator.validateOrdenId, validateFields, controller.deleted);

export default router;
