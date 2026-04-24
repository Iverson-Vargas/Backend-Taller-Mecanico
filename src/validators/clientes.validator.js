import { body, param } from 'express-validator';

export class ClienteValidator {
  validateRecepcion = [
    body('cedula_rif', 'La cédula/RIF es requerida').notEmpty().trim(),
    body('nombre', 'El nombre es requerido').notEmpty().trim(),
    body('apellido', 'El apellido es requerido').notEmpty().trim(),
    body('correo', 'Correo inválido').optional({ checkFalsy: true }).isEmail(),
    body('placa', 'La placa del vehículo es requerida').notEmpty().trim(),
    body('marca', 'La marca del vehículo es requerida').notEmpty().trim()
  ];
  
  validateCedula = [
    param('cedula', 'La cédula es requerida').notEmpty().trim()
  ];
  
  validateClienteId = [
    param('id', 'El ID del cliente es requerido').notEmpty().trim()
  ];
  
  validateCliente = [
    body('cedula_rif', 'La cédula/RIF es requerida').notEmpty().trim(),
    body('nombre', 'El nombre es requerido').notEmpty().trim()
  ];
}