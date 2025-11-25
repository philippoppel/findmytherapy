import { prisma } from '../packages/db/src/client';

async function checkTables() {
  try {
    console.log('🔍 Checking database tables...\n');

    // Check if Microsite tables exist
    console.log('1️⃣  Checking Therapist Microsite tables:');
    try {
      const micrositeVisits = await prisma.therapistMicrositeVisit.count();
      const micrositeLeads = await prisma.therapistMicrositeLead.count();
      const micrositeRedirects = await prisma.therapistMicrositeRedirect.count();
      console.log(`   ✅ TherapistMicrositeVisit: ${micrositeVisits} records`);
      console.log(`   ✅ TherapistMicrositeLead: ${micrositeLeads} records`);
      console.log(`   ✅ TherapistMicrositeRedirect: ${micrositeRedirects} records`);
    } catch (error: any) {
      console.log(`   ❌ Microsite tables not found: ${error.message}`);
    }

    console.log('\n2️⃣  Checking Session-Zero-Dossier tables:');
    try {
      const dossiers = await prisma.sessionZeroDossier.count();
      const accessLogs = await prisma.dossierAccessLog.count();
      const consents = await prisma.clientConsent.count();
      console.log(`   ✅ SessionZeroDossier: ${dossiers} records`);
      console.log(`   ✅ DossierAccessLog: ${accessLogs} records`);
      console.log(`   ✅ ClientConsent: ${consents} records`);
    } catch (error: any) {
      console.log(`   ❌ Dossier tables not found: ${error.message}`);
    }

    console.log('\n3️⃣  Checking Therapist profiles with microsites:');
    try {
      const totalProfiles = await prisma.therapistProfile.count();
      const withMicrosite = await prisma.therapistProfile.count({
        where: {
          micrositeSlug: { not: null },
        },
      });
      const published = await prisma.therapistProfile.count({
        where: {
          micrositeStatus: 'PUBLISHED',
          status: 'VERIFIED',
        },
      });
      console.log(`   Total profiles: ${totalProfiles}`);
      console.log(`   With micrositeSlug: ${withMicrosite}`);
      console.log(`   Published & Verified: ${published}`);

      if (published > 0) {
        const examples = await prisma.therapistProfile.findMany({
          where: {
            micrositeStatus: 'PUBLISHED',
            status: 'VERIFIED',
            micrositeSlug: { not: null },
          },
          select: {
            displayName: true,
            micrositeSlug: true,
            micrositeStatus: true,
          },
          take: 5,
        });
        console.log('\n   Example microsites:');
        examples.forEach((p) => {
          console.log(`   - /t/${p.micrositeSlug} (${p.displayName})`);
        });
      }
    } catch (error: any) {
      console.log(`   ❌ Error checking profiles: ${error.message}`);
    }

    console.log('\n4️⃣  Checking Triage sessions:');
    try {
      const totalSessions = await prisma.triageSession.count();
      const withClient = await prisma.triageSession.count({
        where: {
          clientId: { not: null },
        },
      });
      console.log(`   Total triage sessions: ${totalSessions}`);
      console.log(`   With client: ${withClient}`);
    } catch (error: any) {
      console.log(`   ❌ Error checking triage sessions: ${error.message}`);
    }

    console.log('\n✅ Database check complete!');
  } catch (error: any) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkTables();
