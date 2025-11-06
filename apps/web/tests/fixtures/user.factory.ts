/**
 * User Test Fixtures
 *
 * Factory functions for creating test users with realistic data
 */

import { User, UserRole } from '@prisma/client'
import { hash } from 'bcryptjs'

type CreateUserInput = {
  email?: string
  firstName?: string
  lastName?: string
  role?: UserRole
  locale?: string
  emailVerified?: Date | null
  marketingOptIn?: boolean
}

let emailCounter = 0

/**
 * Create a test user with default values
 */
export function createTestUser(overrides?: CreateUserInput): Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'> {
  emailCounter++

  return {
    email: overrides?.email || `test-user-${emailCounter}@example.com`,
    emailVerified: overrides?.emailVerified ?? new Date(),
    passwordHash: null, // Will be set by createTestUserWithPassword if needed
    firstName: overrides?.firstName || `Test`,
    lastName: overrides?.lastName || `User ${emailCounter}`,
    marketingOptIn: overrides?.marketingOptIn ?? false,
    role: overrides?.role || 'CLIENT',
    twoFASecret: null,
    locale: overrides?.locale || 'de-AT'
  }
}

/**
 * Create a test user with a hashed password
 */
export async function createTestUserWithPassword(
  password: string = 'Test1234!',
  overrides?: CreateUserInput
): Promise<Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>> {
  const user = createTestUser(overrides)
  const passwordHash = await hash(password, 10)

  return {
    ...user,
    passwordHash
  }
}

/**
 * Create a test therapist user
 */
export async function createTestTherapist(overrides?: CreateUserInput) {
  return createTestUserWithPassword('Therapist123!', {
    ...overrides,
    role: 'THERAPIST',
    firstName: overrides?.firstName || 'Dr.',
    lastName: overrides?.lastName || `Therapeut ${++emailCounter}`,
    email: overrides?.email || `therapist-${emailCounter}@example.com`
  })
}

/**
 * Create a test admin user
 */
export async function createTestAdmin(overrides?: CreateUserInput) {
  return createTestUserWithPassword('Admin123!', {
    ...overrides,
    role: 'ADMIN',
    firstName: overrides?.firstName || 'Admin',
    lastName: overrides?.lastName || `User ${++emailCounter}`,
    email: overrides?.email || `admin-${emailCounter}@example.com`
  })
}

/**
 * Create a test client user
 */
export async function createTestClient(overrides?: CreateUserInput) {
  return createTestUserWithPassword('Client123!', {
    ...overrides,
    role: 'CLIENT',
    firstName: overrides?.firstName || 'Test',
    lastName: overrides?.lastName || `Client ${++emailCounter}`,
    email: overrides?.email || `client-${emailCounter}@example.com`
  })
}

/**
 * Reset the email counter (useful for test isolation)
 */
export function resetEmailCounter() {
  emailCounter = 0
}
