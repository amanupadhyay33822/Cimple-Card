-- DropForeignKey
ALTER TABLE "WorkSession" DROP CONSTRAINT "WorkSession_workingHoursId_fkey";

-- AddForeignKey
ALTER TABLE "WorkSession" ADD CONSTRAINT "WorkSession_workingHoursId_fkey" FOREIGN KEY ("workingHoursId") REFERENCES "WorkingHours"("id") ON DELETE CASCADE ON UPDATE CASCADE;
