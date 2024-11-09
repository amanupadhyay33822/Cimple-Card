-- DropForeignKey
ALTER TABLE "AvailableTime" DROP CONSTRAINT "AvailableTime_availabilityHoursId_fkey";

-- AddForeignKey
ALTER TABLE "AvailableTime" ADD CONSTRAINT "AvailableTime_availabilityHoursId_fkey" FOREIGN KEY ("availabilityHoursId") REFERENCES "AvailabilityHours"("id") ON DELETE CASCADE ON UPDATE CASCADE;
