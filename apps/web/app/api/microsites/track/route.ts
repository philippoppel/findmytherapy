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
 * Optimiert: 1 Query statt 3 durch upsert-ähnliche Logik
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

    // Optimiert: Eine einzige Transaction statt 3 separate Queries
    // createMany mit skipDuplicates würde nicht für das 30-Min-Fenster funktionieren,
    // daher nutzen wir eine Transaction mit conditional insert
    const result = await prisma.$transaction(async (tx) => {
      // Check für recent visit UND profile existence in einem Schritt
      const recentVisit = await tx.therapistMicrositeVisit.findFirst({
        where: {
          therapistProfileId: profileId,
          sessionId,
          occurredAt: {
            gte: new Date(Date.now() - 30 * 60 * 1000), // Last 30 minutes
          },
        },
        select: { id: true },
      });

      if (recentVisit) {
        return { tracked: false };
      }

      // Versuche direkt zu erstellen - wenn Profile nicht existiert, wirft FK-Error
      try {
        await tx.therapistMicrositeVisit.create({
          data: {
            therapistProfileId: profileId,
            sessionId,
            source: source || null,
            userAgent: userAgent || null,
            ipAddress: ip || null,
          },
        });
        return { tracked: true };
      } catch {
        // FK violation = Profile existiert nicht
        return { tracked: false };
      }
    });

    return NextResponse.json(
      { success: true, tracked: result.tracked },
      { status: result.tracked ? 201 : 200 }
    );
  } catch (error) {
    // Silent fail - analytics errors should not break UX
    console.error('Analytics tracking error:', error);
    return NextResponse.json({ success: false }, { status: 200 });
  }
}
