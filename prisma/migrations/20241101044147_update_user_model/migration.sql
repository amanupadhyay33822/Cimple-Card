/*
  Warnings:

  - You are about to drop the column `strategicContribution` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "strategicContribution",
ALTER COLUMN "equityPercentage" DROP DEFAULT,
ALTER COLUMN "leadershipScore" DROP DEFAULT;
