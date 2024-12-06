/*
  Warnings:

  - The `instagramVideoLink` column on the `Card` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `youtubeVideoLink` column on the `Card` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Card" DROP COLUMN "instagramVideoLink",
ADD COLUMN     "instagramVideoLink" TEXT[],
DROP COLUMN "youtubeVideoLink",
ADD COLUMN     "youtubeVideoLink" TEXT[];
