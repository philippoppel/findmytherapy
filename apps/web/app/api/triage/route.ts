import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { seedCourses } from '@/lib/seed-data'
import { z } from 'zod'
import { captureError } from '../../../lib/monitoring'
import { auth } from '../../../lib/auth'

const triagePayloadSchema = z.object({
  // PHQ-9 data (9 items, each 0-3)
  phq9Answers: z.array(z.number().int().min(0).max(3)).length(9),
  phq9Score: z.number().int().min(0).max(27),
  phq9Severity: z.enum(['minimal', 'mild', 'moderate', 'moderately_severe', 'severe']),

  // GAD-7 data (7 items, each 0-3)
  gad7Answers: z.array(z.number().int().min(0).max(3)).length(7),
  gad7Score: z.number().int().min(0).max(21),
  gad7Severity: z.enum(['minimal', 'mild', 'moderate', 'severe']),

  // Additional context
  supportPreferences: z.array(z.string()).default([]),
  availability: z.array(z.string()).default([]),
  phq9Item9Score: z.number().int().min(0).max(3).optional().default(0),
  hasSuicidalIdeation: z.boolean().optional().default(false),

  // Risk assessment
  riskLevel: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  requiresEmergency: z.boolean(),
})

type TherapistRecommendation = {
  id: string
  name: string
  title: string
  headline?: string
  focus: string[]
  availability: string
  location: string
  rating: number
  reviews: number
  status: string
  formatTags: Array<'online' | 'praesenz' | 'hybrid'>
  highlights: string[]
  acceptingClients?: boolean
  services?: string[]
  responseTime?: string
  yearsExperience?: number
  languages: string[]
  image?: string | null
}

type CourseRecommendation = {
  slug: string
  title: string
  shortDescription: string
  focus: string
  duration: string
  format: string
  outcomes: string[]
  highlights: string[]
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const payload = triagePayloadSchema.parse(body)

    // Get session (if available - might be anonymous)
    const session = await auth()
    const userId = session?.user?.id

    // Verify user exists in database if userId is provided
    let validUserId: string | undefined = undefined
    if (userId) {
      const userExists = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true },
      })
      if (userExists) {
        validUserId = userId
      } else {
        console.warn('[TRIAGE] Session contains userId that does not exist in database:', userId)
      }
    }

    // Build recommendations based on new data
    const therapistRecommendations = await buildTherapistRecommendations(payload)
    const courseRecommendations = buildCourseRecommendations(payload)

    console.log('[TRIAGE DEBUG] Therapist recommendations:', therapistRecommendations.length)
    console.log('[TRIAGE DEBUG] Course recommendations:', courseRecommendations.length)
    console.log('[TRIAGE DEBUG] First therapist:', JSON.stringify(therapistRecommendations[0], null, 2))

    let triageSessionId: string | undefined

    try {
      // Save to database
      if (validUserId) {
        // Save complete triage session for authenticated users
        const triageSession = await prisma.triageSession.create({
          data: {
            clientId: validUserId,
            phq9Answers: payload.phq9Answers,
            phq9Score: payload.phq9Score,
            phq9Severity: payload.phq9Severity,
            gad7Answers: payload.gad7Answers,
            gad7Score: payload.gad7Score,
            gad7Severity: payload.gad7Severity,
            supportPreferences: payload.supportPreferences,
            availability: payload.availability,
            riskLevel: payload.riskLevel,
            requiresEmergency: payload.requiresEmergency,
            emergencyTriggered: false,
            recommendedNextStep: determineNextStep(payload),
            meta: {
              phq9Item9Score: payload.phq9Item9Score,
              hasSuicidalIdeation: payload.hasSuicidalIdeation,
            },
          },
        })

        triageSessionId = triageSession.id

        // Create emergency alert if required
        if (payload.requiresEmergency) {
          await prisma.emergencyAlert.create({
            data: {
              clientId: validUserId,
              triageSessionId: triageSession.id,
              severity: 'HIGH',
              notes: `PHQ-9: ${payload.phq9Score}/27 (${payload.phq9Severity}), GAD-7: ${payload.gad7Score}/21 (${payload.gad7Severity})${
                payload.hasSuicidalIdeation ? '; Suizidgedanken (Item 9) bestätigt' : ''
              }`,
            },
          })

          // Mark emergency as triggered
          await prisma.triageSession.update({
            where: { id: triageSession.id },
            data: { emergencyTriggered: true },
          })
        }
      } else {
        // For anonymous users, save minimal snapshot
        await prisma.triageSnapshot.create({
          data: {
            score: payload.phq9Score + payload.gad7Score,
            level: payload.riskLevel,
            mood: payload.phq9Score,
            motivation: null,
            anxiety: payload.gad7Score,
            support: payload.supportPreferences,
            availability: payload.availability,
            recommendedTherapists: therapistRecommendations.map((item) => item.id),
            recommendedCourses: courseRecommendations.map((item) => item.slug),
          },
        })
      }
    } catch (dbError) {
      // Log database error but continue to return recommendations
      console.error('[TRIAGE] Database save error (continuing anyway):', dbError)
    }

    return NextResponse.json(
      {
        success: true,
        triageSessionId,
        recommendations: {
          therapists: therapistRecommendations,
          courses: courseRecommendations,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    captureError(error, { location: 'api/triage' })

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validierungsfehler',
          errors: error.errors,
        },
        { status: 400 }
      )
    }

    console.error('Error storing triage results:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Die Ergebnisse konnten nicht gespeichert werden.',
      },
      { status: 500 }
    )
  }
}

function determineNextStep(payload: z.infer<typeof triagePayloadSchema>): 'INFO' | 'COURSE' | 'THERAPIST' {
  if (payload.hasSuicidalIdeation || payload.requiresEmergency) return 'THERAPIST'
  if (payload.riskLevel === 'HIGH') return 'THERAPIST'
  if (payload.riskLevel === 'MEDIUM') {
    if (payload.supportPreferences.includes('course') && !payload.supportPreferences.includes('therapist')) {
      return 'COURSE'
    }
    return 'THERAPIST'
  }

  // For LOW risk, check preferences
  if (payload.supportPreferences.includes('therapist')) return 'THERAPIST'
  if (payload.supportPreferences.includes('course')) return 'COURSE'

  return 'INFO'
}

async function buildTherapistRecommendations(payload: z.infer<typeof triagePayloadSchema>): Promise<TherapistRecommendation[]> {
  const supportSet = new Set(payload.supportPreferences)
  const availabilitySet = new Set(payload.availability.map((item) => item.toLowerCase()))
  const escalatedNeed = payload.hasSuicidalIdeation || payload.requiresEmergency || payload.riskLevel === 'HIGH'
  const publicTherapists = await prisma.therapistProfile.findMany({
    where: {
      isPublic: true,
      status: 'VERIFIED',
    },
    select: {
      id: true,
      displayName: true,
      title: true,
      headline: true,
      specialties: true,
      services: true,
      availabilityNote: true,
      responseTime: true,
      acceptingClients: true,
      rating: true,
      reviewCount: true,
      online: true,
      city: true,
      country: true,
      modalities: true,
      experienceSummary: true,
      yearsExperience: true,
      languages: true,
      profileImageUrl: true,
    },
  })

  return publicTherapists
    .map((therapist) => {
      const formatTags = deriveFormatTagsFromProfile(therapist.city, therapist.online)
      let score = therapist.rating ?? 4.2

      // Prioritize based on risk level
      if (payload.riskLevel === 'HIGH') {
        score += 3
      } else if (payload.riskLevel === 'MEDIUM') {
        score += 1.5
      }

      // Check support preferences
      if (supportSet.has('therapist')) {
        score += 2
      }

      if (escalatedNeed) {
        score += 2
      }

      // Availability matching
      if (therapist.online && availabilitySet.has('online')) {
        score += 2
      }
      if (therapist.online && therapist.city && availabilitySet.has('hybrid')) {
        score += 1.5
      }

      // Prioritize therapists with relevant specialties
      const focusAreas = therapist.specialties.map((f) => f.toLowerCase())

      // Check for depression-related focus
      if (
        (payload.phq9Severity === 'moderate' ||
          payload.phq9Severity === 'moderately_severe' ||
          payload.phq9Severity === 'severe') &&
        (focusAreas.some((item) => item.includes('depress')) || focusAreas.some((item) => item.includes('stress')))
      ) {
        score += 1.5
      }

      // Check for anxiety-related focus
      if (
        (payload.gad7Severity === 'moderate' || payload.gad7Severity === 'severe') &&
        (focusAreas.some((item) => item.includes('angst')) || focusAreas.some((item) => item.includes('stress')))
      ) {
        score += 1.5
      }

      // Build highlights
      const highlights: string[] = []
      if (therapist.online && availabilitySet.has('online')) {
        highlights.push('Online verfügbar')
      }
      if (therapist.city && therapist.online) {
        highlights.push('Hybrid angeboten')
      } else if (therapist.city) {
        highlights.push(`Praxis in ${therapist.city}`)
      }
      if (payload.riskLevel !== 'LOW') {
        highlights.push('Erfahrung mit erhöhtem Unterstützungsbedarf')
      }
      if (supportSet.has('therapist')) {
        highlights.push('Empfohlen für 1:1 Begleitung')
      }
      if (escalatedNeed) {
        if (therapist.acceptingClients) {
          highlights.push('Nimmt neue Klient:innen in Akutsituationen an')
        } else {
          highlights.push('Krisenerfahrenes Setting')
        }
      }
      if (therapist.responseTime) {
        highlights.push(therapist.responseTime)
      }
      if (therapist.services.length > 0) {
        highlights.push(therapist.services[0])
      }

      return {
        id: therapist.id,
        name: therapist.displayName ?? 'Therapeut:in',
        title: therapist.title ?? '',
        focus: therapist.specialties,
        availability: therapist.availabilityNote ?? 'Termine auf Anfrage',
        location: deriveLocationLabel(therapist.city, therapist.online),
        rating: therapist.rating ?? 0,
        reviews: therapist.reviewCount ?? 0,
        status: 'VERIFIED',
        formatTags,
        highlights: Array.from(new Set(highlights)).slice(0, 3),
        acceptingClients: therapist.acceptingClients,
        headline: therapist.headline ?? undefined,
        services: therapist.services.slice(0, 3),
        responseTime: therapist.responseTime ?? undefined,
        yearsExperience: therapist.yearsExperience ?? undefined,
        languages: therapist.languages,
        image: therapist.profileImageUrl ?? null,
        score,
      }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ score: _score, ...rest }) => rest)
}

function buildCourseRecommendations(payload: z.infer<typeof triagePayloadSchema>): CourseRecommendation[] {
  const supportSet = new Set(payload.supportPreferences)
  const publishedCourses = seedCourses.filter((course) => course.status === 'PUBLISHED')

  if (payload.riskLevel === 'HIGH') {
    if (payload.requiresEmergency || payload.hasSuicidalIdeation) {
      return []
    }
  }

  let relevantCourses = publishedCourses

  if (payload.riskLevel === 'HIGH') {
    relevantCourses = relevantCourses.filter((course) => {
      const intensity = course.intensity.toLowerCase()
      return intensity.includes('begleit') || intensity.includes('coaching') || intensity.includes('stabil')
    })
  }

  return relevantCourses
    .map((course) => {
      let score = supportSet.has('course') ? 3 : 1

      // Prioritize structured programs for higher risk
      if (payload.riskLevel === 'HIGH' && course.intensity.toLowerCase().includes('struktur')) {
        score += 2
      }

      // Check support preferences
      if (supportSet.has('checkin') && course.format.toLowerCase().includes('check')) {
        score += 1.5
      }
      if (supportSet.has('group') && course.format.toLowerCase().includes('live')) {
        score += 1
      }

      // Match course focus to symptoms
      const courseFocus = course.focus.toLowerCase()
      if (
        (payload.phq9Severity === 'mild' || payload.phq9Severity === 'moderate') &&
        (courseFocus.includes('stress') || courseFocus.includes('selbstwert'))
      ) {
        score += 1
      }
      if (
        (payload.gad7Severity === 'mild' || payload.gad7Severity === 'moderate') &&
        (courseFocus.includes('angst') || courseFocus.includes('stress'))
      ) {
        score += 1
      }

      // Build highlights
      const highlights: string[] = []
      if (supportSet.has('course')) {
        highlights.push('Selbstlern-Inhalte zur Begleitung')
      }
      if (course.format.toLowerCase().includes('live')) {
        highlights.push('Live-Elemente inklusive')
      }
      if (course.format.toLowerCase().includes('check')) {
        highlights.push('Check-ins mit Care-Team')
      }
      if (payload.riskLevel === 'HIGH') {
        highlights.push('Nur als Ergänzung zur individuellen Therapie nutzen')
      }
      if (payload.riskLevel === 'LOW') {
        highlights.push('Präventiv und ressourcenstärkend')
      }
      if (payload.hasSuicidalIdeation) {
        highlights.push('Begleitangebot – bitte parallel professionelle Hilfe in Anspruch nehmen')
      }

      return {
        slug: course.slug,
        title: course.title,
        shortDescription: course.shortDescription,
        focus: course.focus,
        duration: course.duration,
        format: course.format,
        outcomes: course.outcomes.slice(0, 3),
        highlights: Array.from(new Set(highlights)).slice(0, 3),
        score,
      }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ score: _score, ...rest }) => rest)
}

function deriveFormatTagsFromProfile(city: string | null, online: boolean): Array<'online' | 'praesenz' | 'hybrid'> {
  const tags = new Set<Array<'online' | 'praesenz' | 'hybrid'>[number]>()

  if (online) {
    tags.add('online')
  }

  if (city && online) {
    tags.add('hybrid')
  }

  if (city && !online) {
    tags.add('praesenz')
  }

  return Array.from(tags)
}

function deriveLocationLabel(city: string | null, online: boolean): string {
  if (city && online) {
    return `${city} · Online`
  }

  if (city) {
    return city
  }

  if (online) {
    return 'Online'
  }

  return 'Ort auf Anfrage'
}
