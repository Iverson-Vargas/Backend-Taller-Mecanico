import { Router } from 'express';
import { ContabilidadController } from '../controladores/contabilidad.controladores.js';

const router = Router();
const controller = new ContabilidadController();

router.get('/', controller.getAll);
router.get('/proveedores', controller.getProveedores);
router.post('/proveedores', controller.postProveedor);
router.delete('/proveedores/:id', controller.deleteProveedor);
router.post('/', controller.create);
router.patch('/pagar', controller.patchEstado);
router.delete('/:id', controller.delete);

export default router;
