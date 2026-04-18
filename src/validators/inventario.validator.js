import { body, param } from 'express-validator';

export class InventarioValidator {
  validateRepuestoId = [
    param('id', 'El ID del repuesto debe ser un número entero válido').isInt({ min: 1 })
  ];

  validateRepuesto = [
    body('descripcion', 'La descripción del repuesto es requerida').notEmpty().trim(),
    body('stock_actual', 'El stock debe ser un entero >= 0').optional().isInt({ min: 0 }),
    body('precio_venta_sugerido', 'El precio de venta debe ser un número positivo').optional().isFloat({ min: 0 }),
    body('codigo_barra', 'Código de barra inválido').optional().trim()
  ];
}
