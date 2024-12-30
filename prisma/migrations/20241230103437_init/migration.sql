/*
  Warnings:

  - You are about to drop the column `publicId` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_publicId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "publicId";
