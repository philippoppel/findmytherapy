import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const revalidate = 300; // Cache for 5 minutes

export async function GET() {
  try {
    const profiles = await prisma.therapistProfile.findMany({
      where: {
        isPublic: true,
        status: { in: ['VERIFIED', 'PENDING'] },
      },
      select: {
        id: true,
        displayName: true,
        specialties: true,
        city: true,
        profileImageUrl: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: [{ status: 'asc' }, { updatedAt: 'desc' }],
    });

    const searchIndex = profiles.map((profile) => {
      const displayName =
        profile.displayName ??
        (`${profile.user.firstName ?? ''} ${profile.user.lastName ?? ''}`.trim() ||
          'Therapeut:in');

      const nameParts = displayName.split(' ');
      const initials =
        nameParts.length >= 2
          ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
          : displayName.substring(0, 2).toUpperCase() || '??';

      // Filter out placeholder images
      const image = profile.profileImageUrl?.trim();
      const hasValidImage =
        image &&
        !image.endsWith('default.jpg') &&
        !image.includes('placeholder') &&
        !image.includes('unsplash');

      return {
        id: profile.id,
        name: displayName,
        focus: (profile.specialties ?? []).slice(0, 3),
        city: profile.city,
        image: hasValidImage ? image : null,
        initials,
      };
    });

    return NextResponse.json(searchIndex, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Error fetching search index:', error);
    return NextResponse.json([], { status: 500 });
  }
}
