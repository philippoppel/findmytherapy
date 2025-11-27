import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Office/therapy room images from Unsplash for gallery
const officeImages = [
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop', // Modern office
  'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=600&fit=crop', // Cozy workspace
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop', // Living room style
  'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&h=600&fit=crop', // Minimalist room
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop', // Comfortable sofa
  'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&h=600&fit=crop', // Bright therapy room
  'https://images.unsplash.com/photo-1598928506311-c55ez9c0daed?w=800&h=600&fit=crop', // Plants & light
  'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&h=600&fit=crop', // Modern interior
  'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800&h=600&fit=crop', // Cozy corner
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop', // Warm lighting
  'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=800&h=600&fit=crop', // Contemporary
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop', // Calm space
]

// Qualification templates
const qualificationTemplates = [
  'Psychotherapeut:in (Eintragung BMG Österreich)',
  'Klinische Psycholog:in',
  'Gesundheitspsycholog:in',
  'Master of Science in Psychologie',
  'Magister der Psychologie',
  'Dr. phil. Psychologie',
  'Zertifizierte:r EMDR-Therapeut:in',
  'Zertifizierte:r Traumatherapeut:in',
  'Mitglied ÖBVP (Österreichischer Bundesverband für Psychotherapie)',
  'Mitglied ÖAGG (Österreichischer Arbeitskreis für Gruppentherapie)',
  'Ausbildung Verhaltenstherapie (ÖGVT)',
  'Ausbildung Systemische Familientherapie',
  'Ausbildung Psychoanalyse',
  'Ausbildung Gestalttherapie',
  'Ausbildung Existenzanalyse und Logotherapie',
  'Zertifizierte:r Paartherapeut:in',
  'Weiterbildung Schematherapie',
  'Weiterbildung DBT (Dialektisch-Behaviorale Therapie)',
  'Weiterbildung ACT (Akzeptanz- und Commitmenttherapie)',
  'Supervision und Coaching Ausbildung',
]

// Approach summary templates
const approachTemplates = [
  'In meiner Arbeit ist mir ein wertschätzender, offener Umgang besonders wichtig. Ich glaube daran, dass jeder Mensch die Ressourcen in sich trägt, die er für positive Veränderung braucht. Gemeinsam entdecken wir diese Stärken.',
  'Mein therapeutischer Ansatz ist geprägt von Empathie und Achtsamkeit. Ich begegne Ihnen auf Augenhöhe und begleite Sie dabei, Ihre eigenen Lösungswege zu finden.',
  'Ich arbeite ressourcenorientiert und lege großen Wert darauf, Ihre individuellen Stärken zu fördern. Therapie verstehe ich als gemeinsamen Prozess, in dem Sie die Expert:in für Ihr Leben sind.',
  'Meine Arbeit basiert auf einem integrativen Ansatz, der verschiedene therapeutische Methoden verbindet. So kann ich flexibel auf Ihre persönlichen Bedürfnisse eingehen.',
  'Vertrauen und Sicherheit bilden das Fundament meiner therapeutischen Arbeit. In einem geschützten Rahmen können Sie sich öffnen und neue Perspektiven entwickeln.',
  'Ich glaube an die Kraft der therapeutischen Beziehung. Durch echtes Interesse und Präsenz schaffe ich einen Raum, in dem Heilung möglich wird.',
]

// Experience summary templates
const experienceTemplates = [
  'Seit über {years} Jahren begleite ich Menschen auf ihrem Weg zu mehr Wohlbefinden. Meine Schwerpunkte haben sich aus meiner klinischen Erfahrung und persönlichen Interessen entwickelt.',
  'Nach meinem Studium in Wien habe ich umfangreiche Erfahrung in verschiedenen klinischen Settings gesammelt. Heute arbeite ich in eigener Praxis und freue mich auf die Begegnungen mit meinen Klient:innen.',
  'Meine berufliche Reise begann in einer psychiatrischen Klinik, wo ich wertvolle Erfahrungen sammeln durfte. Seit {years} Jahren führe ich nun meine eigene Praxis.',
  'Die Arbeit mit Menschen in schwierigen Lebensphasen erfüllt mich seit {years} Jahren. Jede therapeutische Beziehung ist einzigartig und bereichert auch mein eigenes Leben.',
  'Von der Akutpsychiatrie bis zur ambulanten Psychotherapie – mein Weg hat mich durch verschiedene Bereiche geführt. Diese vielfältige Erfahrung fließt heute in meine Arbeit ein.',
  'Nach {years} Jahren in diesem Beruf bin ich nach wie vor fasziniert von der Kraft der Veränderung, die Menschen in sich tragen. Es ist mir eine Ehre, Sie auf diesem Weg begleiten zu dürfen.',
]

// Stock images from Unsplash (professional headshots) - higher resolution for better quality
const stockImages = {
  female: [
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&h=1000&fit=crop&crop=faces',
    'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=800&h=1000&fit=crop&crop=faces',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=1000&fit=crop&crop=faces',
    'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&h=1000&fit=crop&crop=faces',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&h=1000&fit=crop&crop=faces',
    'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=800&h=1000&fit=crop&crop=faces',
    'https://images.unsplash.com/photo-1598550874175-4d0ef436c909?w=800&h=1000&fit=crop&crop=faces',
    'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=800&h=1000&fit=crop&crop=faces',
    'https://images.unsplash.com/photo-1601412436009-d964bd02edbc?w=800&h=1000&fit=crop&crop=faces',
    'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=800&h=1000&fit=crop&crop=faces',
  ],
  male: [
    'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&h=1000&fit=crop&crop=faces',
    'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&h=1000&fit=crop&crop=faces',
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&h=1000&fit=crop&crop=faces',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&h=1000&fit=crop&crop=faces',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1000&fit=crop&crop=faces',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=1000&fit=crop&crop=faces',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&h=1000&fit=crop&crop=faces',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=1000&fit=crop&crop=faces',
    'https://images.unsplash.com/photo-1618077360395-f3068be8e001?w=800&h=1000&fit=crop&crop=faces',
    'https://images.unsplash.com/photo-1557862921-37829c790f19?w=800&h=1000&fit=crop&crop=faces',
  ],
}

// Austrian cities with coordinates
const locations = [
  { city: 'Wien', state: 'Wien', lat: 48.2082, lng: 16.3738, postalCodes: ['1010', '1020', '1030', '1040', '1050', '1060', '1070', '1080', '1090', '1100', '1110', '1120', '1130', '1140', '1150', '1160', '1170', '1180', '1190', '1200', '1210', '1220', '1230'] },
  { city: 'Graz', state: 'Steiermark', lat: 47.0707, lng: 15.4395, postalCodes: ['8010', '8020', '8036', '8041', '8042', '8043', '8044', '8045', '8046', '8047', '8051', '8052', '8053', '8054', '8055'] },
  { city: 'Linz', state: 'Oberösterreich', lat: 48.3069, lng: 14.2858, postalCodes: ['4020', '4030', '4040', '4050'] },
  { city: 'Salzburg', state: 'Salzburg', lat: 47.8095, lng: 13.0550, postalCodes: ['5020', '5023', '5026'] },
  { city: 'Innsbruck', state: 'Tirol', lat: 47.2692, lng: 11.4041, postalCodes: ['6020'] },
  { city: 'Klagenfurt', state: 'Kärnten', lat: 46.6249, lng: 14.3050, postalCodes: ['9020'] },
  { city: 'Villach', state: 'Kärnten', lat: 46.6111, lng: 13.8558, postalCodes: ['9500'] },
  { city: 'Wels', state: 'Oberösterreich', lat: 48.1575, lng: 14.0236, postalCodes: ['4600'] },
  { city: 'St. Pölten', state: 'Niederösterreich', lat: 48.2047, lng: 15.6256, postalCodes: ['3100'] },
  { city: 'Dornbirn', state: 'Vorarlberg', lat: 47.4125, lng: 9.7417, postalCodes: ['6850'] },
  { city: 'Bregenz', state: 'Vorarlberg', lat: 47.5031, lng: 9.7471, postalCodes: ['6900'] },
  { city: 'Baden', state: 'Niederösterreich', lat: 48.0049, lng: 16.2310, postalCodes: ['2500'] },
  { city: 'Mödling', state: 'Niederösterreich', lat: 48.0856, lng: 16.2870, postalCodes: ['2340'] },
  { city: 'Krems', state: 'Niederösterreich', lat: 48.4092, lng: 15.6144, postalCodes: ['3500'] },
  { city: 'Wiener Neustadt', state: 'Niederösterreich', lat: 47.8139, lng: 16.2465, postalCodes: ['2700'] },
]

// First names (mostly female, some male for diversity)
const femaleFirstNames = [
  'Anna', 'Maria', 'Sophie', 'Laura', 'Julia', 'Lena', 'Sarah', 'Lisa', 'Emma', 'Hannah',
  'Katharina', 'Christina', 'Elisabeth', 'Barbara', 'Monika', 'Sabine', 'Claudia', 'Petra', 'Andrea', 'Susanne',
  'Martina', 'Eva', 'Birgit', 'Michaela', 'Doris', 'Karin', 'Sandra', 'Silvia', 'Marion', 'Cornelia',
  'Anja', 'Nicole', 'Melanie', 'Daniela', 'Stefanie', 'Sonja', 'Jasmin', 'Nadine', 'Verena', 'Simone',
  'Mag. Dr. Helena', 'Dr. Margarethe', 'Dr. Ingrid', 'Dr. Renate', 'Mag. Ursula', 'Mag. Gabriele', 'Dr. Johanna',
]

const maleFirstNames = [
  'Thomas', 'Michael', 'Stefan', 'Christian', 'Andreas', 'Markus', 'Alexander', 'Daniel', 'Martin', 'Peter',
  'Dr. Wolfgang', 'Dr. Franz', 'Mag. Georg', 'Dr. Robert',
]

const lastNames = [
  'Müller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner', 'Becker', 'Hoffmann', 'Schäfer',
  'Koch', 'Bauer', 'Richter', 'Klein', 'Wolf', 'Schröder', 'Neumann', 'Schwarz', 'Zimmermann', 'Braun',
  'Krüger', 'Hofmann', 'Hartmann', 'Lange', 'Schmitt', 'Werner', 'Schmitz', 'Krause', 'Meier', 'Lehmann',
  'Maier', 'Huber', 'Berger', 'Gruber', 'Steiner', 'Moser', 'Hofer', 'Leitner', 'Eder', 'Pichler',
  'Winkler', 'Reiter', 'Brunner', 'Fuchs', 'Aigner', 'Haas', 'Lang', 'Koller', 'Wimmer', 'Egger',
]

// Specialties with German labels
const specialties = [
  'Angststörungen', 'Depression', 'Burnout', 'Trauma & PTBS', 'Beziehungsprobleme',
  'Paartherapie', 'Familientherapie', 'Essstörungen', 'Suchtprobleme', 'ADHS',
  'Zwangsstörungen', 'Phobien', 'Trauerbewältigung', 'Selbstwertprobleme', 'Stress & Überforderung',
  'Schlafstörungen', 'Persönlichkeitsstörungen', 'Borderline', 'Bipolare Störung', 'Schizophrenie',
  'Sexualtherapie', 'Kindertherapie', 'Jugendtherapie', 'Schwangerschaft & Geburt', 'Lebenskrise',
  'Mobbing', 'Hochsensibilität', 'Neurodiversität', 'LGBTQ+', 'Migration & Kultur',
]

// Modalities
const modalities = [
  'Verhaltenstherapie', 'Psychoanalyse', 'Tiefenpsychologie', 'Systemische Therapie',
  'Gestalttherapie', 'EMDR', 'Schematherapie', 'ACT', 'DBT', 'Körperpsychotherapie',
  'Hypnotherapie', 'Kunsttherapie', 'Musiktherapie', 'Logotherapie', 'Existenzanalyse',
  'Integrative Therapie', 'Personzentrierte Therapie', 'Lösungsorientierte Therapie',
]

// Languages
const languageSets = [
  ['Deutsch'],
  ['Deutsch'],
  ['Deutsch'],
  ['Deutsch', 'Englisch'],
  ['Deutsch', 'Englisch'],
  ['Deutsch', 'Englisch', 'Französisch'],
  ['Deutsch', 'Italienisch'],
  ['Deutsch', 'Spanisch'],
  ['Deutsch', 'Türkisch'],
  ['Deutsch', 'Bosnisch', 'Kroatisch', 'Serbisch'],
  ['Deutsch', 'Polnisch'],
  ['Deutsch', 'Russisch'],
  ['Deutsch', 'Arabisch'],
  ['Deutsch', 'Ungarisch'],
  ['Deutsch', 'Englisch', 'Spanisch'],
]

// Age groups
const ageGroupSets = [
  ['Erwachsene'],
  ['Erwachsene'],
  ['Erwachsene', 'Jugendliche'],
  ['Kinder', 'Jugendliche'],
  ['Kinder', 'Jugendliche', 'Erwachsene'],
  ['Erwachsene', 'Senioren'],
  ['Jugendliche', 'Junge Erwachsene'],
]

// Insurance types
const insuranceTypes = [
  ['ÖGK', 'BVAEB', 'SVS'],
  ['Alle Kassen'],
  ['Privat'],
  ['Privat', 'Wahlarzt'],
  ['ÖGK'],
  ['Privat', 'ÖGK'],
  [],
]

// Services
const serviceTypes = [
  ['Einzeltherapie'],
  ['Einzeltherapie', 'Paartherapie'],
  ['Einzeltherapie', 'Gruppentherapie'],
  ['Einzeltherapie', 'Paartherapie', 'Familientherapie'],
  ['Einzeltherapie', 'Online-Therapie'],
  ['Supervision', 'Coaching'],
  ['Einzeltherapie', 'Coaching', 'Supervision'],
]

// Availability statuses with weights
const availabilityOptions: Array<{ status: 'AVAILABLE' | 'LIMITED' | 'WAITLIST' | 'UNAVAILABLE'; waitWeeks: number | null }> = [
  { status: 'AVAILABLE', waitWeeks: null },
  { status: 'AVAILABLE', waitWeeks: null },
  { status: 'LIMITED', waitWeeks: 2 },
  { status: 'LIMITED', waitWeeks: 3 },
  { status: 'WAITLIST', waitWeeks: 4 },
  { status: 'WAITLIST', waitWeeks: 6 },
  { status: 'WAITLIST', waitWeeks: 8 },
  { status: 'UNAVAILABLE', waitWeeks: null },
]

// Helper functions
function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomElements<T>(arr: T[], min: number, max: number): T[] {
  const count = Math.floor(Math.random() * (max - min + 1)) + min
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

function randomPrice(): { min: number; max: number } {
  const bases = [80, 90, 100, 110, 120, 130, 140, 150, 160, 180, 200]
  const min = randomElement(bases)
  const max = min + randomElement([0, 10, 20, 30, 40, 50])
  return { min: min * 100, max: max * 100 } // in cents
}

function generateSlug(name: string, index: number): string {
  return `${name.toLowerCase().replace(/[^a-z]/g, '-').replace(/-+/g, '-')}-${index}`
}

function generateAbout(name: string, specialties: string[], modalities: string[]): string {
  const intros = [
    `Als erfahrene Psychotherapeutin begleite ich Menschen auf ihrem Weg zu mehr Wohlbefinden und innerer Stärke.`,
    `Mein therapeutischer Ansatz ist geprägt von Empathie, Wertschätzung und dem festen Glauben an die Ressourcen jedes einzelnen Menschen.`,
    `In meiner Praxis biete ich einen sicheren Raum, in dem Sie sich öffnen und Ihre Themen bearbeiten können.`,
    `Mit langjähriger Erfahrung unterstütze ich Sie dabei, neue Perspektiven zu entwickeln und positive Veränderungen in Ihrem Leben zu bewirken.`,
    `Ich glaube an die Selbstheilungskräfte jedes Menschen und sehe meine Aufgabe darin, diese zu aktivieren und zu unterstützen.`,
  ]

  const specialtyText = specialties.length > 0
    ? `\n\nMeine Schwerpunkte liegen in den Bereichen ${specialties.slice(0, 3).join(', ')}.`
    : ''

  const modalityText = modalities.length > 0
    ? ` Ich arbeite hauptsächlich mit ${modalities[0]}${modalities.length > 1 ? ` und ${modalities[1]}` : ''}.`
    : ''

  return randomElement(intros) + specialtyText + modalityText
}

function generateHeadline(specialties: string[]): string {
  const headlines = [
    `Spezialisiert auf ${specialties[0] || 'Psychotherapie'}`,
    `Expertin für ${specialties[0] || 'mentale Gesundheit'}`,
    `Ihr Weg zu mehr Lebensqualität`,
    `Professionelle Begleitung in schwierigen Zeiten`,
    `Gemeinsam neue Wege finden`,
    `Therapie mit Herz und Verstand`,
    `Raum für Veränderung`,
  ]
  return randomElement(headlines)
}

function generateGalleryImages(): string[] {
  const count = Math.floor(Math.random() * 3) + 2 // 2-4 images
  const shuffled = [...officeImages].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

function generateQualifications(modalities: string[]): string[] {
  const count = Math.floor(Math.random() * 3) + 3 // 3-5 qualifications
  const base = ['Psychotherapeut:in (Eintragung BMG Österreich)']

  // Add education based on random chance
  if (Math.random() > 0.5) {
    base.push(randomElement(['Master of Science in Psychologie', 'Magister der Psychologie', 'Dr. phil. Psychologie']))
  }

  // Add modality-specific training
  if (modalities.includes('Verhaltenstherapie')) {
    base.push('Ausbildung Verhaltenstherapie (ÖGVT)')
  }
  if (modalities.includes('Systemische Therapie')) {
    base.push('Ausbildung Systemische Familientherapie')
  }
  if (modalities.includes('EMDR')) {
    base.push('Zertifizierte:r EMDR-Therapeut:in')
  }
  if (modalities.includes('Schematherapie')) {
    base.push('Weiterbildung Schematherapie')
  }
  if (modalities.includes('DBT')) {
    base.push('Weiterbildung DBT (Dialektisch-Behaviorale Therapie)')
  }

  // Add random additional qualifications
  const remaining = qualificationTemplates.filter(q => !base.includes(q))
  const additional = randomElements(remaining, 0, Math.max(0, count - base.length))

  return [...base, ...additional].slice(0, count + 2)
}

function generateApproachSummary(): string {
  return randomElement(approachTemplates)
}

function generateExperienceSummary(years: number): string {
  return randomElement(experienceTemplates).replace('{years}', years.toString())
}

async function main() {
  console.log('🧹 Lösche bestehende Demo-Daten...')

  // Delete all existing therapist profiles and their users
  await prisma.therapistMicrositeVisit.deleteMany()
  await prisma.therapistMicrositeLead.deleteMany()
  await prisma.therapistProfileVersion.deleteMany()
  await prisma.match.deleteMany()
  await prisma.listing.deleteMany()
  await prisma.therapistProfile.deleteMany()

  // Delete therapist users
  await prisma.user.deleteMany({
    where: { role: 'THERAPIST' }
  })

  console.log('✅ Bestehende Daten gelöscht')
  console.log('🌱 Erstelle 100 Demo-Therapeutinnen...\n')

  const therapists = []

  for (let i = 1; i <= 100; i++) {
    const isFemale = i <= 85 // 85% female
    const firstName = isFemale
      ? randomElement(femaleFirstNames)
      : randomElement(maleFirstNames)
    const lastName = randomElement(lastNames)
    const displayName = `${firstName} ${lastName}`
    const email = `demo.therapist.${i}@findmytherapy.at`

    const location = randomElement(locations)
    const postalCode = randomElement(location.postalCodes)

    const therapistSpecialties = randomElements(specialties, 2, 6)
    const therapistModalities = randomElements(modalities, 1, 3)
    const languages = randomElement(languageSets)
    const ageGroups = randomElement(ageGroupSets)
    const insurance = randomElement(insuranceTypes)
    const services = randomElement(serviceTypes)
    const price = randomPrice()
    const availability = randomElement(availabilityOptions)

    const imageUrl = isFemale
      ? stockImages.female[i % stockImages.female.length]
      : stockImages.male[i % stockImages.male.length]

    const yearsExperience = Math.floor(Math.random() * 25) + 2
    const online = Math.random() > 0.3 // 70% offer online

    const slug = generateSlug(displayName, i)

    // Create user first
    const user = await prisma.user.create({
      data: {
        email,
        firstName: firstName.replace(/^(Mag\. |Dr\. |Mag\. Dr\. )/, ''),
        lastName,
        role: 'THERAPIST',
        emailVerified: new Date(),
      }
    })

    // Generate new microsite content
    const galleryImages = generateGalleryImages()
    const qualifications = generateQualifications(therapistModalities)
    const approachSummary = generateApproachSummary()
    const experienceSummary = generateExperienceSummary(yearsExperience)

    // Create therapist profile
    const profile = await prisma.therapistProfile.create({
      data: {
        userId: user.id,
        status: 'VERIFIED',
        displayName,
        title: isFemale ? 'Psychotherapeutin' : 'Psychotherapeut',
        headline: generateHeadline(therapistSpecialties),
        profileImageUrl: imageUrl,
        about: generateAbout(displayName, therapistSpecialties, therapistModalities),
        approachSummary,
        experienceSummary,
        galleryImages,
        qualifications,
        specialties: therapistSpecialties,
        modalities: therapistModalities,
        languages,
        ageGroups,
        acceptedInsurance: insurance,
        services,
        priceMin: price.min,
        priceMax: price.max,
        city: location.city,
        state: location.state,
        postalCode,
        country: 'AT',
        latitude: location.lat + (Math.random() - 0.5) * 0.1,
        longitude: location.lng + (Math.random() - 0.5) * 0.1,
        online,
        acceptingClients: availability.status !== 'UNAVAILABLE',
        availabilityStatus: availability.status,
        estimatedWaitWeeks: availability.waitWeeks,
        yearsExperience,
        isPublic: true,
        micrositeSlug: slug,
        micrositeStatus: 'PUBLISHED',
        rating: Math.round((3.5 + Math.random() * 1.5) * 10) / 10, // 3.5 - 5.0
        reviewCount: Math.floor(Math.random() * 50),
        responseTime: randomElement(['< 24 Stunden', '1-2 Tage', '2-3 Tage', '< 1 Woche']),
      }
    })

    therapists.push({ user, profile })

    // Progress indicator
    if (i % 10 === 0) {
      console.log(`  ✓ ${i}/100 Therapeutinnen erstellt`)
    }
  }

  console.log('\n✅ 100 Demo-Therapeutinnen erfolgreich erstellt!')

  // Summary statistics
  const stats = await prisma.therapistProfile.groupBy({
    by: ['city'],
    _count: true,
  })

  console.log('\n📊 Verteilung nach Städten:')
  stats.sort((a, b) => b._count - a._count).slice(0, 10).forEach(s => {
    console.log(`   ${s.city}: ${s._count}`)
  })

  const onlineCount = await prisma.therapistProfile.count({ where: { online: true } })
  console.log(`\n🌐 Online-Therapie angeboten: ${onlineCount}/100`)

  const availableCount = await prisma.therapistProfile.count({
    where: { availabilityStatus: 'AVAILABLE' }
  })
  console.log(`📅 Sofort verfügbar: ${availableCount}/100`)
}

main()
  .catch((e) => {
    console.error('❌ Seed fehlgeschlagen:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
