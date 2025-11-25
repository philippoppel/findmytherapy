/**
 * Dossier creation API integration tests
 * Exercises the live route with real Prisma + test DB.
 */

// Unmock Prisma for integration tests
jest.unmock('@prisma/client');

import { POST as createDossierRoute } from '../../../../app/api/dossiers/route';
import { createMockRequest, parseJsonResponse } from '../../../utils/api-test-client';
import { getTestDbClient, setupDbTest, teardownDbTest } from '../../../utils/db-test-client';
import { createTestClient } from '../../../fixtures/user.factory';

jest.mock('../../../../lib/auth', () => ({
  auth: jest.fn(),
}));

import { auth } from '../../../../lib/auth';

const mockAuth = auth as jest.MockedFunction<typeof auth>;

const prisma = getTestDbClient();

const DEFAULT_TRIAGE_DATA = {
  phq9Answers: [1, 1, 1, 1, 1, 1, 1, 1, 1],
  phq9Score: 9,
  phq9Severity: 'mild',
  gad7Answers: [1, 1, 1, 1, 1, 1, 1],
  gad7Score: 7,
  gad7Severity: 'mild',
  supportPreferences: [],
  availability: [],
  riskLevel: 'LOW' as const,
  requiresEmergency: false,
  recommendedNextStep: 'INFO' as const,
  meta: {
    phq9Item9Score: 0,
    hasSuicidalIdeation: false,
  },
};

describe('POST /api/dossiers', () => {
  beforeAll(() => {
    process.env.DOSSIER_ENCRYPTION_KEY =
      process.env.DOSSIER_ENCRYPTION_KEY || 'test-encryption-key';
    process.env.NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || 'test-secret';
  });

  beforeEach(async () => {
    await setupDbTest();
    mockAuth.mockReset();
  });

  afterAll(async () => {
    await teardownDbTest();
  });

  it('requires authentication', async () => {
    mockAuth.mockResolvedValue(null);

    const request = createMockRequest('/api/dossiers', {
      method: 'POST',
      body: { triageSessionId: 'invalid-id' },
    });

    const response = await createDossierRoute(request);
    const data = await parseJsonResponse(response);

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
  });

  it('rejects creation when consent is missing', async () => {
    const clientData = await createTestClient();
    const client = await prisma.user.create({ data: clientData });

    const triageSession = await prisma.triageSession.create({
      data: {
        clientId: client.id,
        ...DEFAULT_TRIAGE_DATA,
      },
    });

    mockAuth.mockResolvedValue({
      user: { id: client.id, email: client.email, role: 'CLIENT' },
    } as any);

    const request = createMockRequest('/api/dossiers', {
      method: 'POST',
      body: { triageSessionId: triageSession.id },
    });

    const response = await createDossierRoute(request);
    const data = await parseJsonResponse(response);

    expect(response.status).toBe(403);
    expect(data.code).toBe('CONSENT_REQUIRED');
  });

  it('creates dossier when consent is granted', async () => {
    const clientData = await createTestClient();
    const client = await prisma.user.create({ data: clientData });

    const triageSession = await prisma.triageSession.create({
      data: {
        clientId: client.id,
        ...DEFAULT_TRIAGE_DATA,
      },
    });

    await prisma.clientConsent.create({
      data: {
        clientId: client.id,
        scope: 'DOSSIER_SHARING',
        status: 'GRANTED',
        source: 'test',
      },
    });

    mockAuth.mockResolvedValue({
      user: { id: client.id, email: client.email, role: 'CLIENT' },
    } as any);

    const request = createMockRequest('/api/dossiers', {
      method: 'POST',
      body: {
        triageSessionId: triageSession.id,
        recommendedTherapistIds: ['therapist-123'],
      },
    });

    const response = await createDossierRoute(request);
    const data = await parseJsonResponse(response);

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.data.dossierId).toBeTruthy();

    const dossierInDb = await prisma.sessionZeroDossier.findUnique({
      where: { triageSessionId: triageSession.id },
    });
    expect(dossierInDb).not.toBeNull();
  });

  it('prevents duplicate dossier creation for the same triage session', async () => {
    const clientData = await createTestClient();
    const client = await prisma.user.create({ data: clientData });

    const triageSession = await prisma.triageSession.create({
      data: {
        clientId: client.id,
        ...DEFAULT_TRIAGE_DATA,
      },
    });

    await prisma.clientConsent.create({
      data: {
        clientId: client.id,
        scope: 'DOSSIER_SHARING',
        status: 'GRANTED',
        source: 'test',
      },
    });

    await prisma.sessionZeroDossier.create({
      data: {
        triageSessionId: triageSession.id,
        clientId: client.id,
        encryptedPayload: 'encrypted-test-data',
        encryptionKeyId: 'primary',
        riskLevel: 'LOW',
        redFlags: [],
        generatedBy: 'AUTO',
        version: 1,
        expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000),
        recommendedTherapists: [],
      },
    });

    mockAuth.mockResolvedValue({
      user: { id: client.id, email: client.email, role: 'CLIENT' },
    } as any);

    const request = createMockRequest('/api/dossiers', {
      method: 'POST',
      body: {
        triageSessionId: triageSession.id,
      },
    });

    const response = await createDossierRoute(request);
    const data = await parseJsonResponse(response);

    expect(response.status).toBe(409);
    expect(data.code).toBe('DOSSIER_EXISTS');
  });
});
