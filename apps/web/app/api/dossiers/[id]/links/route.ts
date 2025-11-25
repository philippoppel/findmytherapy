/**
 * Dossier Signed Links API
 *
 * POST /api/dossiers/:id/links - Generate new signed URL for accessing dossier
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { captureError } from '@/lib/monitoring';
import { generateSignedDossierURL } from '@/lib/storage';

interface RouteContext {
  params: {
    id: string;
  };
}

const createLinkSchema = z.object({
  therapistUserId: z.string().cuid(),
  expiresInHours: z.number().min(1).max(168).optional().default(72), // Max 1 week
});

/**
 * POST /api/dossiers/:id/links
 *
 * Generate a new signed URL for a therapist to access the dossier
 */
export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 },
      );
    }

    const dossierId = context.params.id;

    // Parse request body
    const body = await request.json();
    const { therapistUserId, expiresInHours } = createLinkSchema.parse(body);

    // Fetch the dossier
    const dossier = await prisma.sessionZeroDossier.findUnique({
      where: { id: dossierId },
      select: {
        id: true,
        clientId: true,
        recommendedTherapists: true,
        expiresAt: true,
      },
    });

    if (!dossier) {
      return NextResponse.json({ success: false, error: 'Dossier not found' }, { status: 404 });
    }

    // Check authorization (admin or client owner)
    const isAdmin = session.user.role === 'ADMIN';
    const isClient = session.user.id === dossier.clientId;

    if (!isAdmin && !isClient) {
      return NextResponse.json({ success: false, error: 'Access denied' }, { status: 403 });
    }

    // Check if dossier has expired
    if (new Date() > dossier.expiresAt) {
      return NextResponse.json(
        {
          success: false,
          error: 'Dossier has expired',
          code: 'DOSSIER_EXPIRED',
        },
        { status: 410 },
      );
    }

    // Verify therapist exists and is verified
    const therapistProfile = await prisma.therapistProfile.findFirst({
      where: {
        userId: therapistUserId,
        status: 'VERIFIED',
      },
      select: {
        id: true,
        displayName: true,
      },
    });

    if (!therapistProfile) {
      return NextResponse.json(
        {
          success: false,
          error: 'Therapist not found or not verified',
        },
        { status: 404 },
      );
    }

    // Check if therapist is in recommended list
    if (!dossier.recommendedTherapists.includes(therapistProfile.id)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Therapist not in recommended list for this dossier',
          code: 'THERAPIST_NOT_RECOMMENDED',
        },
        { status: 403 },
      );
    }

    // Generate signed URL
    const { url, expiresAt } = await generateSignedDossierURL(
      dossierId,
      therapistUserId,
      expiresInHours,
    );

    return NextResponse.json({
      success: true,
      data: {
        url,
        expiresAt: expiresAt.toISOString(),
        therapistId: therapistProfile.id,
        therapistName: therapistProfile.displayName,
      },
    });
  } catch (error) {
    captureError(error, { location: 'api/dossiers/:id/links POST' });

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

    console.error('[DOSSIERS] Error creating signed link:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create signed link',
      },
      { status: 500 },
    );
  }
}
