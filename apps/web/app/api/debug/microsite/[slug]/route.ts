import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/debug/microsite/[slug]
 * Debug endpoint to check microsite visibility issues
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    // Find all profiles with this slug (no filters)
    const allProfiles = await prisma.therapistProfile.findMany({
      where: {
        micrositeSlug: slug,
      },
      select: {
        id: true,
        displayName: true,
        micrositeSlug: true,
        micrositeStatus: true,
        status: true,
        deletedAt: true,
        headline: true,
        specialties: true,
        user: {
          select: {
            email: true,
            role: true,
          },
        },
      },
    });

    if (allProfiles.length === 0) {
      return NextResponse.json({
        found: false,
        message: `No profile found with slug "${slug}"`,
        filters: {},
      });
    }

    const profile = allProfiles[0];

    // Check each filter individually
    const filters = {
      hasSlug: !!profile.micrositeSlug,
      isPublished: profile.micrositeStatus === 'PUBLISHED',
      isVerified: profile.status === 'VERIFIED',
      notDeleted: profile.deletedAt === null,
      hasHeadline: !!profile.headline,
      hasSpecialties: (profile.specialties?.length || 0) >= 3,
    };

    // Check if it matches the page query
    const matchesPageQuery = await prisma.therapistProfile.findFirst({
      where: {
        micrositeSlug: slug,
        micrositeStatus: 'PUBLISHED',
        status: 'VERIFIED',
        deletedAt: null,
      },
    });

    return NextResponse.json({
      found: true,
      profile: {
        id: profile.id,
        displayName: profile.displayName,
        slug: profile.micrositeSlug,
        micrositeStatus: profile.micrositeStatus,
        accountStatus: profile.status,
        deletedAt: profile.deletedAt,
        headline: profile.headline,
        specialtyCount: profile.specialties?.length || 0,
        userEmail: profile.user.email,
        userRole: profile.user.role,
      },
      filters,
      matchesPageQuery: !!matchesPageQuery,
      allFiltersPassed: Object.values(filters).every((f) => f === true),
      failedFilters: Object.entries(filters)
        .filter(([_, passed]) => !passed)
        .map(([name]) => name),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Debug check failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
