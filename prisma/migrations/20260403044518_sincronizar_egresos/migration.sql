/*
  Warnings:

  - You are about to drop the column `soporte` on the `gastos` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "gastos" DROP COLUMN "soporte",
ADD COLUMN     "estado" VARCHAR(20) DEFAULT 'POR PAGAR';
