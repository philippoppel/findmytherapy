import { createClient } from 'redis'

/**
 * Redis Client für Caching
 * Nutzt RD_REDIS_URL oder REDIS_URL Environment Variable
 * Mit Fallback falls Redis nicht verfügbar (z.B. lokal)
 */

type RedisClient = ReturnType<typeof createClient>

let redis: RedisClient | null = null
let isConnecting = false

async function getRedisClient(): Promise<RedisClient | null> {
  // Wenn bereits initialisiert und connected
  if (redis && redis.isOpen) {
    return redis
  }

  // Wenn gerade am connecten, warte
  if (isConnecting) {
    await new Promise((resolve) => setTimeout(resolve, 100))
    return redis
  }

  // Redis URL aus Environment Variables
  const redisUrl = process.env.RD_REDIS_URL || process.env.REDIS_URL

  if (!redisUrl) {
    console.log('[Redis] No REDIS_URL found, caching disabled')
    return null
  }

  try {
    isConnecting = true

    redis = createClient({
      url: redisUrl,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 3) {
            console.log('[Redis] Max retries reached')
            return false // Stop retrying
          }
          return Math.min(retries * 50, 2000) // Exponential backoff
        },
      },
    })

    redis.on('error', (err) => {
      console.error('[Redis] Error:', err.message)
    })

    redis.on('connect', () => {
      console.log('[Redis] Connected successfully')
    })

    await redis.connect()
    isConnecting = false

    return redis
  } catch (error) {
    console.error('[Redis] Failed to connect:', error)
    isConnecting = false
    redis = null
    return null
  }
}

/**
 * Cached GET mit Fallback
 */
export async function getCached<T>(key: string): Promise<T | null> {
  const client = await getRedisClient()
  if (!client) return null

  try {
    const value = await client.get(key)
    if (!value) return null

    return JSON.parse(value) as T
  } catch (error) {
    console.error('[Redis] GET error:', error)
    return null
  }
}

/**
 * Cached SET mit TTL und Fallback
 */
export async function setCached<T>(
  key: string,
  value: T,
  ttlSeconds: number = 300
): Promise<void> {
  const client = await getRedisClient()
  if (!client) {
    console.log('[Redis] SET skipped - client not available')
    return
  }

  try {
    await client.set(key, JSON.stringify(value), {
      EX: ttlSeconds,
    })
    console.log(`[Redis] SET successful: ${key} (TTL: ${ttlSeconds}s)`)
  } catch (error) {
    console.error('[Redis] SET error:', error)
  }
}

/**
 * Health Check für Redis Connection
 */
export async function checkRedisHealth(): Promise<boolean> {
  const client = await getRedisClient()
  if (!client) return false

  try {
    await client.ping()
    return true
  } catch (error) {
    console.error('[Redis] Health check failed:', error)
    return false
  }
}
