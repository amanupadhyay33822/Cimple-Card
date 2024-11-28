/*
  Warnings:

  - You are about to drop the column `email` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `SocialMediaLink` table. All the data in the column will be lost.
  - Added the required column `personalSocialMediaLinks` to the `Card` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SocialMediaLink" DROP CONSTRAINT "SocialMediaLink_userId_fkey";

-- AlterTable
ALTER TABLE "Card" DROP COLUMN "email",
DROP COLUMN "phoneNumber",
ADD COLUMN     "aboutUs" TEXT,
ADD COLUMN     "addresses" TEXT[],
ADD COLUMN     "companySocialMediaLink" TEXT,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "emails" TEXT[],
ADD COLUMN     "instagramVideoLink" TEXT,
ADD COLUMN     "personalSocialMediaLinks" JSONB NOT NULL,
ADD COLUMN     "phoneNumbers" TEXT[],
ADD COLUMN     "youtubeVideoLink" TEXT;

-- AlterTable
ALTER TABLE "SocialMediaLink" DROP COLUMN "userId",
ADD COLUMN     "iconUrl" TEXT;

-- CreateTable
CREATE TABLE "Service" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT,
    "serviceUrl" TEXT,
    "cardId" INTEGER NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" SERIAL NOT NULL,
    "authorName" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "imageUrl" TEXT,
    "designation" TEXT,
    "cardId" INTEGER NOT NULL,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Testimonial" ADD CONSTRAINT "Testimonial_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
