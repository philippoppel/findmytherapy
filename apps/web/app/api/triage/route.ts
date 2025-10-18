import { NextRequest, NextResponse } from 'next/server'
import { prisma, seedTherapists, seedCourses } from '@mental-health/db'
import { z } from 'zod'
import { captureError } from '../../../lib/monitoring'

const triagePayloadSchema = z.object({
  mood: z.number().int().min(0).max(3).nullable(),
  motivation: z.number().int().min(0).max(3).nullable(),
  anxiety: z.number().int().min(0).max(3).nullable(),
  support: z.array(z.string()).default([]),
  availability: z.array(z.string()).default([]),
  score: z.number().int().min(0),
  level: z.enum(['low', 'medium', 'high']),
})

type TherapistRecommendation = {
  id: string
  name: string
  title: string
  focus: string[]
  availability: string
  location: string
  rating: number
  reviews: number
  status: string
  formatTags: Array<'online' | 'praesenz' | 'hybrid'>
  highlights: string[]
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

    const therapistRecommendations = buildTherapistRecommendations(payload)
    const courseRecommendations = buildCourseRecommendations(payload)

    await prisma.triageSnapshot.create({
      data: {
        score: payload.score,
        level: payload.level,
        mood: payload.mood ?? undefined,
        motivation: payload.motivation ?? undefined,
        anxiety: payload.anxiety ?? undefined,
        support: payload.support,
        availability: payload.availability,
        recommendedTherapists: therapistRecommendations.map((item) => item.id),
        recommendedCourses: courseRecommendations.map((item) => item.slug),
      },
    })

    return NextResponse.json(
      {
        success: true,
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

    console.error('Error storing triage snapshot:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Die Ergebnisse konnten nicht gespeichert werden.',
      },
      { status: 500 }
    )
  }
}

function buildTherapistRecommendations(payload: z.infer<typeof triagePayloadSchema>): TherapistRecommendation[] {
  const supportSet = new Set(payload.support)
  const availabilitySet = new Set(payload.availability.map((item) => item.toLowerCase()))
  const publicTherapists = seedTherapists.filter((therapist) => therapist.profile.isPublic)

  return publicTherapists
    .map((therapist) => {
      const formatTags = deriveFormatTags(therapist.location, therapist.profile.online)
      let score = therapist.rating

      if (supportSet.has('therapist')) {
        score += 1.5
      }
      if (payload.level === 'high') {
        score += 0.75
      }
      if (therapist.profile.online && availabilitySet.has('online')) {
        score += 1.5
      }
      if (therapist.location.toLowerCase().includes('hybrid') && availabilitySet.has('hybrid')) {
        score += 1
      }
      if (therapist.availability.toLowerCase().includes('kurzfristig') && payload.level === 'high') {
        score += 0.5
      }

      const highlights: string[] = []
      if (therapist.profile.online && availabilitySet.has('online')) {
        highlights.push('Online verfügbar')
      }
      if (therapist.location.toLowerCase().includes('präsenz') && availabilitySet.has('praesenz')) {
        highlights.push('Vor Ort möglich')
      }
      if (therapist.location.toLowerCase().includes('hybrid') && availabilitySet.has('hybrid')) {
        highlights.push('Hybrid angeboten')
      }
      if (payload.level !== 'low') {
        highlights.push('Erfahrung mit erhöhtem Unterstützungsbedarf')
      }
      if (supportSet.has('therapist')) {
        highlights.push('Empfohlen für 1:1 Begleitung')
      }

      return {
        id: therapist.email,
        name: therapist.displayName,
        title: therapist.title,
        focus: therapist.focus,
        availability: therapist.availability,
        location: therapist.location,
        rating: therapist.rating,
        reviews: therapist.reviews,
        status: therapist.profile.status,
        formatTags,
        highlights: Array.from(new Set(highlights)).slice(0, 3),
        score,
      }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ score: _score, ...rest }) => rest)
}

function buildCourseRecommendations(payload: z.infer<typeof triagePayloadSchema>): CourseRecommendation[] {
  const supportSet = new Set(payload.support)

  const publishedCourses = seedCourses.filter((course) => course.status === 'PUBLISHED')

  return publishedCourses
    .map((course) => {
      let score = supportSet.has('course') ? 3 : 1
      if (payload.level === 'high') {
        score += course.intensity.toLowerCase().includes('struktur') ? 1 : 0
      }
      if (supportSet.has('checkin') && course.format.toLowerCase().includes('check')) {
        score += 1
      }
      if (supportSet.has('group') && course.format.toLowerCase().includes('live')) {
        score += 0.5
      }

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
      if (payload.level === 'high') {
        highlights.push('Strukturierter Fahrplan trotz hoher Belastung')
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

function deriveFormatTags(location: string, online: boolean): Array<'online' | 'praesenz' | 'hybrid'> {
  const tags = new Set<Array<'online' | 'praesenz' | 'hybrid'>[number]>()

  if (online) {
    tags.add('online')
  }

  const lowerLocation = location.toLowerCase()
  if (lowerLocation.includes('präsenz') || lowerLocation.includes('praesenz')) {
    tags.add('praesenz')
  }
  if (lowerLocation.includes('hybrid')) {
    tags.add('hybrid')
  }
  if (lowerLocation.includes('online')) {
    tags.add('online')
  }

  return Array.from(tags)
}
