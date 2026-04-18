import { body, param } from 'express-validator';

export class ServicioValidator {
  validateServicioId = [
    param('id', 'El ID del servicio debe ser un número entero válido').isInt({ min: 1 })
  ];

  validateServicio = [
    body('nombre_servicio', 'El nombre del servicio es requerido').notEmpty().trim(),
    body('precio_base', 'El precio base es requerido').notEmpty(),
    body('precio_base', 'El precio base debe ser un número positivo').isFloat({ min: 0 }),
    body('tipo_servicio', 'Tipo de servicio inválido').optional().trim()
  ];
}
