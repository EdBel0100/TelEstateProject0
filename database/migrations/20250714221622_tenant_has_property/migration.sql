/*
  Warnings:

  - You are about to drop the column `tenantsCognitoId` on the `Property` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[propertyId]` on the table `Tenant` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Property" DROP CONSTRAINT "Property_tenantsCognitoId_fkey";

-- AlterTable
ALTER TABLE "Property" DROP COLUMN "tenantsCognitoId";

-- AlterTable
ALTER TABLE "Tenant" ADD COLUMN     "propertyId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_propertyId_key" ON "Tenant"("propertyId");

-- AddForeignKey
ALTER TABLE "Tenant" ADD CONSTRAINT "Tenant_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE SET NULL ON UPDATE CASCADE;
