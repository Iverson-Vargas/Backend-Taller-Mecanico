/*
  Warnings:

  - You are about to drop the column `id_persona` on the `clientes` table. All the data in the column will be lost.
  - You are about to drop the column `id_persona` on the `empleados` table. All the data in the column will be lost.
  - You are about to drop the column `id_persona` on the `proveedores` table. All the data in the column will be lost.
  - You are about to drop the column `id_persona` on the `usuarios` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "carros" ADD COLUMN     "categoria" VARCHAR(30);

-- AlterTable
ALTER TABLE "clientes" DROP COLUMN "id_persona";

-- AlterTable
ALTER TABLE "detalle_orden_servicios" ADD COLUMN     "descripcion_especial" VARCHAR(200),
ADD COLUMN     "es_especial" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "empleados" DROP COLUMN "id_persona";

-- AlterTable
ALTER TABLE "facturas" ADD COLUMN     "monto_igtf" DECIMAL(12,2),
ADD COLUMN     "monto_iva" DECIMAL(12,2),
ADD COLUMN     "subtotal" DECIMAL(12,2),
ADD COLUMN     "tasa_cambio" DECIMAL(12,4);

-- AlterTable
ALTER TABLE "gastos" ADD COLUMN     "categoria" VARCHAR(50);

-- AlterTable
ALTER TABLE "nomina" ADD COLUMN     "monto_sueldo" DECIMAL(12,2),
ADD COLUMN     "monto_total" DECIMAL(12,2),
ADD COLUMN     "periodo" VARCHAR(20),
ADD COLUMN     "tipo_pago" VARCHAR(20);

-- AlterTable
ALTER TABLE "ordenes_servicio" ADD COLUMN     "prioridad" VARCHAR(20) DEFAULT 'normal';

-- AlterTable
ALTER TABLE "proveedores" DROP COLUMN "id_persona";

-- AlterTable
ALTER TABLE "usuarios" DROP COLUMN "id_persona";
