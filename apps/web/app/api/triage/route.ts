import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { seedCourses } from '@/lib/seed-data'
import { z } from 'zod'
import { captureError } from '../../../lib/monitoring'
import { auth } from '../../../lib/auth'

// Schema for full assessment (all questions answered)
const fullTriagePayloadSchema = z.object({
  assessmentType: z.literal('full'),

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

  // Consent for data sharing
  consentDossierSharing: z.boolean().optional().default(false),
})

// Schema for screening-only (PHQ-2/GAD-2 only)
const screeningOnlyPayloadSchema = z.object({
  assessmentType: z.literal('screening'),

  // PHQ-2 and GAD-2 data
  phq2Answers: z.array(z.number().int().min(0).max(3)).length(2),
  gad2Answers: z.array(z.number().int().min(0).max(3)).length(2),
  phq2Score: z.number().int().min(0).max(6),
  gad2Score: z.number().int().min(0).max(6),

  // Additional context
  supportPreferences: z.array(z.string()).default([]),
  availability: z.array(z.string()).default([]),
})

// Union of both schemas
const triagePayloadSchema = z.discriminatedUnion('assessmentType', [
  fullTriagePayloadSchema,
  screeningOnlyPayloadSchema,
])

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

    // Handle screening-only assessment
    if (payload.assessmentType === 'screening') {
      // Validate that scores match answers
      const calculatedPHQ2 = payload.phq2Answers.reduce((sum, val) => sum + val, 0)
      const calculatedGAD2 = payload.gad2Answers.reduce((sum, val) => sum + val, 0)

      if (calculatedPHQ2 !== payload.phq2Score || calculatedGAD2 !== payload.gad2Score) {
        return NextResponse.json(
          {
            success: false,
            message: 'Score mismatch: calculated scores do not match provided scores',
            details: {
              phq2: { provided: payload.phq2Score, calculated: calculatedPHQ2 },
              gad2: { provided: payload.gad2Score, calculated: calculatedGAD2 },
            },
          },
          { status: 400 }
        )
      }

      // Validate that both scores are <3 (otherwise should be full assessment)
      if (payload.phq2Score >= 3 || payload.gad2Score >= 3) {
        console.warn('[TRIAGE] Screening-only submitted with scores ≥3', {
          phq2Score: payload.phq2Score,
          gad2Score: payload.gad2Score,
        })
        // Don't fail, but log warning - UX might allow override
      }

      // Build therapist recommendations for LOW risk users based on preferences
      const therapistRecommendations = await buildTherapistRecommendationsForScreening(payload)
      const courseRecommendations = buildCourseRecommendationsForScreening(payload)

      console.log('[TRIAGE DEBUG] Screening-only therapist recommendations:', therapistRecommendations.length)
      console.log('[TRIAGE DEBUG] Screening-only course recommendations:', courseRecommendations.length)

      return NextResponse.json(
        {
          success: true,
          assessmentType: 'screening',
          screeningResult: {
            phq2Score: payload.phq2Score,
            gad2Score: payload.gad2Score,
            message: 'Screening unauffällig - präventive Unterstützung möglich',
            interpretation: 'Basierend auf dem Kurzscreening (PHQ-2/GAD-2) zeigen sich minimale Symptome. Präventive Unterstützung kann helfen, Ihr Wohlbefinden zu stärken.',
          },
          recommendations: {
            therapists: therapistRecommendations,
            courses: courseRecommendations,
          },
        },
        { status: 200 }
      )
    }

    // Validate full assessment scores
    const calculatedPHQ9 = payload.phq9Answers.reduce((sum, val) => sum + val, 0)
    const calculatedGAD7 = payload.gad7Answers.reduce((sum, val) => sum + val, 0)

    if (calculatedPHQ9 !== payload.phq9Score || calculatedGAD7 !== payload.gad7Score) {
      return NextResponse.json(
        {
          success: false,
          message: 'Score mismatch: calculated scores do not match provided scores',
          details: {
            phq9: { provided: payload.phq9Score, calculated: calculatedPHQ9 },
            gad7: { provided: payload.gad7Score, calculated: calculatedGAD7 },
          },
        },
        { status: 400 }
      )
    }

    // Build recommendations based on new data (full assessment only)
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

        // Handle consent for dossier sharing
        if (payload.consentDossierSharing) {
          try {
            await prisma.clientConsent.create({
              data: {
                clientId: validUserId,
                scope: 'DOSSIER_SHARING',
                status: 'GRANTED',
                source: 'triage_flow',
                metadata: {
                  triageSessionId: triageSession.id,
                  timestamp: new Date().toISOString(),
                },
              },
            })
          } catch (consentError) {
            console.error('[TRIAGE] Failed to save consent:', consentError)
            // Don't fail the request if consent saving fails
          }
        }

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

function determineNextStep(payload: z.infer<typeof fullTriagePayloadSchema>): 'INFO' | 'COURSE' | 'THERAPIST' {
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

async function buildTherapistRecommendations(payload: z.infer<typeof fullTriagePayloadSchema>): Promise<TherapistRecommendation[]> {
  const supportSet = new Set(payload.supportPreferences)
  const availabilitySet = new Set(payload.availability.map((item) => item.toLowerCase()))
  const escalatedNeed = payload.hasSuicidalIdeation || payload.requiresEmergency || payload.riskLevel === 'HIGH'

  let publicTherapists = await prisma.therapistProfile.findMany({
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

  // If no verified therapists found, try to find any public therapists
  if (publicTherapists.length === 0) {
    console.warn('[TRIAGE] No VERIFIED therapists found, fetching all public therapists')
    publicTherapists = await prisma.therapistProfile.findMany({
      where: {
        isPublic: true,
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
  }

  return publicTherapists
    .map((therapist) => {
      const formatTags = deriveFormatTagsFromProfile(therapist.city, therapist.online)
      let score = 4.8

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
        rating: 4.8,
        reviews: 0,
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

function buildCourseRecommendations(payload: z.infer<typeof fullTriagePayloadSchema>): CourseRecommendation[] {
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

async function buildTherapistRecommendationsForScreening(payload: z.infer<typeof screeningOnlyPayloadSchema>): Promise<TherapistRecommendation[]> {
  const supportSet = new Set(payload.supportPreferences)
  const availabilitySet = new Set(payload.availability.map((item) => item.toLowerCase()))

  let publicTherapists = await prisma.therapistProfile.findMany({
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

  // If no verified therapists found, try to find any public therapists
  if (publicTherapists.length === 0) {
    console.warn('[TRIAGE] No VERIFIED therapists found, fetching all public therapists')
    publicTherapists = await prisma.therapistProfile.findMany({
      where: {
        isPublic: true,
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
  }

  return publicTherapists
    .map((therapist) => {
      const formatTags = deriveFormatTagsFromProfile(therapist.city, therapist.online)
      let score = 4.8

      // For LOW risk, prioritize based on preferences
      if (supportSet.has('therapist')) {
        score += 2
      }

      if (supportSet.has('checkin')) {
        score += 1
      }

      // Availability matching
      if (therapist.online && availabilitySet.has('online')) {
        score += 2
      }
      if (therapist.online && therapist.city && availabilitySet.has('hybrid')) {
        score += 1.5
      }
      if (therapist.city && availabilitySet.has('praesenz')) {
        score += 1.5
      }

      // Build highlights for preventive support
      const highlights: string[] = []
      if (therapist.online && availabilitySet.has('online')) {
        highlights.push('Online verfügbar')
      }
      if (therapist.city && therapist.online) {
        highlights.push('Hybrid angeboten')
      } else if (therapist.city) {
        highlights.push(`Praxis in ${therapist.city}`)
      }
      highlights.push('Präventive Begleitung')
      if (therapist.acceptingClients) {
        highlights.push('Nimmt neue Klient:innen an')
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
        rating: 4.8,
        reviews: 0,
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
    .map(({ score: _score, ...rest }) => rest)
}

function buildCourseRecommendationsForScreening(payload: z.infer<typeof screeningOnlyPayloadSchema>): CourseRecommendation[] {
  const supportSet = new Set(payload.supportPreferences)
  const publishedCourses = seedCourses.filter((course) => course.status === 'PUBLISHED')

  // For LOW risk, prioritize preventive and resource-building courses
  const relevantCourses = publishedCourses.filter((course) => {
    const focus = course.focus.toLowerCase()
    const intensity = course.intensity.toLowerCase()
    // Prefer stress management, self-care, resilience courses
    return focus.includes('stress') || focus.includes('selbst') || focus.includes('resilienz') || intensity.includes('prävent')
  })

  return relevantCourses
    .map((course) => {
      let score = supportSet.has('course') ? 3 : 1.5

      // Check support preferences
      if (supportSet.has('checkin') && course.format.toLowerCase().includes('check')) {
        score += 1.5
      }
      if (supportSet.has('group') && course.format.toLowerCase().includes('live')) {
        score += 1
      }

      // Build highlights for preventive courses
      const highlights: string[] = []
      highlights.push('Präventiv und ressourcenstärkend')
      if (supportSet.has('course')) {
        highlights.push('Selbstlern-Inhalte zur Begleitung')
      }
      if (course.format.toLowerCase().includes('live')) {
        highlights.push('Live-Elemente inklusive')
      }
      if (course.format.toLowerCase().includes('check')) {
        highlights.push('Check-ins mit Care-Team')
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
