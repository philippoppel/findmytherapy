import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Demo-Daten basierend auf den Spezialisierungen
const INSURANCE_OPTIONS = [
  ["ÖGK (Österreichische Gesundheitskasse)", "Private Zusatzversicherungen"],
  ["ÖGK (Österreichische Gesundheitskasse)", "BVAEB (Versicherungsanstalt öffentlich Bediensteter)", "Private Zusatzversicherungen"],
  ["ÖGK (Österreichische Gesundheitskasse)", "SVS (Sozialversicherung der Selbständigen)"],
  ["Private Zusatzversicherungen", "Selbstzahler"],
  ["ÖGK (Österreichische Gesundheitskasse)"],
]

const AGE_GROUP_OPTIONS = [
  ["Erwachsene (26-64)", "Senioren (65+)"],
  ["Jugendliche (14-17)", "Junge Erwachsene (18-25)", "Erwachsene (26-64)"],
  ["Junge Erwachsene (18-25)", "Erwachsene (26-64)"],
  ["Kinder (6-13)", "Jugendliche (14-17)", "Junge Erwachsene (18-25)"],
  ["Erwachsene (26-64)"],
]

// Zusätzliche Qualifikationen basierend auf Spezialisierungen
const QUALIFICATIONS_BY_SPECIALTY: Record<string, string[]> = {
  'Angst': [
    "Zertifizierung in Kognitiver Verhaltenstherapie (KVT)",
    "Fortbildung in Expositionstherapie",
  ],
  'Depression': [
    "Weiterbildung in Interpersoneller Therapie (IPT)",
    "Zertifizierung in Achtsamkeitsbasierter Kognitiver Therapie (MBCT)",
  ],
  'Trauma': [
    "Zertifizierung in EMDR (Eye Movement Desensitization and Reprocessing)",
    "Fortbildung in Traumazentrierter Kognitiver Verhaltenstherapie",
  ],
  'ADHS': [
    "Spezialisierung auf ADHS-Diagnostik und -Behandlung",
    "Fortbildung in Neurofeedback",
  ],
  'Beziehungsprobleme': [
    "Zertifizierung in Paartherapie",
    "Weiterbildung in Systemischer Therapie",
  ],
}

async function enrichTherapistData() {
  try {
    console.log('🔍 Suche Therapeuten mit unvollständigen Daten...\n')

    const therapists = await prisma.therapistProfile.findMany({
      where: {
        status: 'VERIFIED',
        isPublic: true,
      },
      select: {
        id: true,
        displayName: true,
        specialties: true,
        acceptedInsurance: true,
        ageGroups: true,
        qualifications: true,
      },
    })

    console.log(`Gefunden: ${therapists.length} Therapeuten\n`)

    let enrichedCount = 0

    for (const therapist of therapists) {
      const updates: any = {}
      let needsUpdate = false

      // Fehlende Insurance hinzufügen
      if (!therapist.acceptedInsurance || therapist.acceptedInsurance.length === 0) {
        const randomInsurance = INSURANCE_OPTIONS[Math.floor(Math.random() * INSURANCE_OPTIONS.length)]
        updates.acceptedInsurance = randomInsurance
        needsUpdate = true
        console.log(`  ✅ ${therapist.displayName}: Insurance hinzugefügt`)
      }

      // Fehlende Age Groups hinzufügen
      if (!therapist.ageGroups || therapist.ageGroups.length === 0) {
        const randomAgeGroups = AGE_GROUP_OPTIONS[Math.floor(Math.random() * AGE_GROUP_OPTIONS.length)]
        updates.ageGroups = randomAgeGroups
        needsUpdate = true
        console.log(`  ✅ ${therapist.displayName}: Altersgruppen hinzugefügt`)
      }

      // Qualifikationen erweitern basierend auf Spezialisierungen
      if (therapist.specialties && therapist.specialties.length > 0) {
        const existingQuals = therapist.qualifications || []
        const newQuals: string[] = []

        // Füge Qualifikationen basierend auf Spezialisierungen hinzu
        for (const specialty of therapist.specialties) {
          const relatedQuals = QUALIFICATIONS_BY_SPECIALTY[specialty]
          if (relatedQuals) {
            for (const qual of relatedQuals) {
              if (!existingQuals.includes(qual) && !newQuals.includes(qual)) {
                newQuals.push(qual)
              }
            }
          }
        }

        if (newQuals.length > 0) {
          updates.qualifications = [...existingQuals, ...newQuals]
          needsUpdate = true
          console.log(`  ✅ ${therapist.displayName}: ${newQuals.length} Qualifikationen hinzugefügt`)
        }
      }

      // Update durchführen
      if (needsUpdate) {
        await prisma.therapistProfile.update({
          where: { id: therapist.id },
          data: updates,
        })
        enrichedCount++
        console.log(`  💾 ${therapist.displayName}: Daten gespeichert\n`)
      } else {
        console.log(`  ⏭️  ${therapist.displayName}: Bereits vollständig\n`)
      }
    }

    console.log(`\n✨ Fertig! ${enrichedCount}/${therapists.length} Therapeuten wurden erweitert.`)

  } catch (error) {
    console.error('❌ Fehler:', error)
  } finally {
    await prisma.$disconnect()
  }
}

enrichTherapistData()
