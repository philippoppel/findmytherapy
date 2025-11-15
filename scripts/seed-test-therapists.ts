import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const testTherapists = [
  {
    displayName: 'Dr. Maria Müller',
    title: 'Klinische Psychologin & Psychotherapeutin',
    city: 'Wien',
    latitude: 48.2082,
    longitude: 16.3738,
    online: true,
    specialties: ['Depression', 'Angststörungen', 'Burnout'],
    languages: ['Deutsch', 'Englisch'],
    yearsExperience: 12,
    priceMin: 9000, // €90
    priceMax: 12000, // €120
    acceptingClients: true,
    approachSummary: 'Verhaltenstherapeutischer Ansatz mit Schwerpunkt auf kognitiver Umstrukturierung',
    headline: 'Spezialistin für Angst und Depression',
  },
  {
    displayName: 'Mag. Thomas Schmidt',
    title: 'Psychotherapeut',
    city: 'Graz',
    latitude: 47.0707,
    longitude: 15.4395,
    online: false,
    specialties: ['Trauma', 'PTBS', 'Paartherapie'],
    languages: ['Deutsch'],
    yearsExperience: 8,
    priceMin: 8000,
    priceMax: 10000,
    acceptingClients: true,
    approachSummary: 'Tiefenpsychologisch fundierte Psychotherapie',
    headline: 'Trauma-Spezialist',
  },
  {
    displayName: 'Dr. Sarah Weber',
    title: 'Fachärztin für Psychiatrie',
    city: 'Salzburg',
    latitude: 47.8095,
    longitude: 13.055,
    online: true,
    specialties: ['Depression', 'Bipolare Störung', 'Psychopharmakologie'],
    languages: ['Deutsch', 'Englisch', 'Französisch'],
    yearsExperience: 15,
    priceMin: 11000,
    priceMax: 15000,
    acceptingClients: false,
    approachSummary: 'Kombinierte Psychotherapie und medikamentöse Behandlung',
    headline: 'Psychiaterin mit psychotherapeutischer Ausbildung',
  },
  {
    displayName: 'Lisa Huber, MSc',
    title: 'Psychotherapeutin',
    city: 'Innsbruck',
    latitude: 47.2692,
    longitude: 11.4041,
    online: true,
    specialties: ['Essstörungen', 'Selbstwert', 'Körperbild'],
    languages: ['Deutsch', 'Englisch'],
    yearsExperience: 6,
    priceMin: 7500,
    priceMax: 9500,
    acceptingClients: true,
    approachSummary: 'Systemische Familientherapie und Einzeltherapie',
    headline: 'Expertin für Essstörungen',
  },
  {
    displayName: 'Mag. Peter Gruber',
    title: 'Psychotherapeut',
    city: 'Linz',
    latitude: 48.3069,
    longitude: 14.2858,
    online: false,
    specialties: ['Sucht', 'Abhängigkeit', 'Stressbewältigung'],
    languages: ['Deutsch'],
    yearsExperience: 10,
    priceMin: 8500,
    priceMax: 11000,
    acceptingClients: true,
    approachSummary: 'Verhaltenstherapie mit Schwerpunkt Suchtbehandlung',
    headline: 'Sucht-Therapeut',
  },
  {
    displayName: 'Dr. Anna Berger',
    title: 'Psychotherapeutin',
    city: 'Klagenfurt',
    latitude: 46.636,
    longitude: 14.3122,
    online: true,
    specialties: ['Kinder & Jugendliche', 'ADHS', 'Schulprobleme'],
    languages: ['Deutsch', 'Italienisch'],
    yearsExperience: 14,
    priceMin: 9500,
    priceMax: 12500,
    acceptingClients: true,
    approachSummary: 'Kinder- und Jugendlichenpsychotherapie',
    headline: 'Kinder- und Jugendpsychotherapeutin',
  },
  {
    displayName: 'Mag. Michael Lang',
    title: 'Psychotherapeut',
    city: 'Wien',
    latitude: 48.2285,
    longitude: 16.3975,
    online: true,
    specialties: ['Sexualtherapie', 'Beziehungsprobleme', 'LGBTQ+'],
    languages: ['Deutsch', 'Englisch'],
    yearsExperience: 9,
    priceMin: 8800,
    priceMax: 11500,
    acceptingClients: true,
    approachSummary: 'Integrative Sexualtherapie und Paarberatung',
    headline: 'Sexualtherapeut & Paartherapeut',
  },
  {
    displayName: 'Dr. Julia Fischer',
    title: 'Psychologin',
    city: 'Wien',
    latitude: 48.1951,
    longitude: 16.3633,
    online: false,
    specialties: ['Schlafstörungen', 'Chronische Schmerzen', 'Psychosomatik'],
    languages: ['Deutsch'],
    yearsExperience: 7,
    priceMin: 8000,
    priceMax: 10500,
    acceptingClients: true,
    approachSummary: 'Kognitive Verhaltenstherapie für psychosomatische Beschwerden',
    headline: 'Spezialistin für psychosomatische Medizin',
  },
];

async function main() {
  console.log('🌱 Erstelle Testdaten für Therapeutinnen...\n');

  // Create users and therapist profiles
  for (const therapist of testTherapists) {
    const user = await prisma.user.create({
      data: {
        email: `${therapist.displayName.toLowerCase().replace(/[.\s]/g, '')}@test.com`,
        emailVerified: new Date(),
        firstName: therapist.displayName.split(' ')[0],
        lastName: therapist.displayName.split(' ').slice(1).join(' '),
        role: 'THERAPIST',
      },
    });

    const profile = await prisma.therapistProfile.create({
      data: {
        userId: user.id,
        displayName: therapist.displayName,
        title: therapist.title,
        headline: therapist.headline,
        city: therapist.city,
        latitude: therapist.latitude,
        longitude: therapist.longitude,
        online: therapist.online,
        specialties: therapist.specialties,
        languages: therapist.languages,
        yearsExperience: therapist.yearsExperience,
        priceMin: therapist.priceMin,
        priceMax: therapist.priceMax,
        acceptingClients: therapist.acceptingClients,
        approachSummary: therapist.approachSummary,
        isPublic: true,
        status: 'VERIFIED',
        country: 'AT',
      },
    });

    console.log(`✅ ${profile.displayName} (${profile.city})`);
  }

  console.log(`\n✨ ${testTherapists.length} Testprofile erfolgreich erstellt!`);

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error('❌ Fehler beim Erstellen der Testdaten:', error);
  process.exit(1);
});
