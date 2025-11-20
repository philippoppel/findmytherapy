import { NextResponse } from 'next/server'
import { getDatabaseHealth } from '@/lib/db-health-check'

/**
 * Health-Check Endpoint
 * GET /api/health
 *
 * Prüft:
 * - Datenbankverbindung
 * - Kritische Tabellen
 * - Basis-Statistiken
 */
export async function GET() {
  try {
    const health = await getDatabaseHealth()

    const statusCode = health.status === 'healthy' ? 200 : 503

    return NextResponse.json(health, {
      status: statusCode,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        connection: 'failed',
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      },
      {
        status: 503,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      }
    )
  }
}
