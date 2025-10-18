import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

import { prisma } from '@mental-health/db'
import { queueNotification } from '../../../../lib/notifications'
import { captureError } from '../../../../lib/monitoring'

const clientSchema = z
  .object({
    firstName: z.string().min(1, 'Vorname ist erforderlich'),
    lastName: z.string().min(1, 'Nachname ist erforderlich'),
    email: z.string().email('Bitte eine gültige E-Mail-Adresse angeben'),
    password: z
      .string()
      .min(8, 'Mindestens 8 Zeichen')
      .regex(/[A-Z]/, 'Mindestens ein Großbuchstabe')
      .regex(/[a-z]/, 'Mindestens ein Kleinbuchstabe')
      .regex(/\d/, 'Mindestens eine Zahl'),
    confirmPassword: z.string(),
    acceptTerms: z.literal(true, {
      errorMap: () => ({
        message: 'Bitte bestätige die Nutzungsbedingungen',
      }),
    }),
    marketingOptIn: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwörter stimmen nicht überein',
    path: ['confirmPassword'],
  })

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const payload = clientSchema.parse(body)

    const existingUser = await prisma.user.findUnique({
      where: { email: payload.email.toLowerCase() },
      select: { id: true },
    })

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Für diese E-Mail existiert bereits ein Konto. Bitte melde dich an oder fordere ein neues Passwort an.',
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

    const passwordHash = await bcrypt.hash(payload.password, 10)

    const user = await prisma.user.create({
      data: {
        email: payload.email.toLowerCase(),
        passwordHash,
        firstName: payload.firstName.trim(),
        lastName: payload.lastName.trim(),
        marketingOptIn: Boolean(payload.marketingOptIn),
        role: 'CLIENT',
        locale: 'de-AT',

      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    })

    await queueNotification('client-registration', {
      userId: user.id,
      email: user.email,
      marketingOptIn: Boolean(payload.marketingOptIn),
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Account erstellt. Du kannst dich jetzt anmelden.',
        userId: user.id,
      },
      { status: 201 }
    )
  } catch (error) {
    captureError(error, { location: 'api/clients/register' })

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

    console.error('Error registering client:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Ein Fehler ist aufgetreten. Bitte versuche es später erneut.',
      },
      { status: 500 }
    )
  }
}
