/*
  Warnings:

  - Added the required column `monthlyPrice` to the `Lease` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Lease" ADD COLUMN     "monthlyPrice" INTEGER NOT NULL;
