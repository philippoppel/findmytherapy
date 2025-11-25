/**
 * Triage API Contract Tests (integration with real Prisma + DB)
 *
 * Focuses on the high-level contract: valid payloads succeed, invalid ones
 * are rejected with a structured error. Uses the live route handler.
 */

// Unmock Prisma for integration tests
jest.unmock('@prisma/client');

import { POST as triageRoute } from '../../../app/api/triage/route';
import { createMockRequest, parseJsonResponse } from '../../utils/api-test-client';
import { getTestDbClient, setupDbTest, teardownDbTest } from '../../utils/db-test-client';
import { createTestClient } from '../../fixtures/user.factory';
import { createPhq9Answers, createGad7Answers } from '../../fixtures/triage.factory';

// Avoid next-auth runtime work during integration runs
jest.mock('../../../lib/auth', () => ({
  auth: jest.fn().mockResolvedValue(null),
}));

describe('POST /api/triage - Contract Tests', () => {
  const prisma = getTestDbClient();

  beforeEach(async () => {
    await setupDbTest();
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await teardownDbTest();
  });

  it('accepts a full assessment payload and returns recommendations', async () => {
    const userData = await createTestClient();
    const user = await prisma.user.create({ data: userData });

    const request = createMockRequest('/api/triage', {
      method: 'POST',
      body: {
        assessmentType: 'full' as const,
        clientId: user.id,
        phq9Answers: createPhq9Answers(6),
        phq9Score: 6,
        phq9Severity: 'mild' as const,
        gad7Answers: createGad7Answers(5),
        gad7Score: 5,
        gad7Severity: 'mild' as const,
        supportPreferences: ['therapist'],
        availability: ['online'],
        riskLevel: 'LOW' as const,
        requiresEmergency: false,
        phq9Item9Score: 0,
        hasSuicidalIdeation: false,
      },
    });

    const response = await triageRoute(request);
    const data = await parseJsonResponse(response);

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.recommendations).toBeDefined();
    expect(Array.isArray(data.recommendations?.courses)).toBe(true);
  });

  it('accepts a screening-only payload and returns screening result', async () => {
    const request = createMockRequest('/api/triage', {
      method: 'POST',
      body: {
        assessmentType: 'screening' as const,
        phq2Answers: [1, 1],
        gad2Answers: [0, 1],
        phq2Score: 2,
        gad2Score: 1,
        supportPreferences: [],
        availability: [],
      },
    });

    const response = await triageRoute(request);
    const data = await parseJsonResponse(response);

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.assessmentType).toBe('screening');
    expect(data.screeningResult).toBeDefined();
  });

  it('rejects payloads that fail schema validation', async () => {
    const request = createMockRequest('/api/triage', {
      method: 'POST',
      body: {
        assessmentType: 'full' as const,
        // Wrong length for PHQ-9
        phq9Answers: [1, 2, 3],
        phq9Score: 6,
        phq9Severity: 'mild',
        gad7Answers: createGad7Answers(4),
        gad7Score: 4,
        gad7Severity: 'mild',
        riskLevel: 'LOW',
        requiresEmergency: false,
      },
    });

    const response = await triageRoute(request);
    const data = await parseJsonResponse(response);

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(Array.isArray(data.errors)).toBe(true);
  });
});
