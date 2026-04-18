import { body } from 'express-validator';

export class AuthValidator {
  validateLogin = [
    body('usuario', 'El usuario (correo o cédula) es requerido').notEmpty().trim(),
    body('password', 'La contraseña es requerida').notEmpty()
  ];
}
