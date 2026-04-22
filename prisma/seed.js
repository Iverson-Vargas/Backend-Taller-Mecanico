import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando el poblado de la base de datos...');

  // 1. Crear Usuarios
  const usuario = await prisma.usuario.upsert({
    where: { correo: 'admin@taller.com' },
    update: { contrasena: '123456' },
    create: {
      correo: 'admin@taller.com',
      contrasena: '123456',
      rol: 'admin',
      cedula_rif: 'V-12345678',
      nombre: 'Admin',
      apellido: 'Sistema',
    },
  });
  console.log('Usuario admin creado/verificado.');

  // 2. Crear Clientes
  const cliente1 = await prisma.cliente.create({
    data: {
      cedula_rif: 'V-20123456',
      nombre: 'Juan',
      apellido: 'Perez',
      telefono: '0414-1234567',
      direccion: 'Av. Principal, Caracas',
    },
  });
  console.log('Cliente Juan Perez creado.');

  // 3. Crear Carros
  const carro1 = await prisma.carro.create({
    data: {
      placa: 'AB123CD',
      cliente: {
        connect: { id_cliente: cliente1.id_cliente }
      },
      marca: 'Toyota',
      modelo: 'Corolla',
      ano: 2010,
      kilometraje: 150000,
    },
  });
  console.log('Carro Toyota Corolla creado.');

  // 4. Crear Servicios
  await prisma.servicio.createMany({
    data: [
      { nombre_servicio: 'Cambio de Aceite', tipo_servicio: 'Mantenimiento', precio_base: 20.00 },
      { nombre_servicio: 'Alineación y Balanceo', tipo_servicio: 'Mantenimiento', precio_base: 30.00 },
      { nombre_servicio: 'Revisión de Frenos', tipo_servicio: 'Mecánica', precio_base: 40.00 },
    ],
  });
  console.log('Servicios base creados.');

  // 5. Crear Inventario (Repuestos)
  await prisma.inventario.createMany({
    data: [
      { codigo_barra: 'REP-001', descripcion: 'Aceite 15W40 Mineral', stock_actual: 50, precio_venta_sugerido: 5.00 },
      { codigo_barra: 'REP-002', descripcion: 'Filtro de Aceite Toyota', stock_actual: 30, precio_venta_sugerido: 8.00 },
      { codigo_barra: 'REP-003', descripcion: 'Pastillas de Freno', stock_actual: 20, precio_venta_sugerido: 25.00 },
    ],
  });
  console.log('Inventario base creado.');

  // 6. Crear Empleados
  await prisma.empleado.create({
    data: {
      id_empleado: 'V-15987654',
      cargo: 'Mecánico Principal',
      nombre: 'Carlos',
      apellido: 'Mendoza',
      telefono: '0424-9876543',
      direccion: 'Calle Sucre, Los Teques',
      sueldo_base: 300.00,
      aplica_comision: true,
      monto_comision_fija: null,
    },
  });
  console.log('Empleado Mecánico creado.');

  // 7. Crear Proveedores
  await prisma.proveedor.create({
    data: {
      rif: 'J-12345678-9',
      nombre_empresa: 'Autorepuestos El Motor, C.A.',
      especialidad: 'Repuestos Toyota y Chevrolet',
      nombre_contacto: 'Pedro',
      apellido_contacto: 'Gomez',
    },
  });
  console.log('Proveedor creado.');

  console.log('✅ Base de datos poblada exitosamente con datos de prueba.');
}

main()
  .catch((e) => {
    console.error('Error poblando la base de datos:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
