import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { captureError } from '@/lib/monitoring';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== 'THERAPIST') {
      return NextResponse.json(
        { success: false, message: 'Nicht autorisiert' },
        { status: 401 }
      );
    }

    const profile = await prisma.therapistProfile.findFirst({
      where: {
        userId: session.user.id,
        deletedAt: null,
      },
      select: { id: true },
    });

    if (!profile) {
      return NextResponse.json(
        { success: false, message: 'Profil nicht gefunden' },
        { status: 404 }
      );
    }

    const leads = await prisma.therapistMicrositeLead.findMany({
      where: {
        therapistProfileId: profile.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 100,
    });

    return NextResponse.json({ success: true, leads });
  } catch (error) {
    captureError(error, { location: 'api/therapist/microsite/leads:get' });

    return NextResponse.json(
      { success: false, message: 'Leads konnten nicht geladen werden' },
      { status: 500 }
    );
  }
}
