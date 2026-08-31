/*
  Warnings:

  - You are about to drop the column `tenantId` on the `PaymentPlan` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tenantCognitoId]` on the table `PaymentPlan` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tenantCognitoId` to the `PaymentPlan` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PaymentPlan" DROP CONSTRAINT "PaymentPlan_tenantId_fkey";

-- DropIndex
DROP INDEX "PaymentPlan_tenantId_key";

-- AlterTable
ALTER TABLE "PaymentPlan" DROP COLUMN "tenantId",
ADD COLUMN     "tenantCognitoId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "PaymentPlan_tenantCognitoId_key" ON "PaymentPlan"("tenantCognitoId");

-- AddForeignKey
ALTER TABLE "PaymentPlan" ADD CONSTRAINT "PaymentPlan_tenantCognitoId_fkey" FOREIGN KEY ("tenantCognitoId") REFERENCES "Tenant"("cognitoId") ON DELETE CASCADE ON UPDATE CASCADE;
