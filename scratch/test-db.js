import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function test() {
  try {
    console.log("Testing Gastos query...");
    const gastos = await prisma.gasto.findMany({
      include: { 
        usuario: { select: { nombre: true, apellido: true } },
        proveedor: true 
      },
      orderBy: { fecha: 'desc' }
    });
    console.log("Gastos found:", gastos.length);

    console.log("Testing Compras query...");
    const compras = await prisma.compra.findMany({
      include: { 
        usuario: { select: { nombre: true, apellido: true } },
        proveedor: true 
      },
      orderBy: { fecha: 'desc' }
    });
    console.log("Compras found:", compras.length);

    process.exit(0);
  } catch (error) {
    console.error("TEST FAILED");
    console.error(error);
    process.exit(1);
  }
}

test();
