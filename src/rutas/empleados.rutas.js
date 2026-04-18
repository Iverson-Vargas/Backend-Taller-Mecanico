import { Router } from 'express';
import { EmpleadoController } from '../controladores/empleados.controladores.js';
import { EmpleadoValidator } from '../validators/empleados.validator.js';
import { validateFields } from '../middlewares/validate-fields.middleware.js';

const router = Router();
const controller = new EmpleadoController();
const validator = new EmpleadoValidator();

router.get('/', controller.getAll);
router.get('/:id', ...validator.validateEmpleadoId, validateFields, controller.getOne);
router.post('/', ...validator.validateEmpleado, validateFields, controller.created);
router.put('/:id', ...validator.validateEmpleadoId, validateFields, controller.updated);

// Comisiones
router.post('/calcular-comision', ...validator.validateComision, validateFields, controller.calcularComision);
router.get('/mis-comisiones/:id', ...validator.validateEmpleadoId, validateFields, controller.getComisiones);

export default router;
