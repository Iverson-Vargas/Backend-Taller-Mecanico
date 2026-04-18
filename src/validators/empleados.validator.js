import { body, param } from 'express-validator';

export class EmpleadoValidator {
  validateEmpleadoId = [
    param('id', 'El ID del empleado es requerido').notEmpty().trim()
  ];

  validateEmpleado = [
    body('id_empleado', 'La cédula del empleado es requerida').notEmpty().trim(),
    body('nombre', 'El nombre es requerido').notEmpty().trim(),
    body('apellido', 'El apellido es requerido').notEmpty().trim(),
    body('cargo', 'El cargo es requerido').notEmpty().trim(),
    body('sueldo_base', 'El sueldo base debe ser un número positivo').optional().isFloat({ min: 0 }),
    body('aplica_comision', 'aplica_comision debe ser booleano').optional().isBoolean(),
    body('monto_comision_fija', 'El porcentaje de comisión debe ser un número entre 0 y 100').optional().isFloat({ min: 0, max: 100 })
  ];

  validateComision = [
    body('id_orden', 'El ID de la orden es requerido').notEmpty(),
    body('id_orden', 'El ID de la orden debe ser un número entero').isInt({ min: 1 })
  ];
}
