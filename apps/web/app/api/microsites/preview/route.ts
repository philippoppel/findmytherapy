import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { captureError } from '@/lib/monitoring';

export const dynamic = 'force-dynamic';

/**
 * POST /api/microsites/preview
 * Authenticated endpoint for therapists to preview their microsite
 * (even if not published yet)
 */
export async function POST(_request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== 'THERAPIST') {
      return NextResponse.json(
        { success: false, message: 'Nicht autorisiert' },
        { status: 401 }
      );
    }

    // Fetch therapist profile (including unpublished)
    const profile = await prisma.therapistProfile.findFirst({
      where: {
        userId: session.user.id,
        deletedAt: null,
      },
      select: {
        id: true,
        displayName: true,
        title: true,
        headline: true,
        profileImageUrl: true,
        approachSummary: true,
        experienceSummary: true,
        about: true,
        services: true,
        modalities: true,
        specialties: true,
        languages: true,
        priceMin: true,
        priceMax: true,
        pricingNote: true,
        city: true,
        country: true,
        online: true,
        videoUrl: true,
        acceptingClients: true,
        yearsExperience: true,
        responseTime: true,
        availabilityNote: true,
        micrositeSlug: true,
        micrositeStatus: true,
        micrositeBlocks: true,
        micrositeLastPublishedAt: true,
        updatedAt: true,
        user: {
          select: {
            email: true,
          },
        },
        courses: {
          where: {
            status: 'PUBLISHED',
            deletedAt: null,
          },
          select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            price: true,
            currency: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 5,
        },
      },
    });

    if (!profile) {
      return NextResponse.json(
        { success: false, message: 'Profil nicht gefunden' },
        { status: 404 }
      );
    }

    // Transform and return data (same structure as public API)
    const micrositeData = {
      profile: {
        id: profile.id,
        displayName: profile.displayName,
        title: profile.title,
        headline: profile.headline,
        profileImageUrl: profile.profileImageUrl,
        approachSummary: profile.approachSummary,
        experienceSummary: profile.experienceSummary,
        about: profile.about,
        services: profile.services,
        modalities: profile.modalities,
        specialties: profile.specialties,
        languages: profile.languages,
        priceMin: profile.priceMin,
        priceMax: profile.priceMax,
        pricingNote: profile.pricingNote,
        city: profile.city,
        country: profile.country,
        online: profile.online,
        videoUrl: profile.videoUrl,
        acceptingClients: profile.acceptingClients,
        yearsExperience: profile.yearsExperience,
        rating: 4.8,
        reviewCount: 0,
        responseTime: profile.responseTime,
        availabilityNote: profile.availabilityNote,
        slug: profile.micrositeSlug,
        status: profile.micrositeStatus,
        blocks: profile.micrositeBlocks,
        lastPublishedAt: profile.micrositeLastPublishedAt,
        updatedAt: profile.updatedAt,
      },
      courses: profile.courses,
      contactEmail: profile.user.email,
      isPreview: true,
    };

    return NextResponse.json(
      { success: true, data: micrositeData },
      { status: 200 }
    );
  } catch (error) {
    captureError(error, { location: 'api/microsites/preview:post' });

    return NextResponse.json(
      { success: false, message: 'Vorschau konnte nicht geladen werden' },
      { status: 500 }
    );
  }
}
