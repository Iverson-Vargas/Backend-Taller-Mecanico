-- CreateTable
CREATE TABLE "carros" (
    "placa" VARCHAR(15) NOT NULL,
    "id_cliente" INTEGER,
    "marca" VARCHAR(50),
    "modelo" VARCHAR(50),
    "ano" INTEGER,
    "kilometraje" INTEGER,

    CONSTRAINT "carros_pkey" PRIMARY KEY ("placa")
);

-- CreateTable
CREATE TABLE "clientes" (
    "id_cliente" SERIAL NOT NULL,
    "id_persona" INTEGER,
    "cedula_rif" VARCHAR(20) NOT NULL,
    "nombre" VARCHAR(75),
    "apellido" VARCHAR(75),
    "telefono" VARCHAR(20),
    "direccion" TEXT,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id_cliente")
);

-- CreateTable
CREATE TABLE "compras" (
    "id_compra" SERIAL NOT NULL,
    "id_proveedor" INTEGER,
    "monto_total" DECIMAL(12,2),
    "fecha" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "compras_pkey" PRIMARY KEY ("id_compra")
);

-- CreateTable
CREATE TABLE "detalle_compras" (
    "id_detalle_compra" SERIAL NOT NULL,
    "id_compra" INTEGER,
    "id_repuesto" INTEGER,
    "cantidad" INTEGER NOT NULL,
    "precio_compra_unitario" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "detalle_compras_pkey" PRIMARY KEY ("id_detalle_compra")
);

-- CreateTable
CREATE TABLE "detalle_factura_repuestos" (
    "id_detalle_venta" SERIAL NOT NULL,
    "id_factura" INTEGER,
    "id_repuesto" INTEGER,
    "cantidad" INTEGER NOT NULL,
    "precio_venta_unitario" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "detalle_factura_repuestos_pkey" PRIMARY KEY ("id_detalle_venta")
);

-- CreateTable
CREATE TABLE "detalle_orden_repuestos" (
    "id_detalle_repuesto" SERIAL NOT NULL,
    "id_orden" INTEGER,
    "id_repuesto" INTEGER,
    "cantidad" INTEGER NOT NULL,

    CONSTRAINT "detalle_orden_repuestos_pkey" PRIMARY KEY ("id_detalle_repuesto")
);

-- CreateTable
CREATE TABLE "detalle_orden_servicios" (
    "id_orden" INTEGER NOT NULL,
    "id_servicio" INTEGER NOT NULL,
    "precio_aplicado" DECIMAL(12,2),

    CONSTRAINT "detalle_orden_servicios_pkey" PRIMARY KEY ("id_orden","id_servicio")
);

-- CreateTable
CREATE TABLE "empleados" (
    "id_empleado" VARCHAR(20) NOT NULL,
    "id_persona" INTEGER,
    "cargo" VARCHAR(50),
    "nombre" VARCHAR(75),
    "apellido" VARCHAR(75),
    "telefono" VARCHAR(20),
    "direccion" TEXT,
    "sueldo_base" DECIMAL(12,2),
    "aplica_comision" BOOLEAN DEFAULT false,
    "monto_comision_fija" DECIMAL(12,2),

    CONSTRAINT "empleados_pkey" PRIMARY KEY ("id_empleado")
);

-- CreateTable
CREATE TABLE "facturas" (
    "id_factura" SERIAL NOT NULL,
    "id_orden" INTEGER,
    "monto_total" DECIMAL(12,2) NOT NULL,
    "metodo_pago" VARCHAR(50),
    "fecha_emision" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "facturas_pkey" PRIMARY KEY ("id_factura")
);

-- CreateTable
CREATE TABLE "gastos" (
    "id_gasto" SERIAL NOT NULL,
    "registrado_por_usuario" VARCHAR(20),
    "descripcion" VARCHAR(100),
    "monto" DECIMAL(12,2),
    "fecha" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gastos_pkey" PRIMARY KEY ("id_gasto")
);

-- CreateTable
CREATE TABLE "inventario" (
    "id_repuesto" SERIAL NOT NULL,
    "codigo_barra" VARCHAR(50),
    "descripcion" VARCHAR(200),
    "stock_actual" INTEGER DEFAULT 0,
    "precio_venta_sugerido" DECIMAL(12,2),

    CONSTRAINT "inventario_pkey" PRIMARY KEY ("id_repuesto")
);

-- CreateTable
CREATE TABLE "nomina" (
    "id_pago" SERIAL NOT NULL,
    "id_empleado" VARCHAR(20),
    "monto_comision" DECIMAL(12,2),
    "fecha_pago" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "nomina_pkey" PRIMARY KEY ("id_pago")
);

-- CreateTable
CREATE TABLE "ordenes_servicio" (
    "id_orden" SERIAL NOT NULL,
    "placa_carro" VARCHAR(15),
    "id_mecanico" VARCHAR(20),
    "diagnostico_inicial" TEXT NOT NULL,
    "diagnostico_tecnico" TEXT,
    "estado" VARCHAR(30) DEFAULT 'recepcion',
    "fecha_creacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ordenes_servicio_pkey" PRIMARY KEY ("id_orden")
);

-- CreateTable
CREATE TABLE "proveedores" (
    "id_proveedor" SERIAL NOT NULL,
    "id_persona" INTEGER,
    "rif" VARCHAR(20) NOT NULL,
    "nombre_empresa" VARCHAR(100),
    "nombre_contacto" VARCHAR(75),
    "apellido_contacto" VARCHAR(75),

    CONSTRAINT "proveedores_pkey" PRIMARY KEY ("id_proveedor")
);

-- CreateTable
CREATE TABLE "servicios" (
    "id_servicio" SERIAL NOT NULL,
    "nombre_servicio" VARCHAR(100) NOT NULL,
    "tipo_servicio" VARCHAR(50),
    "precio_base" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "servicios_pkey" PRIMARY KEY ("id_servicio")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id_usuario" SERIAL NOT NULL,
    "id_persona" INTEGER,
    "correo" VARCHAR(100) NOT NULL,
    "contrasena" VARCHAR(255) NOT NULL,
    "rol" VARCHAR(20) NOT NULL,
    "cedula_rif" VARCHAR(20) NOT NULL,
    "nombre" VARCHAR(75),
    "apellido" VARCHAR(75),

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("cedula_rif")
);

-- CreateIndex
CREATE UNIQUE INDEX "facturas_id_orden_key" ON "facturas"("id_orden");

-- CreateIndex
CREATE UNIQUE INDEX "inventario_codigo_barra_key" ON "inventario"("codigo_barra");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_correo_key" ON "usuarios"("correo");

-- AddForeignKey
ALTER TABLE "carros" ADD CONSTRAINT "carros_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "clientes"("id_cliente") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "compras" ADD CONSTRAINT "compras_id_proveedor_fkey" FOREIGN KEY ("id_proveedor") REFERENCES "proveedores"("id_proveedor") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "detalle_compras" ADD CONSTRAINT "detalle_compras_id_compra_fkey" FOREIGN KEY ("id_compra") REFERENCES "compras"("id_compra") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "detalle_compras" ADD CONSTRAINT "detalle_compras_id_repuesto_fkey" FOREIGN KEY ("id_repuesto") REFERENCES "inventario"("id_repuesto") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "detalle_factura_repuestos" ADD CONSTRAINT "detalle_factura_repuestos_id_factura_fkey" FOREIGN KEY ("id_factura") REFERENCES "facturas"("id_factura") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "detalle_factura_repuestos" ADD CONSTRAINT "detalle_factura_repuestos_id_repuesto_fkey" FOREIGN KEY ("id_repuesto") REFERENCES "inventario"("id_repuesto") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "detalle_orden_repuestos" ADD CONSTRAINT "detalle_orden_repuestos_id_orden_fkey" FOREIGN KEY ("id_orden") REFERENCES "ordenes_servicio"("id_orden") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "detalle_orden_repuestos" ADD CONSTRAINT "detalle_orden_repuestos_id_repuesto_fkey" FOREIGN KEY ("id_repuesto") REFERENCES "inventario"("id_repuesto") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "detalle_orden_servicios" ADD CONSTRAINT "detalle_orden_servicios_id_orden_fkey" FOREIGN KEY ("id_orden") REFERENCES "ordenes_servicio"("id_orden") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "detalle_orden_servicios" ADD CONSTRAINT "detalle_orden_servicios_id_servicio_fkey" FOREIGN KEY ("id_servicio") REFERENCES "servicios"("id_servicio") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "facturas" ADD CONSTRAINT "facturas_id_orden_fkey" FOREIGN KEY ("id_orden") REFERENCES "ordenes_servicio"("id_orden") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "gastos" ADD CONSTRAINT "gastos_registrado_por_usuario_fkey" FOREIGN KEY ("registrado_por_usuario") REFERENCES "usuarios"("cedula_rif") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "nomina" ADD CONSTRAINT "nomina_id_empleado_fkey" FOREIGN KEY ("id_empleado") REFERENCES "empleados"("id_empleado") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ordenes_servicio" ADD CONSTRAINT "ordenes_servicio_placa_carro_fkey" FOREIGN KEY ("placa_carro") REFERENCES "carros"("placa") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ordenes_servicio" ADD CONSTRAINT "ordenes_servicio_id_mecanico_fkey" FOREIGN KEY ("id_mecanico") REFERENCES "empleados"("id_empleado") ON DELETE NO ACTION ON UPDATE NO ACTION;
