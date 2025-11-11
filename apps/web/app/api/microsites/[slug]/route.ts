import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { captureError } from '@/lib/monitoring';

/**
 * GET /api/microsites/[slug]
 * Public API endpoint to fetch microsite data for ISR
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    if (!slug) {
      return NextResponse.json(
        { success: false, message: 'Slug ist erforderlich' },
        { status: 400 }
      );
    }

    // Check for redirects first
    const redirect = await prisma.therapistMicrositeRedirect.findUnique({
      where: { fromSlug: slug },
    });

    if (redirect) {
      return NextResponse.json(
        {
          success: false,
          redirect: redirect.toSlug,
          message: 'Diese URL wurde verschoben',
        },
        { status: 301 }
      );
    }

    // Fetch therapist profile with microsite data
    const profile = await prisma.therapistProfile.findFirst({
      where: {
        micrositeSlug: slug,
        micrositeStatus: 'PUBLISHED',
        status: 'VERIFIED',
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
        { success: false, message: 'Microsite nicht gefunden' },
        { status: 404 }
      );
    }

    // Transform and return data
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
    };

    return NextResponse.json(
      { success: true, data: micrositeData },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (error) {
    captureError(error, { location: 'api/microsites/[slug]:get' });

    return NextResponse.json(
      { success: false, message: 'Microsite konnte nicht geladen werden' },
      { status: 500 }
    );
  }
}
