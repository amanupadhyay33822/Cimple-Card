-- DropForeignKey
ALTER TABLE "AvailabilityHours" DROP CONSTRAINT "AvailabilityHours_userId_fkey";

-- AddForeignKey
ALTER TABLE "AvailabilityHours" ADD CONSTRAINT "AvailabilityHours_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
