import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const PROFILE_ID = 'cmhaqa2qv00037cay24yiqup1' // Dr. Maria Müller

async function updateDemoProfile() {
  try {
    console.log('🎨 Updating Dr. Maria Müller profile for demo...\n')

    const updated = await prisma.therapistProfile.update({
      where: { id: PROFILE_ID },
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
        websiteUrl: 'https://www.therapie-mueller.at'
      }
    })

    console.log('✅ Profile updated successfully!\n')
    console.log('📊 Updated Details:')
    console.log(`   Name: ${updated.displayName}`)
    console.log(`   Slug: ${updated.micrositeSlug}`)
    console.log(`   Status: ${updated.micrositeStatus}`)
    console.log(`   Gallery Images: ${updated.galleryImages.length} images`)
    console.log(`   Qualifications: ${updated.qualifications.length} items`)
    console.log(`   Age Groups: ${updated.ageGroups.length} groups`)
    console.log(`   Insurance: ${updated.acceptedInsurance.length} types`)
    console.log(`   Private Practice: ${updated.privatePractice}`)
    console.log(`   Social Links: LinkedIn, Instagram, Website`)

    console.log('\n🌐 Microsite URLs:')
    console.log('   Production: https://findmytherapy-demo.vercel.app/t/demo')
    console.log('   Latest:     https://findmytherapy-qyva-8p9lje48e-philipps-projects-0f51423d.vercel.app/t/demo')
    console.log('\n🎉 All features enabled: Gallery, Qualifications, Pricing enhancements!')

  } catch (error) {
    console.error('❌ Error updating profile:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

updateDemoProfile()
