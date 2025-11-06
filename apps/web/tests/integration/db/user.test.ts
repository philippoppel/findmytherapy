/**
 * User Model Integration Tests
 *
 * Tests database constraints, relations, and operations for the User model
 */

import { getTestDbClient, setupDbTest, teardownDbTest } from '../../utils/db-test-client'
import { createTestUser, createTestClient, resetEmailCounter } from '../../fixtures/user.factory'

describe('User Model', () => {
  const prisma = getTestDbClient()

  beforeEach(async () => {
    await setupDbTest()
    resetEmailCounter()
  })

  afterAll(async () => {
    await teardownDbTest()
  })

  describe('Constraints', () => {
    it('enforces unique email constraint', async () => {
      const userData = createTestUser({ email: 'duplicate@example.com' })

      await prisma.user.create({ data: userData })

      // Second user with same email should fail
      await expect(
        prisma.user.create({ data: { ...userData } })
      ).rejects.toThrow(/Unique constraint/)
    })

    it('requires email field', async () => {
      const userData = createTestUser()
      const { email, ...userWithoutEmail } = userData

      await expect(
        prisma.user.create({ data: userWithoutEmail as any })
      ).rejects.toThrow()
    })

    it('sets default role to CLIENT', async () => {
      const userData = createTestUser()
      const { role, ...userWithoutRole } = userData

      const user = await prisma.user.create({ data: userWithoutRole })

      expect(user.role).toBe('CLIENT')
    })

    it('sets default locale to de-AT', async () => {
      const userData = createTestUser()
      const { locale, ...userWithoutLocale } = userData

      const user = await prisma.user.create({ data: userWithoutLocale })

      expect(user.locale).toBe('de-AT')
    })

    it('sets default marketingOptIn to false', async () => {
      const userData = createTestUser()

      const user = await prisma.user.create({ data: userData })

      expect(user.marketingOptIn).toBe(false)
    })
  })

  describe('Relations', () => {
    it('cascades delete to sessions', async () => {
      const userData = await createTestClient()
      const user = await prisma.user.create({ data: userData })

      // Create a session
      await prisma.session.create({
        data: {
          userId: user.id,
          sessionToken: 'test-session-token',
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
        }
      })

      // Delete user should cascade to session
      await prisma.user.delete({ where: { id: user.id } })

      const sessions = await prisma.session.findMany({ where: { userId: user.id } })
      expect(sessions).toHaveLength(0)
    })

    it('cascades delete to accounts', async () => {
      const userData = await createTestClient()
      const user = await prisma.user.create({ data: userData })

      // Create an account
      await prisma.account.create({
        data: {
          userId: user.id,
          type: 'oauth',
          provider: 'google',
          providerAccountId: 'google-123'
        }
      })

      // Delete user should cascade to account
      await prisma.user.delete({ where: { id: user.id } })

      const accounts = await prisma.account.findMany({ where: { userId: user.id } })
      expect(accounts).toHaveLength(0)
    })

    it('cascades delete to therapist profile', async () => {
      const userData = await createTestClient({ role: 'THERAPIST' })
      const user = await prisma.user.create({ data: userData })

      // Create therapist profile
      await prisma.therapistProfile.create({
        data: {
          userId: user.id,
          displayName: 'Test Therapist',
          country: 'AT'
        }
      })

      // Delete user should cascade to profile
      await prisma.user.delete({ where: { id: user.id } })

      const profile = await prisma.therapistProfile.findUnique({
        where: { userId: user.id }
      })
      expect(profile).toBeNull()
    })
  })

  describe('Indexes', () => {
    it('indexes email for fast lookups', async () => {
      // Create many users
      const users = await Promise.all(
        Array.from({ length: 100 }, (_, i) =>
          prisma.user.create({ data: createTestUser() })
        )
      )

      const email = users[50].email

      // Email lookup should be fast (indexed)
      const start = Date.now()
      const user = await prisma.user.findUnique({ where: { email } })
      const duration = Date.now() - start

      expect(user).toBeTruthy()
      expect(duration).toBeLessThan(100) // Should be very fast with index
    })

    it('indexes role for filtering', async () => {
      // Create users with different roles
      await Promise.all([
        ...Array.from({ length: 30 }, () =>
          prisma.user.create({ data: createTestUser({ role: 'CLIENT' }) })
        ),
        ...Array.from({ length: 20 }, () =>
          prisma.user.create({ data: createTestUser({ role: 'THERAPIST' }) })
        )
      ])

      // Role filtering should be fast (indexed)
      const start = Date.now()
      const therapists = await prisma.user.findMany({ where: { role: 'THERAPIST' } })
      const duration = Date.now() - start

      expect(therapists).toHaveLength(20)
      expect(duration).toBeLessThan(100)
    })
  })

  describe('Soft Deletes', () => {
    it('supports soft delete via deletedAt', async () => {
      const userData = await createTestClient()
      const user = await prisma.user.create({ data: userData })

      // Soft delete
      await prisma.user.update({
        where: { id: user.id },
        data: { deletedAt: new Date() }
      })

      // User still exists in DB
      const deletedUser = await prisma.user.findUnique({ where: { id: user.id } })
      expect(deletedUser).toBeTruthy()
      expect(deletedUser?.deletedAt).toBeTruthy()
    })

    it('can filter out soft-deleted users', async () => {
      const userData1 = await createTestClient()
      const userData2 = await createTestClient()

      const user1 = await prisma.user.create({ data: userData1 })
      await prisma.user.create({ data: userData2 })

      // Soft delete user1
      await prisma.user.update({
        where: { id: user1.id },
        data: { deletedAt: new Date() }
      })

      // Query only active users
      const activeUsers = await prisma.user.findMany({
        where: { deletedAt: null }
      })

      expect(activeUsers).toHaveLength(1)
      expect(activeUsers[0].email).toBe(userData2.email)
    })
  })

  describe('CRUD Operations', () => {
    it('creates user with all fields', async () => {
      const userData = await createTestClient()

      const user = await prisma.user.create({ data: userData })

      expect(user.id).toBeTruthy()
      expect(user.email).toBe(userData.email)
      expect(user.firstName).toBe(userData.firstName)
      expect(user.lastName).toBe(userData.lastName)
      expect(user.role).toBe('CLIENT')
      expect(user.createdAt).toBeInstanceOf(Date)
      expect(user.updatedAt).toBeInstanceOf(Date)
    })

    it('updates user fields', async () => {
      const userData = await createTestClient()
      const user = await prisma.user.create({ data: userData })

      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          firstName: 'Updated',
          lastName: 'Name'
        }
      })

      expect(updatedUser.firstName).toBe('Updated')
      expect(updatedUser.lastName).toBe('Name')
      expect(updatedUser.updatedAt.getTime()).toBeGreaterThan(user.updatedAt.getTime())
    })

    it('deletes user', async () => {
      const userData = await createTestClient()
      const user = await prisma.user.create({ data: userData })

      await prisma.user.delete({ where: { id: user.id } })

      const deletedUser = await prisma.user.findUnique({ where: { id: user.id } })
      expect(deletedUser).toBeNull()
    })

    it('finds user by email', async () => {
      const userData = await createTestClient()
      await prisma.user.create({ data: userData })

      const user = await prisma.user.findUnique({ where: { email: userData.email } })

      expect(user).toBeTruthy()
      expect(user?.email).toBe(userData.email)
    })
  })
})
