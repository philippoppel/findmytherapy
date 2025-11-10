/**
 * Dossier Creation API Integration Tests
 */

// Unmock Prisma for integration tests
jest.unmock('@prisma/client')

import { POST as createDossierRoute } from '../../../../app/api/dossiers/route'
import { createMockRequest, parseJsonResponse } from '../../../utils/api-test-client'
import { getTestDbClient, setupDbTest, teardownDbTest } from '../../../utils/db-test-client'
import { createTestClient } from '../../../fixtures/user.factory'

// Mock environment variables
process.env.DOSSIER_ENCRYPTION_KEY = 'test-encryption-key-for-integration-tests'
process.env.NEXTAUTH_SECRET = 'test-secret'

// Mock the auth function
jest.mock('../../../../lib/auth', () => ({
  auth: jest.fn(),
}))

import { auth } from '../../../../lib/auth'

const mockAuth = auth as jest.MockedFunction<typeof auth>

describe.skip('POST /api/dossiers - Create Dossier', () => {
  const prisma = getTestDbClient()

  beforeEach(async () => {
    await setupDbTest()
    mockAuth.mockReset()
  })

  afterAll(async () => {
    await teardownDbTest()
  })

  describe('Authentication', () => {
    it('should require authentication', async () => {
      mockAuth.mockResolvedValue(null)

      const request = createMockRequest('/api/dossiers', {
        method: 'POST',
        body: { triageSessionId: 'test-id' },
      })

      const response = await createDossierRoute(request)
      expect(response.status).toBe(401)

      const data = await parseJsonResponse(response)
      expect(data.success).toBe(false)
      expect(data.error).toContain('Authentication')
    })
  })

  describe('Consent Validation', () => {
    it('should require consent before creating dossier', async () => {
      // Create client and triage session
      const clientData = await createTestClient()
      const client = await prisma.user.create({ data: clientData })

      mockAuth.mockResolvedValue({
        user: {
          id: client.id,
          email: client.email,
          role: 'CLIENT',
        },
      } as any)

      const triageSession = await prisma.triageSession.create({
        data: {
          clientId: client.id,
          phq9Answers: [1, 1, 1, 1, 1, 1, 1, 1, 1],
          phq9Score: 9,
          phq9Severity: 'mild',
          gad7Answers: [1, 1, 1, 1, 1, 1, 1],
          gad7Score: 7,
          gad7Severity: 'mild',
          supportPreferences: [],
          availability: [],
          riskLevel: 'LOW',
          requiresEmergency: false,
          recommendedNextStep: 'INFO',
        },
      })

      // Note: No consent created

      const request = createMockRequest('/api/dossiers', {
        method: 'POST',
        body: {
          triageSessionId: triageSession.id,
        },
      })

      const response = await createDossierRoute(request)
      expect(response.status).toBe(403)

      const data = await parseJsonResponse(response)
      expect(data.code).toBe('CONSENT_REQUIRED')
    })
  })

  describe('Dossier Creation', () => {
    it('should create dossier with valid consent', async () => {
      // Create client and triage session
      const clientData = await createTestClient()
      const client = await prisma.user.create({ data: clientData })

      mockAuth.mockResolvedValue({
        user: {
          id: client.id,
          email: client.email,
          role: 'CLIENT',
        },
      } as any)

      const triageSession = await prisma.triageSession.create({
        data: {
          clientId: client.id,
          phq9Answers: [2, 2, 2, 2, 2, 1, 1, 1, 1],
          phq9Score: 14,
          phq9Severity: 'moderate',
          gad7Answers: [2, 2, 2, 2, 2, 1, 1],
          gad7Score: 12,
          gad7Severity: 'moderate',
          supportPreferences: ['therapist'],
          availability: ['online'],
          riskLevel: 'MEDIUM',
          requiresEmergency: false,
          recommendedNextStep: 'THERAPIST',
        },
      })

      // Create consent
      await prisma.clientConsent.create({
        data: {
          clientId: client.id,
          scope: 'DOSSIER_SHARING',
          status: 'GRANTED',
          source: 'test',
        },
      })

      const request = createMockRequest('/api/dossiers', {
        method: 'POST',
        body: {
          triageSessionId: triageSession.id,
          recommendedTherapistIds: [],
        },
      })

      const response = await createDossierRoute(request)
      expect(response.status).toBe(201)

      const data = await parseJsonResponse(response)
      expect(data.success).toBe(true)
      expect(data.data.dossierId).toBeTruthy()
      expect(data.data.riskLevel).toBe('MEDIUM')
      expect(data.data.version).toBe(1)
    })

    it('should prevent duplicate dossier creation', async () => {
      // Create client, triage, and dossier
      const clientData = await createTestClient()
      const client = await prisma.user.create({ data: clientData })

      mockAuth.mockResolvedValue({
        user: {
          id: client.id,
          email: client.email,
          role: 'CLIENT',
        },
      } as any)

      const triageSession = await prisma.triageSession.create({
        data: {
          clientId: client.id,
          phq9Answers: [1, 1, 1, 1, 1, 1, 1, 1, 1],
          phq9Score: 9,
          phq9Severity: 'mild',
          gad7Answers: [1, 1, 1, 1, 1, 1, 1],
          gad7Score: 7,
          gad7Severity: 'mild',
          supportPreferences: [],
          availability: [],
          riskLevel: 'LOW',
          requiresEmergency: false,
          recommendedNextStep: 'INFO',
        },
      })

      await prisma.clientConsent.create({
        data: {
          clientId: client.id,
          scope: 'DOSSIER_SHARING',
          status: 'GRANTED',
          source: 'test',
        },
      })

      // Create first dossier
      const expiresAt = new Date()
      expiresAt.setHours(expiresAt.getHours() + 72)

      await prisma.sessionZeroDossier.create({
        data: {
          triageSessionId: triageSession.id,
          clientId: client.id,
          encryptedPayload: 'encrypted-test-data',
          encryptionKeyId: 'primary',
          riskLevel: 'LOW',
          expiresAt,
          recommendedTherapists: [],
        },
      })

      // Try to create another dossier for the same triage session
      const request = createMockRequest('/api/dossiers', {
        method: 'POST',
        body: {
          triageSessionId: triageSession.id,
        },
      })

      const response = await createDossierRoute(request)
      expect(response.status).toBe(409)

      const data = await parseJsonResponse(response)
      expect(data.code).toBe('DOSSIER_EXISTS')
    })
  })
})
