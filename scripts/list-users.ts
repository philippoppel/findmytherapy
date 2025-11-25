import { PrismaClient } from '@mental-health/db';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 20,
  });

  console.log('\n📋 Recent users in database:');
  console.log('=====================================');
  users.forEach((user, index) => {
    console.log(
      `${index + 1}. ${user.email} (${user.firstName} ${user.lastName}) - ${user.role} - ${user.createdAt.toISOString()}`,
    );
  });
  console.log('=====================================\n');
  console.log(`Total: ${users.length} users\n`);
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
