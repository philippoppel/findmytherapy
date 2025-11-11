/**
 * Check what therapist profiles exist with microsites
 */

import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(__dirname, '.env.production.check') })

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL
})

async function checkProfiles() {
  console.log('🔍 Checking all therapist profiles...\n')

  const allProfiles = await prisma.therapistProfile.findMany({
    select: {
      id: true,
      displayName: true,
      micrositeSlug: true,
      micrositeStatus: true,
      status: true,
      deletedAt: true,
      user: {
        select: {
          email: true
        }
      }
    }
  })

  console.log(`Total profiles: ${allProfiles.length}\n`)

  allProfiles.forEach((profile, index) => {
    console.log(`${index + 1}. ${profile.displayName}`)
    console.log(`   ID: ${profile.id}`)
    console.log(`   Email: ${profile.user.email}`)
    console.log(`   Status: ${profile.status}`)
    console.log(`   Microsite Slug: ${profile.micrositeSlug || 'NOT SET'}`)
    console.log(`   Microsite Status: ${profile.micrositeStatus}`)
    console.log(`   Deleted: ${profile.deletedAt ? 'YES' : 'NO'}`)
    console.log('')
  })

  console.log('🔍 Checking for profiles with dr-maria-mueller slug...\n')

  const mariaProfiles = await prisma.therapistProfile.findMany({
    where: {
      micrositeSlug: 'dr-maria-mueller'
    },
    select: {
      id: true,
      displayName: true,
      micrositeSlug: true,
      micrositeStatus: true,
      status: true,
      deletedAt: true
    }
  })

  if (mariaProfiles.length > 0) {
    console.log(`Found ${mariaProfiles.length} profile(s) with slug 'dr-maria-mueller':`)
    mariaProfiles.forEach(p => {
      console.log(`  - ${p.displayName} (Status: ${p.status}, Microsite: ${p.micrositeStatus}, Deleted: ${p.deletedAt ? 'YES' : 'NO'})`)
    })
  } else {
    console.log('No profiles found with slug "dr-maria-mueller"')
  }

  await prisma.$disconnect()
}

checkProfiles().catch(console.error)
