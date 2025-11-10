import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect old therapist profile URLs to new microsite URLs
  // /therapists/[profileId] -> /t/[slug]
  if (pathname.startsWith('/therapists/')) {
    const profileId = pathname.split('/')[2];

    if (profileId) {
      try {
        // Look up profile by ID to get the microsite slug
        const profile = await prisma.therapistProfile.findUnique({
          where: { id: profileId },
          select: { micrositeSlug: true, micrositeStatus: true },
        });

        if (profile?.micrositeSlug && profile.micrositeStatus === 'PUBLISHED') {
          // Redirect to microsite
          const url = request.nextUrl.clone();
          url.pathname = `/t/${profile.micrositeSlug}`;
          return NextResponse.redirect(url, 301); // Permanent redirect
        }
      } catch (error) {
        console.error('Middleware redirect error:', error);
        // Continue to original URL if lookup fails
      }
    }
  }

  return NextResponse.next();
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    '/therapists/:path*',
  ],
};
