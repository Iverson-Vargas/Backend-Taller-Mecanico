/*
  Warnings:

  - You are about to drop the column `precio_aplicado` on the `detalle_orden_servicios` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "compras" DROP CONSTRAINT "compras_id_proveedor_fkey";

-- DropForeignKey
ALTER TABLE "gastos" DROP CONSTRAINT "gastos_registrado_por_usuario_fkey";

-- AlterTable
ALTER TABLE "compras" ADD COLUMN     "registrado_por_usuario" VARCHAR(20);

-- AlterTable
ALTER TABLE "detalle_orden_servicios" DROP COLUMN "precio_aplicado",
ADD COLUMN     "precio_applied" DECIMAL(12,2);

-- AlterTable
ALTER TABLE "gastos" ADD COLUMN     "id_proveedor" INTEGER;

-- AddForeignKey
ALTER TABLE "compras" ADD CONSTRAINT "compras_registrado_por_usuario_fkey" FOREIGN KEY ("registrado_por_usuario") REFERENCES "usuarios"("cedula_rif") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compras" ADD CONSTRAINT "compras_id_proveedor_fkey" FOREIGN KEY ("id_proveedor") REFERENCES "proveedores"("id_proveedor") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gastos" ADD CONSTRAINT "gastos_registrado_por_usuario_fkey" FOREIGN KEY ("registrado_por_usuario") REFERENCES "usuarios"("cedula_rif") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gastos" ADD CONSTRAINT "gastos_id_proveedor_fkey" FOREIGN KEY ("id_proveedor") REFERENCES "proveedores"("id_proveedor") ON DELETE SET NULL ON UPDATE CASCADE;
