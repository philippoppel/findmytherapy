-- Ensure all required TherapistProfile columns exist
-- This runs independently of Prisma migrations to fix production DB state

-- Gallery & Media
ALTER TABLE "TherapistProfile" ADD COLUMN IF NOT EXISTS "galleryImages" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

-- Social Media & Web Presence
ALTER TABLE "TherapistProfile" ADD COLUMN IF NOT EXISTS "socialLinkedin" TEXT;
ALTER TABLE "TherapistProfile" ADD COLUMN IF NOT EXISTS "socialInstagram" TEXT;
ALTER TABLE "TherapistProfile" ADD COLUMN IF NOT EXISTS "socialFacebook" TEXT;
ALTER TABLE "TherapistProfile" ADD COLUMN IF NOT EXISTS "websiteUrl" TEXT;

-- Additional Profile Info
ALTER TABLE "TherapistProfile" ADD COLUMN IF NOT EXISTS "qualifications" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "TherapistProfile" ADD COLUMN IF NOT EXISTS "ageGroups" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "TherapistProfile" ADD COLUMN IF NOT EXISTS "acceptedInsurance" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "TherapistProfile" ADD COLUMN IF NOT EXISTS "privatePractice" BOOLEAN NOT NULL DEFAULT false;
