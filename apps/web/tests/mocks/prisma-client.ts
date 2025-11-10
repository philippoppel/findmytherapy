/**
 * Mock Prisma Client for tests
 */

export const PrismaClient = jest.fn().mockImplementation(() => ({
  user: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
  },
  triageSession: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    deleteMany: jest.fn(),
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
    findUnique: jest.fn(),
    findMany: jest.fn(),
    deleteMany: jest.fn(),
  },
  therapistProfileVersion: {
    deleteMany: jest.fn(),
  },
  emergencyAlert: {
    create: jest.fn(),
    deleteMany: jest.fn(),
  },
  triageSnapshot: {
    create: jest.fn(),
    deleteMany: jest.fn(),
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
}))
