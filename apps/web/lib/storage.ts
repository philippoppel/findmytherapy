/**
 * Storage abstraction for files (dossiers, blog images, etc.)
 *
 * Provides a unified interface for storing and retrieving files
 * Supports local filesystem (dev) and S3/cloud storage (production)
 */

import { SignJWT, jwtVerify } from 'jose';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

const STORAGE_TYPE = process.env.STORAGE_TYPE || 'local'; // 'local' | 's3'
const LOCAL_STORAGE_PATH = process.env.LOCAL_STORAGE_PATH || '/tmp/dossiers';
const BLOG_IMAGES_PATH = process.env.BLOG_IMAGES_PATH || '/tmp/blog-images';

/**
 * Initialize storage (create directories if needed)
 */
export async function initializeStorage(): Promise<void> {
  if (STORAGE_TYPE === 'local') {
    try {
      await fs.mkdir(LOCAL_STORAGE_PATH, { recursive: true });
    } catch (error) {
      console.error('[STORAGE] Failed to initialize local storage:', error);
      throw error;
    }
  }
  // For S3, initialization would verify credentials and bucket access
}

/**
 * Store a dossier PDF
 */
export async function storeDossierPDF(dossierId: string, pdfBuffer: Buffer): Promise<string> {
  if (STORAGE_TYPE === 'local') {
    const filename = `${dossierId}.pdf`;
    const filepath = path.join(LOCAL_STORAGE_PATH, filename);

    await fs.writeFile(filepath, pdfBuffer);

    // Return a path that can be used to generate a signed URL
    return `/storage/dossiers/${filename}`;
  }

  // For S3, upload to bucket and return S3 URL
  throw new Error('S3 storage not yet implemented');
}

/**
 * Retrieve a dossier PDF
 */
export async function retrieveDossierPDF(dossierId: string): Promise<Buffer | null> {
  if (STORAGE_TYPE === 'local') {
    const filename = `${dossierId}.pdf`;
    const filepath = path.join(LOCAL_STORAGE_PATH, filename);

    try {
      return await fs.readFile(filepath);
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
        return null;
      }
      throw error;
    }
  }

  // For S3, download from bucket
  throw new Error('S3 storage not yet implemented');
}

/**
 * Delete a dossier PDF
 */
export async function deleteDossierPDF(dossierId: string): Promise<void> {
  if (STORAGE_TYPE === 'local') {
    const filename = `${dossierId}.pdf`;
    const filepath = path.join(LOCAL_STORAGE_PATH, filename);

    try {
      await fs.unlink(filepath);
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code !== 'ENOENT') {
        throw error;
      }
    }
  }

  // For S3, delete from bucket
  throw new Error('S3 storage not yet implemented');
}

/**
 * Generate a signed URL for accessing a dossier
 *
 * The URL contains a JWT token that expires after a configurable time
 */
export async function generateSignedDossierURL(
  dossierId: string,
  therapistUserId: string,
  expiresInHours: number = 72,
): Promise<{ url: string; expiresAt: Date }> {
  const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'fallback-secret-for-dev');

  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + expiresInHours);

  const token = await new SignJWT({
    dossierId,
    therapistUserId,
    type: 'dossier_access',
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresAt.getTime() / 1000)
    .sign(secret);

  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const url = `${baseUrl}/api/dossiers/${dossierId}/download?token=${token}`;

  return { url, expiresAt };
}

/**
 * Verify a signed dossier URL token
 */
export async function verifySignedDossierToken(
  token: string,
): Promise<{ dossierId: string; therapistUserId: string } | null> {
  try {
    const secret = new TextEncoder().encode(
      process.env.NEXTAUTH_SECRET || 'fallback-secret-for-dev',
    );

    const { payload } = await jwtVerify(token, secret);

    if (payload.type !== 'dossier_access') {
      return null;
    }

    return {
      dossierId: payload.dossierId as string,
      therapistUserId: payload.therapistUserId as string,
    };
  } catch (error) {
    console.error('[STORAGE] Failed to verify token:', error);
    return null;
  }
}

/**
 * Get storage stats (for monitoring)
 */
export async function getStorageStats(): Promise<{
  type: string;
  filesCount?: number;
  totalSize?: number;
}> {
  if (STORAGE_TYPE === 'local') {
    try {
      const files = await fs.readdir(LOCAL_STORAGE_PATH);
      let totalSize = 0;

      for (const file of files) {
        const filepath = path.join(LOCAL_STORAGE_PATH, file);
        const stats = await fs.stat(filepath);
        totalSize += stats.size;
      }

      return {
        type: 'local',
        filesCount: files.length,
        totalSize,
      };
    } catch (error) {
      console.error('[STORAGE] Failed to get storage stats:', error);
      return { type: 'local', filesCount: 0, totalSize: 0 };
    }
  }

  return { type: STORAGE_TYPE };
}

// ==================== BLOG IMAGE STORAGE ====================

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export interface BlogImageUploadResult {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

/**
 * Initialize blog images storage
 */
export async function initializeBlogImagesStorage(): Promise<void> {
  if (STORAGE_TYPE === 'local') {
    try {
      await fs.mkdir(BLOG_IMAGES_PATH, { recursive: true });
    } catch (error) {
      console.error('[STORAGE] Failed to initialize blog images storage:', error);
      throw error;
    }
  }
}

/**
 * Validate image file
 */
export function validateImageFile(
  buffer: Buffer,
  mimeType: string,
): { valid: boolean; error?: string } {
  if (!ALLOWED_IMAGE_TYPES.includes(mimeType)) {
    return {
      valid: false,
      error: `Ungültiger Bildtyp. Erlaubt: ${ALLOWED_IMAGE_TYPES.join(', ')}`,
    };
  }

  if (buffer.length > MAX_IMAGE_SIZE) {
    return {
      valid: false,
      error: `Bild zu groß. Maximum: ${MAX_IMAGE_SIZE / 1024 / 1024}MB`,
    };
  }

  return { valid: true };
}

/**
 * Generate a unique filename for the image
 */
function generateImageFilename(originalName: string, mimeType: string): string {
  const ext = mimeType.split('/')[1] || 'jpg';
  const timestamp = Date.now();
  const randomPart = crypto.randomBytes(8).toString('hex');
  const sanitizedName = originalName
    .replace(/\.[^/.]+$/, '') // Remove extension
    .replace(/[^a-zA-Z0-9-_]/g, '-') // Replace special chars
    .substring(0, 50); // Limit length

  return `${timestamp}-${sanitizedName}-${randomPart}.${ext}`;
}

/**
 * Store a blog image
 */
export async function storeBlogImage(
  buffer: Buffer,
  originalName: string,
  mimeType: string,
  therapistId: string,
): Promise<BlogImageUploadResult> {
  // Validate
  const validation = validateImageFile(buffer, mimeType);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const filename = generateImageFilename(originalName, mimeType);

  if (STORAGE_TYPE === 'local') {
    // Create therapist-specific folder
    const therapistFolder = path.join(BLOG_IMAGES_PATH, therapistId);
    await fs.mkdir(therapistFolder, { recursive: true });

    const filepath = path.join(therapistFolder, filename);
    await fs.writeFile(filepath, buffer);

    return {
      url: `/api/blog/images/${therapistId}/${filename}`,
      filename,
      size: buffer.length,
      mimeType,
    };
  }

  // For S3/cloud storage in production
  throw new Error('Cloud storage not yet implemented');
}

/**
 * Retrieve a blog image
 */
export async function retrieveBlogImage(
  therapistId: string,
  filename: string,
): Promise<{ buffer: Buffer; mimeType: string } | null> {
  if (STORAGE_TYPE === 'local') {
    const filepath = path.join(BLOG_IMAGES_PATH, therapistId, filename);

    try {
      const buffer = await fs.readFile(filepath);
      const ext = path.extname(filename).toLowerCase().slice(1);
      const mimeType = ext === 'jpg' ? 'image/jpeg' : `image/${ext}`;

      return { buffer, mimeType };
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
        return null;
      }
      throw error;
    }
  }

  throw new Error('Cloud storage not yet implemented');
}

/**
 * Delete a blog image
 */
export async function deleteBlogImage(
  therapistId: string,
  filename: string,
): Promise<void> {
  if (STORAGE_TYPE === 'local') {
    const filepath = path.join(BLOG_IMAGES_PATH, therapistId, filename);

    try {
      await fs.unlink(filepath);
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code !== 'ENOENT') {
        throw error;
      }
    }
    return;
  }

  throw new Error('Cloud storage not yet implemented');
}
