import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const trackingSchema = z.object({
  profileId: z.string(),
  slug: z.string(),
  sessionId: z.string(),
  source: z.string().optional(),
  userAgent: z.string().optional(),
});

/**
 * POST /api/microsites/track
 * Track microsite pageviews (client-side tracking)
 */
export async function POST(request: NextRequest) {
  try {
    let parsedBody: unknown = {};
    try {
      parsedBody = await request.json();
    } catch {
      // tolerate empty/invalid JSON
      parsedBody = {};
    }

    const { profileId, sessionId, source, userAgent } = trackingSchema.parse(parsedBody);

    // Get client IP (with privacy consideration - hash it?)
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip');

    // Check if this session was already tracked recently (avoid double-counting)
    const recentVisit = await prisma.therapistMicrositeVisit.findFirst({
      where: {
        therapistProfileId: profileId,
        sessionId,
        occurredAt: {
          gte: new Date(Date.now() - 30 * 60 * 1000), // Last 30 minutes
        },
      },
    });

    if (recentVisit) {
      // Already tracked, don't create duplicate
      return NextResponse.json({ success: true, tracked: false }, { status: 200 });
    }

    // Create visit record
    await prisma.therapistMicrositeVisit.create({
      data: {
        therapistProfileId: profileId,
        sessionId,
        source: source || null,
        userAgent: userAgent || null,
        ipAddress: ip || null,
      },
    });

    return NextResponse.json({ success: true, tracked: true }, { status: 201 });
  } catch (error) {
    // Silent fail - analytics errors should not break UX
    console.error('Analytics tracking error:', error);
    return NextResponse.json({ success: false }, { status: 200 });
  }
}
