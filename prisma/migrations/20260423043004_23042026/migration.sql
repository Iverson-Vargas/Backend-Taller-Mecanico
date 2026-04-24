/*
  Warnings:

  - The primary key for the `usuarios` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[codigo_barra]` on the table `inventario` will be added. If there are existing duplicate values, this will fail.
  - Made the column `cedula_rif` on table `usuarios` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "carros" ADD COLUMN     "categoria" VARCHAR(30);

-- AlterTable
ALTER TABLE "empleados" ADD COLUMN     "aplica_comision" BOOLEAN DEFAULT false,
ADD COLUMN     "direccion" TEXT,
ADD COLUMN     "monto_comision_fija" DECIMAL(12,2),
ADD COLUMN     "sueldo_base" DECIMAL(12,2),
ADD COLUMN     "telefono" VARCHAR(20);

-- AlterTable
ALTER TABLE "facturas" ADD COLUMN     "fecha_emision" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "metodo_pago" VARCHAR(50),
ADD COLUMN     "monto_igtf" DECIMAL(12,2),
ADD COLUMN     "monto_iva" DECIMAL(12,2),
ADD COLUMN     "subtotal" DECIMAL(12,2),
ADD COLUMN     "tasa_cambio" DECIMAL(12,4);

-- AlterTable
ALTER TABLE "inventario" ADD COLUMN     "codigo_barra" VARCHAR(50),
ADD COLUMN     "precio_venta_sugerido" DECIMAL(12,2);

-- AlterTable
ALTER TABLE "ordenes_servicio" ADD COLUMN     "diagnostico_inicial" TEXT,
ADD COLUMN     "fecha_creacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "prioridad" VARCHAR(20) DEFAULT 'normal';

-- AlterTable
ALTER TABLE "usuarios" DROP CONSTRAINT "usuarios_pkey",
ALTER COLUMN "cedula_rif" SET NOT NULL,
ADD CONSTRAINT "usuarios_pkey" PRIMARY KEY ("cedula_rif");

-- CreateTable
CREATE TABLE "compras" (
    "id_compra" SERIAL NOT NULL,
    "id_proveedor" INTEGER,
    "registrado_por_usuario" VARCHAR(20),
    "descripcion" VARCHAR(100),
    "monto_total" DECIMAL(12,2),
    "fecha" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "estado" VARCHAR(20) DEFAULT 'POR PAGAR',

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
CREATE TABLE "gastos" (
    "id_gasto" SERIAL NOT NULL,
    "id_proveedor" INTEGER,
    "registrado_por_usuario" VARCHAR(20),
    "descripcion" VARCHAR(100),
    "monto" DECIMAL(12,2),
    "categoria" VARCHAR(50),
    "fecha" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "estado" VARCHAR(20) DEFAULT 'POR PAGAR',

    CONSTRAINT "gastos_pkey" PRIMARY KEY ("id_gasto")
);

-- CreateTable
CREATE TABLE "nomina" (
    "id_pago" SERIAL NOT NULL,
    "id_empleado" VARCHAR(20),
    "monto_comision" DECIMAL(12,2),
    "monto_sueldo" DECIMAL(12,2),
    "monto_total" DECIMAL(12,2),
    "periodo" VARCHAR(20),
    "tipo_pago" VARCHAR(20),
    "fecha_pago" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "nomina_pkey" PRIMARY KEY ("id_pago")
);

-- CreateTable
CREATE TABLE "proveedores" (
    "id_proveedor" SERIAL NOT NULL,
    "id_persona" INTEGER,
    "rif" VARCHAR(20) NOT NULL,
    "nombre_empresa" VARCHAR(100),
    "especialidad" VARCHAR(100),
    "nombre_contacto" VARCHAR(75),
    "apellido_contacto" VARCHAR(75),

    CONSTRAINT "proveedores_pkey" PRIMARY KEY ("id_proveedor")
);

-- CreateIndex
CREATE UNIQUE INDEX "inventario_codigo_barra_key" ON "inventario"("codigo_barra");

-- AddForeignKey
ALTER TABLE "compras" ADD CONSTRAINT "compras_registrado_por_usuario_fkey" FOREIGN KEY ("registrado_por_usuario") REFERENCES "usuarios"("cedula_rif") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compras" ADD CONSTRAINT "compras_id_proveedor_fkey" FOREIGN KEY ("id_proveedor") REFERENCES "proveedores"("id_proveedor") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_compras" ADD CONSTRAINT "detalle_compras_id_compra_fkey" FOREIGN KEY ("id_compra") REFERENCES "compras"("id_compra") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "detalle_compras" ADD CONSTRAINT "detalle_compras_id_repuesto_fkey" FOREIGN KEY ("id_repuesto") REFERENCES "inventario"("id_repuesto") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "detalle_factura_repuestos" ADD CONSTRAINT "detalle_factura_repuestos_id_factura_fkey" FOREIGN KEY ("id_factura") REFERENCES "facturas"("id_factura") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "detalle_factura_repuestos" ADD CONSTRAINT "detalle_factura_repuestos_id_repuesto_fkey" FOREIGN KEY ("id_repuesto") REFERENCES "inventario"("id_repuesto") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "gastos" ADD CONSTRAINT "gastos_registrado_por_usuario_fkey" FOREIGN KEY ("registrado_por_usuario") REFERENCES "usuarios"("cedula_rif") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gastos" ADD CONSTRAINT "gastos_id_proveedor_fkey" FOREIGN KEY ("id_proveedor") REFERENCES "proveedores"("id_proveedor") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nomina" ADD CONSTRAINT "nomina_id_empleado_fkey" FOREIGN KEY ("id_empleado") REFERENCES "empleados"("id_empleado") ON DELETE NO ACTION ON UPDATE NO ACTION;
