import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { captureError } from '@/lib/monitoring';
import {
  validateSlug,
  isSlugAvailable,
  updateTherapistSlug,
  generateUniqueSlug,
} from '@mental-health/db';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

const slugUpdateSchema = z.object({
  slug: z.string().min(3).max(60),
});

const slugCheckSchema = z.object({
  slug: z.string().min(3).max(60),
});

/**
 * GET /api/therapist/microsite/slug
 * Get current therapist's slug
 */
export async function GET() {
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
        micrositeSlug: true,
        micrositeStatus: true,
      },
    });

    if (!profile) {
      return NextResponse.json(
        { success: false, message: 'Profil nicht gefunden' },
        { status: 404 },
      );
    }

    // If no slug exists, generate one
    if (!profile.micrositeSlug) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { firstName: true, lastName: true },
      });

      const slug = await generateUniqueSlug(prisma, user?.firstName, user?.lastName, profile.id);

      await prisma.therapistProfile.update({
        where: { id: profile.id },
        data: { micrositeSlug: slug },
      });

      return NextResponse.json({
        success: true,
        slug,
        status: profile.micrositeStatus,
      });
    }

    return NextResponse.json({
      success: true,
      slug: profile.micrositeSlug,
      status: profile.micrositeStatus,
    });
  } catch (error) {
    captureError(error, { location: 'api/therapist/microsite/slug:get' });

    return NextResponse.json(
      { success: false, message: 'Slug konnte nicht geladen werden' },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/therapist/microsite/slug
 * Update therapist's slug (creates redirect from old slug)
 */
export async function PATCH(request: NextRequest) {
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
        micrositeSlug: true,
      },
    });

    if (!profile) {
      return NextResponse.json(
        { success: false, message: 'Profil nicht gefunden' },
        { status: 404 },
      );
    }

    const body = await request.json();
    const { slug: newSlug } = slugUpdateSchema.parse(body);

    // Validate slug format
    const validation = validateSlug(newSlug);
    if (!validation.valid) {
      return NextResponse.json({ success: false, message: validation.error }, { status: 400 });
    }

    // Check if slug is the same (no-op)
    if (profile.micrositeSlug === newSlug) {
      return NextResponse.json({
        success: true,
        slug: newSlug,
        message: 'Slug ist bereits aktuell',
      });
    }

    // Update slug (handles redirect creation)
    const result = await updateTherapistSlug(prisma, profile.id, newSlug);

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.error }, { status: 400 });
    }

    // Revalidate microsite pages
    if (profile.micrositeSlug) {
      revalidatePath(`/t/${profile.micrositeSlug}`);
    }
    revalidatePath(`/t/${newSlug}`);

    return NextResponse.json({
      success: true,
      slug: newSlug,
      message: 'Slug erfolgreich aktualisiert',
    });
  } catch (error) {
    captureError(error, { location: 'api/therapist/microsite/slug:patch' });

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validierungsfehler',
          errors: error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { success: false, message: 'Slug konnte nicht aktualisiert werden' },
      { status: 500 },
    );
  }
}

/**
 * POST /api/therapist/microsite/slug/check
 * Check if a slug is available (for real-time validation)
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
      },
    });

    if (!profile) {
      return NextResponse.json(
        { success: false, message: 'Profil nicht gefunden' },
        { status: 404 },
      );
    }

    const body = await request.json();
    const { slug } = slugCheckSchema.parse(body);

    // Validate format
    const validation = validateSlug(slug);
    if (!validation.valid) {
      return NextResponse.json({
        success: true,
        available: false,
        message: validation.error,
      });
    }

    // Check availability
    const available = await isSlugAvailable(prisma, slug, profile.id);

    return NextResponse.json({
      success: true,
      available,
      message: available ? 'Slug ist verfügbar' : 'Slug ist bereits vergeben',
    });
  } catch (error) {
    captureError(error, { location: 'api/therapist/microsite/slug/check:post' });

    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, message: 'Ungültiger Slug' }, { status: 400 });
    }

    return NextResponse.json(
      { success: false, message: 'Verfügbarkeit konnte nicht geprüft werden' },
      { status: 500 },
    );
  }
}
