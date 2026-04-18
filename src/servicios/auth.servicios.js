import { prisma } from '../config/prisma.config.js';

export const AuthServices = {
  login: async (usuario, password) => {
    try {
      if (!usuario || !password) {
        return { message: 'Faltan credenciales', status: 400 };
      }

      const usuarioEncontrado = await prisma.usuario.findFirst({
        where: {
          OR: [
            { correo: usuario },
            { cedula_rif: usuario }
          ],
          contrasena: password
        }
      });

      if (usuarioEncontrado) {
        return {
          message: '¡Bienvenido al sistema!',
          status: 200,
          data: {
            success: true,
            empleado: {
              nombre: usuarioEncontrado.nombre,
              apellido: usuarioEncontrado.apellido,
              cargo: usuarioEncontrado.rol,
              cedula_rif: usuarioEncontrado.cedula_rif
            }
          }
        };
      } else {
        return { message: 'Usuario o contraseña incorrectos', status: 401, data: { success: false } };
      }
    } catch (error) {
      console.error('Error al autenticar:', error);
      return { message: 'Error en el servidor durante la autenticación', status: 500 };
    }
  }
};
