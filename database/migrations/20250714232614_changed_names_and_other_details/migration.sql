/*
  Warnings:

  - You are about to drop the column `landlordCognitoId` on the `Building` table. All the data in the column will be lost.
  - You are about to drop the column `landlordCognitoId` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `landlordCognitoId` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `unitNumber` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `landlordCognitoId` on the `TradePerson` table. All the data in the column will be lost.
  - You are about to drop the `LEASE` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Landlord` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PAYMENT` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `managerCognitoId` to the `Building` table without a default value. This is not possible if the table is not empty.
  - Added the required column `managerCognitoId` to the `Conversation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `managerCognitoId` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `managerCognitoId` to the `TradePerson` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Building" DROP CONSTRAINT "Building_landlordCognitoId_fkey";

-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_landlordCognitoId_fkey";

-- DropForeignKey
ALTER TABLE "LEASE" DROP CONSTRAINT "LEASE_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "PAYMENT" DROP CONSTRAINT "PAYMENT_leased_fkey";

-- DropForeignKey
ALTER TABLE "Property" DROP CONSTRAINT "Property_landlordCognitoId_fkey";

-- DropForeignKey
ALTER TABLE "TradePerson" DROP CONSTRAINT "TradePerson_landlordCognitoId_fkey";

-- AlterTable
ALTER TABLE "Building" DROP COLUMN "landlordCognitoId",
ADD COLUMN     "managerCognitoId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Conversation" DROP COLUMN "landlordCognitoId",
ADD COLUMN     "managerCognitoId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Property" DROP COLUMN "landlordCognitoId",
DROP COLUMN "unitNumber",
ADD COLUMN     "managerCognitoId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TradePerson" DROP COLUMN "landlordCognitoId",
ADD COLUMN     "managerCognitoId" TEXT NOT NULL;

-- DropTable
DROP TABLE "LEASE";

-- DropTable
DROP TABLE "Landlord";

-- DropTable
DROP TABLE "PAYMENT";

-- CreateTable
CREATE TABLE "Manager" (
    "id" SERIAL NOT NULL,
    "cognitoId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,

    CONSTRAINT "Manager_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lease" (
    "id" SERIAL NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "deposit" DOUBLE PRECISION NOT NULL,
    "propertyId" INTEGER NOT NULL,

    CONSTRAINT "Lease_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "amountDue" DOUBLE PRECISION NOT NULL,
    "amountPaid" DOUBLE PRECISION NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL,
    "paymentStatus" TEXT NOT NULL,
    "leased" INTEGER NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Manager_cognitoId_key" ON "Manager"("cognitoId");

-- CreateIndex
CREATE UNIQUE INDEX "Lease_propertyId_key" ON "Lease"("propertyId");

-- AddForeignKey
ALTER TABLE "TradePerson" ADD CONSTRAINT "TradePerson_managerCognitoId_fkey" FOREIGN KEY ("managerCognitoId") REFERENCES "Manager"("cognitoId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Building" ADD CONSTRAINT "Building_managerCognitoId_fkey" FOREIGN KEY ("managerCognitoId") REFERENCES "Manager"("cognitoId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_managerCognitoId_fkey" FOREIGN KEY ("managerCognitoId") REFERENCES "Manager"("cognitoId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lease" ADD CONSTRAINT "Lease_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_leased_fkey" FOREIGN KEY ("leased") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_managerCognitoId_fkey" FOREIGN KEY ("managerCognitoId") REFERENCES "Manager"("cognitoId") ON DELETE RESTRICT ON UPDATE CASCADE;
