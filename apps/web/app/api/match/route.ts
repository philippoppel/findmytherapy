import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createMatchingResponse } from '@/lib/matching'
import { auth } from '@/lib/auth'

// Validierungsschema für die Anfrage
const matchingRequestSchema = z.object({
  // Harte Kriterien
  problemAreas: z.array(z.string()).min(1, 'Mindestens ein Problembereich erforderlich'),
  languages: z.array(z.string()).default(['Deutsch']),
  insuranceType: z.enum(['PUBLIC', 'PRIVATE', 'SELF_PAY', 'ANY']).default('ANY'),
  format: z.enum(['ONLINE', 'IN_PERSON', 'BOTH']).default('BOTH'),
  maxDistanceKm: z.number().positive().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  postalCode: z.string().optional(),
  city: z.string().optional(),
  maxWaitWeeks: z.number().min(0).max(52).optional(),

  // Weiche Kriterien
  preferredMethods: z.array(z.string()).optional(),
  therapistGender: z.enum(['male', 'female', 'any']).optional(),
  therapistAgeRange: z.enum(['young', 'middle', 'senior', 'any']).optional(),
  communicationStyle: z.enum(['DIRECT', 'GENTLE', 'ANY']).optional(),
  priceMax: z.number().positive().optional(), // in Cent

  // Optionen
  limit: z.number().min(1).max(50).default(10),
})

export async function POST(request: NextRequest) {
  try {
    // Request-Body parsen
    const body = await request.json()

    // Validierung
    const parseResult = matchingRequestSchema.safeParse(body)
    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: 'Ungültige Anfrage',
          details: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const data = parseResult.data

    // Optional: User-ID aus Session holen
    let userId: string | undefined
    try {
      const session = await auth()
      userId = session?.user?.id
    } catch {
      // Session-Fehler ignorieren, anonyme Nutzung erlaubt
    }

    // Matching durchführen
    const response = await createMatchingResponse(
      {
        problemAreas: data.problemAreas,
        languages: data.languages,
        insuranceType: data.insuranceType,
        format: data.format,
        maxDistanceKm: data.maxDistanceKm,
        latitude: data.latitude,
        longitude: data.longitude,
        postalCode: data.postalCode,
        city: data.city,
        maxWaitWeeks: data.maxWaitWeeks,
        preferredMethods: data.preferredMethods,
        therapistGender: data.therapistGender,
        therapistAgeRange: data.therapistAgeRange,
        communicationStyle: data.communicationStyle,
        priceMax: data.priceMax,
      },
      { limit: data.limit },
      userId
    )

    // Response mit Cache-Headers
    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
      },
    })
  } catch (error) {
    console.error('Matching error:', error)

    return NextResponse.json(
      {
        error: 'Interner Serverfehler beim Matching',
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

// GET für Health-Check / Info
export async function GET() {
  return NextResponse.json({
    service: 'FindMyTherapy Matching API',
    version: '1.0.1',
    endpoints: {
      'POST /api/match': 'Therapeuten-Matching durchführen',
    },
    requiredFields: ['problemAreas'],
    optionalFields: [
      'languages',
      'insuranceType',
      'format',
      'maxDistanceKm',
      'latitude',
      'longitude',
      'postalCode',
      'city',
      'maxWaitWeeks',
      'preferredMethods',
      'therapistGender',
      'therapistAgeRange',
      'communicationStyle',
      'priceMax',
      'limit',
    ],
  })
}
