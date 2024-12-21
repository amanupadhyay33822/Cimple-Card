/*
  Warnings:

  - You are about to drop the column `githubLink` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `testimonialIndustry` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `testimonialMessage` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `testimonialName` on the `Card` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Card" DROP COLUMN "githubLink",
DROP COLUMN "testimonialIndustry",
DROP COLUMN "testimonialMessage",
DROP COLUMN "testimonialName",
ADD COLUMN     "linkedinLink" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "twitterLink" TEXT;

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cardId" TEXT NOT NULL,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Testimonial" ADD CONSTRAINT "Testimonial_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;
