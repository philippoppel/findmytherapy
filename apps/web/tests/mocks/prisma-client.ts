/**
 * Mock Prisma Client for tests
 */

export const PrismaClient = jest.fn().mockImplementation(() => ({
  user: {
    create: jest.fn().mockResolvedValue({}),
    findUnique: jest.fn().mockResolvedValue(null),
    findMany: jest.fn().mockResolvedValue([]),
    update: jest.fn().mockResolvedValue({}),
    delete: jest.fn().mockResolvedValue({}),
    deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
  },
  triageSession: {
    create: jest.fn().mockResolvedValue({ id: 'test-session-id' }),
    findUnique: jest.fn().mockResolvedValue(null),
    findMany: jest.fn().mockResolvedValue([]),
    update: jest.fn().mockResolvedValue({}),
    deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
  },
  sessionZeroDossier: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    deleteMany: jest.fn(),
  },
  dossierAccessLog: {
    create: jest.fn(),
    findMany: jest.fn(),
    deleteMany: jest.fn(),
  },
  clientConsent: {
    create: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    deleteMany: jest.fn(),
  },
  therapistProfile: {
    findUnique: jest.fn().mockResolvedValue(null),
    findMany: jest.fn().mockResolvedValue([]),
    deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
  },
  therapistProfileVersion: {
    deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
  },
  emergencyAlert: {
    create: jest.fn().mockResolvedValue({ id: 'test-alert-id' }),
    deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
  },
  triageSnapshot: {
    create: jest.fn().mockResolvedValue({ id: 'test-snapshot-id' }),
    deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
  },
  match: {
    deleteMany: jest.fn(),
  },
  appointment: {
    deleteMany: jest.fn(),
  },
  enrollment: {
    deleteMany: jest.fn(),
  },
  order: {
    deleteMany: jest.fn(),
  },
  payout: {
    deleteMany: jest.fn(),
  },
  lesson: {
    deleteMany: jest.fn(),
  },
  course: {
    deleteMany: jest.fn(),
  },
  listing: {
    deleteMany: jest.fn(),
  },
  contactRequest: {
    deleteMany: jest.fn(),
  },
  accessRequest: {
    deleteMany: jest.fn(),
  },
  passwordResetRequest: {
    deleteMany: jest.fn(),
  },
  session: {
    deleteMany: jest.fn(),
  },
  account: {
    deleteMany: jest.fn(),
  },
  verificationToken: {
    deleteMany: jest.fn(),
  },
  auditLog: {
    deleteMany: jest.fn(),
  },
  $disconnect: jest.fn(),
  $connect: jest.fn(),
}));
