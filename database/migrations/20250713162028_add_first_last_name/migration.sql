/*
  Warnings:

  - You are about to drop the column `name` on the `Landlord` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Tenant` table. All the data in the column will be lost.
  - Added the required column `firstName` to the `Landlord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Landlord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `Tenant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Tenant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `TradePerson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `TradePerson` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Landlord" DROP COLUMN "name",
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Tenant" DROP COLUMN "name",
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TradePerson" ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL;
