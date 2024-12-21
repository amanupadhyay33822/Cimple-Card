/*
  Warnings:

  - You are about to drop the column `businessType` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `businesshoursFrom` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `businesshoursTo` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `companyAddress` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `companySocialMediaLink` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `instagramVideoLink` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `testimonialRole` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `uniqueUrl` on the `Card` table. All the data in the column will be lost.
  - The `emails` column on the `Card` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `phoneNumbers` column on the `Card` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `youtubeVideoLink` column on the `Card` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[cardName]` on the table `Card` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cardId` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cardName` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `platform` on the `SocialMediaLink` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `desgination` to the `Testimonial` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Card_uniqueUrl_key";

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "cardId" TEXT NOT NULL,
ADD COLUMN     "timing" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Card" DROP COLUMN "businessType",
DROP COLUMN "businesshoursFrom",
DROP COLUMN "businesshoursTo",
DROP COLUMN "companyAddress",
DROP COLUMN "companySocialMediaLink",
DROP COLUMN "instagramVideoLink",
DROP COLUMN "testimonialRole",
DROP COLUMN "uniqueUrl",
ADD COLUMN     "cardName" TEXT NOT NULL,
ADD COLUMN     "comanyAddress" TEXT,
ADD COLUMN     "gridType" TEXT,
ADD COLUMN     "headerImageUrl" TEXT,
DROP COLUMN "emails",
ADD COLUMN     "emails" TEXT[],
DROP COLUMN "phoneNumbers",
ADD COLUMN     "phoneNumbers" TEXT[],
DROP COLUMN "youtubeVideoLink",
ADD COLUMN     "youtubeVideoLink" TEXT[];

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "SocialMediaLink" DROP COLUMN "platform",
ADD COLUMN     "platform" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Testimonial" ADD COLUMN     "desgination" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "business" (
    "id" SERIAL NOT NULL,
    "type" TEXT,
    "from" TEXT,
    "to" TEXT,
    "cardId" TEXT NOT NULL,

    CONSTRAINT "business_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "companySocialMediaLink" (
    "id" SERIAL NOT NULL,
    "platform" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "cardId" TEXT,
    "iconUrl" TEXT,

    CONSTRAINT "companySocialMediaLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Card_cardName_key" ON "Card"("cardName");

-- AddForeignKey
ALTER TABLE "business" ADD CONSTRAINT "business_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "companySocialMediaLink" ADD CONSTRAINT "companySocialMediaLink_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;
