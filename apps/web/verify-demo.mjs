import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function verify() {
  const profile = await prisma.therapistProfile.findFirst({
    where: { micrositeSlug: 'demo' },
    select: {
      displayName: true,
      micrositeSlug: true,
      micrositeStatus: true,
      galleryImages: true,
      qualifications: true,
      ageGroups: true,
      acceptedInsurance: true,
      privatePractice: true,
      socialLinkedin: true,
      socialInstagram: true,
      websiteUrl: true
    }
  })

  console.log('✓ Profile data in database:\n')
  console.log(JSON.stringify(profile, null, 2))

  await prisma.$disconnect()
}

verify()
