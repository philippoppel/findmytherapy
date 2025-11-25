import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DEMO_THERAPISTS = [
  {
    email: 'demo.psychologe1@example.com',
    profile: {
      displayName: 'Mag. Alexander Weber',
      title: 'Klinischer Psychologe',
      headline: 'Spezialist für Burnout und Stressmanagement',
      specialties: ['Burnout', 'Stress', 'Arbeitsbezogene Probleme', 'Angst'],
      modalities: ['Verhaltenstherapie', 'Stressmanagement', 'Achtsamkeit', 'MBSR'],
      languages: ['Deutsch', 'Englisch'],
      online: true,
      city: 'Wien',
      latitude: 48.2082,
      longitude: 16.3738,
      yearsExperience: 8,
      acceptedInsurance: [
        'ÖGK (Österreichische Gesundheitskasse)',
        'BVAEB (Versicherungsanstalt öffentlich Bediensteter)',
      ],
      ageGroups: ['Junge Erwachsene (18-25)', 'Erwachsene (26-64)'],
      services: ['Einzeltherapie', 'Online-Sitzungen', 'Stressmanagement-Programme'],
      qualifications: [
        'Master in Klinischer Psychologie',
        'Zertifizierung in Kognitiver Verhaltenstherapie',
        'MBSR-Trainer (Mindfulness-Based Stress Reduction)',
      ],
      priceMin: 9000,
      priceMax: 12000,
      privatePractice: true,
      acceptingClients: true,
      availabilityNote: 'Neue Termine in 2-3 Wochen verfügbar',
    },
  },
  {
    email: 'demo.psychotherapeutin2@example.com',
    profile: {
      displayName: 'Dr. Katharina Schmidt',
      title: 'Psychotherapeutin',
      headline: 'Trauma und EMDR-Spezialistin',
      specialties: ['Trauma', 'PTBS', 'Angst', 'Depression', 'Komplexes Trauma'],
      modalities: ['EMDR', 'Traumafokussierte KVT', 'Somatic Experiencing'],
      languages: ['Deutsch'],
      online: true,
      city: 'Graz',
      latitude: 47.0707,
      longitude: 15.4395,
      yearsExperience: 15,
      acceptedInsurance: [
        'ÖGK (Österreichische Gesundheitskasse)',
        'SVS (Sozialversicherung der Selbständigen)',
        'Private Zusatzversicherungen',
      ],
      ageGroups: ['Erwachsene (26-64)', 'Senioren (65+)'],
      services: [
        'Einzeltherapie Präsenz',
        'Einzeltherapie Online',
        'EMDR-Traumatherapie',
        'Langzeittherapie',
      ],
      qualifications: [
        'Promotion in Klinischer Psychologie',
        'Zertifizierung in EMDR',
        'Fortbildung in Somatic Experiencing',
        'Traumatherapeut nach DeGPT',
      ],
      priceMin: 11000,
      priceMax: 15000,
      privatePractice: true,
      acceptingClients: true,
      availabilityNote: 'Warteliste ca. 4-6 Wochen',
    },
  },
  {
    email: 'demo.therapeut3@example.com',
    profile: {
      displayName: 'Mag. Julia Hoffmann',
      title: 'Systemische Therapeutin',
      headline: 'Paartherapie und Familiensysteme',
      specialties: [
        'Beziehungsprobleme',
        'Paartherapie',
        'Familientherapie',
        'Kommunikation',
        'Trennung',
      ],
      modalities: [
        'Systemische Therapie',
        'Solution-Focused',
        'Emotionsfokussierte Paartherapie',
        'Mediation',
      ],
      languages: ['Deutsch', 'Englisch', 'Italienisch'],
      online: true,
      city: 'Salzburg',
      latitude: 47.8095,
      longitude: 13.055,
      yearsExperience: 10,
      acceptedInsurance: ['ÖGK (Österreichische Gesundheitskasse)', 'Private Zusatzversicherungen'],
      ageGroups: ['Junge Erwachsene (18-25)', 'Erwachsene (26-64)'],
      services: [
        'Paartherapie',
        'Einzeltherapie',
        'Familientherapie',
        'Online-Beratung',
        'Mediation',
      ],
      qualifications: [
        'Master in Psychologie',
        'Zertifizierung in Systemischer Therapie',
        'Weiterbildung in Emotionsfokussierter Paartherapie (EFT)',
        'Mediationsausbildung',
      ],
      priceMin: 10000,
      priceMax: 13000,
      privatePractice: true,
      acceptingClients: true,
      availabilityNote: 'Freie Termine innerhalb von 1-2 Wochen',
    },
  },
  {
    email: 'demo.psychologe4@example.com',
    profile: {
      displayName: 'Mag. Michael Berger',
      title: 'Kinder- und Jugendpsychologe',
      headline: 'Spezialist für Kinder, Jugendliche und ADHS',
      specialties: [
        'ADHS',
        'Lernstörungen',
        'Angst bei Kindern',
        'Schulprobleme',
        'Entwicklungsstörungen',
      ],
      modalities: ['Spieltherapie', 'Verhaltenstherapie', 'Familienberatung', 'Neurofeedback'],
      languages: ['Deutsch', 'Englisch'],
      online: false,
      city: 'Linz',
      latitude: 48.3064,
      longitude: 14.2858,
      yearsExperience: 12,
      acceptedInsurance: [
        'ÖGK (Österreichische Gesundheitskasse)',
        'BVAEB (Versicherungsanstalt öffentlich Bediensteter)',
      ],
      ageGroups: ['Kinder (6-13)', 'Jugendliche (14-17)'],
      services: [
        'Diagnostik',
        'Einzeltherapie Präsenz',
        'Familienberatung',
        'Neurofeedback-Training',
      ],
      qualifications: [
        'Master in Psychologie',
        'Spezialisierung Kinder- und Jugendpsychologie',
        'Zertifizierung in Spieltherapie',
        'Fortbildung in ADHS-Diagnostik und -Behandlung',
      ],
      priceMin: 8000,
      priceMax: 11000,
      privatePractice: true,
      acceptingClients: true,
      availabilityNote: 'Verfügbar für Erstgespräche innerhalb von 1 Woche',
    },
  },
  {
    email: 'demo.therapeutin5@example.com',
    profile: {
      displayName: 'Mag. Nina Maier',
      title: 'Psychotherapeutin',
      headline: 'Depression, Selbstwert und Lebensübergänge',
      specialties: [
        'Depression',
        'Selbstwertprobleme',
        'Lebensübergänge',
        'Identität',
        'Sinnkrisen',
      ],
      modalities: [
        'Tiefenpsychologie',
        'Logotherapie',
        'Achtsamkeit',
        'ACT (Acceptance and Commitment Therapy)',
      ],
      languages: ['Deutsch'],
      online: true,
      city: 'Innsbruck',
      latitude: 47.2692,
      longitude: 11.4041,
      yearsExperience: 7,
      acceptedInsurance: ['ÖGK (Österreichische Gesundheitskasse)', 'Private Zusatzversicherungen'],
      ageGroups: ['Junge Erwachsene (18-25)', 'Erwachsene (26-64)'],
      services: ['Einzeltherapie', 'Online-Therapie', 'Krisenintervention'],
      qualifications: [
        'Master in Psychologie',
        'Ausbildung in Logotherapie und Existenzanalyse',
        'Zertifizierung in ACT',
        'Fortbildung in Achtsamkeitsbasierter Kognitiver Therapie',
      ],
      priceMin: 9500,
      priceMax: 12500,
      privatePractice: true,
      acceptingClients: true,
      availabilityNote: 'Neue Termine verfügbar ab nächster Woche',
    },
  },
];

async function addDemoTherapists() {
  try {
    console.log('🏥 Erstelle Demo-Therapeuten...\n');

    let createdCount = 0;
    let skippedCount = 0;

    for (const demo of DEMO_THERAPISTS) {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: demo.email },
      });

      if (existingUser) {
        console.log(`  ⏭️  ${demo.profile.displayName}: Email bereits vorhanden, überspringe`);
        skippedCount++;
        continue;
      }

      // Create user with therapist profile
      const user = await prisma.user.create({
        data: {
          email: demo.email,
          role: 'THERAPIST',
          firstName: demo.profile.displayName.split(' ')[1],
          lastName: demo.profile.displayName.split(' ')[0],
          therapistProfile: {
            create: {
              ...demo.profile,
              status: 'VERIFIED',
              isPublic: true,
            },
          },
        },
        include: {
          therapistProfile: true,
        },
      });

      console.log(`  ✅ ${demo.profile.displayName}: Erfolgreich erstellt`);
      createdCount++;
    }

    console.log(
      `\n✨ Fertig! ${createdCount} neue Therapeuten erstellt, ${skippedCount} übersprungen.\n`,
    );

    // Zeige Zusammenfassung
    const totalTherapists = await prisma.therapistProfile.count({
      where: { status: 'VERIFIED', isPublic: true },
    });

    console.log(`📊 Gesamtzahl verifizierter, öffentlicher Therapeuten: ${totalTherapists}`);
  } catch (error) {
    console.error('❌ Fehler:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addDemoTherapists();
