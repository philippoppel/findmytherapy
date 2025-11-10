-- CreateEnum
CREATE TYPE "MicrositeStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- AlterTable TherapistProfile - Add microsite fields
ALTER TABLE "TherapistProfile" ADD COLUMN "micrositeSlug" TEXT,
ADD COLUMN "micrositeStatus" "MicrositeStatus" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN "micrositeBlocks" JSONB,
ADD COLUMN "micrositeLastPublishedAt" TIMESTAMP(3);

-- CreateTable TherapistMicrositeVisit
CREATE TABLE "TherapistMicrositeVisit" (
    "id" TEXT NOT NULL,
    "therapistProfileId" TEXT NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "source" TEXT,
    "sessionId" TEXT,
    "userAgent" TEXT,
    "ipAddress" TEXT,

    CONSTRAINT "TherapistMicrositeVisit_pkey" PRIMARY KEY ("id")
);

-- CreateTable TherapistMicrositeLead
CREATE TABLE "TherapistMicrositeLead" (
    "id" TEXT NOT NULL,
    "therapistProfileId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "message" TEXT NOT NULL,
    "consent" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TherapistMicrositeLead_pkey" PRIMARY KEY ("id")
);

-- CreateTable TherapistMicrositeRedirect
CREATE TABLE "TherapistMicrositeRedirect" (
    "id" TEXT NOT NULL,
    "fromSlug" TEXT NOT NULL,
    "toSlug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TherapistMicrositeRedirect_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TherapistProfile_micrositeSlug_key" ON "TherapistProfile"("micrositeSlug");

-- CreateIndex
CREATE INDEX "TherapistProfile_micrositeSlug_idx" ON "TherapistProfile"("micrositeSlug");

-- CreateIndex
CREATE INDEX "TherapistProfile_micrositeStatus_idx" ON "TherapistProfile"("micrositeStatus");

-- CreateIndex
CREATE INDEX "TherapistMicrositeVisit_therapistProfileId_idx" ON "TherapistMicrositeVisit"("therapistProfileId");

-- CreateIndex
CREATE INDEX "TherapistMicrositeVisit_occurredAt_idx" ON "TherapistMicrositeVisit"("occurredAt");

-- CreateIndex
CREATE INDEX "TherapistMicrositeVisit_sessionId_idx" ON "TherapistMicrositeVisit"("sessionId");

-- CreateIndex
CREATE INDEX "TherapistMicrositeLead_therapistProfileId_idx" ON "TherapistMicrositeLead"("therapistProfileId");

-- CreateIndex
CREATE INDEX "TherapistMicrositeLead_status_idx" ON "TherapistMicrositeLead"("status");

-- CreateIndex
CREATE INDEX "TherapistMicrositeLead_email_idx" ON "TherapistMicrositeLead"("email");

-- CreateIndex
CREATE INDEX "TherapistMicrositeLead_createdAt_idx" ON "TherapistMicrositeLead"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "TherapistMicrositeRedirect_fromSlug_key" ON "TherapistMicrositeRedirect"("fromSlug");

-- CreateIndex
CREATE INDEX "TherapistMicrositeRedirect_fromSlug_idx" ON "TherapistMicrositeRedirect"("fromSlug");

-- CreateIndex
CREATE INDEX "TherapistMicrositeRedirect_toSlug_idx" ON "TherapistMicrositeRedirect"("toSlug");

-- AddForeignKey
ALTER TABLE "TherapistMicrositeVisit" ADD CONSTRAINT "TherapistMicrositeVisit_therapistProfileId_fkey" FOREIGN KEY ("therapistProfileId") REFERENCES "TherapistProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TherapistMicrositeLead" ADD CONSTRAINT "TherapistMicrositeLead_therapistProfileId_fkey" FOREIGN KEY ("therapistProfileId") REFERENCES "TherapistProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
