import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function listProfiles() {
  try {
    const profiles = await prisma.therapistProfile.findMany({
      select: {
        id: true,
        displayName: true,
        status: true,
        micrositeSlug: true,
        micrositeStatus: true
      }
    })

    console.log(`\n📋 Found ${profiles.length} profiles:\n`)
    profiles.forEach((p, i) => {
      console.log(`${i + 1}. ${p.displayName}`)
      console.log(`   ID: ${p.id}`)
      console.log(`   Status: ${p.status}`)
      console.log(`   Microsite Slug: ${p.micrositeSlug || 'NOT SET'}`)
      console.log(`   Microsite Status: ${p.micrositeStatus}`)
      console.log('')
    })
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

listProfiles()
