import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@mental-health/db'
import { z } from 'zod'
import { queueNotification } from '../../../lib/notifications'
import { captureError } from '../../../lib/monitoring'

const contactSchema = z.object({
  name: z.string().min(1, 'Name ist erforderlich'),
  email: z.string().email('Ungültige E-Mail-Adresse'),
  phone: z.string().optional(),
  topic: z.enum(['orientation', 'matching', 'corporate', 'support']),
  message: z.string().min(10, 'Nachricht muss mindestens 10 Zeichen lang sein'),
  preferredSlot: z.string(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validierung
    const validated = contactSchema.parse(body)

    // In Datenbank speichern
    const contactRequest = await prisma.contactRequest.create({
      data: {
        name: validated.name,
        email: validated.email,
        phone: validated.phone || null,
        topic: validated.topic,
        message: validated.message,
        preferredSlot: validated.preferredSlot,
        status: 'NEW',
      },
    })

    await queueNotification('contact-request', {
      id: contactRequest.id,
      topic: contactRequest.topic,
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Ihre Anfrage wurde erfolgreich übermittelt',
        id: contactRequest.id,
      },
      { status: 201 }
    )
  } catch (error) {
    captureError(error, { location: 'api/contact' })

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
