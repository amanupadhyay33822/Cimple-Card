/*
  Warnings:

  - You are about to drop the column `facebookLink` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `instagramLink` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `linkedinLink` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `otherEmails` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `otherPhoneNumber` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `productDesc` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `twitterLink` on the `Card` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Card" DROP COLUMN "facebookLink",
DROP COLUMN "instagramLink",
DROP COLUMN "linkedinLink",
DROP COLUMN "otherEmails",
DROP COLUMN "otherPhoneNumber",
DROP COLUMN "phoneNumber",
DROP COLUMN "productDesc",
DROP COLUMN "twitterLink";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "publicId" TEXT;
