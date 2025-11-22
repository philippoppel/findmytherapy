import { NextResponse } from 'next/server'
import { getDatabaseHealth } from '@/lib/db-health-check'
import { checkRedisHealth } from '@/lib/redis'

/**
 * Health-Check Endpoint
 * GET /api/health
 *
 * Prüft:
 * - Datenbankverbindung
 * - Kritische Tabellen
 * - Basis-Statistiken
 * - Redis Cache Verfügbarkeit
 */
export async function GET() {
  try {
    const [dbHealth, redisHealthy] = await Promise.all([
      getDatabaseHealth(),
      checkRedisHealth()
    ])

    const health = {
      ...dbHealth,
      redis: {
        available: redisHealthy,
        url: process.env.RD_REDIS_URL ? 'RD_REDIS_URL set' : (process.env.REDIS_URL ? 'REDIS_URL set' : 'not configured')
      }
    }

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
