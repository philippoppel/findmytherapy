/**
 * Storage abstraction for dossier files
 *
 * Provides a unified interface for storing and retrieving dossier PDFs
 * Supports local filesystem (dev) and S3/cloud storage (production)
 */

import { SignJWT, jwtVerify } from 'jose'
import fs from 'fs/promises'
import path from 'path'

const STORAGE_TYPE = process.env.STORAGE_TYPE || 'local' // 'local' | 's3'
const LOCAL_STORAGE_PATH = process.env.LOCAL_STORAGE_PATH || '/tmp/dossiers'

/**
 * Initialize storage (create directories if needed)
 */
export async function initializeStorage(): Promise<void> {
  if (STORAGE_TYPE === 'local') {
    try {
      await fs.mkdir(LOCAL_STORAGE_PATH, { recursive: true })
    } catch (error) {
      console.error('[STORAGE] Failed to initialize local storage:', error)
      throw error
    }
  }
  // For S3, initialization would verify credentials and bucket access
}

/**
 * Store a dossier PDF
 */
export async function storeDossierPDF(
  dossierId: string,
  pdfBuffer: Buffer
): Promise<string> {
  if (STORAGE_TYPE === 'local') {
    const filename = `${dossierId}.pdf`
    const filepath = path.join(LOCAL_STORAGE_PATH, filename)

    await fs.writeFile(filepath, pdfBuffer)

    // Return a path that can be used to generate a signed URL
    return `/storage/dossiers/${filename}`
  }

  // For S3, upload to bucket and return S3 URL
  throw new Error('S3 storage not yet implemented')
}

/**
 * Retrieve a dossier PDF
 */
export async function retrieveDossierPDF(
  dossierId: string
): Promise<Buffer | null> {
  if (STORAGE_TYPE === 'local') {
    const filename = `${dossierId}.pdf`
    const filepath = path.join(LOCAL_STORAGE_PATH, filename)

    try {
      return await fs.readFile(filepath)
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        return null
      }
      throw error
    }
  }

  // For S3, download from bucket
  throw new Error('S3 storage not yet implemented')
}

/**
 * Delete a dossier PDF
 */
export async function deleteDossierPDF(dossierId: string): Promise<void> {
  if (STORAGE_TYPE === 'local') {
    const filename = `${dossierId}.pdf`
    const filepath = path.join(LOCAL_STORAGE_PATH, filename)

    try {
      await fs.unlink(filepath)
    } catch (error: any) {
      if (error.code !== 'ENOENT') {
        throw error
      }
    }
  }

  // For S3, delete from bucket
  throw new Error('S3 storage not yet implemented')
}

/**
 * Generate a signed URL for accessing a dossier
 *
 * The URL contains a JWT token that expires after a configurable time
 */
export async function generateSignedDossierURL(
  dossierId: string,
  therapistUserId: string,
  expiresInHours: number = 72
): Promise<{ url: string; expiresAt: Date }> {
  const secret = new TextEncoder().encode(
    process.env.NEXTAUTH_SECRET || 'fallback-secret-for-dev'
  )

  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + expiresInHours)

  const token = await new SignJWT({
    dossierId,
    therapistUserId,
    type: 'dossier_access',
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresAt.getTime() / 1000)
    .sign(secret)

  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  const url = `${baseUrl}/api/dossiers/${dossierId}/download?token=${token}`

  return { url, expiresAt }
}

/**
 * Verify a signed dossier URL token
 */
export async function verifySignedDossierToken(
  token: string
): Promise<{ dossierId: string; therapistUserId: string } | null> {
  try {
    const secret = new TextEncoder().encode(
      process.env.NEXTAUTH_SECRET || 'fallback-secret-for-dev'
    )

    const { payload } = await jwtVerify(token, secret)

    if (payload.type !== 'dossier_access') {
      return null
    }

    return {
      dossierId: payload.dossierId as string,
      therapistUserId: payload.therapistUserId as string,
    }
  } catch (error) {
    console.error('[STORAGE] Failed to verify token:', error)
    return null
  }
}

/**
 * Get storage stats (for monitoring)
 */
export async function getStorageStats(): Promise<{
  type: string
  filesCount?: number
  totalSize?: number
}> {
  if (STORAGE_TYPE === 'local') {
    try {
      const files = await fs.readdir(LOCAL_STORAGE_PATH)
      let totalSize = 0

      for (const file of files) {
        const filepath = path.join(LOCAL_STORAGE_PATH, file)
        const stats = await fs.stat(filepath)
        totalSize += stats.size
      }

      return {
        type: 'local',
        filesCount: files.length,
        totalSize,
      }
    } catch (error) {
      console.error('[STORAGE] Failed to get storage stats:', error)
      return { type: 'local', filesCount: 0, totalSize: 0 }
    }
  }

  return { type: STORAGE_TYPE }
}
