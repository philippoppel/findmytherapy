#!/usr/bin/env tsx
/**
 * Script to populate missing latitude/longitude coordinates for therapists
 * based on their city field.
 *
 * Usage: pnpm tsx scripts/populate-therapist-coordinates.ts
 */

import { PrismaClient } from '@prisma/client';
import { getCityCoordinates } from '../app/therapists/location-data';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Finding therapists with missing coordinates...');

  const therapistsWithoutCoords = await prisma.therapistProfile.findMany({
    where: {
      city: { not: null },
      OR: [{ latitude: null }, { longitude: null }],
    },
    select: {
      id: true,
      city: true,
      displayName: true,
    },
  });

  console.log(`Found ${therapistsWithoutCoords.length} therapists with missing coordinates\n`);

  if (therapistsWithoutCoords.length === 0) {
    console.log('✅ All therapists already have coordinates!');
    return;
  }

  let updated = 0;
  let skipped = 0;

  for (const therapist of therapistsWithoutCoords) {
    const coords = getCityCoordinates(therapist.city);

    if (coords) {
      await prisma.therapistProfile.update({
        where: { id: therapist.id },
        data: {
          latitude: coords.lat,
          longitude: coords.lng,
        },
      });
      console.log(
        `✅ Updated ${therapist.displayName || therapist.id} (${therapist.city}): ${coords.lat}, ${coords.lng}`,
      );
      updated++;
    } else {
      console.log(
        `⚠️  Skipped ${therapist.displayName || therapist.id} - Unknown city: "${therapist.city}"`,
      );
      skipped++;
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   Updated: ${updated}`);
  console.log(`   Skipped: ${skipped}`);
  console.log(`   Total:   ${therapistsWithoutCoords.length}`);
}

main()
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
