/*
  Warnings:

  - You are about to drop the column `leased` on the `Payment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tenantId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `amountDue` to the `Lease` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rentDueDate` to the `Lease` table without a default value. This is not possible if the table is not empty.
  - Added the required column `leaseId` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenantId` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_leased_fkey";

-- AlterTable
ALTER TABLE "Lease" ADD COLUMN     "amountDue" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "rentDueDate" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "leased",
ADD COLUMN     "leaseId" INTEGER NOT NULL,
ADD COLUMN     "tenantId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Payment_tenantId_key" ON "Payment"("tenantId");

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_leaseId_fkey" FOREIGN KEY ("leaseId") REFERENCES "Lease"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
