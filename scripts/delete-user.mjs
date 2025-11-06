import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const emailToDelete = 'philippoppel223@gmail.com'

async function main() {
  console.log(`\n🔍 Looking for user: ${emailToDelete}`)

  const user = await prisma.user.findUnique({
    where: { email: emailToDelete },
    include: {
      therapistProfile: true,
    },
  })

  if (!user) {
    console.log(`❌ User not found: ${emailToDelete}`)
    process.exit(0)
  }

  console.log(`✓ Found user: ${user.firstName} ${user.lastName} (${user.role})`)

  // Delete therapist profile first if exists
  if (user.therapistProfile) {
    console.log(`🗑️  Deleting therapist profile...`)
    await prisma.therapistProfile.delete({
      where: { userId: user.id },
    })
    console.log('   ✓ Therapist profile deleted')
  }

  // Delete user
  console.log(`🗑️  Deleting user...`)
  await prisma.user.delete({
    where: { id: user.id },
  })
  console.log('   ✓ User deleted')

  console.log(`\n✅ Successfully deleted ${emailToDelete}\n`)
}

main()
  .catch((e) => {
    console.error('\n❌ Error:', e.message)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
