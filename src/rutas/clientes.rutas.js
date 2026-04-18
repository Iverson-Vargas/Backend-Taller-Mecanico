import { Router } from 'express';
import { ClienteController } from '../controladores/clientes.controladores.js';
import { ClienteValidator } from '../validators/clientes.validator.js';
import { validateFields } from '../middlewares/validate-fields.middleware.js';

const router = Router();
const controller = new ClienteController();
const validator = new ClienteValidator();

// Consulta de estado por cédula (Frontend EstadoCliente)
router.get('/consulta/:cedula', ...validator.validateCedula, validateFields, controller.consultaPorCedula);

// CRUD
router.get('/', controller.getAll);
router.get('/:id', ...validator.validateClienteId, validateFields, controller.getOne);

router.post('/', ...validator.validateCliente, validateFields, controller.created);

// Registro de recepción: cliente + vehículo en una transacción
router.post('/recepcion', ...validator.validateRecepcion, validateFields, controller.registroRecepcion);

router.put('/:id', ...validator.validateClienteId, validateFields, controller.updated);
router.delete('/:id', ...validator.validateClienteId, validateFields, controller.deleted);

export default router;
