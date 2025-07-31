/*
  Warnings:

  - You are about to drop the `PaymentTemplate` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_templateId_fkey";

-- DropForeignKey
ALTER TABLE "PaymentTemplate" DROP CONSTRAINT "PaymentTemplate_leaseId_fkey";

-- DropForeignKey
ALTER TABLE "PaymentTemplate" DROP CONSTRAINT "PaymentTemplate_tenantId_fkey";

-- DropTable
DROP TABLE "PaymentTemplate";

-- CreateTable
CREATE TABLE "PaymentPlan" (
    "id" SERIAL NOT NULL,
    "amountDue" INTEGER NOT NULL,
    "amountPaid" INTEGER NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL,
    "leaseId" INTEGER NOT NULL,
    "tenantId" INTEGER NOT NULL,

    CONSTRAINT "PaymentPlan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PaymentPlan_tenantId_key" ON "PaymentPlan"("tenantId");

-- AddForeignKey
ALTER TABLE "PaymentPlan" ADD CONSTRAINT "PaymentPlan_leaseId_fkey" FOREIGN KEY ("leaseId") REFERENCES "Lease"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentPlan" ADD CONSTRAINT "PaymentPlan_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "PaymentPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
