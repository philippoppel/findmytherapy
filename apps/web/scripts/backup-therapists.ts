import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

async function main() {
  console.log('🔄 Fetching all therapist profiles from database...')

  const therapists = await prisma.therapistProfile.findMany({
    include: {
      user: {
        select: {
          email: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  })

  console.log(`✅ Found ${therapists.length} therapist profiles`)

  const backupDir = path.join(__dirname, '../backups')
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true })
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const backupPath = path.join(backupDir, `therapists-backup-${timestamp}.json`)

  fs.writeFileSync(backupPath, JSON.stringify(therapists, null, 2))

  console.log(`💾 Backup saved to: ${backupPath}`)
  console.log(`📊 Total records: ${therapists.length}`)
}

main()
  .catch((e) => {
    console.error('❌ Backup failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })