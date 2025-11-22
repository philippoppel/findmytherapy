const nextJest = require('next/jest')
const dotenv = require('dotenv')

// Load test environment variables
dotenv.config({ path: '.env.test' })

const createJestConfig = nextJest({ dir: './' })

const customJestConfig = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/jest.integration.setup.ts'],
  moduleNameMapper: {
    // Mock next-auth to avoid ESM issues
    '^next-auth$': '<rootDir>/__mocks__/next-auth.js',
    '^next-auth/(.*)$': '<rootDir>/__mocks__/next-auth.js',
    '^jose$': '<rootDir>/__mocks__/jose.js',
    '^next/headers$': '<rootDir>/__mocks__/next/headers.js',
    '^next/server$': '<rootDir>/__mocks__/next/server.js',
    // DO NOT mock Prisma Client for integration tests
    '^@/(.*)$': '<rootDir>/$1',
    '^@mental-health/(.*)$': '<rootDir>/../../packages/$1/src',
  },
  // Only run integration tests
  testMatch: [
    '<rootDir>/tests/integration/**/*.test.ts',
    '<rootDir>/app/api/**/*.test.ts',
  ],
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
  ],
  maxWorkers: 1, // Run serially to avoid DB lock contention during TRUNCATE
  // Longer timeout for DB operations
  testTimeout: 30000,
  collectCoverageFrom: [
    'app/api/**/*.ts',
    'lib/**/*.ts',
  ],
}

module.exports = createJestConfig(customJestConfig)
