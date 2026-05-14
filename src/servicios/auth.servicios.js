import { prisma } from '../config/prisma.config.js';

export const AuthServices = {
  login: async (usuario, password) => {
    try {
      if (!usuario || !password) {
        return { success: false, error: 'Faltan credenciales', status: 400 };
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
          success: true,
          message: '¡Bienvenido al sistema!',
          status: 200,
          data: {
            empleado: {
              nombre: usuarioEncontrado.nombre,
              apellido: usuarioEncontrado.apellido,
              cargo: usuarioEncontrado.rol,
              cedula_rif: usuarioEncontrado.cedula_rif
            }
          }
        };
      } else {
        return { success: false, error: 'Usuario o contraseña incorrectos', status: 401 };
      }
    } catch (error) {
      console.error('Error al autenticar:', error);
      return { success: false, error: 'Error en el servidor durante la autenticación', status: 500 };
    }
  }
};
