/*
  Warnings:

  - You are about to drop the column `created_at` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `designation` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `equityPercentage` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `leadershipScore` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `strategicContribution` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `tasksCompleted` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `totalHoursWorked` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `AvailabilityHours` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AvailableTime` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Break` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Task` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WorkSession` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WorkingHours` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `company` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jobTitle` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AvailabilityHours" DROP CONSTRAINT "AvailabilityHours_userId_fkey";

-- DropForeignKey
ALTER TABLE "AvailableTime" DROP CONSTRAINT "AvailableTime_availabilityHoursId_fkey";

-- DropForeignKey
ALTER TABLE "Break" DROP CONSTRAINT "Break_userId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_assignedById_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_assignedToId_fkey";

-- DropForeignKey
ALTER TABLE "WorkSession" DROP CONSTRAINT "WorkSession_workingHoursId_fkey";

-- DropForeignKey
ALTER TABLE "WorkingHours" DROP CONSTRAINT "WorkingHours_userId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "created_at",
DROP COLUMN "designation",
DROP COLUMN "equityPercentage",
DROP COLUMN "leadershipScore",
DROP COLUMN "strategicContribution",
DROP COLUMN "tasksCompleted",
DROP COLUMN "totalHoursWorked",
DROP COLUMN "updated_at",
ADD COLUMN     "company" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "jobTitle" TEXT NOT NULL,
ADD COLUMN     "phoneNumber" TEXT NOT NULL,
ADD COLUMN     "profileImage" TEXT,
ADD COLUMN     "socialMediaLinks" JSONB,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "AvailabilityHours";

-- DropTable
DROP TABLE "AvailableTime";

-- DropTable
DROP TABLE "Break";

-- DropTable
DROP TABLE "Task";

-- DropTable
DROP TABLE "WorkSession";

-- DropTable
DROP TABLE "WorkingHours";

-- DropEnum
DROP TYPE "BreakType";

-- DropEnum
DROP TYPE "Designation";

-- DropEnum
DROP TYPE "TaskPriority";

-- DropEnum
DROP TYPE "TaskStatus";
