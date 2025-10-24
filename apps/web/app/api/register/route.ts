import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { queueNotification } from '../../../lib/notifications'
import { captureError } from '../../../lib/monitoring'

const therapistSchema = z.object({
  firstName: z.string().min(1, 'Vorname ist erforderlich'),
  lastName: z.string().min(1, 'Nachname ist erforderlich'),
  email: z.string().email('Ungültige E-Mail-Adresse'),
  password: z
    .string()
    .min(8, 'Passwort muss mindestens 8 Zeichen lang sein')
    .regex(/[A-Z]/, 'Passwort benötigt einen Großbuchstaben')
    .regex(/[a-z]/, 'Passwort benötigt einen Kleinbuchstaben')
  ,
  confirmPassword: z.string(),
  city: z.string().min(1, 'Bitte Stadt angeben'),
  specialties: z.array(z.string()).min(1, 'Mindestens ein Schwerpunkt wählen'),
  modalities: z.array(z.enum(['ONLINE', 'PRAESENZ', 'HYBRID'])).min(1, 'Mindestens ein Format auswählen'),
  notes: z.string().optional(),
  availabilityNote: z
    .string()
    .max(500, 'Maximal 500 Zeichen')
    .transform((value) => value.trim())
    .optional(),
  pricingNote: z
    .string()
    .max(500, 'Maximal 500 Zeichen')
    .transform((value) => value.trim())
    .optional(),
})
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwörter stimmen nicht überein',
  })

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = therapistSchema.parse(body)

    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email.toLowerCase() },
      select: { id: true },
    })

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: 'Für diese E-Mail existiert bereits ein Konto. Bitte melde dich an oder fordere ein neues Passwort an.',
          errors: [
            {
              path: ['email'],
              message: 'E-Mail bereits vergeben',
            },
          ],
        },
        { status: 409 }
      )
    }

    const passwordHash = await bcrypt.hash(validated.password, 10)

    const user = await prisma.user.create({
      data: {
        email: validated.email.toLowerCase(),
        passwordHash,
        firstName: validated.firstName.trim(),
        lastName: validated.lastName.trim(),
        role: 'THERAPIST',
        locale: 'de-AT',
        therapistProfile: {
          create: {
            status: 'PENDING',
            modalities: mapModalities(validated.modalities),
            specialties: validated.specialties,
            languages: ['de-AT'],
            online: validated.modalities.includes('ONLINE'),
            city: validated.city,
            country: 'AT',
            about: validated.notes ?? null,
            availabilityNote: validated.availabilityNote || null,
            pricingNote: validated.pricingNote || null,
            isPublic: false,
          },
        },
      },
      include: {
        therapistProfile: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    })

    await queueNotification('therapist-registration', {
      userId: user.id,
      email: user.email,
      city: validated.city,
      modalities: validated.modalities,
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Registrierung erfolgreich. Wir prüfen dein Profil und melden uns mit den nächsten Schritten.',
        userId: user.id,
        profileStatus: user.therapistProfile?.status ?? 'PENDING',
      },
      { status: 201 }
    )
  } catch (error) {
    captureError(error, { location: 'api/register' })

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

    console.error('Error registering therapist:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Ein Fehler ist aufgetreten. Bitte versuche es später erneut.',
      },
      { status: 500 }
    )
  }
}

function mapModalities(modalities: Array<'ONLINE' | 'PRAESENZ' | 'HYBRID'>) {
  const mapped = new Set<string>()

  modalities.forEach((item) => {
    if (item === 'ONLINE') {
      mapped.add('Online')
    }
    if (item === 'PRAESENZ') {
      mapped.add('Präsenz')
    }
    if (item === 'HYBRID') {
      mapped.add('Hybrid')
    }
  })

  if (mapped.size === 0) {
    mapped.add('Online')
  }

  return Array.from(mapped)
}
