/**
 * Check what data was created by the E2E tests
 */

import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, '.env.production.check') });

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

async function checkCreatedData() {
  console.log('🔍 Checking data created by E2E tests...\n');

  // Check leads created in the last 5 minutes
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

  const recentLeads = await prisma.therapistMicrositeLead.findMany({
    where: {
      createdAt: {
        gte: fiveMinutesAgo,
      },
    },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      message: true,
      status: true,
      consent: true,
      metadata: true,
      createdAt: true,
      therapistProfile: {
        select: {
          displayName: true,
          micrositeSlug: true,
        },
      },
    },
  });

  console.log(`📧 Recent Leads (last 5 minutes): ${recentLeads.length}\n`);

  recentLeads.forEach((lead, index) => {
    console.log(`${index + 1}. Lead ID: ${lead.id}`);
    console.log(
      `   Therapist: ${lead.therapistProfile.displayName} (${lead.therapistProfile.micrositeSlug})`,
    );
    console.log(`   Name: ${lead.name}`);
    console.log(`   Email: ${lead.email}`);
    console.log(`   Phone: ${lead.phone}`);
    console.log(`   Message: ${lead.message}`);
    console.log(`   Status: ${lead.status}`);
    console.log(`   Consent: ${lead.consent}`);
    console.log(`   Metadata: ${JSON.stringify(lead.metadata, null, 2)}`);
    console.log(`   Created: ${lead.createdAt}`);
    console.log('');
  });

  // Check all leads for dr-maria-mueller
  const allLeads = await prisma.therapistMicrositeLead.findMany({
    where: {
      therapistProfile: {
        micrositeSlug: 'dr-maria-mueller',
      },
    },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
      createdAt: true,
    },
  });

  console.log(`\n📊 All Leads for dr-maria-mueller: ${allLeads.length}\n`);

  if (allLeads.length > 0) {
    allLeads.forEach((lead, index) => {
      console.log(
        `${index + 1}. ${lead.name} (${lead.email}) - ${lead.status} - ${lead.createdAt}`,
      );
    });
  } else {
    console.log('No leads found');
  }

  // Check visits
  const allVisits = await prisma.therapistMicrositeVisit.count({
    where: {
      therapistProfile: {
        micrositeSlug: 'dr-maria-mueller',
      },
    },
  });

  console.log(`\n👁️  Total Visits for dr-maria-mueller: ${allVisits}`);

  // Summary of all microsite data
  console.log('\n' + '='.repeat(80));
  console.log('MICROSITE DATA SUMMARY');
  console.log('='.repeat(80));

  const profile = await prisma.therapistProfile.findFirst({
    where: {
      micrositeSlug: 'dr-maria-mueller',
    },
    select: {
      displayName: true,
      micrositeSlug: true,
      micrositeStatus: true,
      _count: {
        select: {
          micrositeLeads: true,
          micrositeVisits: true,
        },
      },
    },
  });

  if (profile) {
    console.log(`\nTherapist: ${profile.displayName}`);
    console.log(`Slug: ${profile.micrositeSlug}`);
    console.log(`Status: ${profile.micrositeStatus}`);
    console.log(`Total Leads: ${profile._count.micrositeLeads}`);
    console.log(`Total Visits: ${profile._count.micrositeVisits}`);
  }

  console.log('\n' + '='.repeat(80));

  await prisma.$disconnect();
}

checkCreatedData().catch(console.error);
