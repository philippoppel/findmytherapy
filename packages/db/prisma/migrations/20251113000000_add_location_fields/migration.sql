-- Add latitude and longitude fields to TherapistProfile
-- These fields are used for location-based search and filtering

ALTER TABLE "TherapistProfile" ADD COLUMN IF NOT EXISTS "latitude" DOUBLE PRECISION;
ALTER TABLE "TherapistProfile" ADD COLUMN IF NOT EXISTS "longitude" DOUBLE PRECISION;

-- Create index for location-based queries
CREATE INDEX IF NOT EXISTS "TherapistProfile_latitude_longitude_idx" ON "TherapistProfile"("latitude", "longitude");
