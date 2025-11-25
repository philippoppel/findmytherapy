import { NextRequest, NextResponse } from 'next/server';
import { getTherapistCards } from '@/app/therapists/getTherapistCards';

// Force this route to be dynamic since it uses search params
export const dynamic = 'force-dynamic';

/**
 * GET /api/therapists
 *
 * Query params:
 * - limit: number of results (default: 50, max: 200)
 * - offset: pagination offset (default: 0)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 200);
    const offset = parseInt(searchParams.get('offset') || '0');

    const { therapists, total } = await getTherapistCards({
      limit,
      offset,
    });

    return NextResponse.json({
      therapists,
      total,
      limit,
      offset,
      hasMore: offset + therapists.length < total,
    });
  } catch (error) {
    console.error('Error fetching therapists:', error);
    return NextResponse.json({ error: 'Failed to fetch therapists' }, { status: 500 });
  }
}
