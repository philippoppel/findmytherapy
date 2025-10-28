// Mock for next-auth to avoid ESM issues in Jest
module.exports = {
  __esModule: true,
  default: jest.fn(() => Promise.resolve(null)),
  providers: {
    Credentials: jest.fn(() => ({})),
  },
}
