import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function debugMicrosite() {
  const slug = 'test';

  console.log('=== Debugging Microsite: ' + slug + ' ===\n');

  // Check if profile exists with this slug
  const allWithSlug = await prisma.therapistProfile.findMany({
    where: {
      micrositeSlug: slug,
    },
    select: {
      id: true,
      displayName: true,
      micrositeSlug: true,
      micrositeStatus: true,
      status: true,
      deletedAt: true,
      headline: true,
      specialties: true,
      user: {
        select: {
          email: true,
        },
      },
    },
  });

  console.log('All profiles with slug "' + slug + '":', JSON.stringify(allWithSlug, null, 2));

  if (allWithSlug.length === 0) {
    console.log('\n❌ No profile found with slug "' + slug + '"');
    return;
  }

  // Check with EXACT same query as the page uses
  const publishedProfile = await prisma.therapistProfile.findFirst({
    where: {
      micrositeSlug: slug,
      micrositeStatus: 'PUBLISHED',
      status: 'VERIFIED',
      deletedAt: null,
    },
  });

  console.log('\n--- Filter Check Results ---');
  console.log('✓ Has slug "' + slug + '":', allWithSlug.length > 0);
  console.log(
    '✓ micrositeStatus === "PUBLISHED":',
    allWithSlug[0]?.micrositeStatus === 'PUBLISHED',
  );
  console.log('✓ status === "VERIFIED":', allWithSlug[0]?.status === 'VERIFIED');
  console.log('✓ deletedAt === null:', allWithSlug[0]?.deletedAt === null);
  console.log('\n✓ Profile matches all filters:', publishedProfile !== null);

  if (!publishedProfile) {
    console.log('\n❌ PROBLEM: Profile does not match ALL required filters for publication');
    console.log('Current status:', {
      micrositeStatus: allWithSlug[0]?.micrositeStatus,
      status: allWithSlug[0]?.status,
      deletedAt: allWithSlug[0]?.deletedAt,
    });
  } else {
    console.log(
      '\n✅ Profile SHOULD be visible at: https://findmytherapy-demo.vercel.app/t/' + slug,
    );
    console.log('Issue is likely ISR cache on Vercel - it may take a few minutes to update');
  }

  await prisma.$disconnect();
}

debugMicrosite().catch(console.error);
