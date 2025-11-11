import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function setupDemoProfile() {
  try {
    console.log('🎨 Setting up demo profile with gallery and enhanced features...\n')

    // Find Dr.in Lena Huber's profile
    const profile = await prisma.therapistProfile.findFirst({
      where: {
        OR: [
          { displayName: { contains: 'Lena' } },
          { displayName: 'Dr.in Lena Huber' }
        ]
      }
    })

    if (!profile) {
      console.error('❌ Could not find Lena\'s profile')
      process.exit(1)
    }

    console.log(`✓ Found profile: ${profile.displayName} (ID: ${profile.id})`)

    // Update the profile with demo data
    const updated = await prisma.therapistProfile.update({
      where: { id: profile.id },
      data: {
        micrositeSlug: 'demo',
        micrositeStatus: 'PUBLISHED',
        galleryImages: [
          'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=800&q=80',
          'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&q=80',
          'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80',
          'https://images.unsplash.com/photo-1551836022-4c4c79ecde51?w=800&q=80',
          'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80'
        ],
        qualifications: [
          'Approbation als Psychologische Psychotherapeutin',
          'Master in Klinischer Psychologie, Universität Wien',
          'Zertifizierung in Verhaltenstherapie (VT)',
          'Fortbildung in EMDR (Eye Movement Desensitization and Reprocessing)',
          'Weiterbildung in Achtsamkeitsbasierter Kognitiver Therapie (MBCT)',
          'Supervisorin für therapeutische Praxisausbildung'
        ],
        ageGroups: [
          'Jugendliche (14-17)',
          'Junge Erwachsene (18-25)',
          'Erwachsene (26-64)',
          'Senioren (65+)'
        ],
        acceptedInsurance: [
          'ÖGK (Österreichische Gesundheitskasse)',
          'BVAEB (Versicherungsanstalt öffentlich Bediensteter)',
          'SVS (Sozialversicherung der Selbständigen)',
          'Private Zusatzversicherungen'
        ],
        privatePractice: true,
        socialLinkedin: 'https://www.linkedin.com/in/demo-profile',
        socialInstagram: 'https://www.instagram.com/demo.therapie',
        websiteUrl: 'https://www.example-therapie.at'
      }
    })

    console.log('\n✅ Demo profile updated successfully!\n')
    console.log('📊 Profile Details:')
    console.log(`   Name: ${updated.displayName}`)
    console.log(`   Slug: ${updated.micrositeSlug}`)
    console.log(`   Status: ${updated.micrositeStatus}`)
    console.log(`   Gallery Images: ${updated.galleryImages.length}`)
    console.log(`   Qualifications: ${updated.qualifications.length}`)
    console.log(`   Age Groups: ${updated.ageGroups.length}`)
    console.log(`   Accepted Insurance: ${updated.acceptedInsurance.length}`)
    console.log(`   Private Practice: ${updated.privatePractice}`)
    console.log(`   Social Links: ${[updated.socialLinkedin, updated.socialInstagram, updated.websiteUrl].filter(Boolean).length}`)

    console.log('\n🌐 Microsite URL:')
    console.log('   https://findmytherapy-demo.vercel.app/t/demo')
    console.log('   (or your current deployment URL)')

  } catch (error) {
    console.error('❌ Error setting up demo profile:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

setupDemoProfile()
