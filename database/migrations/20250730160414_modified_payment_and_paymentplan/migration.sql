/*
  Warnings:

  - You are about to drop the column `amountDue` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `amountDue` on the `PaymentPlan` table. All the data in the column will be lost.
  - You are about to drop the column `amountPaid` on the `PaymentPlan` table. All the data in the column will be lost.
  - Added the required column `setPrice` to the `PaymentPlan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "amountDue";

-- AlterTable
ALTER TABLE "PaymentPlan" DROP COLUMN "amountDue",
DROP COLUMN "amountPaid",
ADD COLUMN     "setPrice" INTEGER NOT NULL;
