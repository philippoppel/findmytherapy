// Mock for jose to avoid ESM issues in Jest
module.exports = {
  __esModule: true,
  compactDecrypt: jest.fn(),
  compactVerify: jest.fn(),
  EncryptJWT: jest.fn(),
  jwtDecrypt: jest.fn(),
  jwtVerify: jest.fn(),
  SignJWT: jest.fn(),
}
