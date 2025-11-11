import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function ensureColumns() {
  try {
    console.log('Ensuring TherapistProfile columns exist...')
    
    // Execute raw SQL to add columns if they don't exist
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "TherapistProfile" ADD COLUMN IF NOT EXISTS "galleryImages" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
      ALTER TABLE "TherapistProfile" ADD COLUMN IF NOT EXISTS "socialLinkedin" TEXT;
      ALTER TABLE "TherapistProfile" ADD COLUMN IF NOT EXISTS "socialInstagram" TEXT;
      ALTER TABLE "TherapistProfile" ADD COLUMN IF NOT EXISTS "socialFacebook" TEXT;
      ALTER TABLE "TherapistProfile" ADD COLUMN IF NOT EXISTS "websiteUrl" TEXT;
      ALTER TABLE "TherapistProfile" ADD COLUMN IF NOT EXISTS "qualifications" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
      ALTER TABLE "TherapistProfile" ADD COLUMN IF NOT EXISTS "ageGroups" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
      ALTER TABLE "TherapistProfile" ADD COLUMN IF NOT EXISTS "acceptedInsurance" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
      ALTER TABLE "TherapistProfile" ADD COLUMN IF NOT EXISTS "privatePractice" BOOLEAN NOT NULL DEFAULT false;
    `)
    
    console.log('✓ All columns ensured')
  } catch (error) {
    console.error('Error ensuring columns:', error)
    // Don't fail the build - columns might already exist
  } finally {
    await prisma.$disconnect()
  }
}

ensureColumns()
