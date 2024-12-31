/*
  Warnings:

  - You are about to drop the column `desgination` on the `Testimonial` table. All the data in the column will be lost.
  - Added the required column `designation` to the `Testimonial` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Testimonial" DROP COLUMN "desgination",
ADD COLUMN     "designation" TEXT NOT NULL;
