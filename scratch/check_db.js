import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.usuario.findMany({ take: 5 });
  const providers = await prisma.proveedor.findMany({ take: 5 });
  console.log("USUARIOS:", JSON.stringify(users, null, 2));
  console.log("PROVEEDORES:", JSON.stringify(providers, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
