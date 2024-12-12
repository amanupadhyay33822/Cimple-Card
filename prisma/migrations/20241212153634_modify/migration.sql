/*
  Warnings:

  - You are about to drop the column `addresses` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `personalSocialMediaLinks` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the `Company` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OTP` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Testimonial` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Testimonial" DROP CONSTRAINT "Testimonial_cardId_fkey";

-- AlterTable
ALTER TABLE "Card" DROP COLUMN "addresses",
DROP COLUMN "personalSocialMediaLinks",
ADD COLUMN     "additionalLink" TEXT,
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "businessType" TEXT,
ADD COLUMN     "businesshoursFrom" TEXT,
ADD COLUMN     "businesshoursTo" TEXT,
ADD COLUMN     "companyAddress" TEXT,
ADD COLUMN     "emergencyEmail" TEXT,
ADD COLUMN     "emergencyName" TEXT,
ADD COLUMN     "emergencyNumber" TEXT,
ADD COLUMN     "emergencyRelationship" TEXT,
ADD COLUMN     "githubLink" TEXT,
ADD COLUMN     "instagramLink" TEXT,
ADD COLUMN     "languageSpoken" TEXT,
ADD COLUMN     "otherEmails" TEXT,
ADD COLUMN     "otherPhoneNumber" TEXT,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "productDesc" TEXT,
ADD COLUMN     "testimonialIndustry" TEXT,
ADD COLUMN     "testimonialMessage" TEXT,
ADD COLUMN     "testimonialName" TEXT,
ADD COLUMN     "testimonialRole" TEXT,
ALTER COLUMN "dateOfBirth" SET DATA TYPE TEXT,
ALTER COLUMN "emails" DROP NOT NULL,
ALTER COLUMN "emails" SET DATA TYPE TEXT,
ALTER COLUMN "phoneNumbers" DROP NOT NULL,
ALTER COLUMN "phoneNumbers" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "Company";

-- DropTable
DROP TABLE "OTP";

-- DropTable
DROP TABLE "Testimonial";
