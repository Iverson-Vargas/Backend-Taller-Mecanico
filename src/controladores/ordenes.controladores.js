const registrarOrden = async (req, res) => {
    const {
        placa_carro, id_mecanico, motivo_visita, falla_declarada,
        tiene_caucho, tiene_radio, tiene_rayones, observaciones
    } = req.body;

    try {
        const nuevaOrden = await prisma.ordenServicio.create({
            data: {
                placa_carro,
                id_mecanico, // Debe coincidir con un ID de la tabla Empleado
                motivo_visita,
                falla_declarada,
                tiene_caucho: Boolean(tiene_caucho),
                tiene_radio: Boolean(tiene_radio),
                tiene_rayones: Boolean(tiene_rayones),
                observaciones,
                estado: "Activa"
            }
        });

        res.status(201).json(nuevaOrden);
    } catch (error) {
        res.status(500).json({ error: "Error al crear la orden" });
    }
};