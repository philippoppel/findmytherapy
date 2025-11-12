// Mock for next/headers to provide cookies() function in tests
module.exports = {
  __esModule: true,
  cookies: jest.fn(() => ({
    get: jest.fn((name) => ({
      name,
      value: 'mock-jwt-token-for-testing',
    })),
    set: jest.fn(),
    delete: jest.fn(),
    getAll: jest.fn(() => []),
    has: jest.fn(() => true),
  })),
  headers: jest.fn(() => ({
    get: jest.fn(),
    has: jest.fn(),
    keys: jest.fn(),
    values: jest.fn(),
    entries: jest.fn(),
    forEach: jest.fn(),
  })),
}
