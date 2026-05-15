import { prisma } from '../src/config/prisma.config.js';

const cols = await prisma.$queryRaw`
  SELECT column_name, data_type, column_default
  FROM information_schema.columns
  WHERE table_name = 'proveedores'
  ORDER BY ordinal_position
`;
console.log('Columnas reales en tabla proveedores:');
console.table(cols);

await prisma.$disconnect();
