import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { captureError } from '@/lib/monitoring';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

const publishSchema = z.object({
  action: z.enum(['publish', 'unpublish']),
});

/**
 * POST /api/therapist/microsite/publish
 * Publish or unpublish a therapist's microsite
 * Auto-publish for VERIFIED therapists (as per requirements)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== 'THERAPIST') {
      return NextResponse.json({ success: false, message: 'Nicht autorisiert' }, { status: 401 });
    }

    const profile = await prisma.therapistProfile.findFirst({
      where: {
        userId: session.user.id,
        deletedAt: null,
      },
      select: {
        id: true,
        status: true,
        micrositeSlug: true,
        micrositeStatus: true,
        displayName: true,
        headline: true,
        specialties: true,
      },
    });

    if (!profile) {
      return NextResponse.json(
        { success: false, message: 'Profil nicht gefunden' },
        { status: 404 },
      );
    }

    const body = await request.json();
    const { action } = publishSchema.parse(body);

    // Check if therapist is verified (required for publishing)
    if (action === 'publish' && profile.status !== 'VERIFIED') {
      return NextResponse.json(
        {
          success: false,
          message: 'Nur verifizierte Therapeuten können ihre Microsite veröffentlichen',
        },
        { status: 403 },
      );
    }

    // Validate minimum requirements for publishing
    if (action === 'publish') {
      const errors: string[] = [];

      if (!profile.micrositeSlug) {
        errors.push('Slug fehlt');
      }
      if (!profile.displayName) {
        errors.push('Anzeigename fehlt');
      }
      if (!profile.headline) {
        errors.push('Überschrift fehlt');
      }
      if (!profile.specialties || profile.specialties.length < 3) {
        errors.push('Mindestens 3 Spezialisierungen erforderlich');
      }

      if (errors.length > 0) {
        return NextResponse.json(
          {
            success: false,
            message: 'Profil erfüllt nicht die Mindestanforderungen',
            errors,
          },
          { status: 400 },
        );
      }
    }

    // Update microsite status
    const newStatus = action === 'publish' ? 'PUBLISHED' : 'DRAFT';
    const updatedProfile = await prisma.therapistProfile.update({
      where: { id: profile.id },
      data: {
        micrositeStatus: newStatus,
        micrositeLastPublishedAt:
          action === 'publish'
            ? new Date()
            : profile.micrositeStatus === 'PUBLISHED'
              ? undefined
              : null,
      },
      select: {
        micrositeSlug: true,
        micrositeStatus: true,
        micrositeLastPublishedAt: true,
      },
    });

    // Revalidate microsite page
    if (updatedProfile.micrositeSlug) {
      revalidatePath(`/t/${updatedProfile.micrositeSlug}`);
    }

    const message =
      action === 'publish'
        ? 'Microsite erfolgreich veröffentlicht'
        : 'Microsite erfolgreich zurückgezogen';

    return NextResponse.json({
      success: true,
      message,
      slug: updatedProfile.micrositeSlug,
      status: updatedProfile.micrositeStatus,
      publishedAt: updatedProfile.micrositeLastPublishedAt,
    });
  } catch (error) {
    captureError(error, { location: 'api/therapist/microsite/publish:post' });

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Ungültige Aktion',
          errors: error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { success: false, message: 'Status konnte nicht geändert werden' },
      { status: 500 },
    );
  }
}
