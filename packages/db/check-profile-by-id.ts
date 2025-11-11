/**
 * Check if profile exists by ID from production API
 */

import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(__dirname, '.env.production.check') })

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL
})

async function checkProfileById() {
  console.log('🔍 Checking profile from production API...\n')

  // The ID from production API response
  const productionProfileId = 'cmh8yfedx0009um9ju8339185'

  const profile = await prisma.therapistProfile.findUnique({
    where: {
      id: productionProfileId
    },
    select: {
      id: true,
      displayName: true,
      micrositeSlug: true,
      micrositeStatus: true,
      status: true,
      user: {
        select: {
          email: true
        }
      }
    }
  })

  if (profile) {
    console.log('✅ Profile found in database:')
    console.log(`   ID: ${profile.id}`)
    console.log(`   Display Name: ${profile.displayName}`)
    console.log(`   Email: ${profile.user.email}`)
    console.log(`   Microsite Slug: ${profile.micrositeSlug}`)
    console.log(`   Microsite Status: ${profile.micrositeStatus}`)
    console.log(`   Therapist Status: ${profile.status}`)
  } else {
    console.log(`❌ Profile with ID ${productionProfileId} NOT found in database`)
    console.log('\nThis suggests the production deployment is using a DIFFERENT database.')
    console.log('The DATABASE_URL in production differs from .env.production.check')
  }

  // Check what profiles we have with this slug
  console.log('\n🔍 Checking all profiles with slug "dr-maria-mueller"...\n')

  const allProfiles = await prisma.therapistProfile.findMany({
    where: {
      micrositeSlug: 'dr-maria-mueller'
    },
    select: {
      id: true,
      displayName: true,
      micrositeStatus: true,
      status: true,
      createdAt: true
    }
  })

  console.log(`Found ${allProfiles.length} profile(s):`)
  allProfiles.forEach(p => {
    console.log(`  - ${p.id} | ${p.displayName} | ${p.micrositeStatus} | ${p.status} | ${p.createdAt}`)
  })

  await prisma.$disconnect()
}

checkProfileById().catch(console.error)
