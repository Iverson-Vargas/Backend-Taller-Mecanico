import { body, param } from 'express-validator';

export class VehiculoValidator {
  validatePlaca = [
    param('placa', 'La placa es requerida').notEmpty().trim()
  ];

  validateVehiculo = [
    body('placa', 'La placa es requerida').notEmpty().trim(),
    body('id_cliente', 'El ID del cliente es requerido').optional().isInt({ min: 1 }),
    body('marca', 'La marca es requerida').notEmpty().trim(),
    body('modelo', 'El modelo es requerido').notEmpty().trim(),
    body('categoria', 'Categoría inválida').optional().isIn(['Sencillo', 'Carga Pesada', 'Alta Gama'])
  ];
}
