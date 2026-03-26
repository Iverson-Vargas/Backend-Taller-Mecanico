const express = require('express');
const router = express.Router();
const prisma = require('../../db');

//obtener todos lo empleados (admin/Recepcionista)
router.get('/', async (req, res) => {
    try {
        const empleados = await prisma.empleado.findMany({
            include: {nominas: true} 
        });
        res.json(empleados);
    } catch (error) {
        res.status(500).json({ error: 'error al obtener empleados'});
    }
});

//registrar un nuevo empleado
router.post('/', async (req, res) => {
  const { id_empleado, nombre, apellido, cargo, sueldo_base, aplica_comision, monto_comision_fija } = req.body;
  try {
    const nuevoEmpleado = await prisma.empleado.create({
      data: { id_empleado, nombre, apellido, cargo, sueldo_base, aplica_comision, monto_comision_fija }
    });
    res.status(201).json(nuevoEmpleado);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear empleado' });
  }
});

//calcular y registrar la comision al finalizar
router.post('/calcular-comision', async (req,res) => {
    const { id_orden} = req.body;

    try {
        //buscar la orden
        const orden = await prisma.ordenServicion.findUnique({
            where:{ id_orden },
            include:{
                mecanico:true,
                detalle_orden_servicion: true
            }
        });

        if (!orden || !orden.mecanico.aplica_comision) {
            return res.status(400).json({ mensaje: 'Orden no encontrada o mecanico no aplica a comision'})
        }
        //calcular el total de mano de obra 
        const totalManoObra = orden.detalle_orden_servicion.reduce((acc, curr) => acc + Number(curr.precis_aplicado), 0);

        //calcular monto de comision 
        const montoPagar = totalManoObra * (Number(orden.mecanico.monto_comision_fija) / 100);

        //registro tabla Nomnina
        const nuevoPago = await prisma.nomina.create({
            data:{
                id_empleado: orden.id_empleado,
                monto_comision: montoPagar,
                fecha_pago: new Date()
            }
        });

        res.json({ mensaje: 'Comision calculada y pagada', detalle: nuevoPago});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al calcular comision' });
    }
});

router.get('/mis-comisiones/:id', async (req,res) =>{
    try {
        const historial = await prisma.nomina.findMany({
            where: {id_empleado: req.params.id},
            orderBy: {fecha_pago: 'desc'}
        });
        res.json(historial);
    } catch (error) {
        res.status(500).json({ error: 'error al consultar historial'});
    }
})

module.exports = router;