const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ==========================================
// 1. OBTENER TODOS LOS EGRESOS (GET)
// ==========================================
exports.getEgresos = async (req, res) => {
    try {
        // Buscamos en ambas tablas e incluimos datos del usuario y proveedor
        const gastos = await prisma.gasto.findMany({
            include: { 
                usuario: { select: { nombre: true } },
                proveedor: true 
            },
            orderBy: { fecha: 'desc' }
        });

        const compras = await prisma.compra.findMany({
            include: { 
                usuario: { select: { nombre: true } },
                proveedor: true 
            },
            orderBy: { fecha: 'desc' }
        });

        res.json({ gastos, compras });
    } catch (error) {
        console.error("Error al obtener egresos:", error);
        res.status(500).json({ error: "Error al obtener la lista de egresos" });
    }
};

// ==========================================
// 2. CREAR EGRESO (POST)
// ==========================================
exports.createEgreso = async (req, res) => {
    const { tipo, descripcion, monto, id_proveedor, usuarioLogueado, estado } = req.body;

    try {
        // Estructura base común
        const dataBase = {
            descripcion: descripcion,
            estado: estado || "POR PAGAR",
            fecha: new Date(),
            usuario: { connect: { cedula_rif: usuarioLogueado } }
        };

        // Vinculación opcional de proveedor
        if (id_proveedor) {
            dataBase.proveedor = { connect: { id_proveedor: parseInt(id_proveedor) } };
        }

        if (tipo === 'Gasto') {
            const nuevoGasto = await prisma.gasto.create({
                data: { ...dataBase, monto: parseFloat(monto) }
            });
            return res.status(201).json(nuevoGasto);
        } else {
            const nuevaCompra = await prisma.compra.create({
                data: { ...dataBase, monto_total: parseFloat(monto) }
            });
            return res.status(201).json(nuevaCompra);
        }
    } catch (error) {
        console.error("Error al crear egreso:", error);
        res.status(500).json({ error: "Error interno", detalle: error.message });
    }
};

// ==========================================
// 3. ACTUALIZAR ESTADO A PAGADO (PATCH)
// ==========================================
exports.updateEstado = async (req, res) => {
    const { id, tipo } = req.body; // Enviamos el ID y si es 'Gasto' o 'Compra'

    try {
        if (tipo === 'Gasto') {
            const actualizado = await prisma.gasto.update({
                where: { id_gasto: parseInt(id) },
                data: { estado: 'PAGADO' }
            });
            res.json({ mensaje: "Gasto marcado como pagado", actualizado });
        } else {
            const actualizado = await prisma.compra.update({
                where: { id_compra: parseInt(id) },
                data: { estado: 'PAGADO' }
            });
            res.json({ mensaje: "Compra marcada como pagada", actualizado });
        }
    } catch (error) {
        res.status(500).json({ error: "No se pudo actualizar el estado" });
    }
};

// ==========================================
// 4. ELIMINAR EGRESO (DELETE)
// ==========================================
exports.deleteEgreso = async (req, res) => {
    const { id } = req.params;
    const { tipo } = req.query; // Lo recibimos por query: /api/egresos/5?tipo=Gasto

    try {
        if (tipo === 'Gasto') {
            await prisma.gasto.delete({
                where: { id_gasto: parseInt(id) }
            });
        } else {
            await prisma.compra.delete({
                where: { id_compra: parseInt(id) }
            });
        }
        res.json({ mensaje: "Egreso eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar:", error);
        res.status(500).json({ error: "No se pudo eliminar el registro" });
    }
};