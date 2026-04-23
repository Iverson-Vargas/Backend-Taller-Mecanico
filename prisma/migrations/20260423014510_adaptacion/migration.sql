/*
  Warnings:

  - You are about to drop the column `categoria` on the `carros` table. All the data in the column will be lost.
  - You are about to drop the column `aplica_comision` on the `empleados` table. All the data in the column will be lost.
  - You are about to drop the column `direccion` on the `empleados` table. All the data in the column will be lost.
  - You are about to drop the column `monto_comision_fija` on the `empleados` table. All the data in the column will be lost.
  - You are about to drop the column `sueldo_base` on the `empleados` table. All the data in the column will be lost.
  - You are about to drop the column `telefono` on the `empleados` table. All the data in the column will be lost.
  - You are about to drop the column `fecha_emision` on the `facturas` table. All the data in the column will be lost.
  - You are about to drop the column `metodo_pago` on the `facturas` table. All the data in the column will be lost.
  - You are about to drop the column `monto_igtf` on the `facturas` table. All the data in the column will be lost.
  - You are about to drop the column `monto_iva` on the `facturas` table. All the data in the column will be lost.
  - You are about to drop the column `subtotal` on the `facturas` table. All the data in the column will be lost.
  - You are about to drop the column `tasa_cambio` on the `facturas` table. All the data in the column will be lost.
  - You are about to drop the column `codigo_barra` on the `inventario` table. All the data in the column will be lost.
  - You are about to drop the column `precio_venta_sugerido` on the `inventario` table. All the data in the column will be lost.
  - You are about to drop the column `diagnostico_inicial` on the `ordenes_servicio` table. All the data in the column will be lost.
  - You are about to drop the column `fecha_creacion` on the `ordenes_servicio` table. All the data in the column will be lost.
  - You are about to drop the column `prioridad` on the `ordenes_servicio` table. All the data in the column will be lost.
  - The primary key for the `usuarios` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `compras` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `detalle_compras` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `detalle_factura_repuestos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `gastos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `nomina` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `proveedores` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[cedula_rif]` on the table `clientes` will be added. If there are existing duplicate values, this will fail.
  - Made the column `id_cliente` on table `carros` required. This step will fail if there are existing NULL values in that column.
  - Made the column `id_orden` on table `detalle_orden_repuestos` required. This step will fail if there are existing NULL values in that column.
  - Made the column `id_repuesto` on table `detalle_orden_repuestos` required. This step will fail if there are existing NULL values in that column.
  - Made the column `id_orden` on table `facturas` required. This step will fail if there are existing NULL values in that column.
  - Made the column `stock_actual` on table `inventario` required. This step will fail if there are existing NULL values in that column.
  - Made the column `placa_carro` on table `ordenes_servicio` required. This step will fail if there are existing NULL values in that column.
  - Made the column `estado` on table `ordenes_servicio` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "carros" DROP CONSTRAINT "carros_id_cliente_fkey";

-- DropForeignKey
ALTER TABLE "compras" DROP CONSTRAINT "compras_id_proveedor_fkey";

-- DropForeignKey
ALTER TABLE "compras" DROP CONSTRAINT "compras_registrado_por_usuario_fkey";

-- DropForeignKey
ALTER TABLE "detalle_compras" DROP CONSTRAINT "detalle_compras_id_compra_fkey";

-- DropForeignKey
ALTER TABLE "detalle_compras" DROP CONSTRAINT "detalle_compras_id_repuesto_fkey";

-- DropForeignKey
ALTER TABLE "detalle_factura_repuestos" DROP CONSTRAINT "detalle_factura_repuestos_id_factura_fkey";

-- DropForeignKey
ALTER TABLE "detalle_factura_repuestos" DROP CONSTRAINT "detalle_factura_repuestos_id_repuesto_fkey";

-- DropForeignKey
ALTER TABLE "detalle_orden_repuestos" DROP CONSTRAINT "detalle_orden_repuestos_id_orden_fkey";

-- DropForeignKey
ALTER TABLE "detalle_orden_repuestos" DROP CONSTRAINT "detalle_orden_repuestos_id_repuesto_fkey";

-- DropForeignKey
ALTER TABLE "detalle_orden_servicios" DROP CONSTRAINT "detalle_orden_servicios_id_orden_fkey";

-- DropForeignKey
ALTER TABLE "detalle_orden_servicios" DROP CONSTRAINT "detalle_orden_servicios_id_servicio_fkey";

-- DropForeignKey
ALTER TABLE "facturas" DROP CONSTRAINT "facturas_id_orden_fkey";

-- DropForeignKey
ALTER TABLE "gastos" DROP CONSTRAINT "gastos_id_proveedor_fkey";

-- DropForeignKey
ALTER TABLE "gastos" DROP CONSTRAINT "gastos_registrado_por_usuario_fkey";

-- DropForeignKey
ALTER TABLE "nomina" DROP CONSTRAINT "nomina_id_empleado_fkey";

-- DropForeignKey
ALTER TABLE "ordenes_servicio" DROP CONSTRAINT "ordenes_servicio_id_mecanico_fkey";

-- DropForeignKey
ALTER TABLE "ordenes_servicio" DROP CONSTRAINT "ordenes_servicio_placa_carro_fkey";

-- DropIndex
DROP INDEX "inventario_codigo_barra_key";

-- AlterTable
ALTER TABLE "carros" DROP COLUMN "categoria",
ADD COLUMN     "capacidad_tanque" VARCHAR(20),
ALTER COLUMN "id_cliente" SET NOT NULL;

-- AlterTable
ALTER TABLE "clientes" ADD COLUMN     "correo" VARCHAR(100);

-- AlterTable
ALTER TABLE "detalle_orden_repuestos" ALTER COLUMN "id_orden" SET NOT NULL,
ALTER COLUMN "id_repuesto" SET NOT NULL;

-- AlterTable
ALTER TABLE "empleados" DROP COLUMN "aplica_comision",
DROP COLUMN "direccion",
DROP COLUMN "monto_comision_fija",
DROP COLUMN "sueldo_base",
DROP COLUMN "telefono";

-- AlterTable
ALTER TABLE "facturas" DROP COLUMN "fecha_emision",
DROP COLUMN "metodo_pago",
DROP COLUMN "monto_igtf",
DROP COLUMN "monto_iva",
DROP COLUMN "subtotal",
DROP COLUMN "tasa_cambio",
ALTER COLUMN "id_orden" SET NOT NULL;

-- AlterTable
ALTER TABLE "inventario" DROP COLUMN "codigo_barra",
DROP COLUMN "precio_venta_sugerido",
ALTER COLUMN "stock_actual" SET NOT NULL;

-- AlterTable
ALTER TABLE "ordenes_servicio" DROP COLUMN "diagnostico_inicial",
DROP COLUMN "fecha_creacion",
DROP COLUMN "prioridad",
ADD COLUMN     "falla_declarada" TEXT,
ADD COLUMN     "fecha_ingreso" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "hora_ingreso" VARCHAR(10),
ADD COLUMN     "motivo_visita" TEXT,
ADD COLUMN     "observaciones" TEXT,
ADD COLUMN     "tiene_caucho" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tiene_radio" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tiene_rayones" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "placa_carro" SET NOT NULL,
ALTER COLUMN "estado" SET NOT NULL,
ALTER COLUMN "estado" SET DEFAULT 'Activa';

-- AlterTable
ALTER TABLE "usuarios" DROP CONSTRAINT "usuarios_pkey",
ALTER COLUMN "rol" SET DEFAULT 'user',
ALTER COLUMN "cedula_rif" DROP NOT NULL,
ADD CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id_usuario");

-- DropTable
DROP TABLE "compras";

-- DropTable
DROP TABLE "detalle_compras";

-- DropTable
DROP TABLE "detalle_factura_repuestos";

-- DropTable
DROP TABLE "gastos";

-- DropTable
DROP TABLE "nomina";

-- DropTable
DROP TABLE "proveedores";

-- CreateIndex
CREATE UNIQUE INDEX "clientes_cedula_rif_key" ON "clientes"("cedula_rif");

-- AddForeignKey
ALTER TABLE "carros" ADD CONSTRAINT "carros_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "clientes"("id_cliente") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ordenes_servicio" ADD CONSTRAINT "ordenes_servicio_placa_carro_fkey" FOREIGN KEY ("placa_carro") REFERENCES "carros"("placa") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ordenes_servicio" ADD CONSTRAINT "ordenes_servicio_id_mecanico_fkey" FOREIGN KEY ("id_mecanico") REFERENCES "empleados"("id_empleado") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_orden_servicios" ADD CONSTRAINT "detalle_orden_servicios_id_orden_fkey" FOREIGN KEY ("id_orden") REFERENCES "ordenes_servicio"("id_orden") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_orden_servicios" ADD CONSTRAINT "detalle_orden_servicios_id_servicio_fkey" FOREIGN KEY ("id_servicio") REFERENCES "servicios"("id_servicio") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_orden_repuestos" ADD CONSTRAINT "detalle_orden_repuestos_id_orden_fkey" FOREIGN KEY ("id_orden") REFERENCES "ordenes_servicio"("id_orden") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_orden_repuestos" ADD CONSTRAINT "detalle_orden_repuestos_id_repuesto_fkey" FOREIGN KEY ("id_repuesto") REFERENCES "inventario"("id_repuesto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facturas" ADD CONSTRAINT "facturas_id_orden_fkey" FOREIGN KEY ("id_orden") REFERENCES "ordenes_servicio"("id_orden") ON DELETE RESTRICT ON UPDATE CASCADE;
