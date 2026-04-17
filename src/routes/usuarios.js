const express = require('express');
const router = express.Router();
const prisma = require('../../db');

// POST /api/auth/login - Iniciar Sesión (Login Empleados / Admin)
router.post('/login', async (req, res) => {
    const { usuario, password } = req.body;

    if (!usuario || !password) {
        return res.status(400).json({ success: false, error: 'Faltan credenciales' });
    }

    try {
        // Buscar al usuario por correo o por cedula_rif en la tabla usuarios
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
            // Retornamos 200 OK
            res.status(200).json({ 
                success: true, 
                mensaje: "¡Bienvenido al sistema!", 
                empleado: { 
                    nombre: usuarioEncontrado.nombre, 
                    cargo: usuarioEncontrado.rol 
                } 
            });
        } else {
            // Retornamos 401 Unauthorized si las credenciales fallan
            res.status(401).json({ success: false, error: "Usuario o contraseña incorrectos" });
        }
    } catch (error) {
        console.error("Error al autenticar usuario:", error);
        res.status(500).json({ success: false, error: "Error en el servidor durante la autenticación" });
    }
});

module.exports = router;
