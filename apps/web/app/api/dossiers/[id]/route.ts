/**
 * Individual Dossier API Routes
 *
 * GET /api/dossiers/:id - Get decrypted dossier data
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { captureError } from '@/lib/monitoring'
import { decryptDossierData, type DossierPayload, hashIPAddress } from '@/lib/encryption'

interface RouteContext {
  params: {
    id: string
  }
}

/**
 * GET /api/dossiers/:id
 *
 * Get decrypted dossier data (with access logging)
 */
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    const dossierId = context.params.id

    // Fetch the dossier
    const dossier = await prisma.sessionZeroDossier.findUnique({
      where: { id: dossierId },
      include: {
        client: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        triageSession: {
          select: {
            id: true,
            createdAt: true,
          },
        },
      },
    })

    if (!dossier) {
      return NextResponse.json(
        { success: false, error: 'Dossier not found' },
        { status: 404 }
      )
    }

    // Check if dossier has expired
    if (new Date() > dossier.expiresAt) {
      // Log expired access attempt
      await logDossierAccess(
        request,
        dossierId,
        session.user.id,
        'EXPIRED',
        'Dossier has expired'
      )

      return NextResponse.json(
        {
          success: false,
          error: 'Dossier has expired',
          code: 'DOSSIER_EXPIRED',
          expiresAt: dossier.expiresAt.toISOString(),
        },
        { status: 410 }
      )
    }

    // Check authorization
    const isAdmin = session.user.role === 'ADMIN'
    const isClient = session.user.id === dossier.clientId
    let isRecommendedTherapist = false

    if (session.user.role === 'THERAPIST') {
      const therapistProfile = await prisma.therapistProfile.findUnique({
        where: { userId: session.user.id },
        select: { id: true, status: true },
      })

      if (therapistProfile && therapistProfile.status === 'VERIFIED') {
        isRecommendedTherapist = dossier.recommendedTherapists.includes(
          therapistProfile.id
        )
      }
    }

    if (!isAdmin && !isClient && !isRecommendedTherapist) {
      // Log denied access attempt
      await logDossierAccess(
        request,
        dossierId,
        session.user.id,
        'DENIED',
        'User not authorized to access this dossier'
      )

      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      )
    }

    // Decrypt the payload
    let payload: DossierPayload
    try {
      payload = decryptDossierData<DossierPayload>(
        dossier.encryptedPayload,
        dossier.encryptionKeyId
      )
    } catch (error) {
      console.error('[DOSSIERS] Decryption failed:', error)
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to decrypt dossier data',
        },
        { status: 500 }
      )
    }

    // Log successful access
    await logDossierAccess(
      request,
      dossierId,
      session.user.id,
      'SUCCESS',
      null
    )

    // Return dossier data
    return NextResponse.json({
      success: true,
      data: {
        id: dossier.id,
        triageSessionId: dossier.triageSessionId,
        clientId: dossier.clientId,
        riskLevel: dossier.riskLevel,
        redFlags: dossier.redFlags,
        version: dossier.version,
        expiresAt: dossier.expiresAt.toISOString(),
        createdAt: dossier.createdAt.toISOString(),
        payload,
        metadata: {
          client: {
            id: dossier.client.id,
            name: isAdmin || isClient
              ? `${dossier.client.firstName || ''} ${dossier.client.lastName || ''}`.trim()
              : payload.clientAlias,
            email: isAdmin || isClient ? dossier.client.email : undefined,
          },
        },
      },
    })
  } catch (error) {
    captureError(error, { location: 'api/dossiers/:id GET' })
    console.error('[DOSSIERS] Error retrieving dossier:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve dossier',
      },
      { status: 500 }
    )
  }
}

/**
 * Helper function to log dossier access
 */
async function logDossierAccess(
  request: NextRequest,
  dossierId: string,
  userId: string,
  status: 'SUCCESS' | 'DENIED' | 'EXPIRED',
  reason: string | null
): Promise<void> {
  try {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const userAgent = request.headers.get('user-agent') || undefined

    await prisma.dossierAccessLog.create({
      data: {
        dossierId,
        therapistUserId: userId,
        channel: 'WEB_DASHBOARD',
        ipHash: hashIPAddress(ip),
        userAgent,
        status,
        reason,
      },
    })
  } catch (error) {
    console.error('[DOSSIERS] Failed to log access:', error)
    // Don't throw - logging failure shouldn't break the request
  }
}
