import { body, param } from 'express-validator';

export class GastoValidator {
  validateGastoId = [
    param('id', 'El ID del gasto debe ser un número entero válido').isInt({ min: 1 })
  ];

  validateGasto = [
    body('descripcion', 'La descripción del gasto es requerida').notEmpty().trim(),
    body('monto', 'El monto es requerido').notEmpty(),
    body('monto', 'El monto debe ser un número positivo').isFloat({ min: 0 }),
    body('categoria', 'Categoría inválida').optional().isIn([
      'alquiler', 'servicios_basicos', 'herramientas', 'insumos', 'nomina', 'otros'
    ])
  ];
}
