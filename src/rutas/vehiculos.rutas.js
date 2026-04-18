import { Router } from 'express';
import { VehiculoController } from '../controladores/vehiculos.controladores.js';
import { VehiculoValidator } from '../validators/vehiculos.validator.js';
import { validateFields } from '../middlewares/validate-fields.middleware.js';

const router = Router();
const controller = new VehiculoController();
const validator = new VehiculoValidator();

router.get('/', controller.getAll);
router.get('/:placa', ...validator.validatePlaca, validateFields, controller.getOne);
router.post('/', ...validator.validateVehiculo, validateFields, controller.created);
router.put('/:placa', ...validator.validatePlaca, validateFields, controller.updated);
router.delete('/:placa', ...validator.validatePlaca, validateFields, controller.deleted);

export default router;
