import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🗑️  Removing all profile images...\n');

  const result = await prisma.therapistProfile.updateMany({
    where: {
      profileImageUrl: {
        not: null,
      },
    },
    data: {
      profileImageUrl: null,
    },
  });

  console.log(`✅ Removed profile images from ${result.count} therapist profiles`);
  console.log('   Default avatars with initials will be used instead.\n');

  await prisma.$disconnect();
}

main().catch(console.error);
