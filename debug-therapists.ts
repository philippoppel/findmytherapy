import { PrismaClient } from './packages/db/node_modules/.prisma/client/index.js'

const prisma = new PrismaClient()

async function main() {
  const allProfiles = await prisma.therapistProfile.findMany({
    select: {
      id: true,
      displayName: true,
      status: true,
      isPublic: true,
    },
  })

  console.log('Total profiles:', allProfiles.length)
  console.log('By status:')
  const byStatus = allProfiles.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  console.log(byStatus)
  console.log('isPublic: true:', allProfiles.filter(p => p.isPublic).length)
  console.log('isPublic: true + VERIFIED:', allProfiles.filter(p => p.isPublic && p.status === 'VERIFIED').length)

  const profiles = await prisma.therapistProfile.findMany({
    where: {
      isPublic: true,
    },
    select: {
      id: true,
      displayName: true,
      status: true,
      micrositeSlug: true,
      micrositeStatus: true,
      specialties: true,
      languages: true,
      services: true,
      modalities: true,
      user: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
    take: 3,
  })

  console.log('\nFirst 3 public profiles:', profiles.length)
  profiles.forEach((profile) => {
    console.log('\n---')
    console.log('ID:', profile.id)
    console.log('Name:', profile.displayName)
    console.log('Status:', profile.status)
    console.log('Microsite:', profile.micrositeSlug, profile.micrositeStatus)
    console.log('specialties:', profile.specialties, 'type:', typeof profile.specialties)
    console.log('languages:', profile.languages, 'type:', typeof profile.languages)
    console.log('services:', profile.services, 'type:', typeof profile.services)
    console.log('modalities:', profile.modalities, 'type:', typeof profile.modalities)
  })

  await prisma.$disconnect()
}

main().catch(console.error)
