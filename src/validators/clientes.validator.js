import { body } from 'express-validator';

export class ClienteValidator {
  validateRecepcion = [
    body('cedula_rif', 'La cédula/RIF es requerida').notEmpty().trim(),
    body('nombre', 'El nombre es requerido').notEmpty().trim(),
    body('apellido', 'El apellido es requerido').notEmpty().trim(),
    body('correo', 'Correo inválido').optional().isEmail(), // Añadido
    body('placa', 'La placa del vehículo es requerida').notEmpty().trim(),
    body('marca', 'La marca del vehículo es requerida').notEmpty().trim()
  ];
}