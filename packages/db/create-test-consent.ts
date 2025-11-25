/**
 * Create test consent record
 */

import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, '.env.production.check') });

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

async function createTestConsent() {
  console.log('🔧 Creating test consent record...\n');

  // Find the triage session
  const triageSession = await prisma.triageSession.findFirst({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      clientId: true,
      client: {
        select: {
          email: true,
          firstName: true,
        },
      },
    },
  });

  if (!triageSession) {
    console.log('❌ No triage session found!');
    await prisma.$disconnect();
    return;
  }

  console.log(`Found triage session for client: ${triageSession.client.email}`);

  // Check if consent already exists
  const existingConsent = await prisma.clientConsent.findFirst({
    where: {
      clientId: triageSession.clientId,
      scope: 'DOSSIER_SHARING',
    },
  });

  if (existingConsent) {
    console.log('✅ Consent already exists:');
    console.log(`   Scope: ${existingConsent.scope}`);
    console.log(`   Status: ${existingConsent.status}`);
    console.log(`   Granted At: ${existingConsent.grantedAt}`);
    await prisma.$disconnect();
    return;
  }

  // Create consent
  const consent = await prisma.clientConsent.create({
    data: {
      clientId: triageSession.clientId,
      scope: 'DOSSIER_SHARING',
      status: 'GRANTED',
      grantedAt: new Date(),
      source: 'triage_flow',
      metadata: {
        triageSessionId: triageSession.id,
        testData: true,
      },
    },
  });

  console.log('✅ Consent created successfully!');
  console.log(`   ID: ${consent.id}`);
  console.log(`   Client ID: ${consent.clientId}`);
  console.log(`   Scope: ${consent.scope}`);
  console.log(`   Status: ${consent.status}`);
  console.log(`   Source: ${consent.source}`);
  console.log(`   Granted At: ${consent.grantedAt}`);

  await prisma.$disconnect();
}

createTestConsent().catch(console.error);
