import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const profiles = await prisma.therapistProfile.findMany({
    select: {
      gender: true,
      acceptedInsurance: true,
      languages: true,
      specialties: true,
      modalities: true,
      ageGroups: true,
      online: true,
      city: true,
      priceMin: true,
      priceMax: true,
      availabilityStatus: true,
      estimatedWaitWeeks: true,
      yearsExperience: true,
      rating: true,
      reviewCount: true,
    }
  })

  const stats = {
    total: profiles.length,
    gender: { filled: 0, empty: 0 },
    insurance: { filled: 0, empty: 0 },
    languages: { filled: 0, empty: 0 },
    specialties: { filled: 0, empty: 0 },
    modalities: { filled: 0, empty: 0 },
    ageGroups: { filled: 0, empty: 0 },
    online: { yes: 0, no: 0 },
    city: { filled: 0, empty: 0 },
    price: { filled: 0, empty: 0 },
    availability: { filled: 0, empty: 0 },
    waitWeeks: { filled: 0, empty: 0 },
    experience: { filled: 0, empty: 0 },
    rating: { filled: 0, empty: 0 },
  }

  profiles.forEach(p => {
    stats.gender[p.gender ? 'filled' : 'empty']++
    stats.insurance[p.acceptedInsurance.length > 0 ? 'filled' : 'empty']++
    stats.languages[p.languages.length > 0 ? 'filled' : 'empty']++
    stats.specialties[p.specialties.length > 0 ? 'filled' : 'empty']++
    stats.modalities[p.modalities.length > 0 ? 'filled' : 'empty']++
    stats.ageGroups[p.ageGroups.length > 0 ? 'filled' : 'empty']++
    stats.online[p.online ? 'yes' : 'no']++
    stats.city[p.city ? 'filled' : 'empty']++
    stats.price[(p.priceMin || p.priceMax) ? 'filled' : 'empty']++
    stats.availability[p.availabilityStatus ? 'filled' : 'empty']++
    stats.waitWeeks[p.estimatedWaitWeeks != null ? 'filled' : 'empty']++
    stats.experience[p.yearsExperience ? 'filled' : 'empty']++
    stats.rating[p.rating ? 'filled' : 'empty']++
  })

  console.log('=== DATEN-VOLLSTÄNDIGKEIT ===\n')
  console.log('Feld               | Befüllt | Leer')
  console.log('-------------------|---------|-----')
  console.log(`Gender             | ${stats.gender.filled.toString().padStart(7)} | ${stats.gender.empty}`)
  console.log(`Versicherung       | ${stats.insurance.filled.toString().padStart(7)} | ${stats.insurance.empty}`)
  console.log(`Sprachen           | ${stats.languages.filled.toString().padStart(7)} | ${stats.languages.empty}`)
  console.log(`Spezialisierungen  | ${stats.specialties.filled.toString().padStart(7)} | ${stats.specialties.empty}`)
  console.log(`Therapiemethoden   | ${stats.modalities.filled.toString().padStart(7)} | ${stats.modalities.empty}`)
  console.log(`Altersgruppen      | ${stats.ageGroups.filled.toString().padStart(7)} | ${stats.ageGroups.empty}`)
  console.log(`Online-Therapie    | ${stats.online.yes.toString().padStart(7)} | ${stats.online.no} (nur Präsenz)`)
  console.log(`Stadt              | ${stats.city.filled.toString().padStart(7)} | ${stats.city.empty}`)
  console.log(`Preis              | ${stats.price.filled.toString().padStart(7)} | ${stats.price.empty}`)
  console.log(`Verfügbarkeit      | ${stats.availability.filled.toString().padStart(7)} | ${stats.availability.empty}`)
  console.log(`Wartezeit (Wochen) | ${stats.waitWeeks.filled.toString().padStart(7)} | ${stats.waitWeeks.empty}`)
  console.log(`Erfahrung (Jahre)  | ${stats.experience.filled.toString().padStart(7)} | ${stats.experience.empty}`)
  console.log(`Rating             | ${stats.rating.filled.toString().padStart(7)} | ${stats.rating.empty}`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
