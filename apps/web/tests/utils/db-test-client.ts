/**
 * DB Test Client
 *
 * Provides utilities for database testing with automatic cleanup and isolation.
 */

import { PrismaClient } from '@prisma/client'

let prisma: PrismaClient

/**
 * Get or create a Prisma client for testing
 */
export function getTestDbClient(): PrismaClient {
  if (!prisma) {
    prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/test_db'
        }
      }
    })
  }
  return prisma
}

/**
 * Clean up all test data from database
 * Deletes in correct order to respect foreign key constraints
 */
export async function cleanupDatabase() {
  const client = getTestDbClient()

  // Delete in reverse order of dependencies
  await client.auditLog.deleteMany()
  await client.emergencyAlert.deleteMany()

  // Dossier-related tables (new)
  await client.dossierAccessLog.deleteMany()
  await client.sessionZeroDossier.deleteMany()
  await client.clientConsent.deleteMany()

  await client.triageSession.deleteMany()
  await client.triageSnapshot.deleteMany()
  await client.match.deleteMany()
  await client.appointment.deleteMany()
  await client.enrollment.deleteMany()
  await client.order.deleteMany()
  await client.payout.deleteMany()
  await client.lesson.deleteMany()
  await client.course.deleteMany()
  await client.listing.deleteMany()
  await client.therapistProfileVersion.deleteMany()
  await client.therapistProfile.deleteMany()
  await client.contactRequest.deleteMany()
  await client.accessRequest.deleteMany()
  await client.passwordResetRequest.deleteMany()
  await client.session.deleteMany()
  await client.account.deleteMany()
  await client.user.deleteMany()
  await client.verificationToken.deleteMany()
}

/**
 * Disconnect from database
 */
export async function disconnectTestDb() {
  if (prisma) {
    await prisma.$disconnect()
  }
}

/**
 * Setup for DB tests - clean database before each test
 */
export async function setupDbTest() {
  await cleanupDatabase()
}

/**
 * Teardown for DB tests - clean database and disconnect
 */
export async function teardownDbTest() {
  await cleanupDatabase()
  await disconnectTestDb()
}
