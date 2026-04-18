import { body, param } from 'express-validator';

export class FacturaValidator {
  validateFacturaId = [
    param('id', 'El ID de la factura debe ser un número entero válido').isInt({ min: 1 })
  ];

  validateFactura = [
    body('id_orden', 'El ID de la orden es requerido').notEmpty(),
    body('id_orden', 'El ID de la orden debe ser un número entero').isInt({ min: 1 }),
    body('monto_total', 'El monto total es requerido').notEmpty(),
    body('monto_total', 'El monto total debe ser un número positivo').isFloat({ min: 0 }),
    body('metodo_pago', 'El método de pago es requerido').optional().trim(),
    body('subtotal', 'El subtotal debe ser un número positivo').optional().isFloat({ min: 0 }),
    body('monto_iva', 'El monto IVA debe ser un número positivo').optional().isFloat({ min: 0 }),
    body('monto_igtf', 'El monto IGTF debe ser un número positivo').optional().isFloat({ min: 0 }),
    body('tasa_cambio', 'La tasa de cambio debe ser un número positivo').optional().isFloat({ min: 0 })
  ];
}
