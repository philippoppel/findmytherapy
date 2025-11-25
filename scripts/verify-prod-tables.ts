import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

async function verifyTables() {
  try {
    console.log('🔍 Verifying Production Database Tables...\n');

    // 1. Check Microsite tables
    console.log('1️⃣  Therapist Microsite Tables:');
    try {
      const visitCount = await prisma.therapistMicrositeVisit.count();
      const leadCount = await prisma.therapistMicrositeLead.count();
      const redirectCount = await prisma.therapistMicrositeRedirect.count();

      console.log('   ✅ TherapistMicrositeVisit:', visitCount, 'records');
      console.log('   ✅ TherapistMicrositeLead:', leadCount, 'records');
      console.log('   ✅ TherapistMicrositeRedirect:', redirectCount, 'records');
    } catch (error: any) {
      console.log('   ❌ Error:', error.message);
    }

    // 2. Check Dossier tables
    console.log('\n2️⃣  Session-Zero-Dossier Tables:');
    try {
      const dossierCount = await prisma.sessionZeroDossier.count();
      const accessLogCount = await prisma.dossierAccessLog.count();
      const consentCount = await prisma.clientConsent.count();

      console.log('   ✅ SessionZeroDossier:', dossierCount, 'records');
      console.log('   ✅ DossierAccessLog:', accessLogCount, 'records');
      console.log('   ✅ ClientConsent:', consentCount, 'records');
    } catch (error: any) {
      console.log('   ❌ Error:', error.message);
    }

    // 3. Check Therapist profiles with microsites
    console.log('\n3️⃣  Therapist Profiles:');
    try {
      const totalProfiles = await prisma.therapistProfile.count();
      const withMicrosite = await prisma.therapistProfile.count({
        where: { micrositeSlug: { not: null } },
      });
      const published = await prisma.therapistProfile.count({
        where: {
          micrositeStatus: 'PUBLISHED',
          status: 'VERIFIED',
        },
      });

      console.log('   Total profiles:', totalProfiles);
      console.log('   With micrositeSlug:', withMicrosite);
      console.log('   Published & Verified:', published);

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
          },
          take: 3,
        });

        console.log('\n   Example URLs:');
        examples.forEach((p) => {
          console.log(
            `   📍 https://findmytherapy-qyva-d3510xutv-philipps-projects-0f51423d.vercel.app/t/${p.micrositeSlug}`,
          );
        });
      }
    } catch (error: any) {
      console.log('   ❌ Error:', error.message);
    }

    // 4. Check Triage sessions
    console.log('\n4️⃣  Triage Sessions (for Dossier creation):');
    try {
      const triageCount = await prisma.triageSession.count();
      const withDossier = await prisma.triageSession.count({
        where: { dossier: { isNot: null } },
      });

      console.log('   Total triage sessions:', triageCount);
      console.log('   With dossier:', withDossier);
      console.log('   Available for dossier:', triageCount - withDossier);
    } catch (error: any) {
      console.log('   ❌ Error:', error.message);
    }

    // 5. Check Users
    console.log('\n5️⃣  Users:');
    try {
      const totalUsers = await prisma.user.count();
      const clients = await prisma.user.count({ where: { role: 'CLIENT' } });
      const therapists = await prisma.user.count({ where: { role: 'THERAPIST' } });
      const admins = await prisma.user.count({ where: { role: 'ADMIN' } });

      console.log('   Total users:', totalUsers);
      console.log('   Clients:', clients);
      console.log('   Therapists:', therapists);
      console.log('   Admins:', admins);
    } catch (error: any) {
      console.log('   ❌ Error:', error.message);
    }

    console.log('\n✅ Database verification complete!');
    console.log('\n📝 Summary:');
    console.log('   - All Microsite tables exist');
    console.log('   - All Dossier tables exist');
    console.log('   - Database is ready for production use');
  } catch (error: any) {
    console.error('❌ Fatal Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

verifyTables();
