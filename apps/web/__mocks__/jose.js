// Mock for jose to avoid ESM issues in Jest
const crypto = require('crypto')

// Simple JWT implementation for testing
class MockSignJWT {
  constructor(payload) {
    this.payload = payload
    this.protectedHeader = null
  }

  setProtectedHeader(header) {
    this.protectedHeader = header
    return this
  }

  setIssuedAt() {
    this.payload.iat = Math.floor(Date.now() / 1000)
    return this
  }

  setExpirationTime(exp) {
    this.payload.exp = exp
    return this
  }

  async sign(secret) {
    const header = Buffer.from(JSON.stringify(this.protectedHeader || { alg: 'HS256' })).toString('base64url')
    const payload = Buffer.from(JSON.stringify(this.payload)).toString('base64url')
    const signature = crypto.createHmac('sha256', secret).update(`${header}.${payload}`).digest('base64url')
    return `${header}.${payload}.${signature}`
  }
}

async function mockJwtVerify(token, secret) {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) throw new Error('Invalid token')

    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString())

    // Check expiration
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      throw new Error('Token expired')
    }

    return { payload }
  } catch (error) {
    throw error
  }
}

module.exports = {
  __esModule: true,
  compactDecrypt: jest.fn(),
  compactVerify: jest.fn(),
  EncryptJWT: jest.fn(),
  jwtDecrypt: jest.fn().mockResolvedValue({
    payload: {
      sub: 'test-user-id',
      email: 'test@example.com',
      role: 'CLIENT',
      locale: 'de-AT',
      twoFAEnabled: false,
      firstName: 'Test',
      lastName: 'User',
      marketingOptIn: false,
      exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
    },
  }),
  jwtVerify: mockJwtVerify,
  SignJWT: MockSignJWT,
}
