import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'csv-parse/sync';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

interface CSVTherapist {
  personen_id: string;
  name: string;
  titel: string;
  plz: string;
  ort: string;
  strasse: string;
  telefon: string;
  email: string;
  profil_url: string;
  arbeitsschwerpunkte: string;
  settings: string;
  alters_zielgruppen: string;
  fremdsprachen: string;
  zusatzbezeichnungen: string;
  hausbesuche: string;
}

function parseCSVArray(value: string): string[] {
  if (!value || value.trim() === '') return [];
  return value
    .split(';')
    .map((v) => v.trim())
    .filter((v) => v.length > 0);
}

function parsePostalCode(plz: string): string | null {
  if (!plz || plz === '') return null;
  // Convert "1090.0" to "1090"
  const parsed = parseFloat(plz);
  if (isNaN(parsed)) return null;
  return Math.floor(parsed).toString();
}

function extractMethodFromQualifications(qualifications: string): string[] {
  // Extrahiere die therapeutische Methode aus den Zusatzbezeichnungen
  const methods: string[] = [];
  const lowerQual = qualifications.toLowerCase();

  if (lowerQual.includes('verhaltenstherapie') || lowerQual.includes('vt')) {
    methods.push('Verhaltenstherapie');
  }
  if (lowerQual.includes('systemische') || lowerQual.includes('familientherapie')) {
    methods.push('Systemische Therapie');
  }
  if (lowerQual.includes('psychoanalyse') || lowerQual.includes('psychodynamische')) {
    methods.push('Psychoanalyse');
  }
  if (
    lowerQual.includes('humanistische') ||
    lowerQual.includes('personzentriert') ||
    lowerQual.includes('gestalt')
  ) {
    methods.push('Humanistische Therapie');
  }
  if (lowerQual.includes('integrative')) {
    methods.push('Integrative Therapie');
  }

  return methods;
}

function getStateFromPostalCode(postalCode: string): string | null {
  if (!postalCode) return null;

  const code = parseInt(postalCode);
  if (isNaN(code)) return null;

  // Vienna
  if (code >= 1010 && code <= 1230) return 'Wien';

  // Lower Austria
  if ((code >= 2000 && code <= 2999) || (code >= 3000 && code <= 3999)) return 'Niederösterreich';

  // Burgenland
  if (code >= 7000 && code <= 7999) return 'Burgenland';

  // Styria
  if (code >= 8000 && code <= 8999) return 'Steiermark';

  // Carinthia
  if (code >= 9000 && code <= 9999) return 'Kärnten';

  // Upper Austria
  if (code >= 4000 && code <= 4999) return 'Oberösterreich';

  // Salzburg
  if (code >= 5000 && code <= 5999) return 'Salzburg';

  // Tyrol
  if (code >= 6000 && code <= 6999) return 'Tirol';

  return null;
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const limit = args.find((arg) => arg.startsWith('--limit='))?.split('=')[1];
  const maxRecords = limit ? parseInt(limit) : undefined;

  console.log(`\n🔍 Starting CSV import ${dryRun ? '(DRY RUN)' : '(LIVE)'}\n`);

  // Read CSV file
  const csvPath = '/Users/philippoppel/Desktop/mental-health-platform/therapeuten_merged_v2.csv';
  const fileContent = fs.readFileSync(csvPath, 'utf-8');

  const records = csv.parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as CSVTherapist[];

  console.log(`📊 Found ${records.length} therapists in CSV file`);

  const recordsToProcess = maxRecords ? records.slice(0, maxRecords) : records;
  console.log(`📝 Processing ${recordsToProcess.length} records\n`);

  let created = 0;
  let skipped = 0;
  let errors = 0;

  for (const record of recordsToProcess) {
    try {
      const postalCode = parsePostalCode(record.plz);
      const city = record.ort?.trim() || null;
      const name = record.name?.trim();
      const email = record.email?.trim();

      if (!name) {
        console.log(`⚠️  Skipping record without name: ${JSON.stringify(record)}`);
        skipped++;
        continue;
      }

      if (!email) {
        console.log(`⏭️  Skipping ${name}: No email address provided`);
        skipped++;
        continue;
      }

      // Check for duplicates based on name + postal code + city
      const existingProfile = await prisma.therapistProfile.findFirst({
        where: {
          displayName: name,
          postalCode: postalCode,
          city: city,
        },
        include: {
          user: true,
        },
      });

      if (existingProfile) {
        console.log(`⏭️  Skipping duplicate: ${name} (${postalCode} ${city})`);
        skipped++;
        continue;
      }

      // Parse arrays
      const specialties = parseCSVArray(record.arbeitsschwerpunkte);
      const services = parseCSVArray(record.settings);
      const ageGroups = parseCSVArray(record.alters_zielgruppen);
      const languages = parseCSVArray(record.fremdsprachen);
      const qualifications = parseCSVArray(record.zusatzbezeichnungen);
      const modalities = extractMethodFromQualifications(record.zusatzbezeichnungen);

      // Determine if hausbesuche contains postal codes
      const hausbesucheLines =
        record.hausbesuche
          ?.split('\n')
          .filter((l) => l.trim())
          .map((l) => l.trim()) || [];
      const additionalPostalCodes = hausbesucheLines.filter((line) => /^\d{4}/.test(line));

      const state = getStateFromPostalCode(postalCode || '');

      if (dryRun) {
        console.log(`✅ Would create: ${name} (${postalCode} ${city})`);
        console.log(`   Email: ${email}`);
        console.log(`   Specialties: ${specialties.length}`);
        console.log(`   Modalities: ${modalities.join(', ')}`);
        console.log(`   State: ${state || 'N/A'}`);
        created++;
      } else {
        // Check if user with this email already exists
        const existingUser = await prisma.user.findUnique({
          where: { email },
        });

        if (existingUser) {
          // Check if this user already has a therapist profile
          const userProfile = await prisma.therapistProfile.findUnique({
            where: { userId: existingUser.id },
          });

          if (userProfile) {
            console.log(`⏭️  Skipping: User ${email} already has a therapist profile`);
            skipped++;
            continue;
          } else {
            // Create profile for existing user
            await prisma.therapistProfile.create({
              data: {
                userId: existingUser.id,
                displayName: name,
                title: record.titel?.trim() || null,
                postalCode: postalCode,
                city: city,
                street: record.strasse?.trim() || null,
                state: state,
                websiteUrl: record.profil_url?.trim() || null,
                specialties: specialties,
                services: services,
                ageGroups: ageGroups,
                languages: languages.length > 0 ? languages : ['Deutsch'],
                modalities: modalities,
                qualifications: qualifications,
                status: 'VERIFIED',
                isPublic: true,
                acceptingClients: true,
                country: 'AT',
              },
            });

            console.log(`✅ Created profile for existing user: ${name} (${email})`);
            created++;
          }
        } else {
          // Create new user and therapist profile
          const randomPassword = Math.random().toString(36).slice(-12);
          const hashedPassword = await bcrypt.hash(randomPassword, 10);

          await prisma.user.create({
            data: {
              email,
              passwordHash: hashedPassword,
              firstName: name.split(' ')[0],
              lastName: name.split(' ').slice(1).join(' ') || name.split(' ')[0],
              role: 'THERAPIST',
              emailVerified: null, // They need to verify their email
              therapistProfile: {
                create: {
                  displayName: name,
                  title: record.titel?.trim() || null,
                  postalCode: postalCode,
                  city: city,
                  street: record.strasse?.trim() || null,
                  state: state,
                  websiteUrl: record.profil_url?.trim() || null,
                  specialties: specialties,
                  services: services,
                  ageGroups: ageGroups,
                  languages: languages.length > 0 ? languages : ['Deutsch'],
                  modalities: modalities,
                  qualifications: qualifications,
                  status: 'VERIFIED',
                  isPublic: true,
                  acceptingClients: true,
                  country: 'AT',
                },
              },
            },
          });

          console.log(`✅ Created: ${name} (${email})`);
          created++;
        }
      }
    } catch (error) {
      console.error(`❌ Error processing ${record.name}:`, error);
      errors++;
    }
  }

  console.log('\n📈 Summary:');
  console.log(`   ✅ Created: ${created}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
  console.log(`   ❌ Errors: ${errors}`);
  console.log(`   📊 Total: ${recordsToProcess.length}\n`);

  await prisma.$disconnect();
}

main().catch(console.error);
