/*
  Warnings:

  - You are about to drop the column `rentDueDatePerMonth` on the `Lease` table. All the data in the column will be lost.
  - Added the required column `rentDueDateEachMonth` to the `Lease` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Lease" DROP COLUMN "rentDueDatePerMonth",
ADD COLUMN     "rentDueDateEachMonth" INTEGER NOT NULL;
