/*
  Warnings:

  - You are about to drop the column `comanyAddress` on the `Card` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Card" DROP COLUMN "comanyAddress",
ADD COLUMN     "companyAddress" TEXT;
