const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const registrarRecepcion = async (req, res) => {
    const { 
        cedula_rif, nombre, apellido, telefono, direccion, correo,
        placa, marca, modelo, ano, kilometraje, gasolina 
    } = req.body;

    try {
        const resultado = await prisma.$transaction(async (tx) => {
            // 1. Buscar o Crear Cliente
            let cliente = await tx.cliente.findUnique({
                where: { cedula_rif: cedula_rif }
            });

            if (!cliente) {
                cliente = await tx.cliente.create({
                    data: {
                        cedula_rif,
                        nombre,
                        apellido,
                        telefono,
                        direccion,
                        correo
                    }
                });
            }

            // 2. Registrar el Carro vinculado al Cliente
            const nuevoCarro = await tx.carro.upsert({
                where: { placa: placa },
                update: {
                    id_cliente: cliente.id_cliente,
                    kilometraje: parseInt(kilometraje),
                    capacidad_tanque: gasolina
                },
                create: {
                    placa,
                    marca,
                    modelo,
                    ano: parseInt(ano),
                    kilometraje: parseInt(kilometraje),
                    capacidad_tanque: gasolina,
                    id_cliente: cliente.id_cliente
                }
            });

            return { cliente, nuevoCarro };
        });

        res.status(201).json({ mensaje: "Registro completado", data: resultado });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { registrarRecepcion };