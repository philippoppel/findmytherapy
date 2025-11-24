#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client'
import { writeFileSync } from 'fs'

const prisma = new PrismaClient()

async function main() {
  console.log('Hole alle Therapeutinnen mit Websites...')

  const profiles = await prisma.therapistProfile.findMany({
    where: {
      websiteUrl: { not: null }
    },
    select: {
      id: true,
      displayName: true,
      websiteUrl: true,
      city: true
    },
    orderBy: {
      displayName: 'asc'
    }
  })

  console.log(`Gefunden: ${profiles.length} Therapeutinnen mit Websites\n`)

  // CSV erstellen
  let csv = 'ID,Name,Stadt,Website URL\n'
  profiles.forEach(p => {
    const name = (p.displayName || '').replace(/"/g, '""')
    const city = (p.city || '').replace(/"/g, '""')
    const url = (p.websiteUrl || '').replace(/"/g, '""')
    csv += `${p.id},"${name}","${city}","${url}"\n`
  })

  const filePath = '/Users/philippoppel/Desktop/mental-health-platform/therapist-websites.csv'
  writeFileSync(filePath, csv)
  console.log(`✅ Gespeichert: ${filePath}`)
  console.log(`📊 Total: ${profiles.length} Websites`)

  // Statistik
  const uniqueUrls = new Set(profiles.map(p => p.websiteUrl).filter(Boolean))
  console.log(`📊 Unique URLs: ${uniqueUrls.size}`)

  // Domain-Analyse
  const domains: Record<string, number> = {}
  profiles.forEach(p => {
    if (!p.websiteUrl) return
    try {
      const url = new URL(p.websiteUrl)
      const domain = url.hostname.replace('www.', '')
      domains[domain] = (domains[domain] || 0) + 1
    } catch (e) {
      // Invalid URL
    }
  })

  console.log('\n📊 Top 10 Domains:')
  Object.entries(domains)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([domain, count]) => {
      console.log(`   ${domain}: ${count}`)
    })
}

main().catch(console.error).finally(() => prisma.$disconnect())
