import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...\n');

  // Limpiar base de datos
  console.log('🧹 Limpiando base de datos...');
  await prisma.detalleFacturaRepuesto.deleteMany();
  await prisma.detalleOrdenRepuesto.deleteMany();
  await prisma.detalleOrdenServicio.deleteMany();
  await prisma.detalleCompra.deleteMany();
  await prisma.factura.deleteMany();
  await prisma.ordenServicio.deleteMany();
  await prisma.nomina.deleteMany();
  await prisma.gasto.deleteMany();
  await prisma.compra.deleteMany();
  await prisma.carro.deleteMany();
  await prisma.cliente.deleteMany();
  await prisma.servicio.deleteMany();
  await prisma.inventario.deleteMany();
  await prisma.empleado.deleteMany();
  await prisma.proveedor.deleteMany();
  await prisma.usuario.deleteMany();
  console.log('✨ Base de datos limpia.\n');

  // ============================================================
  // 1. USUARIOS
  // ============================================================
  console.log('👤 Insertando usuarios...');
  await prisma.usuario.createMany({
    data: [
      {
        cedula_rif: 'V-12345678',
        correo:     'admin@taller.com',
        contrasena: '1234',
        rol:        'admin',
        nombre:     'Carlos',
        apellido:   'Ramírez',
      },
      {
        cedula_rif: 'V-98765432',
        correo:     'recepcion@taller.com',
        contrasena: '1234',
        rol:        'recepcionista',
        nombre:     'María',
        apellido:   'González',
      },
      {
        cedula_rif: 'V-11223344',
        correo:     'mecanico@taller.com',
        contrasena: '1234',
        rol:        'mecanico',
        nombre:     'Luis',
        apellido:   'Pérez',
      },
    ],
    skipDuplicates: true,
  });

  // ============================================================
  // 2. EMPLEADOS
  // ============================================================
  console.log('🔧 Insertando empleados...');
  await prisma.empleado.createMany({
    data: [
      {
        id_empleado:         'V-11223344',
        cargo:               'Mecánico',
        nombre:              'Luis',
        apellido:            'Pérez',
        telefono:            '0412-1234567',
        direccion:           'Av. Bolívar, Caracas',
        sueldo_base:         800.00,
        aplica_comision:     true,
        monto_comision_fija: 50.00,
      },
      {
        id_empleado:         'V-55667788',
        cargo:               'Técnico Electricista',
        nombre:              'Pedro',
        apellido:            'Martínez',
        telefono:            '0424-9876543',
        direccion:           'Urb. Los Rosales, Caracas',
        sueldo_base:         750.00,
        aplica_comision:     true,
        monto_comision_fija: 40.00,
      },
      {
        id_empleado:         'V-33445566',
        cargo:               'Recepcionista',
        nombre:              'María',
        apellido:            'González',
        telefono:            '0416-5554433',
        direccion:           'Res. Los Pinos, Caracas',
        sueldo_base:         600.00,
        aplica_comision:     false,
        monto_comision_fija: null,
      },
    ],
    skipDuplicates: true,
  });

  // ============================================================
  // 3. CLIENTES
  // ============================================================
  console.log('🧑‍💼 Insertando clientes...');
  const cliente1 = await prisma.cliente.upsert({
    where: { cedula_rif: 'V-20111222' },
    update: {},
    create: {
      cedula_rif: 'V-20111222',
      nombre:     'Andrés',
      apellido:   'Torres',
      telefono:   '0412-3331122',
      direccion:  'Av. Miranda, Los Palos Grandes',
    },
  });

  const cliente2 = await prisma.cliente.upsert({
    where: { cedula_rif: 'V-19887766' },
    update: {},
    create: {
      cedula_rif: 'V-19887766',
      nombre:     'Sofía',
      apellido:   'Blanco',
      telefono:   '0426-7778899',
      direccion:  'Urb. La California Norte',
    },
  });

  // ============================================================
  // 4. CARROS
  // ============================================================
  console.log('🚗 Insertando carros...');
  await prisma.carro.createMany({
    data: [
      { placa: 'ABC123', id_cliente: cliente1.id_cliente, marca: 'Toyota', modelo: 'Corolla', ano: 2018, kilometraje: 75000, categoria: 'Sencillo' },
      { placa: 'XYZ789', id_cliente: cliente2.id_cliente, marca: 'Honda', modelo: 'Civic', ano: 2020, kilometraje: 45000, categoria: 'Alta Gama' },
    ],
    skipDuplicates: true,
  });

  // ============================================================
  // 5. SERVICIOS
  // ============================================================
  console.log('⚙️  Insertando servicios...');
  await prisma.servicio.createMany({
    data: [
      { nombre_servicio: 'Cambio de Aceite', tipo_servicio: 'Mantenimiento', precio_base: 25.00 },
      { nombre_servicio: 'Cambio de Frenos', tipo_servicio: 'Reparación', precio_base: 80.00 },
      { nombre_servicio: 'Alineación y Balanceo', tipo_servicio: 'Mantenimiento', precio_base: 40.00 },
    ],
    skipDuplicates: true,
  });

  const servicios = await prisma.servicio.findMany();

  // ============================================================
  // 6. INVENTARIO
  // ============================================================
  console.log('📦 Insertando inventario...');
  await prisma.inventario.createMany({
    data: [
      { codigo_barra: 'REP-001', descripcion: 'Aceite Motor 10W-40 (1L)', stock_actual: 50, precio_venta_sugerido: 8.50 },
      { codigo_barra: 'REP-002', descripcion: 'Filtro de Aceite Universal', stock_actual: 30, precio_venta_sugerido: 5.00 },
    ],
    skipDuplicates: true,
  });

  const repuestos = await prisma.inventario.findMany();

  // ============================================================
  // 7. ÓRDENES Y FACTURAS (Flujo completo con detalles)
  // ============================================================
  console.log('📋 Insertando órdenes, detalles y facturas históricas...');

  const createOrderAndFactura = async (placa, mecanicoId, monto, fecha, metodo, servicioId, repuestoId) => {
    const orden = await prisma.ordenServicio.create({
      data: {
        placa_carro: placa,
        id_mecanico: mecanicoId,
        estado: 'completada',
        fecha_ingreso: fecha,
      }
    });

    // Detalle de Servicio
    await prisma.detalleOrdenServicio.create({
      data: {
        id_orden: orden.id_orden,
        id_servicio: servicioId,
        precio_aplicado: monto * 0.7,
      }
    });

    // Detalle de Repuesto (opcional)
    if (repuestoId) {
      await prisma.detalleOrdenRepuesto.create({
        data: {
          id_orden: orden.id_orden,
          id_repuesto: repuestoId,
          cantidad: 1,
        }
      });
    }

    const factura = await prisma.factura.create({
      data: {
        id_orden: orden.id_orden,
        monto_total: monto,
        subtotal: monto * 0.84,
        monto_iva: monto * 0.16,
        metodo_pago: metodo,
        fecha_emision: fecha,
      }
    });

    // Detalle de Factura Repuesto (si hubo repuesto)
    if (repuestoId) {
      await prisma.detalleFacturaRepuesto.create({
        data: {
          id_factura: factura.id_factura,
          id_repuesto: repuestoId,
          cantidad: 1,
          precio_venta_unitario: monto * 0.3,
        }
      });
    }
  };

  const sId1 = servicios[0].id_servicio;
  const sId2 = servicios[1].id_servicio;
  const rId1 = repuestos[0].id_repuesto;

  // Enero
  await createOrderAndFactura('ABC123', 'V-11223344', 450.00, new Date('2026-01-15T10:00:00Z'), 'Efectivo', sId1, rId1);
  // Febrero
  await createOrderAndFactura('XYZ789', 'V-11223344', 320.00, new Date('2026-02-10T14:00:00Z'), 'Transferencia', sId2);
  // Marzo
  await createOrderAndFactura('ABC123', 'V-11223344', 150.00, new Date('2026-03-05T09:00:00Z'), 'Zelle', sId1);
  await createOrderAndFactura('XYZ789', 'V-11223344', 600.00, new Date('2026-03-25T11:00:00Z'), 'Efectivo', sId2, rId1);
  // Abril
  await createOrderAndFactura('ABC123', 'V-11223344', 200.00, new Date('2026-04-10T16:00:00Z'), 'Transferencia', sId1);

  // ============================================================
  // 8. PROVEEDORES
  // ============================================================
  console.log('🏭 Insertando proveedores...');
  await prisma.proveedor.createMany({
    data: [
      { rif: 'J-12345678-9', nombre_empresa: 'Lubricantes del Centro C.A.' },
      { rif: 'J-98765432-1', nombre_empresa: 'Repuestos Auto Global S.A.' },
    ],
    skipDuplicates: true,
  });
  const proveedores = await prisma.proveedor.findMany();

  // ============================================================
  // 9. GASTOS
  // ============================================================
  console.log('💸 Insertando gastos...');
  await prisma.gasto.createMany({
    data: [
      { registrado_por_usuario: 'V-12345678', descripcion: 'Alquiler Enero', monto: 500, categoria: 'alquiler', estado: 'PAGADO', fecha: new Date('2026-01-01T08:00:00Z') },
      { registrado_por_usuario: 'V-12345678', descripcion: 'Alquiler Febrero', monto: 500, categoria: 'alquiler', estado: 'PAGADO', fecha: new Date('2026-02-01T08:00:00Z') },
      { registrado_por_usuario: 'V-12345678', descripcion: 'Alquiler Marzo', monto: 500, categoria: 'alquiler', estado: 'PAGADO', fecha: new Date('2026-03-01T08:00:00Z') },
      { registrado_por_usuario: 'V-12345678', descripcion: 'Alquiler Abril', monto: 500, categoria: 'alquiler', estado: 'PAGADO', fecha: new Date('2026-04-01T08:00:00Z') },
      { registrado_por_usuario: 'V-12345678', descripcion: 'Luz Marzo', monto: 80, categoria: 'servicios_basicos', estado: 'PAGADO', fecha: new Date('2026-03-15T10:00:00Z') },
    ],
  });

  // ============================================================
  // 10. COMPRAS (con detalles)
  // ============================================================
  console.log('🛒 Insertando compras y detalles...');
  const compra1 = await prisma.compra.create({
    data: {
      registrado_por_usuario: 'V-12345678',
      id_proveedor: proveedores[0].id_proveedor,
      descripcion: 'Stock Aceite',
      monto_total: 300,
      estado: 'PAGADO',
      fecha: new Date('2026-02-15T10:00:00Z')
    }
  });

  await prisma.detalleCompra.create({
    data: {
      id_compra: compra1.id_compra,
      id_repuesto: repuestos[0].id_repuesto,
      cantidad: 40,
      precio_compra_unitario: 7.5
    }
  });

  const compra2 = await prisma.compra.create({
    data: {
      registrado_por_usuario: 'V-12345678',
      id_proveedor: proveedores[1].id_proveedor,
      descripcion: 'Stock Filtros',
      monto_total: 150,
      estado: 'PAGADO',
      fecha: new Date('2026-03-20T10:00:00Z')
    }
  });

  await prisma.detalleCompra.create({
    data: {
      id_compra: compra2.id_compra,
      id_repuesto: repuestos[1].id_repuesto,
      cantidad: 20,
      precio_compra_unitario: 7.5
    }
  });

  // ============================================================
  // 11. NÓMINAS
  // ============================================================
  console.log('💰 Insertando nóminas...');
  await prisma.nomina.createMany({
    data: [
      { id_empleado: 'V-11223344', monto_sueldo: 800, monto_comision: 100, monto_total: 900, periodo: '2026-01', fecha_pago: new Date('2026-01-30T12:00:00Z') },
      { id_empleado: 'V-11223344', monto_sueldo: 800, monto_comision: 120, monto_total: 920, periodo: '2026-02', fecha_pago: new Date('2026-02-28T12:00:00Z') },
      { id_empleado: 'V-11223344', monto_sueldo: 800, monto_comision: 150, monto_total: 950, periodo: '2026-03', fecha_pago: new Date('2026-03-30T12:00:00Z') },
    ],
  });

  console.log('\n✅ Seed completado con éxito con datos en TODAS las tablas.');
}

main()
  .catch((e) => {
    console.error('❌ Error en el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
