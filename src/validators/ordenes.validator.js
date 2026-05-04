import { body, param } from 'express-validator';

export class OrdenValidator {
  validateOrdenId = [
    param('id', 'El ID de la orden debe ser un número entero válido').isInt({ min: 1 })
  ];

  validateOrden = [
    body('placa_carro', 'La placa del vehículo es requerida').notEmpty().trim(),
    body('falla_declarada', 'La falla declarada es requerida').notEmpty().trim(),
    body('estado', 'Estado inválido').optional().isIn([
      'recepcion', 'en_espera', 'en_reparacion', 'esperando_repuestos', 'finalizada', 'facturada', 'entregada'
    ])
  ];

  validateEstado = [
    param('id', 'El ID de la orden debe ser un número entero válido').isInt({ min: 1 }),
    body('estado', 'El estado es requerido').notEmpty(),
    body('estado', 'Estado inválido').isIn([
      'recepcion', 'en_espera', 'en_reparacion', 'esperando_repuestos', 'finalizada', 'facturada', 'entregada'
    ])
  ];
}