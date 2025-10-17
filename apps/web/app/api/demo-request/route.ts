import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@mental-health/db'
import { z } from 'zod'

const demoRequestSchema = z.object({
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
    const validated = demoRequestSchema.parse(body)

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
    const demoRequest = await prisma.demoRequest.create({
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

    // Optional: Bestätigungs-E-Mail an den Antragsteller senden
    // await sendDemoConfirmationEmail(demoRequest)

    // Optional: Benachrichtigung an das Sales-Team
    // await sendDemoNotificationToTeam(demoRequest)

    return NextResponse.json(
      {
        success: true,
        message: 'Ihre Demo-Anfrage wurde erfolgreich übermittelt',
        id: demoRequest.id,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error processing demo request:', error)

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
