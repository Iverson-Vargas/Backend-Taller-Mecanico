import { Router } from 'express';
import { ReporteController } from '../controladores/reportes.controladores.js';

const router = Router();
const controller = new ReporteController();

router.get('/balance', controller.getBalance);
router.get('/estado-resultados', controller.getEstadoResultados);
router.get('/rentabilidad-servicios', controller.getRentabilidadServicios);

export default router;
