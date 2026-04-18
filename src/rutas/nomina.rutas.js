import { Router } from 'express';
import { NominaController } from '../controladores/nomina.controladores.js';

const router = Router();
const controller = new NominaController();

router.get('/resumen', controller.getResumen);
router.get('/historial', controller.getHistorial);

export default router;
