-- AlterEnum - Add AvailabilityStatus if not exists
DO $$ BEGIN
 CREATE TYPE "AvailabilityStatus" AS ENUM ('AVAILABLE', 'LIMITED', 'WAITLIST', 'UNAVAILABLE');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- AlterTable TherapistProfile - Add availability fields
ALTER TABLE "TherapistProfile" ADD COLUMN IF NOT EXISTS "availabilityStatus" "AvailabilityStatus";
ALTER TABLE "TherapistProfile" ADD COLUMN IF NOT EXISTS "estimatedWaitWeeks" INTEGER;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "TherapistProfile_availabilityStatus_idx" ON "TherapistProfile"("availabilityStatus");
