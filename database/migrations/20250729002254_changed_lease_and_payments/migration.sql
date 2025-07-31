/*
  Warnings:

  - You are about to drop the column `amountDue` on the `Lease` table. All the data in the column will be lost.
  - You are about to drop the column `rentDueDate` on the `Lease` table. All the data in the column will be lost.
  - You are about to drop the column `dueDate` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `paymentStatus` on the `Payment` table. All the data in the column will be lost.
  - Added the required column `rentDueDatePerMonth` to the `Lease` table without a default value. This is not possible if the table is not empty.
  - Added the required column `typeOfLease` to the `Lease` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_leaseId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_tenantId_fkey";

-- AlterTable
ALTER TABLE "Lease" DROP COLUMN "amountDue",
DROP COLUMN "rentDueDate",
ADD COLUMN     "rentDueDatePerMonth" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "typeOfLease" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "dueDate",
DROP COLUMN "paymentStatus";

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_leaseId_fkey" FOREIGN KEY ("leaseId") REFERENCES "Lease"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
