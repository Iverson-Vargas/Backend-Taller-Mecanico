import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...\n');

  // ============================================================
  // 1. USUARIOS (base para gastos, compras)
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
    where: { id_cliente: 1 },
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
    where: { id_cliente: 2 },
    update: {},
    create: {
      cedula_rif: 'V-19887766',
      nombre:     'Sofía',
      apellido:   'Blanco',
      telefono:   '0426-7778899',
      direccion:  'Urb. La California Norte',
    },
  });

  const cliente3 = await prisma.cliente.upsert({
    where: { id_cliente: 3 },
    update: {},
    create: {
      cedula_rif: 'J-30556677',
      nombre:     'Transportes Rápidos',
      apellido:   'C.A.',
      telefono:   '0212-5556677',
      direccion:  'Zona Industrial La Trinidad',
    },
  });

  // ============================================================
  // 4. CARROS
  // ============================================================
  console.log('🚗 Insertando carros...');
  await prisma.carro.createMany({
    data: [
      {
        placa:      'ABC123',
        id_cliente: cliente1.id_cliente,
        marca:      'Toyota',
        modelo:     'Corolla',
        ano:        2018,
        kilometraje: 75000,
        categoria:  'Sencillo',
      },
      {
        placa:      'XYZ789',
        id_cliente: cliente2.id_cliente,
        marca:      'Honda',
        modelo:     'Civic',
        ano:        2020,
        kilometraje: 45000,
        categoria:  'Alta Gama',
      },
      {
        placa:      'TRK001',
        id_cliente: cliente3.id_cliente,
        marca:      'Ford',
        modelo:     'F-350',
        ano:        2016,
        kilometraje: 120000,
        categoria:  'Carga Pesada',
      },
      {
        placa:      'CHV456',
        id_cliente: cliente1.id_cliente,
        marca:      'Chevrolet',
        modelo:     'Aveo',
        ano:        2015,
        kilometraje: 98000,
        categoria:  'Sencillo',
      },
    ],
    skipDuplicates: true,
  });

  // ============================================================
  // 5. SERVICIOS
  // ============================================================
  console.log('⚙️  Insertando servicios...');
  await prisma.servicio.createMany({
    data: [
      { nombre_servicio: 'Cambio de Aceite',          tipo_servicio: 'Mantenimiento', precio_base: 25.00 },
      { nombre_servicio: 'Cambio de Frenos',           tipo_servicio: 'Reparación',    precio_base: 80.00 },
      { nombre_servicio: 'Alineación y Balanceo',      tipo_servicio: 'Mantenimiento', precio_base: 40.00 },
      { nombre_servicio: 'Diagnóstico Computarizado',  tipo_servicio: 'Diagnóstico',   precio_base: 30.00 },
      { nombre_servicio: 'Cambio de Correa de Distribución', tipo_servicio: 'Reparación', precio_base: 150.00 },
      { nombre_servicio: 'Revisión Eléctrica General', tipo_servicio: 'Diagnóstico',   precio_base: 35.00 },
      { nombre_servicio: 'Cambio de Filtro de Aire',   tipo_servicio: 'Mantenimiento', precio_base: 15.00 },
      { nombre_servicio: 'Lavado de Motor',             tipo_servicio: 'Estética',      precio_base: 20.00 },
    ],
    skipDuplicates: true,
  });

  const servicios = await prisma.servicio.findMany();

  // ============================================================
  // 6. INVENTARIO (repuestos)
  // ============================================================
  console.log('📦 Insertando inventario...');
  await prisma.inventario.createMany({
    data: [
      { codigo_barra: 'REP-001', descripcion: 'Aceite Motor 10W-40 (1L)',          stock_actual: 50,  precio_venta_sugerido: 8.50  },
      { codigo_barra: 'REP-002', descripcion: 'Filtro de Aceite Universal',         stock_actual: 30,  precio_venta_sugerido: 5.00  },
      { codigo_barra: 'REP-003', descripcion: 'Pastillas de Freno Delanteras',      stock_actual: 20,  precio_venta_sugerido: 35.00 },
      { codigo_barra: 'REP-004', descripcion: 'Correa de Distribución Toyota',       stock_actual: 10,  precio_venta_sugerido: 45.00 },
      { codigo_barra: 'REP-005', descripcion: 'Bujías NGK (juego x4)',               stock_actual: 25,  precio_venta_sugerido: 18.00 },
      { codigo_barra: 'REP-006', descripcion: 'Filtro de Aire Chevrolet Aveo',       stock_actual: 15,  precio_venta_sugerido: 12.00 },
      { codigo_barra: 'REP-007', descripcion: 'Líquido de Frenos DOT4 (500ml)',      stock_actual: 40,  precio_venta_sugerido: 7.00  },
      { codigo_barra: 'REP-008', descripcion: 'Amortiguador Delantero Honda Civic',  stock_actual: 8,   precio_venta_sugerido: 75.00 },
    ],
    skipDuplicates: true,
  });

  const repuestos = await prisma.inventario.findMany();

  // ============================================================
  // 7. ÓRDENES DE SERVICIO
  // ============================================================
  console.log('📋 Insertando órdenes de servicio...');
  const orden1 = await prisma.ordenServicio.create({
    data: {
      placa_carro:          'ABC123',
      id_mecanico:          'V-11223344',
      diagnostico_inicial:  'Cliente reporta ruido en frenos y aceite bajo',
      diagnostico_tecnico:  'Pastillas desgastadas al 90%, aceite requiere cambio',
      estado:               'completada',
      prioridad:            'alta',
    },
  });

  const orden2 = await prisma.ordenServicio.create({
    data: {
      placa_carro:          'XYZ789',
      id_mecanico:          'V-55667788',
      diagnostico_inicial:  'Falla en sistema eléctrico, luces intermitentes',
      diagnostico_tecnico:  'Alternador con desgaste, batería por debajo del 60%',
      estado:               'en_proceso',
      prioridad:            'normal',
    },
  });

  const orden3 = await prisma.ordenServicio.create({
    data: {
      placa_carro:          'TRK001',
      id_mecanico:          'V-11223344',
      diagnostico_inicial:  'Mantenimiento preventivo 120.000 km',
      diagnostico_tecnico:  null,
      estado:               'recepcion',
      prioridad:            'normal',
    },
  });

  // ============================================================
  // 8. DETALLE ORDEN SERVICIOS
  // ============================================================
  console.log('🔩 Insertando detalles de servicios en órdenes...');
  await prisma.detalleOrdenServicio.createMany({
    data: [
      { id_orden: orden1.id_orden, id_servicio: servicios[0].id_servicio, precio_aplicado: 25.00 }, // Cambio aceite
      { id_orden: orden1.id_orden, id_servicio: servicios[1].id_servicio, precio_aplicado: 80.00 }, // Cambio frenos
      { id_orden: orden2.id_orden, id_servicio: servicios[5].id_servicio, precio_aplicado: 35.00 }, // Revisión eléctrica
      { id_orden: orden2.id_orden, id_servicio: servicios[3].id_servicio, precio_aplicado: 30.00 }, // Diagnóstico
      { id_orden: orden3.id_orden, id_servicio: servicios[0].id_servicio, precio_aplicado: 25.00 }, // Cambio aceite
      { id_orden: orden3.id_orden, id_servicio: servicios[6].id_servicio, precio_aplicado: 15.00 }, // Filtro de aire
    ],
    skipDuplicates: true,
  });

  // ============================================================
  // 9. DETALLE ORDEN REPUESTOS
  // ============================================================
  console.log('🔧 Insertando repuestos usados en órdenes...');
  await prisma.detalleOrdenRepuesto.createMany({
    data: [
      { id_orden: orden1.id_orden, id_repuesto: repuestos[0].id_repuesto, cantidad: 4 }, // 4L aceite
      { id_orden: orden1.id_orden, id_repuesto: repuestos[1].id_repuesto, cantidad: 1 }, // filtro aceite
      { id_orden: orden1.id_orden, id_repuesto: repuestos[2].id_repuesto, cantidad: 1 }, // pastillas freno
      { id_orden: orden3.id_orden, id_repuesto: repuestos[0].id_repuesto, cantidad: 6 }, // 6L aceite (camión)
      { id_orden: orden3.id_orden, id_repuesto: repuestos[5].id_repuesto, cantidad: 1 }, // filtro aire
    ],
  });

  // ============================================================
  // 10. FACTURAS
  // ============================================================
  console.log('🧾 Insertando facturas...');
  const factura1 = await prisma.factura.create({
    data: {
      id_orden:      orden1.id_orden,
      subtotal:      105.00,
      monto_iva:     15.75,
      monto_igtf:    3.15,
      monto_total:   123.90,
      tasa_cambio:   36.50,
      metodo_pago:   'Transferencia',
    },
  });

  // ============================================================
  // 11. DETALLE FACTURA REPUESTOS
  // ============================================================
  console.log('📄 Insertando detalles de factura...');
  await prisma.detalleFacturaRepuesto.createMany({
    data: [
      { id_factura: factura1.id_factura, id_repuesto: repuestos[0].id_repuesto, cantidad: 4,  precio_venta_unitario: 8.50  },
      { id_factura: factura1.id_factura, id_repuesto: repuestos[1].id_repuesto, cantidad: 1,  precio_venta_unitario: 5.00  },
      { id_factura: factura1.id_factura, id_repuesto: repuestos[2].id_repuesto, cantidad: 1,  precio_venta_unitario: 35.00 },
    ],
  });

  // ============================================================
  // 12. PROVEEDORES
  // ============================================================
  console.log('🏭 Insertando proveedores...');
  await prisma.proveedor.createMany({
    data: [
      {
        rif:               'J-12345678-9',
        nombre_empresa:    'Lubricantes del Centro C.A.',
        especialidad:      'Aceites y Lubricantes',
        nombre_contacto:   'Roberto',
        apellido_contacto: 'Silva',
      },
      {
        rif:               'J-98765432-1',
        nombre_empresa:    'Repuestos Auto Global S.A.',
        especialidad:      'Repuestos y Filtros',
        nombre_contacto:   'Ana',
        apellido_contacto: 'Morales',
      },
      {
        rif:               'J-55443322-0',
        nombre_empresa:    'ElectroAuto Caracas',
        especialidad:      'Componentes Eléctricos',
        nombre_contacto:   'Miguel',
        apellido_contacto: 'Castillo',
      },
    ],
    skipDuplicates: true,
  });

  const proveedores = await prisma.proveedor.findMany();

  // ============================================================
  // 13. GASTOS
  // ============================================================
  console.log('💸 Insertando gastos...');
  await prisma.gasto.createMany({
    data: [
      {
        registrado_por_usuario: 'V-12345678',
        id_proveedor:           proveedores[0].id_proveedor,
        descripcion:            'Compra de aceite 10W-40 para inventario',
        monto:                  320.00,
        categoria:              'herramientas',
        estado:                 'PAGADO',
      },
      {
        registrado_por_usuario: 'V-12345678',
        id_proveedor:           null,
        descripcion:            'Pago de alquiler del local - Abril 2026',
        monto:                  500.00,
        categoria:              'alquiler',
        estado:                 'PAGADO',
      },
      {
        registrado_por_usuario: 'V-98765432',
        id_proveedor:           null,
        descripcion:            'Factura CORPOELEC - Marzo 2026',
        monto:                  120.00,
        categoria:              'servicios_basicos',
        estado:                 'POR PAGAR',
      },
      {
        registrado_por_usuario: 'V-12345678',
        id_proveedor:           proveedores[2].id_proveedor,
        descripcion:            'Compra de multímetro digital y herramientas eléctricas',
        monto:                  85.00,
        categoria:              'herramientas',
        estado:                 'PAGADO',
      },
    ],
  });

  // ============================================================
  // 14. COMPRAS
  // ============================================================
  console.log('🛒 Insertando compras...');
  const compra1 = await prisma.compra.create({
    data: {
      registrado_por_usuario: 'V-12345678',
      id_proveedor:           proveedores[1].id_proveedor,
      descripcion:            'Pedido repuestos: pastillas, filtros y bujías',
      monto_total:            450.00,
      estado:                 'PAGADO',
    },
  });

  const compra2 = await prisma.compra.create({
    data: {
      registrado_por_usuario: 'V-98765432',
      id_proveedor:           proveedores[0].id_proveedor,
      descripcion:            'Restock aceite sintético 5W-30',
      monto_total:            280.00,
      estado:                 'POR PAGAR',
    },
  });

  // ============================================================
  // 15. DETALLE COMPRAS
  // ============================================================
  console.log('📝 Insertando detalles de compras...');
  await prisma.detalleCompra.createMany({
    data: [
      { id_compra: compra1.id_compra, id_repuesto: repuestos[2].id_repuesto, cantidad: 10, precio_compra_unitario: 25.00 },
      { id_compra: compra1.id_compra, id_repuesto: repuestos[1].id_repuesto, cantidad: 20, precio_compra_unitario: 3.50  },
      { id_compra: compra1.id_compra, id_repuesto: repuestos[4].id_repuesto, cantidad: 15, precio_compra_unitario: 12.00 },
      { id_compra: compra2.id_compra, id_repuesto: repuestos[0].id_repuesto, cantidad: 40, precio_compra_unitario: 7.00  },
    ],
  });

  // ============================================================
  // 16. NÓMINAS
  // ============================================================
  console.log('💰 Insertando nóminas...');
  await prisma.nomina.createMany({
    data: [
      {
        id_empleado:    'V-11223344',
        monto_sueldo:   800.00,
        monto_comision: 150.00,
        monto_total:    950.00,
        periodo:        '2026-04',
        tipo_pago:      'quincenal',
      },
      {
        id_empleado:    'V-55667788',
        monto_sueldo:   750.00,
        monto_comision: 80.00,
        monto_total:    830.00,
        periodo:        '2026-04',
        tipo_pago:      'quincenal',
      },
      {
        id_empleado:    'V-33445566',
        monto_sueldo:   600.00,
        monto_comision: 0.00,
        monto_total:    600.00,
        periodo:        '2026-04',
        tipo_pago:      'quincenal',
      },
      {
        id_empleado:    'V-11223344',
        monto_sueldo:   0.00,
        monto_comision: 200.00,
        monto_total:    200.00,
        periodo:        '2026-03',
        tipo_pago:      'comision',
      },
    ],
  });

  console.log('\n✅ Seed completado exitosamente.');
  console.log('   → Usuarios:       3');
  console.log('   → Empleados:      3');
  console.log('   → Clientes:       3');
  console.log('   → Carros:         4');
  console.log('   → Servicios:      8');
  console.log('   → Inventario:     8 repuestos');
  console.log('   → Órdenes:        3');
  console.log('   → Facturas:       1');
  console.log('   → Proveedores:    3');
  console.log('   → Gastos:         4');
  console.log('   → Compras:        2');
  console.log('   → Nóminas:        4');
}

main()
  .catch((e) => {
    console.error('❌ Error en el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
