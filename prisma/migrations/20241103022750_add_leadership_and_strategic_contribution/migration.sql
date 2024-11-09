/*
  Warnings:

  - You are about to drop the column `date` on the `AvailabilityHours` table. All the data in the column will be lost.
  - You are about to drop the column `desgination` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `WorkingHours` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Designation" AS ENUM ('Partner', 'Founder', 'CoFounder', 'CEO', 'CTO', 'COO', 'CoCEO', 'CoCTO');

-- AlterTable
ALTER TABLE "AvailabilityHours" DROP COLUMN "date",
ADD COLUMN     "availabilityDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "User" DROP COLUMN "desgination",
ADD COLUMN     "designation" "Designation" NOT NULL DEFAULT 'Partner';

-- AlterTable
ALTER TABLE "WorkingHours" DROP COLUMN "date",
ADD COLUMN     "workDate" TIMESTAMP(3);

-- DropEnum
DROP TYPE "Desgination";
