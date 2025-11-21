/**
 * DB Test Client
 *
 * Provides utilities for database testing with automatic cleanup and isolation.
 * Uses TRUNCATE ... CASCADE so we don't have to maintain a manual delete order
 * when the Prisma schema evolves.
 */

import { PrismaClient } from '@prisma/client'

const DEFAULT_TEST_DB_URL = 'postgresql://postgres:password@localhost:5432/test_db'
const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', 'host.docker.internal'])

let prisma: PrismaClient

function validateTestDatabaseUrl(url: string) {
  const parsed = new URL(url)
  const dbName = parsed.pathname.replace('/', '')

  if (!LOCAL_HOSTS.has(parsed.hostname)) {
    throw new Error(
      `Refusing to clean non-local database "${parsed.hostname}". ` +
        'Set DATABASE_URL to a dedicated local test database.'
    )
  }

  if (!/test/i.test(dbName)) {
    // Warn but do not block to avoid surprising local CI failures
    // while still nudging engineers toward a disposable database.
    console.warn(
      `Warning: database name "${dbName}" does not look like a test database. ` +
        'Use a *test* database to avoid data loss.'
    )
  }
}

/**
 * Get or create a Prisma client for testing
 */
export function getTestDbClient(): PrismaClient {
  if (!prisma) {
    const url = process.env.DATABASE_URL || DEFAULT_TEST_DB_URL
    validateTestDatabaseUrl(url)

    prisma = new PrismaClient({
      datasources: {
        db: { url }
      }
    })
  }

  return prisma
}

/**
 * Clean up all test data from database using TRUNCATE ... CASCADE
 * to drop rows from every public table (except migrations) and reset sequences.
 */
export async function cleanupDatabase() {
  const client = getTestDbClient()

  const tables = await client.$queryRaw<Array<{ tablename: string }>>`
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
      AND tablename NOT IN ('_prisma_migrations')
  `

  const tableNames = tables
    .map(({ tablename }) => tablename)
    .filter(Boolean)
    .map(name => `"${name}"`)

  if (tableNames.length === 0) {
    return
  }

  const truncateSql = `TRUNCATE TABLE ${tableNames.join(', ')} RESTART IDENTITY CASCADE;`
  await client.$executeRawUnsafe(truncateSql)
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
