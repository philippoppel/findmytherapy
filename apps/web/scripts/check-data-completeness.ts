/**
 * Data Completeness Checker
 *
 * Checks if the demo database has all required data for filters to work.
 *
 * Run with: DATABASE_URL="..." npx tsx apps/web/scripts/check-data-completeness.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 DATEN-VOLLSTÄNDIGKEITSPRÜFUNG\n');
  console.log('='.repeat(60));

  // Get all verified & public profiles
  const profiles = await prisma.therapistProfile.findMany({
    where: { status: 'VERIFIED', isPublic: true },
    select: {
      id: true,
      displayName: true,
      gender: true,
      acceptedInsurance: true,
      languages: true,
      specialties: true,
      modalities: true,
      ageGroups: true,
      online: true,
      city: true,
      latitude: true,
      longitude: true,
      priceMin: true,
      priceMax: true,
      availabilityStatus: true,
      estimatedWaitWeeks: true,
      yearsExperience: true,
      rating: true,
      reviewCount: true,
      profileImageUrl: true,
    },
  });

  const total = profiles.length;
  console.log(`\n📊 Gefundene verifizierte & öffentliche Profile: ${total}\n`);

  if (total === 0) {
    console.log('❌ FEHLER: Keine Profile gefunden!');
    console.log('   Führe den Seed aus: npx tsx apps/web/scripts/seed-demo-therapists.ts');
    process.exit(1);
  }

  // Check each filter requirement
  const stats = {
    gender: { female: 0, male: 0, empty: 0 },
    insurance: { filled: 0, empty: 0, providers: new Set<string>() },
    languages: { filled: 0, empty: 0, langs: new Set<string>() },
    specialties: { filled: 0, empty: 0, specs: new Set<string>() },
    modalities: { filled: 0, empty: 0, mods: new Set<string>() },
    ageGroups: { filled: 0, empty: 0, groups: new Set<string>() },
    format: { online: 0, praesenz: 0 },
    city: { filled: 0, empty: 0, cities: new Map<string, number>() },
    coordinates: { filled: 0, empty: 0 },
    price: { filled: 0, empty: 0, min: Infinity, max: 0 },
    availability: {
      AVAILABLE: 0,
      LIMITED: 0,
      WAITLIST: 0,
      UNAVAILABLE: 0,
      empty: 0,
    },
    experience: { filled: 0, empty: 0 },
    rating: { filled: 0, empty: 0 },
    image: { filled: 0, empty: 0 },
  };

  profiles.forEach((p) => {
    // Gender
    if (p.gender === 'female') stats.gender.female++;
    else if (p.gender === 'male') stats.gender.male++;
    else stats.gender.empty++;

    // Insurance
    if (p.acceptedInsurance.length > 0) {
      stats.insurance.filled++;
      p.acceptedInsurance.forEach((i) => stats.insurance.providers.add(i));
    } else {
      stats.insurance.empty++;
    }

    // Languages
    if (p.languages.length > 0) {
      stats.languages.filled++;
      p.languages.forEach((l) => stats.languages.langs.add(l));
    } else {
      stats.languages.empty++;
    }

    // Specialties
    if (p.specialties.length > 0) {
      stats.specialties.filled++;
      p.specialties.forEach((s) => stats.specialties.specs.add(s));
    } else {
      stats.specialties.empty++;
    }

    // Modalities
    if (p.modalities.length > 0) {
      stats.modalities.filled++;
      p.modalities.forEach((m) => stats.modalities.mods.add(m));
    } else {
      stats.modalities.empty++;
    }

    // Age Groups
    if (p.ageGroups.length > 0) {
      stats.ageGroups.filled++;
      p.ageGroups.forEach((g) => stats.ageGroups.groups.add(g));
    } else {
      stats.ageGroups.empty++;
    }

    // Format (Online/Präsenz)
    if (p.online) stats.format.online++;
    if (p.city && p.city !== 'Online') stats.format.praesenz++;

    // City
    if (p.city) {
      stats.city.filled++;
      stats.city.cities.set(p.city, (stats.city.cities.get(p.city) || 0) + 1);
    } else {
      stats.city.empty++;
    }

    // Coordinates
    if (p.latitude && p.longitude) {
      stats.coordinates.filled++;
    } else {
      stats.coordinates.empty++;
    }

    // Price
    if (p.priceMin || p.priceMax) {
      stats.price.filled++;
      if (p.priceMin && p.priceMin < stats.price.min) stats.price.min = p.priceMin;
      if (p.priceMax && p.priceMax > stats.price.max) stats.price.max = p.priceMax;
    } else {
      stats.price.empty++;
    }

    // Availability
    if (p.availabilityStatus) {
      stats.availability[p.availabilityStatus]++;
    } else {
      stats.availability.empty++;
    }

    // Experience
    if (p.yearsExperience) stats.experience.filled++;
    else stats.experience.empty++;

    // Rating
    if (p.rating) stats.rating.filled++;
    else stats.rating.empty++;

    // Image
    if (p.profileImageUrl) stats.image.filled++;
    else stats.image.empty++;
  });

  // Print results
  console.log('📋 FILTER-DATEN ÜBERSICHT\n');
  console.log('Feld                | Befüllt | Leer    | Status');
  console.log('--------------------|---------|---------|--------');

  const checkStatus = (filled: number, minRequired: number) =>
    filled >= minRequired ? '✅' : '❌';

  console.log(
    `Gender (weiblich)   | ${stats.gender.female.toString().padStart(7)} |         | ${checkStatus(stats.gender.female, 5)}`
  );
  console.log(
    `Gender (männlich)   | ${stats.gender.male.toString().padStart(7)} |         | ${checkStatus(stats.gender.male, 3)}`
  );
  console.log(
    `Versicherung        | ${stats.insurance.filled.toString().padStart(7)} | ${stats.insurance.empty.toString().padStart(7)} | ${checkStatus(stats.insurance.filled, 5)}`
  );
  console.log(
    `Sprachen            | ${stats.languages.filled.toString().padStart(7)} | ${stats.languages.empty.toString().padStart(7)} | ${checkStatus(stats.languages.filled, 10)}`
  );
  console.log(
    `Spezialisierungen   | ${stats.specialties.filled.toString().padStart(7)} | ${stats.specialties.empty.toString().padStart(7)} | ${checkStatus(stats.specialties.filled, 10)}`
  );
  console.log(
    `Therapiemethoden    | ${stats.modalities.filled.toString().padStart(7)} | ${stats.modalities.empty.toString().padStart(7)} | ${checkStatus(stats.modalities.filled, 10)}`
  );
  console.log(
    `Altersgruppen       | ${stats.ageGroups.filled.toString().padStart(7)} | ${stats.ageGroups.empty.toString().padStart(7)} | ${checkStatus(stats.ageGroups.filled, 5)}`
  );
  console.log(
    `Online-Therapie     | ${stats.format.online.toString().padStart(7)} |         | ${checkStatus(stats.format.online, 5)}`
  );
  console.log(
    `Präsenz-Therapie    | ${stats.format.praesenz.toString().padStart(7)} |         | ${checkStatus(stats.format.praesenz, 5)}`
  );
  console.log(
    `Stadt               | ${stats.city.filled.toString().padStart(7)} | ${stats.city.empty.toString().padStart(7)} | ${checkStatus(stats.city.filled, 10)}`
  );
  console.log(
    `Koordinaten         | ${stats.coordinates.filled.toString().padStart(7)} | ${stats.coordinates.empty.toString().padStart(7)} | ${checkStatus(stats.coordinates.filled, 10)}`
  );
  console.log(
    `Preis               | ${stats.price.filled.toString().padStart(7)} | ${stats.price.empty.toString().padStart(7)} | ${checkStatus(stats.price.filled, 10)}`
  );
  console.log(
    `Profilbild          | ${stats.image.filled.toString().padStart(7)} | ${stats.image.empty.toString().padStart(7)} | ${checkStatus(stats.image.filled, 10)}`
  );

  // Availability breakdown
  console.log('\n📅 VERFÜGBARKEIT\n');
  console.log(`   AVAILABLE:   ${stats.availability.AVAILABLE}`);
  console.log(`   LIMITED:     ${stats.availability.LIMITED}`);
  console.log(`   WAITLIST:    ${stats.availability.WAITLIST}`);
  console.log(`   UNAVAILABLE: ${stats.availability.UNAVAILABLE}`);
  if (stats.availability.empty > 0) {
    console.log(`   Leer:        ${stats.availability.empty} ⚠️`);
  }

  // Cities
  console.log('\n🏙️ STÄDTE (Top 10)\n');
  const sortedCities = [...stats.city.cities.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  sortedCities.forEach(([city, count]) => {
    console.log(`   ${city}: ${count}`);
  });

  // Languages
  console.log('\n🌍 SPRACHEN\n');
  console.log(`   ${Array.from(stats.languages.langs).sort().join(', ')}`);

  // Specialties
  console.log('\n🎯 SPEZIALISIERUNGEN (${stats.specialties.specs.size} verschiedene)\n');
  const specsSample = Array.from(stats.specialties.specs).sort().slice(0, 15);
  console.log(`   ${specsSample.join(', ')}${stats.specialties.specs.size > 15 ? '...' : ''}`);

  // Insurance providers
  if (stats.insurance.providers.size > 0) {
    console.log('\n🏥 VERSICHERUNGEN\n');
    console.log(`   ${Array.from(stats.insurance.providers).sort().join(', ')}`);
  }

  // Price range
  if (stats.price.filled > 0) {
    console.log('\n💰 PREISBEREICH\n');
    console.log(`   Min: €${(stats.price.min / 100).toFixed(0)}`);
    console.log(`   Max: €${(stats.price.max / 100).toFixed(0)}`);
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('\n📈 ZUSAMMENFASSUNG\n');

  const issues: string[] = [];

  if (stats.gender.female < 5) issues.push('Zu wenige weibliche Therapeuten');
  if (stats.gender.male < 3) issues.push('Zu wenige männliche Therapeuten');
  if (stats.gender.empty > 0) issues.push(`${stats.gender.empty} Profile ohne Gender`);
  if (stats.coordinates.empty > 0)
    issues.push(`${stats.coordinates.empty} Profile ohne Koordinaten`);
  if (stats.price.empty > total * 0.3) issues.push('Viele Profile ohne Preis');
  if (stats.specialties.empty > 0)
    issues.push(`${stats.specialties.empty} Profile ohne Spezialisierungen`);
  if (stats.image.empty > 0) issues.push(`${stats.image.empty} Profile ohne Bild`);

  if (issues.length === 0) {
    console.log('✅ Alle Daten sind vollständig!\n');
  } else {
    console.log('⚠️ Gefundene Probleme:\n');
    issues.forEach((issue) => console.log(`   • ${issue}`));
    console.log('\n   Führe den Seed aus um fehlende Daten zu ergänzen:');
    console.log('   npx tsx apps/web/scripts/seed-demo-therapists.ts\n');
  }
}

main()
  .catch((e) => {
    console.error('❌ Fehler:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
