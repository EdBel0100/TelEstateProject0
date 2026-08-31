/*
  Warnings:

  - You are about to drop the column `leaseId` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `tenantId` on the `Payment` table. All the data in the column will be lost.
  - Added the required column `templateId` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Made the column `propertyId` on table `Tenant` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_leaseId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "Tenant" DROP CONSTRAINT "Tenant_propertyId_fkey";

-- DropIndex
DROP INDEX "Payment_tenantId_key";

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "leaseId",
DROP COLUMN "tenantId",
ADD COLUMN     "templateId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Tenant" ALTER COLUMN "propertyId" SET NOT NULL;

-- CreateTable
CREATE TABLE "PaymentTemplate" (
    "id" SERIAL NOT NULL,
    "amountDue" INTEGER NOT NULL,
    "amountPaid" INTEGER NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL,
    "leaseId" INTEGER NOT NULL,
    "tenantId" INTEGER NOT NULL,

    CONSTRAINT "PaymentTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PaymentTemplate_tenantId_key" ON "PaymentTemplate"("tenantId");

-- AddForeignKey
ALTER TABLE "Tenant" ADD CONSTRAINT "Tenant_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentTemplate" ADD CONSTRAINT "PaymentTemplate_leaseId_fkey" FOREIGN KEY ("leaseId") REFERENCES "Lease"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentTemplate" ADD CONSTRAINT "PaymentTemplate_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "PaymentTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
