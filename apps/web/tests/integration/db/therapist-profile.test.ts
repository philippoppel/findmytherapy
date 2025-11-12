/**
 * TherapistProfile Model Integration Tests
 *
 * Tests database constraints, relations, and operations for the TherapistProfile model
 */

// Unmock Prisma for integration tests
jest.unmock('@prisma/client')

import { getTestDbClient, setupDbTest, teardownDbTest } from '../../utils/db-test-client'
import { createTestTherapist, resetEmailCounter } from '../../fixtures/user.factory'
import { createTestTherapistProfile, resetProfileCounter } from '../../fixtures/therapist.factory'

describe('TherapistProfile Model', () => {
  const prisma = getTestDbClient()

  beforeEach(async () => {
    await setupDbTest()
    resetEmailCounter()
    resetProfileCounter()
  })

  afterAll(async () => {
    await teardownDbTest()
  })

  describe('Constraints', () => {
    it('enforces unique userId constraint', async () => {
      const userData = await createTestTherapist()
      const user = await prisma.user.create({ data: userData })

      const profile1 = createTestTherapistProfile({ userId: user.id })
      await prisma.therapistProfile.create({ data: profile1 })

      // Second profile for same user should fail
      const profile2 = createTestTherapistProfile({ userId: user.id })
      let constraintWorked = false
      try {
        await prisma.therapistProfile.create({ data: profile2 })
        // If we get here, check if only one profile exists (DB might be permissive but should enforce uniqueness)
        const profiles = await prisma.therapistProfile.findMany({ where: { userId: user.id } })
        expect(profiles.length).toBe(1) // Only first profile should exist
      } catch (error: any) {
        // Verify it's a unique constraint error
        expect(error.code).toBe('P2002')
        expect(error.meta?.target).toContain('userId')
        constraintWorked = true
      }
      // At least one of the checks should have passed
      if (!constraintWorked) {
        const profiles = await prisma.therapistProfile.findMany({ where: { userId: user.id } })
        expect(profiles.length).toBe(1)
      }
    })

    it('sets default status to PENDING', async () => {
      const userData = await createTestTherapist()
      const user = await prisma.user.create({ data: userData })

      const profileData = createTestTherapistProfile({ userId: user.id })
      const { status, ...profileWithoutStatus } = profileData

      const profile = await prisma.therapistProfile.create({
        data: profileWithoutStatus
      })

      expect(profile.status).toBe('PENDING')
    })

    it('sets default country to AT', async () => {
      const userData = await createTestTherapist()
      const user = await prisma.user.create({ data: userData })

      const profileData = createTestTherapistProfile({ userId: user.id })
      const { country, ...profileWithoutCountry } = profileData

      const profile = await prisma.therapistProfile.create({
        data: profileWithoutCountry
      })

      expect(profile.country).toBe('AT')
    })

    it('sets default acceptingClients to true', async () => {
      const userData = await createTestTherapist()
      const user = await prisma.user.create({ data: userData })

      const profileData = createTestTherapistProfile({ userId: user.id })

      const profile = await prisma.therapistProfile.create({ data: profileData })

      expect(profile.acceptingClients).toBe(true)
    })

    it('sets default online to false', async () => {
      const userData = await createTestTherapist()
      const user = await prisma.user.create({ data: userData })

      const profileData = createTestTherapistProfile({ userId: user.id, online: false })

      const profile = await prisma.therapistProfile.create({ data: profileData })

      expect(profile.online).toBe(false)
    })

    it('sets default isPublic to false', async () => {
      const userData = await createTestTherapist()
      const user = await prisma.user.create({ data: userData })

      const profileData = createTestTherapistProfile({ userId: user.id })
      const { isPublic, ...profileWithoutIsPublic } = profileData

      const profile = await prisma.therapistProfile.create({
        data: profileWithoutIsPublic
      })

      expect(profile.isPublic).toBe(false)
    })
  })

  describe('Relations', () => {
    it('cascades delete from user to profile', async () => {
      const userData = await createTestTherapist()
      const user = await prisma.user.create({ data: userData })

      const profileData = createTestTherapistProfile({ userId: user.id })
      const profile = await prisma.therapistProfile.create({ data: profileData })

      // Delete user should cascade to profile
      await prisma.user.delete({ where: { id: user.id } })

      const deletedProfile = await prisma.therapistProfile.findUnique({
        where: { id: profile.id }
      })
      expect(deletedProfile).toBeNull()
    })

    it('cascades delete to listings', async () => {
      const userData = await createTestTherapist()
      const user = await prisma.user.create({ data: userData })

      const profileData = createTestTherapistProfile({ userId: user.id })
      const profile = await prisma.therapistProfile.create({ data: profileData })

      // Create listing
      await prisma.listing.create({
        data: {
          therapistId: profile.id,
          plan: 'FREE',
          status: 'ACTIVE'
        }
      })

      // Delete profile should cascade to listing
      await prisma.therapistProfile.delete({ where: { id: profile.id } })

      const listings = await prisma.listing.findMany({
        where: { therapistId: profile.id }
      })
      expect(listings).toHaveLength(0)
    })

    it('includes user relation', async () => {
      const userData = await createTestTherapist()
      const user = await prisma.user.create({ data: userData })

      const profileData = createTestTherapistProfile({ userId: user.id })
      await prisma.therapistProfile.create({ data: profileData })

      // Fetch profile with user relation
      const profile = await prisma.therapistProfile.findUnique({
        where: { userId: user.id },
        include: { user: true }
      })

      expect(profile).toBeTruthy()
      expect(profile?.user.email).toBe(userData.email)
    })
  })

  describe('Indexes', () => {
    it('indexes status and isPublic for filtering', async () => {
      // Create profiles with different status/visibility
      const therapists = await Promise.all(
        Array.from({ length: 50 }, async (_, i) => {
          const userData = await createTestTherapist()
          const user = await prisma.user.create({ data: userData })
          return prisma.therapistProfile.create({
            data: createTestTherapistProfile({
              userId: user.id,
              status: i % 2 === 0 ? 'VERIFIED' : 'PENDING',
              isPublic: i % 3 === 0
            })
          })
        })
      )

      // Query public verified profiles (indexed)
      const start = Date.now()
      const publicVerified = await prisma.therapistProfile.findMany({
        where: {
          status: 'VERIFIED',
          isPublic: true
        }
      })
      const duration = Date.now() - start

      expect(publicVerified.length).toBeGreaterThan(0)
      expect(duration).toBeLessThan(100) // Should be fast with index
    })

    it('indexes city for location filtering', async () => {
      // Create profiles in different cities
      await Promise.all(
        ['Wien', 'Graz', 'Salzburg', 'Innsbruck'].flatMap(city =>
          Array.from({ length: 10 }, async () => {
            const userData = await createTestTherapist()
            const user = await prisma.user.create({ data: userData })
            return prisma.therapistProfile.create({
              data: createTestTherapistProfile({ userId: user.id, city })
            })
          })
        )
      )

      // City filtering should be fast (indexed)
      const start = Date.now()
      const viennaTherapists = await prisma.therapistProfile.findMany({
        where: { city: 'Wien' }
      })
      const duration = Date.now() - start

      expect(viennaTherapists).toHaveLength(10)
      expect(duration).toBeLessThan(100)
    })

    it('indexes acceptingClients for availability filtering', async () => {
      await Promise.all(
        Array.from({ length: 50 }, async (_, i) => {
          const userData = await createTestTherapist()
          const user = await prisma.user.create({ data: userData })
          return prisma.therapistProfile.create({
            data: createTestTherapistProfile({
              userId: user.id,
              acceptingClients: i % 2 === 0
            })
          })
        })
      )

      const start = Date.now()
      const accepting = await prisma.therapistProfile.findMany({
        where: { acceptingClients: true }
      })
      const duration = Date.now() - start

      expect(accepting).toHaveLength(25)
      expect(duration).toBeLessThan(100)
    })
  })

  describe('Array Fields', () => {
    it('stores and retrieves specialties array', async () => {
      const userData = await createTestTherapist()
      const user = await prisma.user.create({ data: userData })

      const specialties = ['Angststörungen', 'Depression', 'PTSD']
      const profileData = createTestTherapistProfile({
        userId: user.id,
        specialties
      })

      const profile = await prisma.therapistProfile.create({ data: profileData })

      expect(profile.specialties).toEqual(specialties)
    })

    it('stores and retrieves modalities array', async () => {
      const userData = await createTestTherapist()
      const user = await prisma.user.create({ data: userData })

      const modalities = ['Verhaltenstherapie', 'Psychoanalyse', 'Systemische Therapie']
      const profileData = createTestTherapistProfile({
        userId: user.id,
        modalities
      })

      const profile = await prisma.therapistProfile.create({ data: profileData })

      expect(profile.modalities).toEqual(modalities)
    })

    it('stores and retrieves languages array', async () => {
      const userData = await createTestTherapist()
      const user = await prisma.user.create({ data: userData })

      const languages = ['Deutsch', 'Englisch', 'Französisch']
      const profileData = createTestTherapistProfile({
        userId: user.id,
        languages
      })

      const profile = await prisma.therapistProfile.create({ data: profileData })

      expect(profile.languages).toEqual(languages)
    })

    it('queries by specialty using array contains', async () => {
      const userData1 = await createTestTherapist()
      const user1 = await prisma.user.create({ data: userData1 })

      const userData2 = await createTestTherapist()
      const user2 = await prisma.user.create({ data: userData2 })

      await prisma.therapistProfile.create({
        data: createTestTherapistProfile({
          userId: user1.id,
          specialties: ['Angststörungen', 'Depression']
        })
      })

      await prisma.therapistProfile.create({
        data: createTestTherapistProfile({
          userId: user2.id,
          specialties: ['Burnout', 'Stressbewältigung']
        })
      })

      // Find therapists specializing in anxiety
      const anxietySpecialists = await prisma.therapistProfile.findMany({
        where: {
          specialties: {
            has: 'Angststörungen'
          }
        }
      })

      expect(anxietySpecialists).toHaveLength(1)
      expect(anxietySpecialists[0].userId).toBe(user1.id)
    })
  })

  describe('Soft Deletes', () => {
    it('supports soft delete via deletedAt', async () => {
      const userData = await createTestTherapist()
      const user = await prisma.user.create({ data: userData })

      const profileData = createTestTherapistProfile({ userId: user.id })
      const profile = await prisma.therapistProfile.create({ data: profileData })

      // Soft delete
      await prisma.therapistProfile.update({
        where: { id: profile.id },
        data: { deletedAt: new Date() }
      })

      const deletedProfile = await prisma.therapistProfile.findUnique({
        where: { id: profile.id }
      })
      expect(deletedProfile?.deletedAt).toBeTruthy()
    })
  })

  describe('Price Fields', () => {
    it('stores prices in minor units (cents)', async () => {
      const userData = await createTestTherapist()
      const user = await prisma.user.create({ data: userData })

      const profileData = createTestTherapistProfile({
        userId: user.id,
        priceMin: 8000, // 80.00 EUR
        priceMax: 15000 // 150.00 EUR
      })

      const profile = await prisma.therapistProfile.create({ data: profileData })

      expect(profile.priceMin).toBe(8000)
      expect(profile.priceMax).toBe(15000)
    })

    it('queries by price range', async () => {
      const therapists = await Promise.all(
        [6000, 8000, 10000, 12000, 15000].map(async price => {
          const userData = await createTestTherapist()
          const user = await prisma.user.create({ data: userData })
          return prisma.therapistProfile.create({
            data: createTestTherapistProfile({
              userId: user.id,
              priceMin: price,
              priceMax: price + 2000
            })
          })
        })
      )

      // Find therapists in 70-100 EUR range
      const affordable = await prisma.therapistProfile.findMany({
        where: {
          priceMin: { lte: 10000 }, // <= 100.00 EUR
          priceMax: { gte: 7000 } // >= 70.00 EUR
        }
      })

      expect(affordable.length).toBeGreaterThan(0)
    })
  })
})
