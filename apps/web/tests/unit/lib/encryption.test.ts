/**
 * Encryption utilities tests
 */

import {
  encryptDossierData,
  decryptDossierData,
  hashIPAddress,
  generateSecureToken,
  buildDossierPayload,
  type DossierPayload,
} from '../../../lib/encryption'

// Mock environment variable
process.env.DOSSIER_ENCRYPTION_KEY = 'test-encryption-key-for-unit-tests-must-be-secure'

describe('Encryption Utilities', () => {
  describe('encryptDossierData / decryptDossierData', () => {
    it('should encrypt and decrypt data correctly', () => {
      const testData = {
        message: 'Hello, World!',
        number: 42,
        nested: { value: true },
      }

      const { encryptedData, keyId } = encryptDossierData(testData)

      expect(encryptedData).toBeTruthy()
      expect(typeof encryptedData).toBe('string')
      expect(keyId).toBe('primary')

      // Encrypted data should not contain original data
      expect(encryptedData).not.toContain('Hello, World!')

      // Decrypt and verify
      const decrypted = decryptDossierData(encryptedData, keyId)
      expect(decrypted).toEqual(testData)
    })

    it('should produce different encrypted outputs for same data', () => {
      const testData = { value: 'test' }

      const result1 = encryptDossierData(testData)
      const result2 = encryptDossierData(testData)

      // Different IVs should produce different encrypted outputs
      expect(result1.encryptedData).not.toBe(result2.encryptedData)

      // But both should decrypt to the same data
      expect(decryptDossierData(result1.encryptedData)).toEqual(testData)
      expect(decryptDossierData(result2.encryptedData)).toEqual(testData)
    })

    it('should handle complex nested objects', () => {
      const complexData: DossierPayload = {
        clientAlias: 'Test Client',
        clientEmail: 'test@example.com',
        clientTimezone: 'Europe/Vienna',
        preferredContact: ['email'],
        phq9Score: 15,
        phq9Severity: 'moderately_severe',
        phq9Answers: [2, 2, 2, 2, 2, 2, 2, 2, 1],
        gad7Score: 12,
        gad7Severity: 'moderate',
        gad7Answers: [2, 2, 2, 2, 2, 1, 1],
        riskLevel: 'MEDIUM',
        requiresEmergency: false,
        hasSuicidalIdeation: false,
        phq9Item9Score: 1,
        redFlags: [
          {
            code: 'MODERATELY_SEVERE_DEPRESSION',
            severity: 'HIGH',
            description: 'Test',
          },
        ],
        supportPreferences: ['therapist'],
        availability: ['online'],
        themes: [
          { name: 'Depression', intensity: 55 },
          { name: 'Angst', intensity: 57 },
        ],
        createdAt: new Date().toISOString(),
        triageSessionId: 'test-session-id',
      }

      const { encryptedData } = encryptDossierData(complexData)
      const decrypted = decryptDossierData<DossierPayload>(encryptedData)

      expect(decrypted).toEqual(complexData)
      expect(decrypted.phq9Score).toBe(15)
      expect(decrypted.redFlags).toHaveLength(1)
      expect(decrypted.themes).toHaveLength(2)
    })

    it('should throw error on tampered encrypted data', () => {
      const testData = { value: 'test' }
      const { encryptedData } = encryptDossierData(testData)

      // Tamper with encrypted data
      const tampered = encryptedData.slice(0, -10) + 'xxxxxxxxxx'

      expect(() => {
        decryptDossierData(tampered)
      }).toThrow()
    })

    it('should throw error on invalid encrypted data format', () => {
      expect(() => {
        decryptDossierData('invalid-format')
      }).toThrow('Invalid encrypted data format')
    })
  })

  describe('hashIPAddress', () => {
    it('should hash IP addresses consistently', () => {
      const ip = '192.168.1.1'
      const hash1 = hashIPAddress(ip)
      const hash2 = hashIPAddress(ip)

      expect(hash1).toBe(hash2)
      expect(hash1).toHaveLength(64) // SHA256 produces 64 hex characters
    })

    it('should produce different hashes for different IPs', () => {
      const ip1 = '192.168.1.1'
      const ip2 = '192.168.1.2'

      const hash1 = hashIPAddress(ip1)
      const hash2 = hashIPAddress(ip2)

      expect(hash1).not.toBe(hash2)
    })

    it('should not contain original IP in hash', () => {
      const ip = '192.168.1.1'
      const hash = hashIPAddress(ip)

      expect(hash).not.toContain(ip)
      expect(hash).not.toContain('192')
    })
  })

  describe('generateSecureToken', () => {
    it('should generate random tokens', () => {
      const token1 = generateSecureToken()
      const token2 = generateSecureToken()

      expect(token1).not.toBe(token2)
      expect(token1).toHaveLength(64) // 32 bytes = 64 hex characters
    })

    it('should generate tokens of specified length', () => {
      const token = generateSecureToken(16)
      expect(token).toHaveLength(32) // 16 bytes = 32 hex characters
    })
  })

  describe('buildDossierPayload', () => {
    it('should build complete dossier payload from triage data', () => {
      const triageSession = {
        id: 'test-triage-id',
        phq9Score: 12,
        phq9Severity: 'moderate',
        phq9Answers: [1, 1, 1, 1, 1, 2, 2, 2, 1],
        gad7Score: 9,
        gad7Severity: 'mild',
        gad7Answers: [1, 1, 1, 2, 2, 1, 1],
        riskLevel: 'MEDIUM',
        requiresEmergency: false,
        supportPreferences: ['therapist', 'online'],
        availability: ['mornings', 'online'],
        meta: {
          phq9Item9Score: 1,
          hasSuicidalIdeation: false,
        },
        createdAt: new Date(),
      }

      const client = {
        id: 'test-client-id',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      }

      const payload = buildDossierPayload(triageSession, client)

      expect(payload.clientAlias).toBe('Test User')
      expect(payload.clientEmail).toBe('test@example.com')
      expect(payload.phq9Score).toBe(12)
      expect(payload.gad7Score).toBe(9)
      expect(payload.riskLevel).toBe('MEDIUM')
      expect(payload.requiresEmergency).toBe(false)
      expect(payload.hasSuicidalIdeation).toBe(false)
      expect(payload.themes).toHaveLength(2)
      expect(payload.themes[0].name).toBe('Depression')
      expect(payload.themes[1].name).toBe('Angst')
    })

    it('should identify red flags correctly', () => {
      const triageSession = {
        id: 'test-triage-id',
        phq9Score: 22,
        phq9Severity: 'severe',
        phq9Answers: [3, 3, 3, 3, 3, 3, 2, 2, 2],
        gad7Score: 18,
        gad7Severity: 'severe',
        gad7Answers: [3, 3, 3, 3, 3, 2, 1],
        riskLevel: 'HIGH',
        requiresEmergency: true,
        supportPreferences: [],
        availability: [],
        meta: {
          phq9Item9Score: 2,
          hasSuicidalIdeation: true,
        },
        createdAt: new Date(),
      }

      const client = {
        id: 'test-client-id',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      }

      const payload = buildDossierPayload(triageSession, client)

      expect(payload.riskLevel).toBe('CRITICAL')
      expect(payload.hasSuicidalIdeation).toBe(true)
      expect(payload.redFlags.length).toBeGreaterThan(0)

      const suicidalFlag = payload.redFlags.find(
        (f) => f.code === 'SUICIDAL_IDEATION'
      )
      expect(suicidalFlag).toBeDefined()
      expect(suicidalFlag?.severity).toBe('CRITICAL')

      const depressionFlag = payload.redFlags.find(
        (f) => f.code === 'SEVERE_DEPRESSION'
      )
      expect(depressionFlag).toBeDefined()

      const anxietyFlag = payload.redFlags.find((f) => f.code === 'SEVERE_ANXIETY')
      expect(anxietyFlag).toBeDefined()
    })

    it('should handle clients without names', () => {
      const triageSession = {
        id: 'test-triage-id',
        phq9Score: 5,
        phq9Severity: 'mild',
        phq9Answers: [1, 1, 1, 1, 1, 0, 0, 0, 0],
        gad7Score: 3,
        gad7Severity: 'minimal',
        gad7Answers: [1, 1, 1, 0, 0, 0, 0],
        riskLevel: 'LOW',
        requiresEmergency: false,
        supportPreferences: [],
        availability: [],
        meta: {},
        createdAt: new Date(),
      }

      const client = {
        id: 'test-client-id',
        email: 'test@example.com',
        firstName: null,
        lastName: null,
      }

      const payload = buildDossierPayload(triageSession, client)

      expect(payload.clientAlias).toBe('Klient:in')
      expect(payload.clientEmail).toBe('test@example.com')
    })
  })
})
