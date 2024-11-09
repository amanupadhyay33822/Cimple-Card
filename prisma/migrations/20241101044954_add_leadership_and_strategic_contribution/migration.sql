/*
  Warnings:

  - Made the column `equityPercentage` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "strategicContribution" DOUBLE PRECISION DEFAULT 0,
ALTER COLUMN "equityPercentage" SET NOT NULL;
