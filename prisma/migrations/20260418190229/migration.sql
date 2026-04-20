/*
  Warnings:

  - You are about to drop the column `precio_applied` on the `detalle_orden_servicios` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "detalle_orden_servicios" DROP COLUMN "precio_applied",
ADD COLUMN     "precio_aplicado" DECIMAL(12,2);

-- AlterTable
ALTER TABLE "proveedores" ADD COLUMN     "id_persona" INTEGER;
