/**
 * Encryption utilities for sensitive dossier data
 *
 * Uses AES-256-GCM for encryption with authenticated encryption
 * Provides key rotation support via keyId
 */

import crypto from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 16
const AUTH_TAG_LENGTH = 16
const SALT_LENGTH = 64

/**
 * Get encryption key from environment
 * In production, this should come from a secure key management service (e.g., AWS KMS, HashiCorp Vault)
 */
function getEncryptionKey(keyId: string = 'primary'): Buffer {
  const envKey = keyId === 'primary'
    ? process.env.DOSSIER_ENCRYPTION_KEY
    : process.env[`DOSSIER_ENCRYPTION_KEY_${keyId.toUpperCase()}`]

  if (!envKey) {
    throw new Error(`Encryption key not found for keyId: ${keyId}`)
  }

  // Derive a 32-byte key from the environment variable
  return crypto.pbkdf2Sync(envKey, SALT_LENGTH.toString(), 100000, 32, 'sha256')
}

/**
 * Encrypt sensitive dossier data
 */
export function encryptDossierData(
  data: unknown,
  keyId: string = 'primary'
): { encryptedData: string; keyId: string } {
  try {
    const jsonData = JSON.stringify(data)
    const key = getEncryptionKey(keyId)
    const iv = crypto.randomBytes(IV_LENGTH)

    const cipher = crypto.createCipheriv(ALGORITHM, key, iv)

    let encrypted = cipher.update(jsonData, 'utf8', 'hex')
    encrypted += cipher.final('hex')

    const authTag = cipher.getAuthTag()

    // Combine IV + encrypted data + auth tag
    const combined = iv.toString('hex') + ':' + encrypted + ':' + authTag.toString('hex')

    return {
      encryptedData: combined,
      keyId,
    }
  } catch (error) {
    console.error('[ENCRYPTION] Error encrypting dossier data:', error)
    throw new Error('Failed to encrypt dossier data')
  }
}

/**
 * Decrypt sensitive dossier data
 */
export function decryptDossierData<T = unknown>(
  encryptedData: string,
  keyId: string = 'primary'
): T {
  try {
    const parts = encryptedData.split(':')
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted data format')
    }

    const [ivHex, encrypted, authTagHex] = parts

    const key = getEncryptionKey(keyId)
    const iv = Buffer.from(ivHex, 'hex')
    const authTag = Buffer.from(authTagHex, 'hex')

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
    decipher.setAuthTag(authTag)

    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')

    return JSON.parse(decrypted) as T
  } catch (error) {
    console.error('[ENCRYPTION] Error decrypting dossier data:', error)
    throw new Error('Failed to decrypt dossier data')
  }
}

/**
 * Hash IP address for privacy-preserving logging
 */
export function hashIPAddress(ip: string): string {
  return crypto.createHash('sha256').update(ip).digest('hex')
}

/**
 * Generate a secure random token
 */
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex')
}

/**
 * Type for decrypted dossier payload
 */
export interface DossierPayload {
  // Client Information
  clientAlias?: string
  clientEmail?: string
  clientTimezone?: string
  preferredContact?: string[]

  // Assessment Scores
  phq9Score: number
  phq9Severity: string
  phq9Answers: number[]
  gad7Score: number
  gad7Severity: string
  gad7Answers: number[]

  // Risk Assessment
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  requiresEmergency: boolean
  hasSuicidalIdeation: boolean
  phq9Item9Score: number

  // Red Flags
  redFlags: Array<{
    code: string
    severity: 'HIGH' | 'CRITICAL'
    description: string
  }>

  // Preferences and Context
  supportPreferences: string[]
  availability: string[]
  themes: Array<{
    name: string
    intensity: number // 0-100
    notes?: string
  }>

  // Organizational Details
  availableTimeSlots?: string[]
  preferredLanguages?: string[]
  budgetRange?: {
    min: number
    max: number
    currency: string
  }

  // Metadata
  createdAt: string
  triageSessionId: string
}

/**
 * Build a complete dossier payload from triage data
 */
export function buildDossierPayload(
  triageSession: {
    id: string
    phq9Score: number
    phq9Severity: string
    phq9Answers: number[]
    gad7Score: number
    gad7Severity: string
    gad7Answers: number[]
    riskLevel: string
    requiresEmergency: boolean
    supportPreferences: string[]
    availability: string[]
    meta?: any
    createdAt: Date
  },
  client: {
    id: string
    email: string
    firstName?: string | null
    lastName?: string | null
  }
): DossierPayload {
  // Determine red flags based on scores and answers
  const redFlags: DossierPayload['redFlags'] = []

  const phq9Item9Score = triageSession.meta?.phq9Item9Score || triageSession.phq9Answers[8] || 0
  const hasSuicidalIdeation = triageSession.meta?.hasSuicidalIdeation || phq9Item9Score > 0

  if (hasSuicidalIdeation) {
    redFlags.push({
      code: 'SUICIDAL_IDEATION',
      severity: 'CRITICAL',
      description: 'Patient berichtet von Suizidgedanken (PHQ-9 Item 9)',
    })
  }

  if (triageSession.phq9Score >= 20) {
    redFlags.push({
      code: 'SEVERE_DEPRESSION',
      severity: 'CRITICAL',
      description: `Schwere depressive Symptomatik (PHQ-9: ${triageSession.phq9Score}/27)`,
    })
  } else if (triageSession.phq9Score >= 15) {
    redFlags.push({
      code: 'MODERATELY_SEVERE_DEPRESSION',
      severity: 'HIGH',
      description: `Mittelschwere bis schwere depressive Symptomatik (PHQ-9: ${triageSession.phq9Score}/27)`,
    })
  }

  if (triageSession.gad7Score >= 15) {
    redFlags.push({
      code: 'SEVERE_ANXIETY',
      severity: 'HIGH',
      description: `Schwere Angstsymptomatik (GAD-7: ${triageSession.gad7Score}/21)`,
    })
  }

  // Determine themes based on scores
  const themes: DossierPayload['themes'] = []

  if (triageSession.phq9Score > 0) {
    themes.push({
      name: 'Depression',
      intensity: Math.round((triageSession.phq9Score / 27) * 100),
      notes: `PHQ-9 Schweregrad: ${triageSession.phq9Severity}`,
    })
  }

  if (triageSession.gad7Score > 0) {
    themes.push({
      name: 'Angst',
      intensity: Math.round((triageSession.gad7Score / 21) * 100),
      notes: `GAD-7 Schweregrad: ${triageSession.gad7Severity}`,
    })
  }

  // Build support preference themes
  if (triageSession.supportPreferences.includes('stress')) {
    themes.push({ name: 'Stress & Burnout', intensity: 60 })
  }

  // Determine risk level
  let riskLevel: DossierPayload['riskLevel'] = triageSession.riskLevel as any
  if (hasSuicidalIdeation || triageSession.phq9Score >= 20) {
    riskLevel = 'CRITICAL'
  }

  return {
    clientAlias: client.firstName && client.lastName
      ? `${client.firstName} ${client.lastName}`
      : 'Klient:in',
    clientEmail: client.email,
    clientTimezone: 'Europe/Vienna', // Default, could be from user profile
    preferredContact: ['email'], // Could be from user preferences

    phq9Score: triageSession.phq9Score,
    phq9Severity: triageSession.phq9Severity,
    phq9Answers: triageSession.phq9Answers,
    gad7Score: triageSession.gad7Score,
    gad7Severity: triageSession.gad7Severity,
    gad7Answers: triageSession.gad7Answers,

    riskLevel,
    requiresEmergency: triageSession.requiresEmergency,
    hasSuicidalIdeation,
    phq9Item9Score,

    redFlags,

    supportPreferences: triageSession.supportPreferences,
    availability: triageSession.availability,
    themes,

    createdAt: triageSession.createdAt.toISOString(),
    triageSessionId: triageSession.id,
  }
}
