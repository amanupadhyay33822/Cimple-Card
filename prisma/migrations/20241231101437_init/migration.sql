-- CreateEnum
CREATE TYPE "PaymentPlan" AS ENUM ('Basic', 'Standard', 'Premium');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "paymentPlan" "PaymentPlan" NOT NULL DEFAULT 'Basic';
