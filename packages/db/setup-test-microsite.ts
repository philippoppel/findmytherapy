/**
 * Setup test microsite profile for E2E testing
 */

import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(__dirname, '.env.production.check') })

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL
})

async function setupTestMicrosite() {
  console.log('🔧 Setting up test microsite profile...\n')

  // Find the first verified profile (Dr.in Lena Huber)
  const profile = await prisma.therapistProfile.findFirst({
    where: {
      status: 'VERIFIED',
      user: {
        email: 'dr.mueller@example.com'
      }
    }
  })

  if (!profile) {
    console.log('❌ No verified profile found!')
    await prisma.$disconnect()
    return
  }

  console.log(`Found profile: ${profile.displayName} (${profile.id})`)

  // Update the profile to set the microsite slug and publish it
  const updated = await prisma.therapistProfile.update({
    where: { id: profile.id },
    data: {
      micrositeSlug: 'dr-maria-mueller',
      micrositeStatus: 'PUBLISHED',
      displayName: 'Dr. Maria Müller',
      micrositeLastPublishedAt: new Date(),
      micrositeBlocks: {
        hero: {
          title: 'Willkommen bei Dr. Maria Müller',
          subtitle: 'Ihre Therapeutin für mentale Gesundheit',
          ctaText: 'Jetzt Kontakt aufnehmen'
        },
        about: {
          text: 'Mit über 15 Jahren Erfahrung in der Psychotherapie unterstütze ich Sie auf Ihrem Weg zu mehr Wohlbefinden und Lebensqualität.'
        },
        services: {
          items: [
            { title: 'Einzeltherapie', description: 'Individuelle Begleitung für Ihre persönlichen Herausforderungen' },
            { title: 'Paartherapie', description: 'Unterstützung für eine gesunde Beziehung' },
            { title: 'Online-Sitzungen', description: 'Flexible Therapie von zu Hause aus' }
          ]
        }
      }
    }
  })

  console.log(`✅ Profile updated successfully!`)
  console.log(`   Slug: ${updated.micrositeSlug}`)
  console.log(`   Status: ${updated.micrositeStatus}`)
  console.log(`   Display Name: ${updated.displayName}`)
  console.log(`   Published At: ${updated.micrositeLastPublishedAt}`)

  console.log('\n🔍 Verifying the update...')

  const verified = await prisma.therapistProfile.findFirst({
    where: {
      micrositeSlug: 'dr-maria-mueller',
      micrositeStatus: 'PUBLISHED',
      status: 'VERIFIED'
    },
    select: {
      id: true,
      displayName: true,
      micrositeSlug: true,
      micrositeStatus: true,
      status: true
    }
  })

  if (verified) {
    console.log('✅ Verification successful!')
    console.log(`   Profile: ${verified.displayName}`)
    console.log(`   Slug: ${verified.micrositeSlug}`)
    console.log(`   Microsite Status: ${verified.micrositeStatus}`)
    console.log(`   Therapist Status: ${verified.status}`)
    console.log('\n🎉 Test microsite is ready for E2E testing!')
  } else {
    console.log('❌ Verification failed - profile not found with expected criteria')
  }

  await prisma.$disconnect()
}

setupTestMicrosite().catch(console.error)
