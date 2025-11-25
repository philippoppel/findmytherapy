import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Updates the 'online' field for therapists based on their services array.
 * Sets online=true if services contains "Online-Beratung" or "Videotelefonie"
 */
async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');

  console.log(`\n🔍 Updating online field ${dryRun ? '(DRY RUN)' : '(LIVE)'}\n`);

  // Find all therapists with online-related services
  const therapistsWithOnlineServices = await prisma.therapistProfile.findMany({
    where: {
      OR: [
        { services: { has: 'Online-Beratung' } },
        { services: { has: 'Videotelefonie' } },
        { services: { has: 'Online' } },
        { services: { has: 'Video' } },
      ],
    },
    select: {
      id: true,
      displayName: true,
      services: true,
      online: true,
    },
  });

  console.log(
    `📊 Found ${therapistsWithOnlineServices.length} therapists with online services`,
  );

  // Filter to only those who don't already have online=true
  const needsUpdate = therapistsWithOnlineServices.filter((t) => !t.online);
  console.log(`📝 ${needsUpdate.length} need to be updated\n`);

  if (dryRun) {
    // Show first 10 examples
    console.log('First 10 therapists that would be updated:');
    needsUpdate.slice(0, 10).forEach((t) => {
      console.log(`  - ${t.displayName}: ${t.services.join(', ')}`);
    });

    // Show statistics
    const serviceStats = new Map<string, number>();
    therapistsWithOnlineServices.forEach((t) => {
      t.services.forEach((s) => {
        if (
          s.toLowerCase().includes('online') ||
          s.toLowerCase().includes('video')
        ) {
          serviceStats.set(s, (serviceStats.get(s) || 0) + 1);
        }
      });
    });

    console.log('\n📈 Online service breakdown:');
    [...serviceStats.entries()]
      .sort((a, b) => b[1] - a[1])
      .forEach(([service, count]) => {
        console.log(`   ${service}: ${count}`);
      });
  } else {
    // Perform the update
    const result = await prisma.therapistProfile.updateMany({
      where: {
        OR: [
          { services: { has: 'Online-Beratung' } },
          { services: { has: 'Videotelefonie' } },
          { services: { has: 'Online' } },
          { services: { has: 'Video' } },
        ],
        online: false,
      },
      data: {
        online: true,
      },
    });

    console.log(`✅ Updated ${result.count} therapists to online=true`);
  }

  // Show final statistics
  const stats = await prisma.therapistProfile.groupBy({
    by: ['online'],
    where: { isPublic: true, status: 'VERIFIED' },
    _count: true,
  });

  console.log('\n📊 Final online status distribution:');
  stats.forEach((s) => {
    console.log(`   online=${s.online}: ${s._count}`);
  });

  await prisma.$disconnect();
}

main().catch(console.error);
