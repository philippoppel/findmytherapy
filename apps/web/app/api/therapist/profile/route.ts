import { NextRequest, NextResponse } from 'next/server'
import { prisma, Prisma } from '@/lib/prisma'

import { auth } from '../../../../lib/auth'
import { captureError } from '../../../../lib/monitoring'
import { setcardPayloadSchema, sanitizeStringArray, safeNullableString, type SetcardPayload } from '../../../../lib/therapist/setcard'
import { z } from 'zod'

const profileSelect = {
  id: true,
  displayName: true,
  title: true,
  headline: true,
  approachSummary: true,
  experienceSummary: true,
  services: true,
  profileImageUrl: true,
  videoUrl: true,
  acceptingClients: true,
  yearsExperience: true,
  rating: true,
  reviewCount: true,
  responseTime: true,
  modalities: true,
  specialties: true,
  languages: true,
  priceMin: true,
  priceMax: true,
  availabilityNote: true,
  pricingNote: true,
  about: true,
  city: true,
  country: true,
  online: true,
  status: true,
  updatedAt: true,
} as const

type TherapistProfileSetcard = Prisma.TherapistProfileGetPayload<{
  select: typeof profileSelect
}>

const serializeProfile = (profile: TherapistProfileSetcard) => ({
  id: profile.id,
  displayName: profile.displayName,
  title: profile.title,
  headline: profile.headline,
  approachSummary: profile.approachSummary,
  experienceSummary: profile.experienceSummary,
  services: profile.services,
  profileImageUrl: profile.profileImageUrl,
  videoUrl: profile.videoUrl,
  acceptingClients: profile.acceptingClients,
  yearsExperience: profile.yearsExperience,
  rating: profile.rating,
  reviewCount: profile.reviewCount,
  responseTime: profile.responseTime,
  modalities: profile.modalities,
  specialties: profile.specialties,
  languages: profile.languages,
  priceMin: profile.priceMin,
  priceMax: profile.priceMax,
  availabilityNote: profile.availabilityNote,
  pricingNote: profile.pricingNote,
  about: profile.about,
  city: profile.city,
  country: profile.country,
  online: profile.online,
  status: profile.status,
  updatedAt: profile.updatedAt,
})

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== 'THERAPIST') {
      return NextResponse.json(
        { success: false, message: 'Nicht autorisiert.' },
        { status: 401 }
      )
    }

    const profile = await prisma.therapistProfile.findUnique({
      where: { userId: session.user.id },
      select: profileSelect,
    })

    if (!profile) {
      return NextResponse.json(
        { success: false, message: 'Profil nicht gefunden.' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, profile: serializeProfile(profile) })
  } catch (error) {
    captureError(error, { location: 'api/therapist/profile:get' })

    return NextResponse.json(
      { success: false, message: 'Profil konnte nicht geladen werden.' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== 'THERAPIST') {
      return NextResponse.json(
        { success: false, message: 'Nicht autorisiert.' },
        { status: 401 }
      )
    }

    const existingProfile = await prisma.therapistProfile.findUnique({
      where: { userId: session.user.id },
      select: profileSelect,
    })

    if (!existingProfile) {
      return NextResponse.json(
        { success: false, message: 'Profil nicht gefunden.' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const payload: SetcardPayload = setcardPayloadSchema.parse(body)

    const cleanedServices = sanitizeStringArray(payload.services)
    const cleanedModalities = sanitizeStringArray(payload.modalities)
    const cleanedSpecialties = sanitizeStringArray(payload.specialties)
    const cleanedLanguages = sanitizeStringArray(payload.languages)

    const updatedProfile = await prisma.therapistProfile.update({
      where: { id: existingProfile.id },
      data: {
        displayName: payload.displayName.trim(),
        title: payload.title.trim(),
        headline: payload.headline.trim(),
        approachSummary: payload.approachSummary.trim(),
        experienceSummary: payload.experienceSummary.trim(),
        services: cleanedServices,
        profileImageUrl: safeNullableString(payload.profileImageUrl),
        videoUrl: safeNullableString(payload.videoUrl),
        acceptingClients: payload.acceptingClients,
        yearsExperience: payload.yearsExperience ?? null,
        responseTime: safeNullableString(payload.responseTime),
        modalities: cleanedModalities,
        specialties: cleanedSpecialties,
        languages: cleanedLanguages,
        priceMin: payload.priceMin ?? null,
        priceMax: payload.priceMax ?? null,
        availabilityNote: safeNullableString(payload.availabilityNote),
        pricingNote: safeNullableString(payload.pricingNote),
        about: safeNullableString(payload.about),
        city: safeNullableString(payload.city),
        country: safeNullableString(payload.country) ?? existingProfile.country,
        online: payload.online,
      },
      select: profileSelect,
    })

    await prisma.therapistProfileVersion.create({
      data: {
        profileId: updatedProfile.id,
        authorId: session.user.id,
        data: serializeProfile(updatedProfile),
      },
    })

    return NextResponse.json({ success: true, profile: serializeProfile(updatedProfile) })
  } catch (error) {
    captureError(error, { location: 'api/therapist/profile:patch' })

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validierungsfehler in den Setcard-Daten.',
          errors: error.flatten(),
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, message: 'Setcard konnte nicht aktualisiert werden.' },
      { status: 500 }
    )
  }
}
