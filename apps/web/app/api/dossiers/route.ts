/**
 * Dossier API Routes
 *
 * POST /api/dossiers - Create a new encrypted dossier
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { captureError } from '@/lib/monitoring';
import { encryptDossierData, buildDossierPayload } from '@/lib/encryption';
import { generateSignedDossierURL } from '@/lib/storage';

const createDossierSchema = z.object({
  triageSessionId: z.string().cuid(),
  trigger: z.enum(['ADMIN', 'WORKER', 'AUTO']).optional().default('AUTO'),
  recommendedTherapistIds: z.array(z.string()).optional().default([]),
});

/**
 * POST /api/dossiers
 *
 * Create a new encrypted session-zero dossier
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    // Require authentication
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 },
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const { triageSessionId, trigger, recommendedTherapistIds } = createDossierSchema.parse(body);

    // Fetch the triage session with client data
    const triageSession = await prisma.triageSession.findUnique({
      where: { id: triageSessionId },
      include: {
        client: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!triageSession) {
      return NextResponse.json(
        { success: false, error: 'Triage session not found' },
        { status: 404 },
      );
    }

    // Check if user has permission (admin or own data)
    const isAdmin = session.user.role === 'ADMIN';
    const isOwnData = session.user.id === triageSession.clientId;

    if (!isAdmin && !isOwnData) {
      return NextResponse.json({ success: false, error: 'Permission denied' }, { status: 403 });
    }

    // Check for consent
    const consent = await prisma.clientConsent.findFirst({
      where: {
        clientId: triageSession.clientId,
        scope: 'DOSSIER_SHARING',
        status: 'GRANTED',
      },
    });

    if (!consent) {
      return NextResponse.json(
        {
          success: false,
          error: 'Client consent required for dossier sharing',
          code: 'CONSENT_REQUIRED',
        },
        { status: 403 },
      );
    }

    const existingDossier = await prisma.sessionZeroDossier.findUnique({
      where: { triageSessionId },
      select: { id: true, version: true },
    });

    // Check if dossier already exists
    if (existingDossier) {
      return NextResponse.json(
        {
          success: false,
          error: 'Dossier already exists for this triage session',
          code: 'DOSSIER_EXISTS',
          existingDossierId: existingDossier.id,
          version: existingDossier.version,
        },
        { status: 409 },
      );
    }

    // Build dossier payload
    const payload = buildDossierPayload(triageSession, triageSession.client);

    // Encrypt the payload
    const { encryptedData, keyId } = encryptDossierData(payload);

    // Determine risk level
    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = triageSession.riskLevel as
      | 'LOW'
      | 'MEDIUM'
      | 'HIGH';
    if (payload.hasSuicidalIdeation || triageSession.phq9Score >= 20) {
      riskLevel = 'CRITICAL';
    }

    // Set expiration (72 hours by default)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 72);

    // Create the dossier
    const dossier = await prisma.sessionZeroDossier.create({
      data: {
        triageSessionId: triageSession.id,
        clientId: triageSession.clientId,
        encryptedPayload: encryptedData,
        encryptionKeyId: keyId,
        riskLevel,
        redFlags: payload.redFlags,
        generatedBy: trigger,
        version: 1,
        expiresAt,
        recommendedTherapists: recommendedTherapistIds,
      },
    });

    // Generate signed URLs for recommended therapists
    const signedUrls: Record<string, { url: string; expiresAt: Date }> = {};

    for (const therapistId of recommendedTherapistIds) {
      const { url, expiresAt: urlExpiresAt } = await generateSignedDossierURL(
        dossier.id,
        therapistId,
        72,
      );
      signedUrls[therapistId] = { url, expiresAt: urlExpiresAt };
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          dossierId: dossier.id,
          triageSessionId: dossier.triageSessionId,
          riskLevel: dossier.riskLevel,
          version: dossier.version,
          expiresAt: dossier.expiresAt.toISOString(),
          signedUrls,
          redFlagsCount: payload.redFlags.length,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    captureError(error, { location: 'api/dossiers POST' });

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          details: error.errors,
        },
        { status: 400 },
      );
    }

    console.error('[DOSSIERS] Error creating dossier:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create dossier',
      },
      { status: 500 },
    );
  }
}

/**
 * GET /api/dossiers
 *
 * List dossiers (admin only or therapist's assigned dossiers)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const therapistId = searchParams.get('therapistId');
    const clientId = searchParams.get('clientId');

    // Admin can see all, therapists can see their own, clients can see their own
    const where: {
      recommendedTherapists?: { has: string };
      clientId?: string;
    } = {};

    if (session.user.role === 'ADMIN') {
      // Admin can filter by therapist or client
      if (therapistId) {
        where.recommendedTherapists = { has: therapistId };
      }
      if (clientId) {
        where.clientId = clientId;
      }
    } else if (session.user.role === 'THERAPIST') {
      // Therapists can only see dossiers they're recommended for
      const therapistProfile = await prisma.therapistProfile.findUnique({
        where: { userId: session.user.id },
        select: { id: true },
      });

      if (!therapistProfile) {
        return NextResponse.json(
          { success: false, error: 'Therapist profile not found' },
          { status: 404 },
        );
      }

      where.recommendedTherapists = { has: therapistProfile.id };
    } else {
      // Clients can only see their own dossiers
      where.clientId = session.user.id;
    }

    const dossiers = await prisma.sessionZeroDossier.findMany({
      where,
      select: {
        id: true,
        triageSessionId: true,
        clientId: true,
        riskLevel: true,
        redFlags: true,
        version: true,
        expiresAt: true,
        createdAt: true,
        generatedBy: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({
      success: true,
      data: dossiers,
    });
  } catch (error) {
    captureError(error, { location: 'api/dossiers GET' });
    console.error('[DOSSIERS] Error listing dossiers:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to list dossiers',
      },
      { status: 500 },
    );
  }
}
