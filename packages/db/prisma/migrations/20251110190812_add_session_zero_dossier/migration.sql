-- CreateEnum
CREATE TYPE "DossierRiskLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "DossierGeneratedBy" AS ENUM ('ADMIN', 'WORKER', 'AUTO');

-- CreateEnum
CREATE TYPE "DossierAccessStatus" AS ENUM ('SUCCESS', 'DENIED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "DossierAccessChannel" AS ENUM ('WEB_DASHBOARD', 'SIGNED_LINK');

-- CreateEnum
CREATE TYPE "ConsentScope" AS ENUM ('DOSSIER_SHARING', 'DATA_PROCESSING', 'COMMUNICATION');

-- CreateEnum
CREATE TYPE "ConsentStatus" AS ENUM ('GRANTED', 'REVOKED');

-- CreateTable
CREATE TABLE "SessionZeroDossier" (
    "id" TEXT NOT NULL,
    "triageSessionId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "encryptedPayload" TEXT NOT NULL,
    "encryptionKeyId" TEXT NOT NULL,
    "pdfUrl" TEXT,
    "riskLevel" "DossierRiskLevel" NOT NULL,
    "redFlags" JSONB,
    "generatedBy" "DossierGeneratedBy" NOT NULL DEFAULT 'AUTO',
    "version" INTEGER NOT NULL DEFAULT 1,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "recommendedTherapists" TEXT[],

    CONSTRAINT "SessionZeroDossier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DossierAccessLog" (
    "id" TEXT NOT NULL,
    "dossierId" TEXT NOT NULL,
    "therapistUserId" TEXT NOT NULL,
    "accessedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "channel" "DossierAccessChannel" NOT NULL,
    "ipHash" TEXT NOT NULL,
    "userAgent" TEXT,
    "status" "DossierAccessStatus" NOT NULL,
    "reason" TEXT,

    CONSTRAINT "DossierAccessLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientConsent" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "scope" "ConsentScope" NOT NULL,
    "status" "ConsentStatus" NOT NULL DEFAULT 'GRANTED',
    "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMP(3),
    "source" TEXT NOT NULL,
    "metadata" JSONB,

    CONSTRAINT "ClientConsent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SessionZeroDossier_triageSessionId_key" ON "SessionZeroDossier"("triageSessionId");

-- CreateIndex
CREATE INDEX "SessionZeroDossier_clientId_idx" ON "SessionZeroDossier"("clientId");

-- CreateIndex
CREATE INDEX "SessionZeroDossier_triageSessionId_idx" ON "SessionZeroDossier"("triageSessionId");

-- CreateIndex
CREATE INDEX "SessionZeroDossier_riskLevel_idx" ON "SessionZeroDossier"("riskLevel");

-- CreateIndex
CREATE INDEX "SessionZeroDossier_expiresAt_idx" ON "SessionZeroDossier"("expiresAt");

-- CreateIndex
CREATE INDEX "SessionZeroDossier_createdAt_idx" ON "SessionZeroDossier"("createdAt");

-- CreateIndex
CREATE INDEX "DossierAccessLog_dossierId_idx" ON "DossierAccessLog"("dossierId");

-- CreateIndex
CREATE INDEX "DossierAccessLog_therapistUserId_idx" ON "DossierAccessLog"("therapistUserId");

-- CreateIndex
CREATE INDEX "DossierAccessLog_accessedAt_idx" ON "DossierAccessLog"("accessedAt");

-- CreateIndex
CREATE INDEX "DossierAccessLog_status_idx" ON "DossierAccessLog"("status");

-- CreateIndex
CREATE INDEX "ClientConsent_clientId_idx" ON "ClientConsent"("clientId");

-- CreateIndex
CREATE INDEX "ClientConsent_scope_idx" ON "ClientConsent"("scope");

-- CreateIndex
CREATE INDEX "ClientConsent_status_idx" ON "ClientConsent"("status");

-- CreateIndex
CREATE INDEX "ClientConsent_grantedAt_idx" ON "ClientConsent"("grantedAt");

-- AddForeignKey
ALTER TABLE "SessionZeroDossier" ADD CONSTRAINT "SessionZeroDossier_triageSessionId_fkey" FOREIGN KEY ("triageSessionId") REFERENCES "TriageSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionZeroDossier" ADD CONSTRAINT "SessionZeroDossier_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DossierAccessLog" ADD CONSTRAINT "DossierAccessLog_dossierId_fkey" FOREIGN KEY ("dossierId") REFERENCES "SessionZeroDossier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DossierAccessLog" ADD CONSTRAINT "DossierAccessLog_therapistUserId_fkey" FOREIGN KEY ("therapistUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientConsent" ADD CONSTRAINT "ClientConsent_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
