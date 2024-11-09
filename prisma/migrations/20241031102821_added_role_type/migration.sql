-- CreateEnum
CREATE TYPE "Role" AS ENUM ('User', 'Admin');

-- CreateEnum
CREATE TYPE "Desgination" AS ENUM ('Partner', 'CEO', 'CTO', 'COO', 'CoCEO', 'CoCTO');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "desgination" "Desgination" NOT NULL DEFAULT 'Partner',
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'User';
