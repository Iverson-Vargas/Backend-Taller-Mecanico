import { Router } from 'express';
import { VehiculoController } from '../controladores/vehiculos.controladores.js';

const router = Router();
const controller = new VehiculoController();

router.get('/cliente/:cedula', controller.getByClienteCedula);
router.get('/', controller.getAll);
router.get('/:placa', controller.getByPlaca);
router.post('/', controller.create);
router.put('/:placa', controller.update);
router.delete('/:placa', controller.delete);

export default router;