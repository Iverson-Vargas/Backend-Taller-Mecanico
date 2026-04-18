import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkUsers() {
  try {
    const users = await prisma.usuario.findMany();
    console.log("USERS IN DATABASE:");
    users.forEach(u => {
      console.log(`- ${u.nombre} ${u.apellido} (${u.rol}): Cedula/RIF: ${u.cedula_rif}, Correo: ${u.correo}`);
    });
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

checkUsers();
