const nextJest = require('next/jest')

const createJestConfig = nextJest({ dir: './' })

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^next-auth$': '<rootDir>/__mocks__/next-auth.js',
    '^next-auth/(.*)$': '<rootDir>/__mocks__/next-auth.js',
    '^jose$': '<rootDir>/__mocks__/jose.js',
    '^next/headers$': '<rootDir>/__mocks__/next/headers.js',
    '^next/server$': '<rootDir>/__mocks__/next/server.js',
    '^@prisma/client$': '<rootDir>/tests/mocks/prisma-client.ts',
    '^@/(.*)$': '<rootDir>/$1',
    '^@mental-health/(.*)$': '<rootDir>/../../packages/$1/src',
  },
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/tests/integration/',  // Integration tests run separately with DB
    '<rootDir>/tests/visual/',       // Visual tests run with Playwright
    '<rootDir>/tests/e2e/'           // E2E tests run with Playwright
  ],
  collectCoverageFrom: ['app/**/*.{ts,tsx}', 'components/**/*.{ts,tsx}', 'lib/**/*.{ts,tsx}'],
}

module.exports = createJestConfig(customJestConfig)
