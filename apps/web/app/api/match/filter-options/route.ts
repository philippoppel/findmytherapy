import { NextRequest, NextResponse } from 'next/server';
import { getAvailableFilterOptions } from '@/lib/matching/filter-availability';
import type { InsuranceType, TherapyFormat } from '@prisma/client';

// Force dynamic rendering since we use searchParams
export const dynamic = 'force-dynamic';

/**
 * GET /api/match/filter-options
 *
 * Gibt verfügbare Filter-Optionen mit Counts zurück
 * Query Parameters:
 * - languages: string[] (optional) - Aktuell gewählte Sprachen
 * - insuranceType: InsuranceType (optional) - Aktuell gewählte Versicherung
 * - format: TherapyFormat (optional) - Aktuell gewähltes Format
 * - problemAreas: string[] (optional) - Aktuell gewählte Problemfelder
 *
 * Response:
 * {
 *   languages: [{ value, label, count, available }, ...],
 *   insuranceTypes: [...],
 *   problemAreas: [...],
 *   formats: [...]
 * }
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Parse current filters from query params
    const currentFilters = {
      languages: searchParams.getAll('languages').filter(Boolean),
      insuranceType: searchParams.get('insuranceType') as InsuranceType | undefined,
      format: searchParams.get('format') as TherapyFormat | undefined,
      problemAreas: searchParams.getAll('problemAreas').filter(Boolean),
    };

    // Get available options
    const options = await getAvailableFilterOptions(currentFilters);

    // Return with caching headers (5 minutes)
    return NextResponse.json(options, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Error fetching filter options:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch filter options',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
