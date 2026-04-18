import { body, param } from 'express-validator';

export class ClienteValidator {
  validateClienteId = [
    param('id', 'El ID debe ser un número entero válido').isInt({ min: 1 })
  ];

  validateCedula = [
    param('cedula', 'La cédula/RIF es requerida').notEmpty().trim()
  ];

  validateCliente = [
    body('cedula_rif', 'La cédula/RIF es requerida').notEmpty().trim(),
    body('nombre', 'El nombre es requerido').notEmpty().trim(),
    body('apellido', 'El apellido es requerido').notEmpty().trim()
  ];

  validateRecepcion = [
    body('cedula_rif', 'La cédula/RIF es requerida').notEmpty().trim(),
    body('nombre', 'El nombre es requerido').notEmpty().trim(),
    body('apellido', 'El apellido es requerido').notEmpty().trim(),
    body('placa', 'La placa del vehículo es requerida').notEmpty().trim(),
    body('marca', 'La marca del vehículo es requerida').notEmpty().trim()
  ];
}
