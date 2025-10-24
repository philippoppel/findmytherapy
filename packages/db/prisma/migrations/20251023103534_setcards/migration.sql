/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Course` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "EmergencyAlert" ADD COLUMN     "triageSessionId" TEXT;

-- AlterTable
ALTER TABLE "TherapistProfile" ADD COLUMN     "acceptingClients" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "approachSummary" TEXT,
ADD COLUMN     "displayName" TEXT,
ADD COLUMN     "experienceSummary" TEXT,
ADD COLUMN     "headline" TEXT,
ADD COLUMN     "profileImageUrl" TEXT,
ADD COLUMN     "rating" DOUBLE PRECISION,
ADD COLUMN     "responseTime" TEXT,
ADD COLUMN     "reviewCount" INTEGER DEFAULT 0,
ADD COLUMN     "services" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "title" TEXT,
ADD COLUMN     "videoUrl" TEXT,
ADD COLUMN     "yearsExperience" INTEGER;

-- AlterTable
ALTER TABLE "TriageSession" ADD COLUMN     "availability" TEXT[],
ADD COLUMN     "emergencyTriggered" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "gad7Answers" INTEGER[],
ADD COLUMN     "gad7Severity" TEXT,
ADD COLUMN     "phq9Answers" INTEGER[],
ADD COLUMN     "phq9Severity" TEXT,
ADD COLUMN     "requiresEmergency" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "supportPreferences" TEXT[];

-- CreateTable
CREATE TABLE "TherapistProfileVersion" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorId" TEXT,

    CONSTRAINT "TherapistProfileVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TriageSnapshot" (
    "id" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "level" TEXT NOT NULL,
    "mood" INTEGER,
    "motivation" INTEGER,
    "anxiety" INTEGER,
    "support" TEXT[],
    "availability" TEXT[],
    "recommendedTherapists" TEXT[],
    "recommendedCourses" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TriageSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactRequest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "topic" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "preferredSlot" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccessRequest" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "company" TEXT,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccessRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordResetRequest" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordResetRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" TEXT NOT NULL,
    "therapistId" TEXT NOT NULL,
    "clientId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "location" TEXT,
    "meetingLink" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TherapistProfileVersion_profileId_idx" ON "TherapistProfileVersion"("profileId");

-- CreateIndex
CREATE INDEX "TherapistProfileVersion_authorId_idx" ON "TherapistProfileVersion"("authorId");

-- CreateIndex
CREATE INDEX "TherapistProfileVersion_createdAt_idx" ON "TherapistProfileVersion"("createdAt");

-- CreateIndex
CREATE INDEX "TriageSnapshot_createdAt_idx" ON "TriageSnapshot"("createdAt");

-- CreateIndex
CREATE INDEX "TriageSnapshot_level_idx" ON "TriageSnapshot"("level");

-- CreateIndex
CREATE INDEX "ContactRequest_email_idx" ON "ContactRequest"("email");

-- CreateIndex
CREATE INDEX "ContactRequest_status_idx" ON "ContactRequest"("status");

-- CreateIndex
CREATE INDEX "ContactRequest_createdAt_idx" ON "ContactRequest"("createdAt");

-- CreateIndex
CREATE INDEX "AccessRequest_email_idx" ON "AccessRequest"("email");

-- CreateIndex
CREATE INDEX "AccessRequest_role_idx" ON "AccessRequest"("role");

-- CreateIndex
CREATE INDEX "AccessRequest_status_idx" ON "AccessRequest"("status");

-- CreateIndex
CREATE INDEX "AccessRequest_createdAt_idx" ON "AccessRequest"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetRequest_token_key" ON "PasswordResetRequest"("token");

-- CreateIndex
CREATE INDEX "PasswordResetRequest_email_idx" ON "PasswordResetRequest"("email");

-- CreateIndex
CREATE INDEX "PasswordResetRequest_token_idx" ON "PasswordResetRequest"("token");

-- CreateIndex
CREATE INDEX "PasswordResetRequest_expires_idx" ON "PasswordResetRequest"("expires");

-- CreateIndex
CREATE INDEX "Appointment_therapistId_idx" ON "Appointment"("therapistId");

-- CreateIndex
CREATE INDEX "Appointment_clientId_idx" ON "Appointment"("clientId");

-- CreateIndex
CREATE INDEX "Appointment_startTime_idx" ON "Appointment"("startTime");

-- CreateIndex
CREATE INDEX "Appointment_status_idx" ON "Appointment"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Course_slug_key" ON "Course"("slug");

-- CreateIndex
CREATE INDEX "Course_status_idx" ON "Course"("status");

-- CreateIndex
CREATE INDEX "EmergencyAlert_triageSessionId_idx" ON "EmergencyAlert"("triageSessionId");

-- CreateIndex
CREATE INDEX "Listing_stripeSubId_idx" ON "Listing"("stripeSubId");

-- CreateIndex
CREATE INDEX "TherapistProfile_acceptingClients_idx" ON "TherapistProfile"("acceptingClients");

-- CreateIndex
CREATE INDEX "TherapistProfile_rating_idx" ON "TherapistProfile"("rating");

-- CreateIndex
CREATE INDEX "TriageSession_requiresEmergency_idx" ON "TriageSession"("requiresEmergency");

-- CreateIndex
CREATE INDEX "TriageSession_createdAt_idx" ON "TriageSession"("createdAt");

-- AddForeignKey
ALTER TABLE "TherapistProfileVersion" ADD CONSTRAINT "TherapistProfileVersion_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "TherapistProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TherapistProfileVersion" ADD CONSTRAINT "TherapistProfileVersion_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmergencyAlert" ADD CONSTRAINT "EmergencyAlert_triageSessionId_fkey" FOREIGN KEY ("triageSessionId") REFERENCES "TriageSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_therapistId_fkey" FOREIGN KEY ("therapistId") REFERENCES "TherapistProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
