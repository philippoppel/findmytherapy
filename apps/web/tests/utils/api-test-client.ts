/**
 * API Test Client
 *
 * Utilities for testing Next.js API routes
 */

import { NextRequest } from 'next/server'

/**
 * Create a mock Next.js request for testing API routes
 */
export function createMockRequest(
  url: string,
  options: {
    method?: string
    headers?: Record<string, string>
    body?: any
    cookies?: Record<string, string>
  } = {}
): NextRequest {
  const { method = 'GET', headers = {}, body, cookies = {} } = options

  const requestUrl = url.startsWith('http') ? url : `http://localhost:3000${url}`

  const requestInit: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  }

  if (body) {
    requestInit.body = JSON.stringify(body)
  }

  const request = new NextRequest(requestUrl, requestInit)

  // Add cookies if provided
  for (const [key, value] of Object.entries(cookies)) {
    request.cookies.set(key, value)
  }

  return request
}

/**
 * Parse JSON response from API route
 */
export async function parseJsonResponse(response: Response) {
  const text = await response.text()
  try {
    return JSON.parse(text)
  } catch (e) {
    throw new Error(`Failed to parse JSON response: ${text}`)
  }
}

/**
 * Create auth token for testing authenticated routes
 */
export function createTestAuthToken(userId: string, role: string = 'CLIENT'): string {
  // This should match your auth implementation
  // For now, returning a mock token
  return Buffer.from(JSON.stringify({ userId, role })).toString('base64')
}

/**
 * Create request with authentication
 */
export function createAuthenticatedRequest(
  url: string,
  userId: string,
  options: Parameters<typeof createMockRequest>[1] = {}
): NextRequest {
  const token = createTestAuthToken(userId)

  return createMockRequest(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`
    },
    cookies: {
      ...options.cookies,
      'auth-token': token
    }
  })
}

/**
 * Assert response status
 */
export function assertStatus(response: Response, expectedStatus: number) {
  if (response.status !== expectedStatus) {
    throw new Error(
      `Expected status ${expectedStatus}, got ${response.status}: ${response.statusText}`
    )
  }
}

/**
 * Assert response is JSON
 */
export function assertJsonResponse(response: Response) {
  const contentType = response.headers.get('content-type')
  if (!contentType?.includes('application/json')) {
    throw new Error(`Expected JSON response, got: ${contentType}`)
  }
}
