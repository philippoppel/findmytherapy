import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { queueNotification } from '../../../lib/notifications'
import { captureError } from '../../../lib/monitoring'

const accessRequestSchema = z.object({
  firstName: z.string().min(1, 'Vorname ist erforderlich'),
  lastName: z.string().min(1, 'Nachname ist erforderlich'),
  email: z.string().email('Ungültige E-Mail-Adresse'),
  role: z.enum(['THERAPIST', 'ORGANISATION', 'PRIVATE']),
  company: z.string().optional(),
  notes: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validierung
    const validated = accessRequestSchema.parse(body)

    // Zusätzliche Validierung: Company ist erforderlich wenn role = ORGANISATION
    if (validated.role === 'ORGANISATION' && !validated.company?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unternehmensname ist erforderlich',
          errors: [
            {
              path: ['company'],
              message: 'Bitte Unternehmensname ergänzen',
            },
          ],
        },
        { status: 400 }
      )
    }

    // In Datenbank speichern
    const accessRequest = await prisma.accessRequest.create({
      data: {
        firstName: validated.firstName,
        lastName: validated.lastName,
        email: validated.email,
        role: validated.role,
        company: validated.company || null,
        notes: validated.notes || null,
        status: 'NEW',
      },
    })

    await queueNotification('access-request', {
      id: accessRequest.id,
      role: accessRequest.role,
      company: accessRequest.company ?? undefined,
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Ihre Anfrage wurde erfolgreich übermittelt',
        id: accessRequest.id,
      },
      { status: 201 }
    )
  } catch (error) {
    captureError(error, { location: 'api/access-request' })

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

    return NextResponse.json(
      {
        success: false,
        message: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.',
      },
      { status: 500 }
    )
  }
}
