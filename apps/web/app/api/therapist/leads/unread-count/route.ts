import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { captureError } from '@/lib/monitoring';

export const dynamic = 'force-dynamic';

/**
 * GET /api/therapist/leads/unread-count
 * Get count of new/unread leads for the therapist
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
      },
    });

    if (!profile) {
      return NextResponse.json(
        { success: false, message: 'Profil nicht gefunden' },
        { status: 404 },
      );
    }

    // Count leads with status NEW (unread)
    const unreadCount = await prisma.therapistMicrositeLead.count({
      where: {
        therapistProfileId: profile.id,
        status: 'NEW',
      },
    });

    return NextResponse.json({
      success: true,
      count: unreadCount,
    });
  } catch (error) {
    captureError(error, { location: 'api/therapist/leads/unread-count:get' });

    return NextResponse.json(
      { success: false, message: 'Fehler beim Laden der Anzahl' },
      { status: 500 },
    );
  }
}
